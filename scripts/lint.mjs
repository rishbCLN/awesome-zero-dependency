#!/usr/bin/env node
// lint.mjs — a zero-dependency validator for this Awesome list.
//
// It reads a Markdown file (README.md by default) and fails (exit 1) if any of
// the following rules are broken, printing one clear message per violation:
//
//   1. Every list entry matches `- [name](url) — Description.`
//      (an em dash " — " separator and a trailing period).
//   2. Entries within each section are sorted alphabetically (case-insensitive).
//   3. No tool name appears more than once across the whole list.
//   4. Every "## Contents" table-of-contents link points to a real section heading.
//
// Only Node.js built-ins are used, so the repo stays dependency-free. The parsing
// helpers are pure and exported so they can be unit-tested (see test/lint.test.mjs).

import { readFile } from 'node:fs/promises';
import { argv, exit } from 'node:process';
import { pathToFileURL } from 'node:url';

// A well-formed entry: "- [text](http(s)://url) — Description ending with a period."
// The em dash is written as \u2014 so this source file is encoding-agnostic; the
// first " \u2014 " after the URL is the separator, and the description (which may
// itself contain em dashes) is everything up to the final period. Trailing
// whitespace after the period is insignificant in Markdown and is tolerated.
//
// The URL may itself contain balanced parentheses (e.g. Wikipedia links like
// ".../Foo_(bar)"), so the destination is matched as a run of non-paren
// characters plus any single-level balanced "(...)" groups, mirroring how
// Markdown link destinations allow balanced parens. The link's own closing ")"
// is whatever follows that run.
const URL_RE = String.raw`https?:\/\/(?:[^()\s]|\([^()\s]*\))*`;
export const ENTRY_RE = new RegExp(
  String.raw`^- \[([^\]]+)\]\((${URL_RE})\) \u2014 (.+\.)\s*$`,
);

/**
 * GitHub-compatible heading -> anchor slug, matching how GitHub actually builds
 * heading anchors: lowercase, drop everything that is not a letter/number/space/
 * underscore/hyphen, then replace EACH remaining whitespace character with a
 * hyphen. GitHub does not collapse whitespace runs, so a heading like
 * "JSON & Data" (where the stripped "&" leaves two spaces) becomes "json--data"
 * with two hyphens, not "json-data". Pure and side-effect free.
 * @param {string} heading
 * @returns {string}
 */
export function slugify(heading) {
  return String(heading)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]+/gu, '')
    .replace(/\s/g, '-');
}

/** Case-insensitive, code-unit ordering used for the alphabetical check. */
export function compareNames(a, b) {
  const la = String(a).toLowerCase();
  const lb = String(b).toLowerCase();
  if (la < lb) return -1;
  if (la > lb) return 1;
  return 0;
}

/**
 * Validate the Markdown text of an Awesome list.
 * @param {string} text
 * @returns {{ ok: boolean, errors: string[], entryCount: number, sectionCount: number }}
 */
