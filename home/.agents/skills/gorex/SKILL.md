---
name: gorex
description: Open a GoRex tab in Windows for a shell command or an agent working on a task in WSL. Use only when the user explicitly asks for GoRex.
---

# GoRex

Use the [launcher](open-gorex-tab) from WSL. It opens a named tab in a separate native GoRex window, leaving the user's existing tabs and sessions alone. It uses the GoRex Start menu shortcut installed by `~/.dotfiles/packages/gorex/install-windows.sh` and runs in the Windows default WSL distro.

1. Use the requested agent and project directory. Check the agent's `--help` for its interactive startup-prompt syntax; pass the task as one argument, not shell code. Preserve its normal permissions and tool approval settings.
2. Run the launcher with a descriptive title, the absolute WSL project path, and the command as individual arguments. For example, for Pi:

   ```bash
   ~/.agents/skills/gorex/open-gorex-tab 'Pi · Review tests' "$PWD" -- \
     pi 'Review the tests for gaps. Report findings without editing files.'
   ```

3. On `GoRex tab launched`, tell the user the tab title and what you handed off. This confirms that the WSL shell reached the launch command, not that the agent finished or successfully authenticated. If confirmation times out, inspect the new window before retrying to avoid duplicate work.

GoRex has no Herdr-style interface for reading, messaging, or waiting on arbitrary existing tabs. If the user specifically wants a tab in an existing window, explain the limitation; offer `Ctrl+Shift+T` in that window or ask before opening a separate one. Leave the launched tab available for the user to inspect.
