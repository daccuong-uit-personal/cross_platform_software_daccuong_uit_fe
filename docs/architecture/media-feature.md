# Media Feature Architecture

## Overview

The media feature provides two distinct web pages:

- `/media` — **Media Platform** for creators to manage their own assets.
- `/media/studio` — **Media Studio** for administrators to manage the full system media catalog.

This separation keeps creator-facing operations lightweight while allowing richer admin listing capabilities.

## Route design

- `apps/app-shell/src/app/routes/app.routes.ts`
  - `path: 'media'` lazy loads `@fe/features/media`
- `libs/features/media/src/lib/lib.routes.ts`
  - `path: ''` maps to `MediaPlatformComponent`
  - `path: 'studio'` maps to `MediaStudioComponent`

## Component responsibility

### MediaPlatformComponent

- Upload files to the backend.
- Load only the authenticated user's media items.
- Preview and delete creator-owned assets.
- Use `AuthService` for user context.
- Use existing `MediaService`/domain media APIs.

### MediaStudioComponent

- List all system media assets.
- Support filtering, sorting, and pagination.
- Use `MediaApiService` for CRUD and list operations.
- Render data through shared `ui-shared-table`.

## Shared UI

- `libs/ui/src/lib/components/shared-table/shared-table.component.ts`
  - Reusable table component for rows, actions, and pagination.
  - Emits `pageChange`, `sortChange`, and `rowDelete`.

## Backend contract

The feature assumes a backend media contract that supports:

- `GET /api/media` with query parameters `page`, `pageSize`, `sort`, and `filter[...]`
- `GET /api/media/:id`
- `POST /api/media`
- `PUT /api/media/:id`
- `DELETE /api/media/:id`

## Phase 5 preparation

- The media feature is now stable enough to serve as the foundation for the next phase.
- Phase 5 will build social feed and creator content distribution, reusing media upload and preview flows.
- Keep the admin studio table and API client reusable for future social content moderation or catalog pages.
