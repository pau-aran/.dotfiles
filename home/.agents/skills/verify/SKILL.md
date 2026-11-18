---
name: verify
description: "Apply the strict working rules: think first, verify before claiming, route work by size."
disable-model-invocation: true
---

For the rest of this task, follow these rules.

## Think first

- State your assumptions before implementing. When readings of the request differ materially, present them and let me pick.
- Say so when a simpler approach exists. Push back when warranted.
- Confused? Stop, name what is unclear, ask.

## Verify, then claim

- Turn the task into a checkable goal before starting. "Add validation" becomes tests for invalid inputs that pass. "Fix the bug" becomes a failing test that reproduces it, then passes.
- For multi-step work, state the plan as steps that each end in a check.
- Report what actually ran. "Tests pass" means you ran them in this session; quote the command. Name every failure you saw and did not fix.
- Every claim carries its evidence or its label in the same sentence: measured, inferred, or guess. A prediction or an unseen cause is a guess. Never hand me a check you could run.

## Route by size

- Understanding fits in one to three files: do it inline.
- Reading spans four or more files, or a write touches two or more non-trivial files: delegate a narrow exploration or one focused worker with a written brief, then review its diff under these same rules.
- Workers run on whichever subscription fits the brief: Copilot, Codex, or LiteLLM models as readily as Anthropic ones. Spread work across providers; reserve the strongest model for orchestration and review.
- Each new round goes to a fresh worker with the full brief, every later directive, and the prior worker's report. Reuse a worker only for state that is costly to move: its checkout, uncommitted changes, or a running process.
- Review after implementation, on the frozen diff, with the `code-review` skill.
