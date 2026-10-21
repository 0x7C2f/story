import { test } from 'node:test';
import assert from 'node:assert';
import { normalizeBooleanValue } from '../src/options.js';

test('normalizeBooleanValue', async (t) => {
  await t.test('returns true for truthy string values', () => {
    assert.strictEqual(normalizeBooleanValue('key', 'true'), true);
    assert.strictEqual(normalizeBooleanValue('key', '1'), true);
    assert.strictEqual(normalizeBooleanValue('key', 'yes'), true);
    assert.strictEqual(normalizeBooleanValue('key', 'on'), true);
    assert.strictEqual(normalizeBooleanValue('key', ' TRUE '), true);
    assert.strictEqual(normalizeBooleanValue('key', 'On'), true);
  });

  await t.test('returns false for falsy string values', () => {
    assert.strictEqual(normalizeBooleanValue('key', 'false'), false);
    assert.strictEqual(normalizeBooleanValue('key', '0'), false);
    assert.strictEqual(normalizeBooleanValue('key', 'no'), false);
    assert.strictEqual(normalizeBooleanValue('key', 'off'), false);
    assert.strictEqual(normalizeBooleanValue('key', ' FALSE '), false);
    assert.strictEqual(normalizeBooleanValue('key', 'Off'), false);
  });

  await t.test('returns boolean representation for non-string values', () => {
    assert.strictEqual(normalizeBooleanValue('key', true), true);
    assert.strictEqual(normalizeBooleanValue('key', false), false);
    assert.strictEqual(normalizeBooleanValue('key', 1), true);
    assert.strictEqual(normalizeBooleanValue('key', 0), false);
    assert.strictEqual(normalizeBooleanValue('key', null), false);
    assert.strictEqual(normalizeBooleanValue('key', undefined), false);
  });

  await t.test('throws usageError for invalid string values', () => {
    assert.throws(
      () => normalizeBooleanValue('key', 'invalid'),
      (err) => {
        assert.strictEqual(err.message, 'Unknown value "invalid" for --key: expected true or false');
        assert.strictEqual(err.exitCode, 2);
        return true;
      }
    );
  });
});
