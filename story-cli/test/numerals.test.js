import assert from "node:assert/strict";
import test, { describe, it } from "node:test";
import { formatNumeral } from "../src/numerals.js";

describe("formatNumeral", () => {
  it("formats latn numerals as strings", () => {
    assert.equal(formatNumeral(1234, "latn"), "1234");
    assert.equal(formatNumeral(0, "latn"), "0");
  });

  it("defaults to latn", () => {
    assert.equal(formatNumeral(1234), "1234");
  });

  it("handles decimal digit replacements for arab", () => {
    assert.equal(formatNumeral(1234, "arab"), "١٢٣٤");
    assert.equal(formatNumeral(0, "arab"), "٠");
  });

  it("handles decimal digit replacements for arabext", () => {
    assert.equal(formatNumeral(123456, "arabext"), "۱۲۳۴۵۶");
  });

  it("formats jpan numerals correctly", () => {
    assert.equal(formatNumeral(0, "jpan"), "〇");
    assert.equal(formatNumeral(1, "jpan"), "一");
    assert.equal(formatNumeral(10, "jpan"), "十");
    assert.equal(formatNumeral(12, "jpan"), "十二");
    assert.equal(formatNumeral(100, "jpan"), "百");
    assert.equal(formatNumeral(101, "jpan"), "百一");
    assert.equal(formatNumeral(110, "jpan"), "百十");
    assert.equal(formatNumeral(1000, "jpan"), "千");
    assert.equal(formatNumeral(1001, "jpan"), "千一");
    assert.equal(formatNumeral(1010, "jpan"), "千十");
    assert.equal(formatNumeral(1100, "jpan"), "千百");
    assert.equal(formatNumeral(10000, "jpan"), "一万");
    assert.equal(formatNumeral(10001, "jpan"), "一万一");
    assert.equal(formatNumeral(12000, "jpan"), "一万二千");
  });

  it("formats hans numerals correctly", () => {
    assert.equal(formatNumeral(0, "hans"), "零");
    assert.equal(formatNumeral(1, "hans"), "一");
    assert.equal(formatNumeral(10, "hans"), "十");
    assert.equal(formatNumeral(12, "hans"), "十二");
    assert.equal(formatNumeral(100, "hans"), "一百");
    assert.equal(formatNumeral(101, "hans"), "一百零一");
    assert.equal(formatNumeral(110, "hans"), "一百一十");
    assert.equal(formatNumeral(1000, "hans"), "一千");
    assert.equal(formatNumeral(1001, "hans"), "一千零一");
    assert.equal(formatNumeral(1010, "hans"), "一千零一十");
    assert.equal(formatNumeral(1100, "hans"), "一千一百");
    assert.equal(formatNumeral(10000, "hans"), "一万");
    assert.equal(formatNumeral(10001, "hans"), "一万零一");
    assert.equal(formatNumeral(12000, "hans"), "一万二千");
  });

  it("formats hant numerals correctly", () => {
    assert.equal(formatNumeral(0, "hant"), "零");
    assert.equal(formatNumeral(1, "hant"), "一");
    assert.equal(formatNumeral(10, "hant"), "十");
    assert.equal(formatNumeral(12, "hant"), "十二");
    assert.equal(formatNumeral(100, "hant"), "一百");
    assert.equal(formatNumeral(101, "hant"), "一百零一");
    assert.equal(formatNumeral(110, "hant"), "一百一十");
    assert.equal(formatNumeral(1000, "hant"), "一千");
    assert.equal(formatNumeral(1001, "hant"), "一千零一");
    assert.equal(formatNumeral(1010, "hant"), "一千零一十");
    assert.equal(formatNumeral(1100, "hant"), "一千一百");
    assert.equal(formatNumeral(10000, "hant"), "一萬");
    assert.equal(formatNumeral(10001, "hant"), "一萬零一");
    assert.equal(formatNumeral(12000, "hant"), "一萬二千");
  });

  it("returns original string for unknown systems", () => {
    assert.equal(formatNumeral(1234, "unknown"), "1234");
  });

  it("returns original string for non-digit inputs in decimal digit systems", () => {
    assert.equal(formatNumeral("123a", "arab"), "123a");
  });

  it("returns original string for non-safe integers in han systems", () => {
    assert.equal(formatNumeral(Number.MAX_SAFE_INTEGER + 1, "hans"), String(Number.MAX_SAFE_INTEGER + 1));
  });

  it("returns original string for negative numbers in han systems", () => {
    assert.equal(formatNumeral(-1, "hans"), "-1");
  });
});
