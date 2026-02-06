# 📦 Versioning & Releases

> Managing change in design systems: semantic versioning, release cadence, visual breaking changes, and communicating updates to adopters.

## Articles

| # | Title | Key Topics |
|---|-------|------------|
| 1 | [Versioning Design Systems - Communicating Change](./01-versioning-design-systems---communicating-change.md) | SemVer, deprecation process, documentation versioning |
| 2 | [Releasing Design Systems - Outputs, Cadence, Versions](./02-releasing-design-systems---outputs-cadence-versions.md) | multi-output strategy, release channels, deployment tiers |
| 3 | [Visual Breaking Change - Color, Typography, Space](./03-visual-breaking-change---color-typography-space.md) | breaking change criteria, accessibility validation, contained changes |

## Key Takeaways

- **Semantic versioning is essential**: MAJOR for breaking changes, MINOR for backward-compatible features, PATCH for bug fixes. Apply to the entire library or individual components based on your team's needs.
- **Deprecation requires time and communication**: Give adopters 3-18 months notice depending on community size. Communicate across all channels: docs, code comments, design assets, and issue trackers.
- **Visual changes are harder to version than API changes**: Color, typography, and spacing changes can break user interfaces even without API changes. Establish clear criteria with your team for what constitutes a visual breaking change.
- **Design systems have multiple outputs**: UI component library (single source of truth), documentation site, design toolkits, tokens, fonts/icons. Version them independently or keep them synchronized based on your distribution strategy.
- **Document past versions**: Teams upgrade at different speeds. Maintain versioned documentation (e.g., `/v1.13.0/`) and design assets so teams can reference what they're actually using.

## Related Categories

- [🎨 Design Tokens](../01-design-tokens/) - Token versioning and synchronization
- [🧱 Visual Foundations](../02-visual-foundations/) - Visual style changes that trigger version bumps
- [🔄 System Generations & Evolution](../10-generations-evolution/) - Major version transitions and generational shifts

---

[← Back to Main](../README.md)
