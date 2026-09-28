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

test('slugify matches GitHub heading anchors (whitespace runs are NOT collapsed)', () => {
  assert.equal(slugify('Git'), 'git');
  // A stripped "&" leaves two spaces, which GitHub turns into two hyphens.
  assert.equal(slugify('JSON & Data'), 'json--data');
  assert.equal(slugify('Command-line & Productivity'), 'command-line--productivity');
  assert.equal(slugify('Libraries & single-file utilities'), 'libraries--single-file-utilities');
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

// Regression: an "&" heading generates a double-hyphen GitHub anchor. A Contents
// link using the old single-hyphen anchor is broken on GitHub and must be flagged.
const AMP_BROKEN_TOC = [
  '# X',
  '## Contents',
  '- [JSON & Data](#json-data)',
  '## JSON & Data',
  '- [alpha](https://example.com/a) \u2014 First.',
].join('\n');

const AMP_GOOD_TOC = [
  '# X',
  '## Contents',
  '- [JSON & Data](#json--data)',
  '## JSON & Data',
  '- [alpha](https://example.com/a) \u2014 First.',
].join('\n');

test('rejects a single-hyphen Contents anchor for an "&" heading (GitHub-broken)', () => {
  const res = lint(AMP_BROKEN_TOC);
  assert.equal(res.ok, false);
  assert.ok(
    res.errors.some((e) => /does not match any section heading/i.test(e)),
    res.errors.join('\n'),
  );
});

test('accepts the correct double-hyphen Contents anchor for an "&" heading', () => {
  const res = lint(AMP_GOOD_TOC);
  assert.equal(res.ok, true, res.errors.join('\n'));
});

// Regression: trailing whitespace after the period is insignificant in Markdown
// and must not turn a valid entry into a "malformed entry" error.
const TRAILING_WS = [
  '# X',
  '## Contents',
  '- [Tools](#tools)',
  '## Tools',
  '- [alpha](https://example.com/a) \u2014 First.   ',
  '- [beta](https://example.com/b) \u2014 Second.\t',
].join('\n');

test('accepts entries with trailing whitespace after the period', () => {
  const res = lint(TRAILING_WS);
  assert.equal(res.ok, true, res.errors.join('\n'));
  assert.equal(res.entryCount, 2);
});

// Regression: a destination URL may contain balanced parentheses (e.g. a
// Wikipedia link). The old [^)]+ URL pattern stopped at the first ")" and
// flagged the whole line as malformed.
const URL_WITH_PARENS = [
  '# X',
  '## Contents',
  '- [Tools](#tools)',
  '## Tools',
  '- [wiki](https://en.wikipedia.org/wiki/Foo_(bar)) \u2014 Named after Foo (bar).',
].join('\n');

test('accepts an entry whose URL contains balanced parentheses', () => {
  const res = lint(URL_WITH_PARENS);
  assert.equal(res.ok, true, res.errors.join('\n'));
  assert.equal(res.entryCount, 1);
  const m = '- [wiki](https://en.wikipedia.org/wiki/Foo_(bar)) \u2014 Named after Foo (bar).'.match(ENTRY_RE);
  assert.ok(m);
  assert.equal(m[2], 'https://en.wikipedia.org/wiki/Foo_(bar)');
});

// Regression: indented bullets are nested notes, not list entries, and must not
// be format-checked as entries.
const INDENTED_NOTE = [
  '# X',
  '## Contents',
  '- [Tools](#tools)',
  '## Tools',
  '- [alpha](https://example.com/a) \u2014 First.',
  '  - a nested note that is deliberately not an entry',
].join('\n');

test('ignores indented (nested) bullets when validating entries', () => {
  const res = lint(INDENTED_NOTE);
  assert.equal(res.ok, true, res.errors.join('\n'));
  assert.equal(res.entryCount, 1);
});

// Regression: GitHub suffixes repeated identical headings (-1, -2, ...). A
// Contents link to that suffixed anchor must resolve, not be flagged.
const DUP_HEADING = [
  '# X',
  '## Contents',
  '- [Tools](#tools)',
  '- [Tools (again)](#tools-1)',
  '## Tools',
  '- [alpha](https://example.com/a) \u2014 First.',
  '## Tools',
  '- [beta](https://example.com/b) \u2014 Second.',
].join('\n');

test('resolves the -1 suffix GitHub adds to a repeated heading', () => {
  const res = lint(DUP_HEADING);
  assert.equal(res.ok, true, res.errors.join('\n'));
});
