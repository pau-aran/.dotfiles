---
name: herdr
description: "Control Herdr workspaces, tabs, panes, and agents. Use only when the user explicitly mentions Herdr or hc, or asks to use them to run, read, message, or wait on a terminal or another agent, or to change layouts, keys, or mods. A task that could merely benefit from delegation or parallel work is not a trigger."
---

# Herdr

The installed binaries carry their own manuals, which are the authority for commands. Choose the runtime before the first control command:

1. If `test "${HERDR_ENV:-}" = 1` passes, run `herdr --skill` and use `herdr` for this session. This takes precedence over inherited `HC_*` variables.
2. Otherwise, if `test -n "${HC_TERMINAL_ID:-}"` passes, run `hc --skill` for terminals and agents. For the app's spaces, tabs, and panes, read `herdr-app --skill`; for layouts, keys, and mods, also read `AGENTS.md` in the app home.
3. If neither check passes, tell the user you are outside a managed terminal and stop session control. Local configuration and CLI help can still be inspected; runtime tests use an explicitly isolated test session.

## Herdr app in WSL

`herdr-app` lives on the Windows side, off the WSL `PATH`. Call it by full path:

```bash
/mnt/c/Users/PauAranMiguel/AppData/Local/Programs/herdr-app/herdr-app.exe --skill
```

The app home is `/mnt/c/Users/PauAranMiguel/.config/herdr-app`.

- Pass `herdr-app check` a Windows path: `"$(wslpath -w "$path")"`.
- App IDs carry an `ubuntu/` prefix. Strip it for `hc` and for `herdr.*` labels.
- Pass `--machine ubuntu` to `space.new` for a WSL space.

## Scope

`herdr` and `hc` have separate servers, state, and identifiers. Keep control commands on the runtime selected above; switching UIs does not move running agents between them.

Act on another existing terminal only when the user names it.

- Target the calling pane or an explicit ID; read IDs from command responses instead of assuming the focused pane belongs to you.
- Preserve the caller's working directory and keep focus unchanged for background work.
- After a timeout, inspect live state before retrying: the command may already have been applied.
- Close only terminals you created unless the user asks otherwise. Restart or stop a server only with explicit permission.
