import { test } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { resolveOutputPath } from '../src/build.js';
import { EXIT_CODES } from '../src/exit-codes.js';

test('resolveOutputPath', async (t) => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'story-test-'));

  // Create .git dir to test assertNotProjectSource inside git dir
  fs.mkdirSync(path.join(tmpRoot, '.git'));

  // Create a directory named dist to test directory check
  const distDir = path.join(tmpRoot, 'dist');
  fs.mkdirSync(distDir);

  // Mock project object required by resolveOutputPath
  const project = {
    root: tmpRoot,
    story: {
      data: {}
    },
    data: {},
    storyData: {}
  };

  await t.test('throws usageError when out is empty', () => {
    assert.throws(
      () => resolveOutputPath(project, '   ', null, false),
      (err) => err.exitCode === EXIT_CODES.usage && err.message.includes('--out needs a file path')
    );
  });

  await t.test('throws refusedError when out is inside .git directory', () => {
    assert.throws(
      () => resolveOutputPath(project, '.git/somefile.md', null, false),
      (err) => err.exitCode === EXIT_CODES.refused && err.message.includes('inside a .git folder')
    );
  });

  await t.test('throws usageError when out is an existing directory', () => {
    // A random dir to make sure we hit the "is a directory" error instead of the "dist" error
    const someDir = path.join(tmpRoot, 'somedir');
    fs.mkdirSync(someDir);
    assert.throws(
      () => resolveOutputPath(project, 'somedir', null, false),
      (err) => err.exitCode === EXIT_CODES.usage && err.message.includes('is a directory: give a file path')
    );
  });

  await t.test('throws usageError when out has a trailing slash', () => {
    assert.throws(
      () => resolveOutputPath(project, 'anotherdir/', null, false),
      (err) => err.exitCode === EXIT_CODES.usage && err.message.includes('is a directory: give a file path')
    );
  });

  await t.test('throws usageError when out is reserved dist directory', () => {
    // Ensure dist exists or not, but it's treated as reserved either way
    fs.rmSync(distDir, { recursive: true, force: true });
    assert.throws(
      () => resolveOutputPath(project, 'dist', null, false),
      (err) => err.exitCode === EXIT_CODES.usage && err.message.includes('is a directory: give a file path') // Note: looking at the source, this happens if `stats` is null but `isDist` is true. `if (stats?.isDirectory() || /[\\/]$/.test(String(rawOut)) || (isDist && !stats)) { throw usageError(\`--out \${rawOut} is a directory: give a file path\`); }`
    );
  });

  await t.test('returns expected result for valid file path', () => {
    const result = resolveOutputPath(project, 'dist/book.md', null, undefined);
    assert.strictEqual(result.outFile, path.join(tmpRoot, 'dist/book.md'));
    assert.strictEqual(result.enforceRoot, true); // Since 'dist/book.md' is not absolute, it should be enforced
  });

  await t.test('uses defaultRelativePath if out is undefined', () => {
    const result = resolveOutputPath(project, undefined, 'dist/book.md', undefined);
    assert.strictEqual(result.outFile, path.join(tmpRoot, 'dist/book.md'));
  });

  await t.test('enforceRoot explicitly true overrides relative path check', () => {
    const absolutePath = path.join(tmpRoot, 'dist/book.md');
    const result = resolveOutputPath(project, absolutePath, null, true);
    assert.strictEqual(result.enforceRoot, true);
  });

  await t.test('catches lstat errors and throws refusedError', () => {
    // A path through a non-directory
    const file = path.join(tmpRoot, 'a_file.txt');
    fs.writeFileSync(file, 'content');
    assert.throws(
      () => resolveOutputPath(project, 'a_file.txt/invalid', null, false),
      (err) => err.exitCode === EXIT_CODES.refused && err.message.includes('ENOTDIR')
    );
  });


  await t.test('throws usageError when out is reserved dist file', () => {
    const distFile = path.join(tmpRoot, 'dist');
    fs.writeFileSync(distFile, 'content');
    assert.throws(
      () => resolveOutputPath(project, 'dist', null, false),
      (err) => err.exitCode === EXIT_CODES.usage && err.message.includes('is reserved for the build folder')
    );
    fs.unlinkSync(distFile);
  });

  await t.test('throws refusedError when out is a referenced file (cover)', () => {
    const projectWithCover = {
      root: tmpRoot,
      story: {
        data: {
          cover: 'cover.jpg'
        }
      },
      data: {},
      storyData: {}
    };
    fs.writeFileSync(path.join(tmpRoot, 'cover.jpg'), 'content');
    assert.throws(
      () => resolveOutputPath(projectWithCover, 'cover.jpg', null, false),
      (err) => err.exitCode === EXIT_CODES.refused && err.message.includes('story.md names it as the cover')
    );
  });

  await t.test('throws refusedError when out is project source (e.g. story.md)', () => {
    assert.throws(
      () => resolveOutputPath(project, 'story.md', null, false),
      (err) => err.exitCode === EXIT_CODES.refused && err.message.includes('it is project source')
    );
  });

  await t.test('throws refusedError when out is hand-edited directory content and exists', () => {
    const feedbackDir = path.join(tmpRoot, 'feedback');
    if (!fs.existsSync(feedbackDir)) fs.mkdirSync(feedbackDir);
    const file = path.join(feedbackDir, 'notes.txt');
    fs.writeFileSync(file, 'content');
    assert.throws(
      () => resolveOutputPath(project, 'feedback/notes.txt', null, false),
      (err) => err.exitCode === EXIT_CODES.refused && err.message.includes('may hold hand-written work')
    );
  });


  await t.test('returns expected result for valid absolute path outside project root', () => {
    const outsideFile = path.resolve(os.tmpdir(), 'outside.md');
    const result = resolveOutputPath(project, outsideFile, null, false);
    assert.strictEqual(result.outFile, outsideFile);
    assert.strictEqual(result.enforceRoot, false);
  });

  await t.test('succeeds when cover is in a non-existent directory', () => {
    const projectWithBadCover = {
      root: tmpRoot,
      story: {
        data: { cover: 'does-not-exist/cover.jpg' }
      },
      data: {},
      storyData: {}
    };
    const result = resolveOutputPath(projectWithBadCover, 'dist/book.md', null, false);
    assert.strictEqual(result.outFile, path.join(tmpRoot, 'dist/book.md'));
  });


  await t.test('succeeds when cover directory is a dead symlink', () => {
    const symlinkDir = path.join(tmpRoot, 'dead-symlink-dir');
    const targetDir = path.join(tmpRoot, 'target-dir');
    try {
      fs.symlinkSync(targetDir, symlinkDir, 'dir');
    } catch {
      return;
    }
    const projectWithBadCover = {
      root: tmpRoot,
      story: {
        data: { cover: 'dead-symlink-dir/cover.jpg' }
      },
      data: {},
      storyData: {}
    };
    const result = resolveOutputPath(projectWithBadCover, 'dist/book.md', null, false);
    assert.strictEqual(result.outFile, path.join(tmpRoot, 'dist/book.md'));
  });

  fs.rmSync(tmpRoot, { recursive: true, force: true });
});
