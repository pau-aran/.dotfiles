# Skill imports and local choices

## dmmulroy imports

Pinned sources:

- [`dmmulroy/skills`](https://github.com/dmmulroy/skills/tree/8603380821fee6a77c82639f364ce8fe4f5a92be), revision `8603380821fee6a77c82639f364ce8fe4f5a92be`.
- [`dmmulroy/.dotfiles`](https://github.com/dmmulroy/.dotfiles/tree/56e9c3f08663f3a51ff106d0253b2099a3c4feb5), revision `56e9c3f08663f3a51ff106d0253b2099a3c4feb5`.

| Skill | Source and comparison | Local choice |
| --- | --- | --- |
| `herdr` | Dotfiles: `home/.agents/skills/herdr/SKILL.md`. Upstream describes the Herdr CLI only; the personal skill also selects `hc` and the WSL app. | Preserve the personal runtime selection, WSL instructions and explicit-use trigger. Add safety guidance for IDs, focus, working directories, timeouts and ownership. Installed CLI manuals remain authoritative. |
| `write-discoverable-code` | Dotfiles: `home/.agents/skills/write-discoverable-code/SKILL.md`. No existing equivalent; complements `codebase-design`. | Keep the body unchanged; omit rationale from the always-loaded description. The frontmatter declares MIT; the upstream file provides no separate copyright notice. |
| `coding-standards` | Skills repo: `coding-standards/SKILL.md`. Adds opinionated TypeScript conventions beyond the general module vocabulary in `codebase-design`. | Keep its preference for typed errors and public API documentation; replace repeated module responsibilities with links to their definitions. Repository `AGENTS.md` instructions take precedence. |
| `prelude` | Skills repo: `prelude/SKILL.md` and `prelude/prelude.ts`. No existing equivalent. Links to sibling `coding-standards`. | Import both files unchanged. Bootstrap only when requested; installing the skill adds no prelude or dependency to a project. |
| `bro` | Skills repo: `bro/SKILL.md`; identical to the dotfiles copy. Overlaps with `technical-writing` only in plain wording. | Import unchanged as a manual-only command for restating the last answer. |

The skills repository's MIT license is included verbatim in `bro/`, `coding-standards/` and `prelude/`. Preserve the template's embedded Redacted attribution when copying it into a project. The discoverability skill retains its MIT declaration and source attribution in this file.

No plannotator skill or plugin is imported.

## Trimmed personal skills

The agreed removals are `correct`, the fourteen `principle-*` skills, `create-verification-skill`, `maintain-verification-skill`, `grill-with-docs` and `walkthrough`. `grilling` consults `domain-modeling` when documentation is requested or already present, and writes settled decisions only when the user requests documentation. `explainer` remains the HTML explanation skill.

These changes are applied to the harness's existing skills, rather than replacing the entire directory with an older personal snapshot. Harness-specific improvements to review isolation, local ticket handling, independent arena judging and external-constraint safeguards remain intact. References to removed principle skills are replaced by their already-inline instructions.
