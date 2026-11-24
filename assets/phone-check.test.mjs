import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const { isValidPhone } = createRequire(import.meta.url)('./phone-check.js');

test('real-looking numbers pass', () => {
  [
    '952-258-3100',
    '612-555-0234',
    '763-201-4455',
    '+1 (651) 288-1234',
    '952.474.9900',
    '(952) 258-3100',
    '1-952-258-3100',
    '9525551234',
    '952-234-5678',
    '612-345-6789',
    '234-567-8900',
    '555-234-5678'
  ].forEach((n) => assert.equal(isValidPhone(n), true, n));
});

test('wrong length fails, including a leading 1 that is not a country code', () => {
  ['', '   ', 'abc', '123', '952258310', '22345678901', '952258310012', '1'].forEach((n) => {
    assert.equal(isValidPhone(n), false, JSON.stringify(n));
  });
});

test('area or exchange starting with 0 or 1 fails', () => {
  ['052-258-3100', '152-258-3100', '952-058-3100', '952-158-3100'].forEach((n) => {
    assert.equal(isValidPhone(n), false, n);
  });
});

test('N11 area codes and exchanges fail', () => {
  ['211', '311', '411', '511', '611', '711', '811', '911'].forEach((n11) => {
    assert.equal(isValidPhone(n11 + '-234-5678'), false, 'area ' + n11);
    assert.equal(isValidPhone('952-' + n11 + '-4567'), false, 'exchange ' + n11);
  });
});

test('only fictional 555-01xx fails; other 555 lines pass', () => {
  assert.equal(isValidPhone('612-555-0100'), false);
  assert.equal(isValidPhone('612-555-0199'), false);
  assert.equal(isValidPhone('612-555-0200'), true);
  assert.equal(isValidPhone('612-555-0234'), true);
  assert.equal(isValidPhone('612-555-1234'), true);
});

test('named sequential fakes and full 10-digit runs fail', () => {
  [
    '123-456-7890',
    '234-567-8901',
    '234-567-8911',
    '987-654-3210',
    '345-678-9012',
    '876-543-2109',
    '890-123-4567'
  ].forEach((n) => assert.equal(isValidPhone(n), false, n));
});

test('a short sequence inside a real number still passes', () => {
  ['952-234-5678', '612-345-6789', '763-321-0987', '234-567-8900'].forEach((n) => {
    assert.equal(isValidPhone(n), true, n);
  });
});

test('all ten digits identical fails, including 222-222-2222', () => {
  for (let i = 0; i <= 9; i++) {
    const n = String(i).repeat(10);
    assert.equal(isValidPhone(n), false, n);
  }
  assert.equal(isValidPhone('222-222-2222'), false);
  assert.equal(isValidPhone('222-333-4444'), true);
});
