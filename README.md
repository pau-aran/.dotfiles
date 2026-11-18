# .dotfiles

Personal config for pi, agent skills, Herdr and the shell prompt.

## Layout

- `home/` mirrors `$HOME`. `dot link` symlinks every file in it to the same path under `~`.
- `home/.pi/agent/`: pi working rules (`AGENTS.md`), `cloak.json`, `keybindings.json`, extensions.
- `home/.agents/skills/`: general agent skills. pi and other agents read `~/.agents/skills`.
- `home/.config/`: Herdr config and themes, oh-my-posh themes.
- `packages/pi-packages.txt`: pi packages to install with `pi install <source>`.

## Use

```sh
git clone https://github.com/pau-aran/.dotfiles.git ~/.dotfiles
~/.dotfiles/dot link     # existing files move to ~/.dotfiles/backups/
~/.dotfiles/dot doctor   # report files that are not linked and missing tools
```

## Not tracked

Each machine keeps its own:

- `~/.pi/agent/settings.json` and `models.json`: providers, enabled models, default model.
- Credentials and state: `auth.json`, `mcp-auth.json`, sessions, caches.
- `~/.bashrc.local`: work aliases and provider environment.
