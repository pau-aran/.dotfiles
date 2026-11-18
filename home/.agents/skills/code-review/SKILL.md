---
name: code-review
description: "Review the changes since a fixed point (commit, branch, tag, or merge-base) along four axes: Standards (does the code follow this repo's documented coding standards?), Spec (does the code match what the originating issue/spec asked for?), Slim (could the diff be smaller and flatter?) and Correctness (does the diff do what it claims under real inputs, concurrency, failure and hostile input?). Runs all four reviews in parallel sub-agents and reports them side by side. Use when the user wants to review a branch, a PR, work-in-progress changes, or asks to \"review since X\"."
---

Four-axis review of the diff between `HEAD` and a fixed point the user supplies:

- **Standards**: does the code conform to this repo's documented coding standards?
- **Spec**: does the code faithfully implement the originating issue / spec?
- **Slim**: could the diff be smaller and flatter and still meet the spec?
- **Correctness**: does the diff do what it claims under real inputs, concurrency, failure and hostile input?

All four axes run as **parallel sub-agents** so they don't pollute each other's context, then this skill aggregates their findings. Start every sub-agent with a fresh context window.

If `docs/agents/issue-tracker.md` exists, it describes how to fetch issues from the project tracker. If it is missing, skip step 2.1 below and go straight to 2.2.

## Process

### 1. Pin the fixed point

Whatever the user said is the fixed point (a commit SHA, branch name, tag, `main`, `HEAD~5`, etc.). If they didn't specify one, ask for it.

Capture the diff command once: `git diff <fixed-point>...HEAD` (three-dot, so the comparison is against the merge-base). Also note the list of commits via `git log <fixed-point>..HEAD --oneline`.

Before going further, confirm the fixed point resolves (`git rev-parse <fixed-point>`) and the diff is non-empty. A bad ref or empty diff should fail here, not inside four parallel sub-agents.

### 2. Identify the spec source

Look for the originating spec, in this order:

1. Issue references in the commit messages (`#123`, `Closes #45`, GitLab `!67`, etc.), fetched via the workflow in `docs/agents/issue-tracker.md`.
2. A path the user passed as an argument.
3. A spec file under `docs/`, `specs/`, or `.scratch/` matching the branch name or feature.
4. If nothing is found, ask the user where the spec is. If they say there isn't one, the **Spec** sub-agent will skip and report "no spec available".

### 3. Identify the standards sources

Search the repo for every file that documents how code should be written. When `CODING_STANDARDS.md` or `CONTRIBUTING.md` exists, it must be on the list.

On top of whatever the repo documents, the Standards axis always carries the **smell baseline** below: a fixed set of Fowler code smells (_Refactoring_, ch.3) that applies even when a repo documents nothing. Two rules bind it:

- **The repo overrides.** A documented repo standard always wins; where it endorses something the baseline would flag, suppress the smell.
- **Always a judgement call.** Each smell is a labelled heuristic ("possible Feature Envy"), never a hard violation. Like any standard here, skip anything tooling already enforces.

Each smell reads *what it is* → *how to fix*; match it against the diff:

- **Mysterious Name**: a function, variable, or type whose name doesn't reveal what it does or holds. → rename it; if no honest name comes, the design's murky.
- **Duplicated Code**: the same logic shape appears in more than one hunk or file in the change. → extract the shared shape, call it from both.
- **Feature Envy**: a method that reaches into another object's data more than its own. → move the method onto the data it envies.
- **Data Clumps**: the same few fields or params keep travelling together (a type wanting to be born). → bundle them into one type, pass that.
- **Primitive Obsession**: a primitive or string standing in for a domain concept that deserves its own type. → give the concept its own small type.
- **Repeated Switches**: the same `switch`/`if`-cascade on the same type recurs across the change. → replace with polymorphism, or one map both sites share.
- **Shotgun Surgery**: one logical change forces scattered edits across many files in the diff. → gather what changes together into one module.
- **Divergent Change**: one file or module is edited for several unrelated reasons. → split so each module changes for one reason.
- **Speculative Generality**: abstraction, parameters, or hooks added for needs the spec doesn't have. → delete it; inline back until a real need shows.
- **Message Chains**: long `a.b().c().d()` navigation the caller shouldn't depend on. → hide the walk behind one method on the first object.
- **Middle Man**: a class or function that mostly just delegates onward. → cut it, call the real target direct.
- **Refused Bequest**: a subclass or implementer that ignores or overrides most of what it inherits. → drop the inheritance, use composition.

### 4. Spawn the four sub-agents in parallel

**Standards sub-agent prompt** should include:

- The full diff command and commit list.
- The list of standards-source files you found in step 3, **plus the smell baseline from step 3** pasted in full (the sub-agent has no other access to it).
- The brief: "Report, per file/hunk where relevant, (a) every place the diff violates a documented standard: cite the standard (file + the rule); and (b) any baseline smell you spot: name it and quote the hunk. Distinguish hard violations from judgement calls: documented-standard breaches can be hard, but baseline smells are always judgement calls, and a documented repo standard overrides the baseline. Skip anything tooling enforces. Under 400 words."

**Spec sub-agent prompt** should include:

- The diff command and commit list.
- The path or fetched contents of the spec.
- The brief: "Report: (a) requirements the spec asked for that are missing or partial; (b) behaviour in the diff that wasn't asked for (scope creep); (c) requirements that look implemented but where the implementation looks wrong. Quote the spec line for each finding. Under 400 words."

If the spec is missing, skip the Spec sub-agent and note this in the final report.