export function lint(text) {
  const errors = [];
  const lines = String(text).split(/\r?\n/);

  const validAnchors = new Set(); // every heading slug in the document
  const sectionEntries = new Map(); // section heading -> [tool names] in document order
  const allNames = []; // every tool name across the list (for duplicate detection)
  const tocLinks = []; // { text, anchor, line } gathered from "## Contents"

  let currentH2 = null;
  let inContents = false;
  let inCodeFence = false;

  const HEADING_RE = /^(#{1,6})\s+(.+?)\s*$/;
  const TOC_RE = /^\s*-\s+\[([^\]]+)\]\((#[^)]*)\)\s*$/;
  // A tool entry is a TOP-LEVEL bullet (column 0). Indented bullets are notes or
  // nested items and must not be validated as entries, so this pattern is not
  // whitespace-tolerant on the left the way TOC_RE is.
  const CANDIDATE_RE = /^-\s+\[[^\]]+\]\(([^)]+)\)/;

  // GitHub disambiguates repeated identical headings by suffixing -1, -2, ...
  // Track how many times each base slug has been seen so the second "## Tools"
  // resolves to "tools-1", matching real anchors.
  const anchorCounts = new Map();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNo = i + 1;

    // Skip fenced code blocks so sample entries there are never validated.
    if (/^\s*(```|~~~)/.test(line)) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    // Headings: remember section context and collect anchor slugs.
    const heading = line.match(HEADING_RE);
    if (heading) {
      const level = heading[1].length;
      const textOfHeading = heading[2];
      const base = slugify(textOfHeading);
      // Replicate GitHub's collision suffixing: first use is the bare slug,
      // repeats become "slug-1", "slug-2", ...
      const seen = anchorCounts.get(base) || 0;
      const anchor = seen === 0 ? base : `${base}-${seen}`;
      anchorCounts.set(base, seen + 1);
      validAnchors.add(anchor);
      if (level === 2) {
        currentH2 = textOfHeading;
        inContents = /^contents$/i.test(textOfHeading.trim());
      }
      continue;
    }

    // Table-of-contents links live under "## Contents" and point to "#anchor".
    const toc = line.match(TOC_RE);
    if (inContents && toc) {
      tocLinks.push({ text: toc[1], anchor: toc[2].slice(1), line: lineNo });
      continue;
    }

    // A tool-entry candidate is a bullet whose link is a URL (not a "#anchor").
    const candidate = line.match(CANDIDATE_RE);
    if (candidate && !candidate[1].startsWith('#')) {
      const m = line.match(ENTRY_RE);
      if (!m) {
        errors.push(
          `Line ${lineNo}: malformed entry (expected "- [name](url) \u2014 Description."): ${line.trim()}`,
        );
        continue;
      }
      const name = m[1];
      if (!currentH2 || inContents) {
        errors.push(`Line ${lineNo}: entry found outside of a category section: ${line.trim()}`);
        continue;
      }
      if (!sectionEntries.has(currentH2)) sectionEntries.set(currentH2, []);
      sectionEntries.get(currentH2).push(name);
      allNames.push(name);
    }
  }

  // Rule 2: alphabetical order within each section.
  for (const [section, names] of sectionEntries) {
    const sorted = [...names].sort(compareNames);
    for (let i = 0; i < names.length; i++) {
      if (names[i] !== sorted[i]) {
        errors.push(
          `Section "${section}" is not alphabetically sorted.\n` +
            `    found:    ${names.join(', ')}\n` +
            `    expected: ${sorted.join(', ')}`,
        );
        break;
      }
    }
  }

  // Rule 3: no duplicate tool names across the whole list.
  const counts = new Map();
  for (const name of allNames) {
    const key = name.toLowerCase();
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  for (const [key, count] of counts) {
    if (count > 1) errors.push(`Duplicate entry: "${key}" appears ${count} times.`);
  }

  // Rule 4: every Contents link resolves to a real heading.
  if (tocLinks.length === 0) {
    errors.push('No "## Contents" table-of-contents links were found.');
  }
  for (const t of tocLinks) {
    if (!validAnchors.has(t.anchor)) {
      errors.push(
        `Line ${t.line}: Contents link "[${t.text}](#${t.anchor})" does not match any section heading.`,
      );
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    entryCount: allNames.length,
    sectionCount: sectionEntries.size,
  };
}

async function main() {
  const file = argv[2] || 'README.md';
  let text;
  try {
    text = await readFile(file, 'utf8');
  } catch (err) {
    console.error(`error: cannot read ${file}: ${(err && err.message) || err}`);
    return 2;
  }

  const { ok, errors, entryCount, sectionCount } = lint(text);
  if (!ok) {
    for (const e of errors) console.error(`FAIL: ${e}`);
    console.error(`\n${errors.length} problem(s) found in ${file}.`);
    return 1;
  }

  console.log(`OK: ${file} passed all checks (${entryCount} entries across ${sectionCount} sections).`);
  return 0;
}

// Run only when executed directly (not when imported by the tests).
if (argv[1] && import.meta.url === pathToFileURL(argv[1]).href) {
  main().then((code) => exit(code));
}
