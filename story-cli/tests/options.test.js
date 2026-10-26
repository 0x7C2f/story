import { test, describe, it } from 'node:test';
import assert from 'node:assert';

import { normalizeBooleanValue, isTruthy } from '../src/options.js';

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

describe('isTruthy', () => {
  it('should return true for boolean true', () => {
    assert.strictEqual(isTruthy(true), true);
  });

  it('should return false for boolean false', () => {
    assert.strictEqual(isTruthy(false), false);
  });

  it('should return false for string "false"', () => {
    assert.strictEqual(isTruthy('false'), false);
    assert.strictEqual(isTruthy('False'), false);
    assert.strictEqual(isTruthy(' FALSE '), false);
  });

  it('should return false for string "0"', () => {
    assert.strictEqual(isTruthy('0'), false);
    assert.strictEqual(isTruthy(' 0 '), false);
  });

  it('should return false for string "no"', () => {
    assert.strictEqual(isTruthy('no'), false);
    assert.strictEqual(isTruthy('No'), false);
    assert.strictEqual(isTruthy(' NO '), false);
  });

  it('should return false for string "off"', () => {
    assert.strictEqual(isTruthy('off'), false);
    assert.strictEqual(isTruthy('Off'), false);
    assert.strictEqual(isTruthy(' OFF '), false);
  });

  it('should return false for empty string ""', () => {
    assert.strictEqual(isTruthy(''), false);
    assert.strictEqual(isTruthy('   '), false);
  });

  it('should return true for other strings', () => {
    assert.strictEqual(isTruthy('true'), true);
    assert.strictEqual(isTruthy('yes'), true);
    assert.strictEqual(isTruthy('1'), true);
    assert.strictEqual(isTruthy('on'), true);
    assert.strictEqual(isTruthy('any other string'), true);
  });

  it('should evaluate arrays using their last element', () => {
    assert.strictEqual(isTruthy(['true', 'false']), false);
    assert.strictEqual(isTruthy(['false', 'true']), true);
    assert.strictEqual(isTruthy([true, false]), false);
    assert.strictEqual(isTruthy([false, true]), true);
    assert.strictEqual(isTruthy(['no', 'yes']), true);
    assert.strictEqual(isTruthy(['yes', 'no']), false);
  });

  it('should return true for numbers other than 0', () => {
    assert.strictEqual(isTruthy(1), true);
    assert.strictEqual(isTruthy(-1), true);
  });

  it('should return false for number 0', () => {
    assert.strictEqual(isTruthy(0), false);
  });

  it('should return false for null and undefined', () => {
    assert.strictEqual(isTruthy(null), false);
    assert.strictEqual(isTruthy(undefined), false);
  });

  it('should return true for objects', () => {
    assert.strictEqual(isTruthy({}), true);
    assert.strictEqual(isTruthy({ key: 'value' }), true);
  });
});