**Slim sub-agent prompt** should include:

- The diff command and commit list, plus the spec path if step 2 found one (so the sub-agent can tell what was asked for from what wasn't).
- The brief: "Report, per hunk where relevant, (a) code that can be deleted outright: behaviour, options, parameters, or abstractions the spec did not ask for, and error handling for cases the types or callers already rule out; (b) code that can be shorter with the same behaviour: a helper with one caller to inline, a wrapper that only forwards, duplicated shapes to merge; (c) complexity to flatten: any function in the diff whose cyclomatic complexity exceeds 10 or whose nesting exceeds 3, naming the branch to remove or the early return that flattens it; (d) the net line count of the diff (additions minus deletions) and, for each finding, an estimate of lines removed. Quote the hunk for each finding and state the smaller version in one or two sentences. Findings that would strip comments, blank lines, docs, or tests don't count: this axis measures behaviour and structure, never formatting. Under 400 words. End with either at least one concrete reduction or the sentence 'Nothing to remove: <one-line reason>'; an empty report without that sentence is incomplete."

**Correctness sub-agent prompt** should include:

- The diff command and commit list, plus the spec path if step 2 found one; otherwise the commit messages stand as the change's stated intent.
- The **correctness rubric** below, pasted in full (the sub-agent has no other access to it).
- The brief: "Report whether the diff does what it claims under real inputs, concurrency, failure and hostile input. Read beyond the diff: callers, callees, type definitions, sibling modules. Apply only the rubric lenses that fit the change. For each finding give: **Severity** (`critical`: would cause bugs, data loss, security issues, or broken behaviour; `warning`: a correctness risk that isn't broken yet but will cause pain; `nit`: minor), **Location** (file:line or function), **Finding** (what is wrong, in concrete terms), **Evidence** (the traced call chain or input path that triggers it, not 'this could be nil'), and an optional **Suggestion** when you have a concrete fix. Before reporting, filter: drop a finding whose input the callers or types already rule out (trace the call site; hypothetical is not actual); drop findings on code the diff didn't touch or on patterns consistent with the rest of the codebase; if what remains is all nits, say the code is probably fine instead of inflating them. Be slow to drop a security finding or a traced bug: when in doubt, keep it. Under 400 words. An empty review is a valid outcome: end with either at least one finding or the sentence 'No correctness findings: <one-line reason>'."

The correctness rubric:

- **Correctness**: does the code actually do what the intent says it should?
  - Edge cases: empty inputs, nil/undefined, boundary values, concurrent access.
  - Error handling: are errors caught, propagated, or silently swallowed?
  - Off-by-one, type coercion, integer overflow, string encoding.
  - State management: race conditions, stale closures, dangling references.
  - Does the happy path work? Does the sad path work?
  - Idempotency: what happens if this operation runs twice, or if a previous run crashed halfway? If the answer is "it depends on what state was left behind", there's a missing reconciliation step.
  - Concurrency: if multiple actors can touch the same mutable state (files, branches, shared data), is access serialized structurally (locks, sequential phases, exclusive ownership), or by conventions that won't hold?
  - For a potential bug, trace the execution path: show the call chain that makes it nil, don't just flag "this could be nil".
- **Root causes vs. symptoms**: is the code fixing the actual problem or papering over a symptom? Read the surrounding code to tell whether the change addresses the right layer.
  - Guard clauses that mask a deeper invariant violation.
  - Retry logic that hides a broken contract.
  - Type casts that silence a modeling error.
  - A workaround: why is it needed, and what would a proper fix look like?
  - A fix in module A that should really be a fix in module B's contract.
  - Instructions where structure would be better: a comment saying "don't do X" or a convention someone has to remember, where a type constraint, lint rule, or runtime check could make the wrong thing impossible.
- **Verification**: can you tell that this code works from reading it?
  - Are there tests? Do they test behaviour or implementation details?
  - Are there assertions or invariants that would catch regressions?
  - If this is a bug fix: is there a test for the bug?
  - If this touches an integration boundary: is the full path tested?
  - Check the real thing, not a proxy: liveness read from file mtime or cached state instead of the actual value is a verification gap.
  - For delegated or async work: does the code verify actual output artifacts, or does it trust self-reports and summaries?
- **Security**: for each finding, trace the input path through the code and show it.
  - User input flowing to dangerous sinks (SQL, shell, eval, innerHTML) without sanitization.
  - Authentication or authorization gaps in new endpoints.
  - Secrets in code, logs, or error messages.
  - TOCTOU (time-of-check-time-of-use) in security-critical paths.

### 5. Aggregate

Present the four reports under `## Standards`, `## Spec`, `## Slim` and `## Correctness` headings, verbatim or lightly cleaned. Do **not** merge or rerank findings, because the four axes are deliberately separate (see _Why four axes_).

End with a one-line summary: total findings per axis, and the worst issue _within each axis_ (if any). Don't pick a single winner across axes: that's the reranking the separation exists to prevent.

## Why four axes

A change can pass one axis and fail another:

- Code that follows every standard but implements the wrong thing → **Standards pass, Spec fail.**
- Code that does exactly what the issue asked but breaks the project's conventions → **Spec pass, Standards fail.**
- Code that meets the spec and every standard yet carries an abstraction with one caller → **Standards pass, Spec pass, Slim fail.**
- Code that is minimal, conventional and does what the issue asked, yet retries a non-idempotent write after a partial failure → **Standards, Spec and Slim pass, Correctness fail.**

Reporting them separately stops one axis from masking the others.
