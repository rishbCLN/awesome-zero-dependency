// Unit tests for the zero-dependency README validator. Run with `node --test`.
import test from 'node:test';
import assert from 'node:assert/strict';

import { lint, slugify, compareNames, ENTRY_RE } from '../scripts/lint.mjs';

// A minimal but fully valid Awesome-list document. The em dash separator is written
// as \u2014 so this test file is safe regardless of source encoding.
const GOOD = [
  '# Awesome Sample [![Awesome](https://awesome.re/badge.svg)](https://github.com/sindresorhus/awesome)',
  '',
  '> A tiny sample list.',
  '',
  '## Contents',
  '',
  '- [Tools](#tools)',
  '- [More Tools](#more-tools)',
  '',
  '## Tools',
  '',
  '- [alpha](https://example.com/a) \u2014 The first tool.',
  '- [beta](https://example.com/b) \u2014 The second tool.',
  '',
  '## More Tools',
  '',
  '- [gamma](https://example.com/g) \u2014 Another tool \u2014 even with an inner em dash.',
  '',
].join('\n');

const BAD_FORMAT = [
  '# X',
  '## Contents',
  '- [Tools](#tools)',
  '## Tools',
  '- [alpha](https://example.com/a) - a hyphen instead of an em dash, no period',
].join('\n');

const BAD_ORDER = [
  '# X',
  '## Contents',
  '- [Tools](#tools)',
  '## Tools',
  '- [beta](https://example.com/b) \u2014 Second.',
  '- [alpha](https://example.com/a) \u2014 First.',
].join('\n');

const BAD_DUP = [
  '# X',
  '## Contents',
  '- [Tools](#tools)',
  '## Tools',
  '- [alpha](https://example.com/a) \u2014 First.',
  '## More',
  '- [alpha](https://example.com/z) \u2014 Duplicated name.',
].join('\n');

const BAD_TOC = [
  '# X',
  '## Contents',
  '- [Missing](#does-not-exist)',
  '## Tools',
  '- [alpha](https://example.com/a) \u2014 First.',
].join('\n');

test('accepts a well-formed list', () => {
  const res = lint(GOOD);
  assert.equal(res.ok, true, res.errors.join('\n'));
  assert.deepEqual(res.errors, []);
  assert.equal(res.entryCount, 3);
  assert.equal(res.sectionCount, 2);
});

test('rejects a malformed entry (wrong separator / no period)', () => {
  const res = lint(BAD_FORMAT);
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /malformed entry/i.test(e)), res.errors.join('\n'));
});

test('rejects entries that are not alphabetically sorted', () => {
  const res = lint(BAD_ORDER);
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /not alphabetically sorted/i.test(e)), res.errors.join('\n'));
});

test('rejects duplicate tool names', () => {
  const res = lint(BAD_DUP);
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /duplicate entry/i.test(e)), res.errors.join('\n'));
});

test('rejects a Contents link with no matching heading', () => {
  const res = lint(BAD_TOC);
  assert.equal(res.ok, false);
  assert.ok(
    res.errors.some((e) => /does not match any section heading/i.test(e)),
    res.errors.join('\n'),
  );
});

test('slugify matches the fleet linkcheck convention', () => {
  assert.equal(slugify('Git'), 'git');
  assert.equal(slugify('JSON & Data'), 'json-data');
  assert.equal(slugify('Command-line & Productivity'), 'command-line-productivity');
  assert.equal(slugify('Libraries & single-file utilities'), 'libraries-single-file-utilities');
});

test('compareNames is case-insensitive', () => {
  assert.equal(compareNames('Alpha', 'beta') < 0, true);
  assert.equal(compareNames('zebra', 'Apple') > 0, true);
});

test('ENTRY_RE captures the tool name and tolerates inner em dashes', () => {
  const m = '- [portkill](https://example.com/p) \u2014 Kill a port \u2014 in one command.'.match(ENTRY_RE);
  assert.ok(m);
  assert.equal(m[1], 'portkill');
});
