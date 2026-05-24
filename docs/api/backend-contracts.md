# Backend CRUD Modules for Social Microservice Architecture

This document summarizes the backend modules and CRUD operations needed to support the app in mock mode today and to ease handoff to microservice teams.

## Main service: Social Service
The social service is the main integration layer and orchestrates content from other microservices.

### 1. Users / Profiles
- Create user account
- Read profile by user ID
- Update profile details
- Delete account / deactivate
- Support search, follow suggestions, and profile metadata

### 2. Posts / Feed
- Create post
- Read post by ID
- Update post content
- Delete post
- List posts for feed, author, hashtag, and trending
- Pagination, sorting, and filter support

### 3. Comments
- Create comment
- Read comments by post ID
- Update comment
- Delete comment
- Count and thread support for nested replies

### 4. Reactions / Likes
- Create reaction/like
- Read reaction counts and user reaction state
- Update reaction if needed (switch from like to love, etc.)
- Delete reaction

### 5. Notifications
- Create notification event
- Read notification list by user
- Update notification status (read/unread)
- Delete notification

### 6. Search / Hashtags
- Read search results for users, posts, hashtags
- Read hashtag details and trending tag pages
- No direct create/update from UI today, but this service should support ingesting tags from posts

### 7. Suggestions / Follows
- Read suggested users
- Read follow relationships
- Create follow
- Delete unfollow

## Supporting microservices
These can be separate services that the social service integrates with.

### Media Service
- Create/upload media asset
- Read media list by user
- Read preview/download URL
- Update asset metadata/status
- Delete asset
- Support processing status, file type, and storage metadata

### Auth Service
- User login and authentication
- Token issue and refresh
- Password reset
- Session validation
- User registration

### Chat Service
- Create chat threads / channels
- Read chat thread list and messages
- Create message
- Update message
- Delete message

### Studio / Content Management Service
- Create content campaigns or collections
- Read creator workspace items
- Update drafts and artwork metadata
- Delete campaign assets

## Recommended module split for backend
- `auth-service` — authentication, sessions, users
- `social-service` — feed, posts, comments, notifications, search aggregator
- `media-service` — media storage, upload, preview, delete
- `chat-service` — real-time messaging and chat threads
- `studio-service` — creator studio, collections, campaign management
- `profile-service` — profile details and preferences (optional if social-service owns users)

## Notes for mock mode
- The frontend currently uses local mock data for social feed and media items.
- Backend teams can implement APIs gradually and keep the same resource shapes:
  - `/users`, `/posts`, `/comments`, `/notifications`, `/media`, `/messages`
- The social service should remain the main integration entry point for UI routes.
