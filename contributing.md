# Contributing to Awesome Zero-Dependency

Thanks for helping keep this list useful! The entire value of an Awesome list is
**curation quality**, so every suggestion is reviewed against strict criteria. A
tool is either genuinely zero-dependency or it does not belong here — there is no
middle ground.

## Inclusion criteria

A tool may be added only if it meets **all** of the following:

1. **Zero runtime dependencies, or a single file / single binary.**
   - The published package installs nothing else at runtime. Development-only
     dependencies (test runners, linters, bundlers, type checkers) are fine.
   - **Or** the tool is distributed as one hackable script or one self-contained
     binary that needs no install and no build step to run.
2. **Actively maintained.** A commit or release within roughly the last 12 months.
3. **Documented.** It has a real README that explains what it does and how to use it.
4. **Solves a real problem.** No toys, demos, or joke projects. No paywall on basic use.
5. **Open-source license.** The project must be freely usable.

If you are not certain a project has zero runtime dependencies, verify it first
(check its `package.json` `dependencies`, its lockfile, or its release artifacts).
When in doubt, leave it out — an inaccurate entry erodes trust in the whole list.

## Entry format

- **One entry per tool**, in the **single most appropriate category**.
- Entries within a category are **alphabetical** (case-insensitive) by name.
- Use the exact format, including the spaced em dash (` — `) and a trailing period:

  ```
  - [tool](https://github.com/owner/repo) — Description ending with a period.
  ```

- Link text is the tool's canonical/published name. Use the **canonical repository
  URL** (`https://github.com/<owner>/<repo>`). No affiliate, referral, or tracking links.
- Keep the description to one crisp line that says what the tool does.

The included `scripts/lint.mjs` validator enforces the format, alphabetical order,
duplicate detection, and the table-of-contents links. Run it before opening a PR:

```bash
node scripts/lint.mjs
```

## How to submit

- **Open an issue** using the *Suggest a tool* template, or
- **Open a pull request** editing `README.md` directly.

For a pull request:

1. Add your entry to the correct category, in alphabetical position.
2. Run `node scripts/lint.mjs` and make sure it prints `OK`.
3. Complete the checklist in the pull request template (zero-dep verified,
   alphabetical, correct format, working link).

## What gets rejected

- Tools with runtime dependencies that are not single-file / single-binary.
- Abandoned or undocumented projects, and toys or demos.
- Duplicate entries, wrong category, or broken formatting.
- Affiliate/tracking links, or self-promotion that does not meet the criteria.

Spam and low-quality submissions are closed politely. Thanks for helping keep the
list trustworthy.
