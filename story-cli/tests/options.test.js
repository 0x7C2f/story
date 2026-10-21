import { expect } from 'chai';
import { isTruthy } from '../src/options.js';

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
