# WebD by aiDo

**Show, don't prompt.**

A visual-first, open-source development companion for the AI you already use.

> Early prototype. The element picker and copyable edit context are implemented in the starter. Browser integration still needs real-world testing. Direct visual editing, source mapping, automatic patches, and deployment are not shipped.

## Why WebD?

A powerful model shouldn't need five paragraphs to understand which button is broken. Point to an element, describe the intended change, and give the AI the small amount of context it actually needs. Keep review and production releases in your hands.

WebD is inspired by reusable skills in creator workflows and the visual feedback loops found in tools such as Lovable, v0 and Bolt. It is not affiliated with those products or OpenAI.

## Try the prototype

1. Clone or download [this repository](https://github.com/docbennyt/aiDo-WebD).
2. In desktop Chrome or another compatible Chromium browser, open `chrome://extensions`, enable Developer mode, and choose **Load unpacked**. Select `extension/`.
3. Open `docs/demo.html` through a local server (`python -m http.server 8000` from the repository root; visit `http://localhost:8000/docs/demo.html`) or open an authorized development preview.
4. Click WebD's extension icon to open its side panel. Click **Select element**, then click an element on the page (Esc cancels).
5. Type a change, inspect the generated context, and copy it into your AI assistant. If the assistant supports repository edits, have it locate the source and propose a small patch. Verify the patch at desktop and mobile widths.

No API key, model call, remote backend, subscription bypass or automatic deployment is included in the prototype. Your AI assistant's own usage limits still apply. The extension only asks for user-activated access to the current tab; restricted browser pages and cross-origin embedded frames are not supported. Do not select sensitive elements. Class names, IDs and paths may contain confidential information; inspect and redact the context before sharing.

## Roadmap

- [x] Original visual edit skill and user-controlled prompt format.
- [x] Chromium extension starter: element selection and computed-style capture.
- [ ] Browser smoke tests and cross-browser compatibility.
- [ ] Safe local visual overrides, responsive preview and undo.
- [ ] Source mapping for supported build systems; explicit patch approval.
- [ ] Curated, license-aware skill catalog and official integrations.
- [ ] Comparative benchmarks for time-to-accepted-change, correction turns, token counts where available, and regressions.

## Contribute

Try a real frontend task, then report reproduction steps, browser version, expected outcome and actual outcome. No invented savings claims; record the whole workflow, including review and testing. See [the benchmark plan](docs/benchmark.md) and [visual frontend edit skill](skills/visual-frontend-edit/SKILL.md).

If the problem resonates with you, star the repository and share a concrete workflow you want WebD to improve.

## License

MIT for original project files. Third-party assets, components and skills retain their own licenses. Do not redistribute paid or restricted material without permission.
