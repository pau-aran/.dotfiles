# Dotfiles

Personal dotfiles. `home/` mirrors `$HOME`; `./dot link` symlinks each file into `~`.

## Where to look

| Task | Location |
|------|----------|
| pi working rules | `home/.pi/agent/AGENTS.md` |
| pi extension | `home/.pi/agent/extensions/` (`<name>.ts` or `<name>/index.ts`) |
| Secret masking | `home/.pi/agent/cloak.json` |
| Skill | `home/.agents/skills/<name>/SKILL.md` |
| pi package | `packages/pi-packages.txt` |
| Herdr | `home/.config/herdr/` |

## Rules

- Never commit credentials, sessions, `settings.json` or `models.json`. They are machine-local; `.gitignore` enforces it.
- Never commit work-specific hosts, accounts or client names. Those go in `~/.bashrc.local`.
- One change per commit.
