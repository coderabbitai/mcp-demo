# CodeRabbit integration qualification fixture

This isolated, non-deployed example qualifies review, fix, tests, and re-review
through Replit, Lovable, Bolt, and Devin. Each host uses its own PR and branch.
The base branch is a passing reference implementation. Prices are integer cents
and quantities are nonnegative integers supplied by a trusted caller.

Run `node qualification/cart/cart.test.mjs` from the repository root.
Scope all edits to `qualification/cart/`; do not change unrelated repository
files, merge a PR, deploy an app, or publish a marketplace listing.
