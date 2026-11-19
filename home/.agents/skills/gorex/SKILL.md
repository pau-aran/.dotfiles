---
name: gorex
description: Open a GoRex tab or pane in Windows for a shell command or an agent working on a task in WSL. Use only when the user explicitly asks for GoRex.
---

# GoRex

Use the [launcher](open-gorex-tab) from WSL. It opens a named tab, or with `--split-right` or `--split-down` a pane beside the focused one, in the user's running GoRex window. When no GoRex window is listening, it opens a new window instead. It uses the GoRex Start menu shortcut and control folder installed by `~/.dotfiles/packages/gorex/install-windows.sh` and runs in the Windows default WSL distro.

1. Use the requested agent and project directory. Check the agent's `--help` for its interactive startup-prompt syntax; pass the task as one argument, not shell code. Preserve its normal permissions and tool approval settings.
2. Run the launcher with a descriptive title, the absolute WSL project path, and the command as individual arguments. Add `--split-right` or `--split-down` first only when the user asks for a pane or split; the title then applies only if a new window opens. For example, for Pi:

   ```bash
   ~/.agents/skills/gorex/open-gorex-tab 'Pi · Review tests' "$PWD" -- \
     pi 'Review the tests for gaps. Report findings without editing files.'
   ```

3. On `GoRex tab launched in …`, tell the user the tab title, whether it went to the running window or a new one, and what you handed off. This confirms that the WSL shell reached the launch command, not that the agent finished or successfully authenticated. If confirmation times out, inspect the GoRex windows before retrying to avoid duplicate work.

With several GoRex windows open, whichever polls first takes the tab; the launcher cannot pick one. Windows opened before the installer ran do not listen until restarted. GoRex has no Herdr-style interface for reading, messaging, or waiting on existing tabs. Leave the launched tab available for the user to inspect.
