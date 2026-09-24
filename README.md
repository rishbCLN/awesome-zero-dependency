# Awesome Zero-Dependency [![Awesome](https://awesome.re/badge.svg)](https://github.com/sindresorhus/awesome)

> A curated list of high-quality, zero-dependency and single-file developer tools.

Every entry here ships with **zero runtime dependencies**, or as a single hackable file or binary with no install and no build step. That means smaller installs, a tiny supply-chain surface, and code you can actually read end to end. The list features a family of nine zero-dependency command-line tools alongside well-known third-party projects, so it stands on its own merit and not as self-promotion.

## What counts as zero-dependency here

An entry qualifies when it meets **one** of the following, and is genuinely useful, maintained, and documented:

- **Zero runtime dependencies.** The published package installs nothing else at runtime; development-only dependencies (test runners, linters, bundlers) are fine.
- **A single file or single binary.** The tool is distributed as one hackable script or one self-contained binary that needs no install or build step to run.
- **Maintained, documented, and real.** It has a real README, a recent release or commit, an open-source license, and it solves an actual problem rather than being a toy or demo.

Prefer auditable, supply-chain-light tooling? This is your list.

## Contents

- [Command-line & Productivity](#command-line--productivity)
- [Git](#git)
- [Documentation](#documentation)
- [JSON & Data](#json--data)
- [API & Mocking](#api--mocking)
- [Environment & Setup](#environment--setup)
- [Libraries & single-file utilities](#libraries--single-file-utilities)
- [Contributing](#contributing)
- [License](#license)

## Command-line & Productivity

- [bat](https://github.com/sharkdp/bat) — A cat clone with syntax highlighting and Git integration.
- [fd](https://github.com/sharkdp/fd) — A simple, fast, and user-friendly alternative to find.
- [fzf](https://github.com/junegunn/fzf) — A general-purpose command-line fuzzy finder.
- [hyperfine](https://github.com/sharkdp/hyperfine) — A command-line benchmarking tool with statistical analysis.
- [pomo-cli](https://github.com/YOUR_USERNAME/pomo-cli) — A no-nonsense terminal Pomodoro timer with streaks and stats — zero dependencies, works on Windows, macOS, and Linux.
- [portkill](https://github.com/YOUR_USERNAME/portkill) — Find and kill whatever process is hogging a port — on Windows, macOS, and Linux, in one command.
- [ripgrep](https://github.com/BurntSushi/ripgrep) — Recursively search directories for a regex pattern, respecting your gitignore.
- [snipvault](https://github.com/YOUR_USERNAME/snipvault) — An offline, fuzzy-searchable snippet manager for your terminal — stash commands & boilerplate, then copy them to the clipboard. Zero dependencies.

## Git

- [delta](https://github.com/dandavison/delta) — A syntax-highlighting pager for git, diff, grep, and blame output.
- [git-cliff](https://github.com/orhun/git-cliff) — A highly customizable changelog generator that follows Conventional Commits.
- [gitsweep](https://github.com/YOUR_USERNAME/gitsweep) — Safely delete merged and stale local git branches — in one interactive command.
- [lazygit](https://github.com/jesseduffield/lazygit) — A simple terminal UI for git commands.

## Documentation

- [github-markdown-css](https://github.com/sindresorhus/github-markdown-css) — The minimal CSS needed to render Markdown the way GitHub does.
- [linkcheck-md](https://github.com/YOUR_USERNAME/linkcheck-md) — Find dead links in your Markdown and docs — local files, anchors, and external URLs — locally and in CI. Zero dependencies.
- [marked](https://github.com/markedjs/marked) — A fast, low-level Markdown parser and compiler built for speed.
- [readmine](https://github.com/YOUR_USERNAME/readmine) — Generate a beautiful README for your project in seconds — an interactive, zero-dependency wizard that reads your package.json and writes the docs for you.

## JSON & Data

- [fx](https://github.com/antonmedv/fx) — A terminal JSON viewer and processor with an interactive mode.
- [gron](https://github.com/tomnomnom/gron) — Transform JSON into discrete, greppable assignments and back again.
- [jq](https://github.com/jqlang/jq) — A lightweight and flexible command-line JSON processor.
- [jsonpeek](https://github.com/YOUR_USERNAME/jsonpeek) — A fast terminal JSON viewer that also hands you the jq path to any value — zero dependencies.

## API & Mocking

- [hurl](https://github.com/Orange-OpenSource/hurl) — Run and test HTTP requests defined in a simple plain-text format.
- [jsonmock-cli](https://github.com/YOUR_USERNAME/jsonmock-cli) — Spin up a fake REST API from a tiny JSON file — in one command. Zero dependencies.
- [oha](https://github.com/hatoo/oha) — A tiny HTTP load generator with a live terminal dashboard.
- [xh](https://github.com/ducaale/xh) — A friendly and fast tool for sending HTTP requests.

## Environment & Setup

- [direnv](https://github.com/direnv/direnv) — Load and unload environment variables per directory as you change folders.
- [dotenv](https://github.com/motdotla/dotenv) — Load environment variables from a .env file into process.env.
- [envcheck](https://github.com/YOUR_USERNAME/envcheck) — One command tells you why a project won't run on a new machine — required tools, versions, env vars, and files. Zero dependencies.
- [just](https://github.com/casey/just) — A handy command runner for saving and running project-specific tasks.

## Libraries & single-file utilities

- [classnames](https://github.com/JedWatson/classnames) — A tiny utility for conditionally joining CSS class names together.
- [clsx](https://github.com/lukeed/clsx) — A tiny utility for constructing className strings conditionally.
- [commander](https://github.com/tj/commander.js) — The complete solution for building Node.js command-line interfaces.
- [dayjs](https://github.com/iamkun/dayjs) — A 2kB immutable date library with a Moment.js-compatible API.
- [immer](https://github.com/immerjs/immer) — Work with immutable state by mutating a temporary draft object.
- [kleur](https://github.com/lukeed/kleur) — The fastest Node.js library for formatting terminal text with ANSI colors.
- [mitt](https://github.com/developit/mitt) — A tiny 200-byte functional event emitter and pub/sub.
- [ms](https://github.com/vercel/ms) — Convert various time formats to milliseconds and back.
- [nanoid](https://github.com/ai/nanoid) — A tiny, secure, URL-friendly, unique string ID generator.
- [normalize.css](https://github.com/necolas/normalize.css) — A modern, HTML5-ready alternative to CSS resets.
- [picocolors](https://github.com/alexeyraspopov/picocolors) — The tiniest and fastest library for terminal output formatting with ANSI colors.
- [preact](https://github.com/preactjs/preact) — A fast 3kB alternative to React with the same modern API.
- [zod](https://github.com/colinhacks/zod) — A TypeScript-first schema validation library with static type inference.

## Contributing

Contributions are welcome! Please read the [contribution guidelines](contributing.md) first — every entry must meet strict, zero-dependency inclusion criteria. Suggest a tool by opening an issue with the *Suggest a tool* template, or by sending a pull request. By participating you agree to abide by our [code of conduct](code-of-conduct.md).

## License

To the extent possible under law, the authors have waived all copyright and related or neighboring rights to this work. This list is dedicated to the public domain under [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/); see [LICENSE](LICENSE) for the full text.
