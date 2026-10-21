import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { styleSheetFile } from '../src/build-style.js';

test('styleSheetFile catches read file error (directory masquerading as file)', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'story-test-'));
  const cssDir = path.join(tempDir, 'style.css');
  fs.mkdirSync(cssDir);

  try {
    assert.throws(
        () => styleSheetFile(tempDir, 'style.css'),
        (err) => {
           return err.exitCode === 3 && err.message.includes('story.md build-style css style.css: Refusing to read: not a regular file');
        }
    );
  } finally {
    fs.rmdirSync(cssDir);
    fs.rmdirSync(tempDir);
  }
});

test('styleSheetFile catches assertSafeProjectPath error (symlink)', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'story-test-'));
  const actualFile = path.join(tempDir, 'actual.css');
  const symlinkFile = path.join(tempDir, 'style.css');
  fs.writeFileSync(actualFile, 'body { color: red; }');
  fs.symlinkSync(actualFile, symlinkFile);

  try {
    assert.throws(
        () => styleSheetFile(tempDir, 'style.css'),
        (err) => {
           return err.exitCode === 3 && err.message.includes('story.md build-style css style.css: Refusing to read through symlink');
        }
    );
  } finally {
    fs.unlinkSync(symlinkFile);
    fs.unlinkSync(actualFile);
    fs.rmdirSync(tempDir);
  }
});
