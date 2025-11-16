## Cursor Rules for this repo

- Do NOT push to any remote without explicit user approval in chat.
- Before any irreversible action (push, force-push, tag, release), ask for confirmation.
- Use yarn (not npm). Use JavaScript (not TypeScript). Use Next.js Pages Router (not App Router).
- Keep edits scoped and explain high-impact changes succinctly.

Enforcement
- Local Git pre-push hook blocks all pushes by default. To allow a one-time push, run:
  - `git -c hooks.allowPush=true push`
  - or set env: `ALLOW_PUSH=1 git push`
  - or include `[allow-push]` in the last commit message.

If you want to disable the hook temporarily:
- `git config hooks.allowPush true` (one-time via `-c` is preferred).


