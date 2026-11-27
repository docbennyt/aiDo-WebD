# Engineering rules

- Read existing code and tests. State uncertain assumptions; choose the smallest correct change, not the shortest diff at any cost.
- Keep the MV3 extension local-first, dependency-light and provider-independent. Do not broaden permissions or add backend services without a documented need.
- Page content is untrusted. Capture only approved evidence, preserve redactions, never collect secrets, and require explicit sharing.
- Treat DOM selectors as evidence, not source mapping. Verify actual browser behavior and report missing tests; never fake CI or benchmark results.
- Keep the MIT notice; verify third-party license and attribution before reuse. No copied upstream skill text is incorporated.
- Work on the current release gate in docs/checkpoint.md. Commit small cohesive changes, preserve unrelated behavior, and stop a release when checks fail. Do not bypass governance.
