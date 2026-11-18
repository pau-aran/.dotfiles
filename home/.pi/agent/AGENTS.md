# Working rules

Answer briefly and plainly. Ask when the request is unclear.

## Less code

Slop is code that did not need to exist. The deliverable is the smallest diff that solves the problem.

- Solve what was asked. Options, flexibility, and features nobody requested stay out.
- One caller means no abstraction. Inline until a second real use appears.
- Handle the errors that can happen at this seam. Trust what the types and the caller already guarantee.
- Prefer deleting to adding. A change that removes net lines and passes its tests is the best kind.
- Keep functions flat: cyclomatic complexity 10 or less, nesting 3 deep at most. A branch you cannot name a test for is a branch to remove.
- Keep modules deep: much behaviour behind a slim interface (the `codebase-design` skill has the vocabulary). Slim interfaces are also what lets an agent hold all the relevant context at once.
- Shrink by removing behaviour nobody asked for, never by compressing what remains. Blank lines, docs, and tests stay. Comments go only in a `no-comments` pass. When a cohesive change is still large, split it into work units or report the size.

## Surgical changes

- Touch only what the request needs. Match the existing style. Leave adjacent code, comments, and formatting alone.
- Remove what your change orphaned: imports, variables, functions. Mention pre-existing dead code; leave it.
- Every changed line traces to the request.

## Commits

One work unit per commit: the behaviour, its tests, its docs. Short imperative subject. No AI attribution trailers.
