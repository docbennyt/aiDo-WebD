# Competitive research — 2026-11-28

Scope: pinned repository READMEs and metadata; targeted source inspection of Design Mode, React Grab and Agentation. This is not a runtime comparison, full license audit, or exhaustive issue/UX survey. No upstream code copied.

| Project and inspected revision | Reported license | Observed approach | WebD decision |
|---|---|---|---|
| [Onlook](https://github.com/onlook-dev/onlook/tree/89e73830e796c1b8b429221e9cd67a213c2bac3e) | Apache-2.0 | Local desktop visual editor on real repo, agent connections | Avoid replacing the IDE or requiring repo setup for basic capture. |
| [Stagewise](https://github.com/stagewise-io/stagewise/tree/b2f8b0023baa67e2b6ed65458d9c255177e10da8) | AGPL-3.0 | Agentic IDE, temporary previews and debugger access | Study UX only; no AGPL source incorporated into MIT core. |
| [Design Mode](https://github.com/SandeepBaskaran/design-mode/tree/59c5c757ebfaa6dc4727498f6c230d8ac3b942da) | MIT | Browser CSS/DOM edits, Markdown and MCP, three browsers | Direct competitor. Its inspected manifest requests all URLs; WebD keeps user-granted activeTab and opt-in capture. Its lifecycle tests show the importance of duplicate/stale-runtime handling. |
| [OpenMagic](https://github.com/Kalmuraee/OpenMagic/tree/add111cc93f82a695180b3998d295c8b925f0012) | MIT | Reverse-proxy toolbar, BYOK, source diffs and verification | Keep the core agent-independent and no model API. Evaluate optional adapters later. |
| [Design Loop](https://github.com/azu/design-loop/tree/3c036696c7bac07f4138280215d42bb08ecadbc0) | Not verified | Claude Code proxy, visual text editing and React locations | Treat as a workflow reference; no source reuse. |
| [React Grab](https://github.com/aidenybai/react-grab/tree/c695bdbaea103d3dae1a28c1bd03ea5c64561cbc) | MIT | Development-time source context; selector ranking and constrained attributes in inspected selector utility | Candidate for a narrow source-mapping integration after license/dependency and compatibility tests. Do not treat DOM selectors as source locations. |
| [Agentation](https://github.com/benjitaylor/agentation/tree/0e3236eb1a0f5577852ab7bb5121f5dd46d42f1d) | PolyForm Shield 1.0.0 (README) | Annotation and MCP; source-location implementation relies on React development internals | Learn from annotation workflow; no code reuse. Avoid promising stable private React internals. |

The competitive gap is not simply selecting elements or copying prompts. Those features already exist. Test whether WebD's explicit evidence approval, narrow permissions, installation without modifying an app, compact agent-independent handoff, and reproducible measurements are a compelling combination. Validate demand before expanding breadth.

[Karpathy-inspired skill](https://github.com/multica-ai/andrej-karpathy-skills/tree/2c606141936f1eeef17fa3043a72095b4765b9c2): inspected README and skill; skill metadata declares MIT, root license file not found in the inspected tree. AGENTS.md uses original project-specific guidance; no upstream text imported. For future skill distribution, use [official Codex skill docs](https://learn.chatgpt.com/docs/build-skills). No third-party design skill was installed. 

Before Milestone D: compare source-mapping APIs, inspect exact licenses and dependencies, add development/production and ambiguity fixtures, and record compatibility results. Before launch: run hands-on comparisons with consenting developers, review recurring upstream issues, and benchmark complete task outcomes rather than marketing claims.
