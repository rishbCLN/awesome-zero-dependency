# awesome-zero-dependency — build instructions

> Self-contained build spec. This one is a **curated list repo**, not an npm package. It is also the growth engine that links the other nine tools.

| Field | Value |
| --- | --- |
| Product name | **awesome-zero-dependency** |
| Tagline | *A curated list of high-quality, zero-dependency and single-file developer tools.* |
| Folder id | `star-tool10-awesome-zero-dependency` |
| Intended repo name | `awesome-zero-dependency` (verify; alt: `awesome-zero-deps`, `awesome-single-file-tools`) |
| Status | Planned |
| License | CC0-1.0 (standard for Awesome lists; content, not code) |

---

## 1. Concept & audience
"Awesome" lists are among the most-starred repos on GitHub. This one owns a real, opinionated niche: **tools with zero runtime dependencies** (or single-file, no-build tools). That theme is genuinely useful (supply-chain safety, small installs, easy auditing) and currently under-served.

**Audience:** developers who care about dependency bloat, supply-chain risk, small containers, and hackable tooling.

## 2. Why it earns stars (and powers the fleet)
- Awesome lists ride the "awesome" discovery ecosystem and get submitted to `sindresorhus/awesome`.
- Near-zero code to build — it's curation + presentation.
- **Flywheel:** it features portkill, gitsweep, readmine, envcheck, jsonpeek, mockit, linkcheck, snips, and pomo — every visitor to the list can discover all nine, and every tool's README links back here. Cross-promotion compounds stars across the whole fleet.

## 3. Scope
**MVP**
- `README.md` structured as a proper Awesome list:
  - badge (`awesome` badge), one-paragraph intro defining "zero-dependency" precisely,
  - a Table of Contents,
  - categorized sections (CLI/Productivity, Git, Docs, JSON/Data, API/Mocking, Env/Setup, Timers/Focus, Libraries),
  - each entry: `- [name](url) — one-line description.` (+ optional language/stars badge).
- Seed it with the fleet's nine tools **plus** genuinely well-known zero-dep tools so it's credible and useful (not just self-promotion).
- `contributing.md` with strict inclusion criteria (must be truly zero runtime deps or single-file; must be maintained; no affiliate spam).
- `code-of-conduct.md` (link the Contributor Covenant).

**Stretch**
- A tiny **zero-dependency** Node script `scripts/lint.mjs` that validates the README format (alphabetical within sections, no dead links via reusing `linkcheck` in CI, entry format regex). Dogfoods `linkcheck`.
- `awesome` badge + "Awesome" self-submission checklist.
- GitHub issue/PR templates for suggesting a tool.

**Non-goals**
- Not a package/CLI. No runtime deps. Don't pad with low-quality/abandoned entries — curation quality is the whole value.

## 4. Inclusion criteria (put in contributing.md — be strict)
- **Zero runtime dependencies** (dev deps allowed) **or** distributed as a single hackable file with no install/build.
- Actively maintained (commit within ~12 months) and documented (has a real README).
- Solves a real problem; not a toy/demo. No paywalls to basic use.
- Open-source license.
- One entry per tool, in the correct category, alphabetical, format: `- [tool](link) — Description ending with a period.`

## 5. File layout
```
awesome-zero-dependency/
  README.md               # the list itself
  contributing.md         # inclusion criteria + how to submit
  code-of-conduct.md
  LICENSE                 # CC0-1.0
  .github/
    workflows/lint.yml    # format + link check (uses linkcheck)
    ISSUE_TEMPLATE/suggest-a-tool.md
    PULL_REQUEST_TEMPLATE.md
  scripts/lint.mjs        # (stretch) zero-dep format validator
```

## 6. README structure (the list)
1. `# Awesome Zero-Dependency [![Awesome](badge)](https://github.com/sindresorhus/awesome)`
2. One-line definition + a crisp "What counts as zero-dependency here" paragraph.
3. `## Contents` (TOC linking each section).
4. Sections (alphabetical entries within each):
   - **Command-line & Productivity** (portkill, snips, pomo, …)
   - **Git** (gitsweep, …)
   - **Documentation** (readmine, linkcheck, …)
   - **JSON & Data** (jsonpeek, …)
   - **API & Mocking** (mockit, …)
   - **Environment & Setup** (envcheck, …)
   - **Libraries & single-file utilities** (well-known zero-dep libs)
5. `## Contributing` (link contributing.md) + `## License` (CC0).

## 7. Implementation steps
1. Scaffold repo files above; CC0 LICENSE.
2. Write the intro + precise definition (this is what makes the list credible).
3. Add the nine fleet tools in their categories + 10–20 reputable real zero-dep tools so the list stands on its own merit.
4. Write `contributing.md` inclusion criteria + templates.
5. (Stretch) `scripts/lint.mjs`: validate entry format + alphabetical order; wire `lint.yml` to run it **and** `linkcheck` on the README.
6. Add the `awesome` badge; prepare the self-submission PR to `sindresorhus/awesome`.

## 8. Quality & safety
- Every external link verified (CI via `linkcheck`) — a broken Awesome list loses trust fast.
- No affiliate/tracking links; plain canonical repo URLs only.
- Keep self-promotion honest: the fleet tools must genuinely meet the criteria (they're designed to). Balance with third-party entries.
- PRs reviewed against criteria; reject spam politely via the template.

## 9. Launch checklist
- Ensure ≥ 25 quality entries before launch (credibility threshold).
- Submit to `sindresorhus/awesome` (follow their strict guidelines — repo must be mature: description, TOC, CI, contributing, license).
- Show HN: "Show HN: Awesome Zero-Dependency — dev tools with no supply-chain baggage".
- r/programming, r/node, r/opensource, r/devops (supply-chain angle resonates post-npm-incidents).
- Cross-link: every fleet tool's README gets a "Featured in awesome-zero-dependency" line back here.

## 10. Definition of Done + star-magnet checklist
- [ ] Valid Awesome-list format; TOC; clear definition; CC0 license.
- [ ] ≥ 25 credible entries incl. the nine fleet tools, correctly categorized + alphabetized.
- [ ] contributing.md with strict criteria + issue/PR templates.
- [ ] CI validates format + links (dogfoods linkcheck).
- [ ] Submitted to sindresorhus/awesome; every fleet README links back here.
