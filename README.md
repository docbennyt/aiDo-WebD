# WebD by aiDo

**Show, don't prompt.**

Select an element on your own development preview, describe the change, approve the relevant evidence, and hand it to your existing AI coding assistant. No model API, account, backend or production deployment needed.

**Status: v0.1.0 release candidate — not a stable release.** Local unit and Chromium DOM checks passed; installed-extension CI and native toolbar permission smoke tests must pass before a stable release. Direct visual editing and source mapping are not yet shipped.

## Install the candidate

1. Download the source from this branch or the candidate ZIP from a successful [CI run](https://github.com/docbennyt/aiDo-WebD/actions). Extract it. Source checkouts contain the extension in `extension/`; the packaged ZIP has `manifest.json` at its root.
2. In desktop Chrome 116+, open `chrome://extensions`, enable Developer mode and select **Load unpacked**. Choose the folder containing `manifest.json`.
3. Open an authorized HTTP(S) development preview. For the bundled demo, run `python -m http.server 8000` from the source root and open `http://localhost:8000/docs/demo.html`.
4. Click the WebD toolbar icon (or Alt+Shift+W if available), then **Select element**. Click the target; Escape or Cancel ends selection.
5. Describe the change. Edit the approved evidence to remove anything sensitive. Review the generated handoff, then copy it into ChatGPT, Codex or your preferred assistant. Review the source diff and verify the result on the real page.

Reopen the toolbar icon on each new target tab. The extension requests only activeTab, scripting and sidePanel. IDs/classes and page origin/path are opt-in, with no query or fragment. No input values, page text, screenshots or cookies are intentionally captured. DOM selectors and styles may still disclose information; review before copying. Capture is not a source mapping. Top-level light DOM only; embedded frames and shadow internals are unsupported. Page-controlled listeners and rerenders may interfere. Closing the panel may leave a picker until its timeout; cancel explicitly first.

## Develop

Node 22 and Python 3.13: `node --test tests/context.test.mjs`; `python -m pip install -r tests/requirements.txt`; `python -m playwright install chromium`; `python tests/dom.py`; `python tests/extension.py`; `python scripts/package.py`. The extension test uses a disposable loopback-only permission grant for interactions, never shipped. Verify actual toolbar grant separately. See [release gate](docs/checkpoint.md), [benchmark plan](docs/benchmark.md), [contributing](CONTRIBUTING.md) and [security](SECURITY.md).

If WebD helps you, [star the project](https://github.com/docbennyt/aiDo-WebD) and report a specific workflow that could be improved. No productivity numbers are claimed before measurements exist.

MIT; see LICENSE. WebD is not affiliated with any model provider.
