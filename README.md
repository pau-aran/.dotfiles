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

## GoRex on Windows

From WSL with Go 1.27.1 or newer, run:

```sh
~/.dotfiles/packages/gorex/install-windows.sh
```

This builds a native Windows app from pinned GoRex source and adds **GoRex**
to the Start menu. New panes start in the default WSL distribution's home
directory and use the Ubuntu profile's Catppuccin Mocha palette, with tabs
in a left sidebar. Your WSL shell loads its usual prompt and startup files. GoRex keeps its own shortcuts, layout, and sessions; it
doesn't import Herdr workspaces or plugins. Before reinstalling, quit GoRex
and end its sessions so Windows can replace the executable.

## Not tracked

Each machine keeps its own:

- `~/.pi/agent/settings.json` and `models.json`: providers, enabled models, default model.
- Credentials and state: `auth.json`, `mcp-auth.json`, sessions, caches.
- `~/.bashrc.local`: work aliases and provider environment.
