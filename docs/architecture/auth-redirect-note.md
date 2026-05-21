# Auth Redirect Temporary Disable Note

## Why this change was made

During frontend development, the backend is not running yet and the app still needs to render protected pages and flows without a real API.

## What changed

- `libs/core/src/lib/guards/auth.guard.ts`
- Added `AUTH_REDIRECT_ENABLED = false`.
- Temporarily bypassed automatic redirect to `/auth/login` so protected routes do not redirect while unauthenticated.

## How to restore

1. Set `AUTH_REDIRECT_ENABLED = true` in `libs/core/src/lib/guards/auth.guard.ts`.
2. Ensure backend auth APIs are wired and tokens are validated correctly.
3. Confirm the guard logic returns `router.createUrlTree(['/auth/login'])` for unauthenticated users.

## Notes

- This is intentionally a temporary development shortcut.
- Do not remove the guard; only re-enable it when the real auth backend is available.
