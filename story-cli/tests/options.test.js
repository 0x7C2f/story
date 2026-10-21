import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeBooleanValue } from '../src/options.js';

test('normalizeBooleanValue throws on invalid string', () => {
  assert.throws(
    () => normalizeBooleanValue('testFlag', 'invalid'),
    (err) => err.message === 'Unknown value "invalid" for --testFlag: expected true or false'
  );
});
