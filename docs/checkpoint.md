# Milestone A — release checkpoint

Base: fac6c05dbd1a98155324f479d0d96ae0f3013f82. Work branch: feat/dogfood-v0.1. Tracking issue #1. No stable release yet.

Local checks: Node syntax and manifest JSON parse; 3 unit tests; 5 Chromium DOM picker scenarios using Chromium 144 and Playwright 1.57; deterministic extension ZIP. These are not installed-extension tests. System Chromium blocked chrome://extensions with ERR_BLOCKED_BY_ADMINISTRATOR; no extension worker loaded, and headed launch timed out. Do not bypass that policy.

Remaining gate: GitHub Actions installed-extension tests on exact candidate, native toolbar activeTab grant on Chrome (including switching tabs, closing panel, keyboard and clipboard), actual aiDo development preview source change and acceptance. Review CI logs, fix failures, rerun, then tag v0.1.0 only when all release requirements are met. Test suite uses a temporary loopback permission for automation, which does not validate native toolbar grant. No claims of cross-browser compatibility or verified accessibility yet.

Roadmap after gate: B validated temporary CSS edits with undo and reset; C versioned portable change bundles; D verified static and React source mapping; E official optional agent adapters; F rendered verification. Benchmark matched tasks before public productivity claims. Do not build account/billing infrastructure yet.
