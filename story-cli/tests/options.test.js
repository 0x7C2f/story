import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { expect } from 'chai';
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
    expect(isTruthy(true)).to.be.true;
  });

  it('should return false for boolean false', () => {
    expect(isTruthy(false)).to.be.false;
  });

  it('should return false for string "false"', () => {
    expect(isTruthy('false')).to.be.false;
    expect(isTruthy('False')).to.be.false;
    expect(isTruthy(' FALSE ')).to.be.false;
  });

  it('should return false for string "0"', () => {
    expect(isTruthy('0')).to.be.false;
    expect(isTruthy(' 0 ')).to.be.false;
  });

  it('should return false for string "no"', () => {
    expect(isTruthy('no')).to.be.false;
    expect(isTruthy('No')).to.be.false;
    expect(isTruthy(' NO ')).to.be.false;
  });

  it('should return false for string "off"', () => {
    expect(isTruthy('off')).to.be.false;
    expect(isTruthy('Off')).to.be.false;
    expect(isTruthy(' OFF ')).to.be.false;
  });

  it('should return false for empty string ""', () => {
    expect(isTruthy('')).to.be.false;
    expect(isTruthy('   ')).to.be.false;
  });

  it('should return true for other strings', () => {
    expect(isTruthy('true')).to.be.true;
    expect(isTruthy('yes')).to.be.true;
    expect(isTruthy('1')).to.be.true;
    expect(isTruthy('on')).to.be.true;
    expect(isTruthy('any other string')).to.be.true;
  });

  it('should evaluate arrays using their last element', () => {
    expect(isTruthy(['true', 'false'])).to.be.false;
    expect(isTruthy(['false', 'true'])).to.be.true;
    expect(isTruthy([true, false])).to.be.false;
    expect(isTruthy([false, true])).to.be.true;
    expect(isTruthy(['no', 'yes'])).to.be.true;
    expect(isTruthy(['yes', 'no'])).to.be.false;
  });

  it('should return true for numbers other than 0', () => {
    expect(isTruthy(1)).to.be.true;
    expect(isTruthy(-1)).to.be.true;
  });

  it('should return false for number 0', () => {
    expect(isTruthy(0)).to.be.false;
  });

  it('should return false for null and undefined', () => {
    expect(isTruthy(null)).to.be.false;
    expect(isTruthy(undefined)).to.be.false;
  });

  it('should return true for objects', () => {
    expect(isTruthy({})).to.be.true;
    expect(isTruthy({ key: 'value' })).to.be.true;
  });
});
