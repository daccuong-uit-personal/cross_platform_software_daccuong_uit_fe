# FRONTEND ROADMAP
## Production-Oriented Social + Commerce + Creator Ecosystem

Version: v1.0
Target Stack: Angular + Nx Monorepo + Signals + RxJS + TailwindCSS
Architecture Style: Rendering Platform + UX Engine

---

# 1. SYSTEM OVERVIEW

## Vision

Build a scalable frontend platform for:

- Social Feed
- Creator Ecosystem
- Commerce Platform
- Realtime Interaction
- Media Platform
- Analytics Dashboard
- Livestreaming
- Recommendation UX

The frontend is NOT the business engine.

Frontend responsibility:

```txt
rendering
interaction
navigation
optimistic ui
realtime hint
local state
responsive experience
media rendering
```

Backend responsibility:

```txt
ranking
business rules
workflow
permission resolution
recommendation
pricing
inventory
ledger truth
aggregation
transaction state
```

---

# 2. GLOBAL ARCHITECTURE

## Monorepo Structure

```txt
apps/
├── web/
├── admin/
├── creator-studio/
└── mobile-shell/

libs/
├── core/
├── shared-ui/
├── auth/
├── profile/
├── media/
├── feed/
├── chat/
├── realtime/
├── search/
├── commerce/
├── analytics/
├── recommendation/
└── live/
```

---

# 3. CORE TECHNOLOGY STACK

## Framework

```txt
Angular (latest stable)
TypeScript strict mode
Angular Signals
RxJS
Angular CDK
Angular Router
```

## Styling

```txt
TailwindCSS
CSS Variables
Design Tokens
```

## Monorepo

```txt
Nx Monorepo
```

## API Integration

```txt
OpenAPI Generator
Swagger Codegen
```

## Monitoring

```txt
Sentry
Frontend Telemetry
Core Web Vitals
```

---

# 4. GLOBAL ENGINEERING RULES

## Mandatory Rules

### FE must NOT

```txt
join data manually
calculate ranking
implement permission logic
orchestrate workflow
own transaction truth
```

### FE must

```txt
render efficiently
avoid memory leaks
be cancellation-safe
be realtime-safe
be mobile responsive
be resilient to network issues
```

---

## Rendering Rules

### Mandatory

```txt
ChangeDetectionStrategy.OnPush
trackBy / @track everywhere
lazy loading
route splitting
virtual rendering
skeleton loading
```

---

## State Management Rules

### Use Signals for

```txt
local ui state
modal state
component state
filters
selection state
```

### Use RxJS for

```txt
api stream
websocket stream
search debounce
realtime events
retry strategy
upload progress
async orchestration
```

### Avoid

```txt
global god store
ngrx everywhere
over-abstracted state layer
```

---

## Realtime Rules

### Websocket is ONLY

```txt
signal layer
notification layer
presence layer
realtime invalidation
```

### Websocket is NOT

```txt
source of truth
large data transport
full synchronization engine
```

---

# 5. REQUIRED SKILLS FOR AGENTS

## Angular

Mandatory:

```txt
signals
standalone components
onpush
control flow syntax
lazy routes
hydration basics
```

---

## RxJS

Mandatory:

```txt
switchMap
exhaustMap
concatMap
mergeMap
debounceTime
distinctUntilChanged
catchError
retry
shareReplay
```

---

## Performance Engineering

Mandatory:

```txt
memory profiling
virtual scrolling
render optimization
media optimization
websocket optimization
bundle optimization
```

---

## Browser Knowledge

Mandatory:

```txt
render lifecycle
layout/reflow
gpu layers
video buffering
intersection observer
storage apis
service worker basics
```

---

# 6. PHASE 0 — CROSS PROJECT FOUNDATION PLATFORM

## Goal

Build reusable platform base for multiple future applications.

---

## Deliverables

### Design Token System

```txt
spacing scale
typography scale
color palette
radius scale
shadow scale
motion tokens
z-index system
```

---

### Theme Platform

Support:

```txt
light mode
dark mode
system theme detection
```

---

### Shared Utilities

```txt
currency formatter
date formatter
timezone helper
validation helper
logger helper
```

---

### Runtime Environment Config

Must support:

```txt
docker runtime injection
k8s runtime injection
multi environment
feature toggles
```

---

### Internationalization

Support:

```txt
i18n
lazy locale loading
currency localization
number formatting
```

---

### Shared Libraries

```txt
libs/shared/theme
libs/shared/utils
libs/shared/logger
libs/shared/config
```

---

## Output Artifacts

### MUST CREATE

```txt
figma design token system
frontend architecture docs
coding standards
eslint rules
prettier config
nx workspace rules
```

---

# 7. PHASE 1 — FRONTEND FOUNDATION PLATFORM

## Goal

Setup production-ready frontend architecture.

---

## Deliverables

### Nx Workspace Setup

```txt
apps/
libs/
import boundaries
affected builds
cache pipeline
```

---

### Core Platform

```txt
core/
├── api/
├── auth/
├── websocket/
├── interceptors/
├── guards/
├── tracing/
├── config/
├── storage/
└── error-handler/
```

---

### Unified API Client

Requirements:

```txt
swagger generated clients
strict types
request normalization
response normalization
error normalization
```

---

### HTTP Interceptor

Must handle:

```txt
access token
refresh token
mutex refresh strategy
trace id
retry nhẹ
timeout
request cancellation
```

---

### Websocket Core

Must support:

```txt
auto reconnect
heartbeat
backoff retry
connection state
network offline detection
```

---

### Base Routing

```txt
/
/feed
/profile/:id
/chat
/studio
/shop
/live
/search
/settings
```

---

## Output Artifacts

### MUST CREATE

```txt
system architecture diagram
api integration guideline
frontend srs
agent coding guide
base figma layout
```

---

# 8. PHASE 2 — DESIGN SYSTEM PLATFORM

## Goal

Build reusable rendering system.

---

## Atomic Components

```txt
Button
Input
Textarea
Select
Checkbox
Radio
Tabs
Modal
Drawer
Dropdown
Toast
Tooltip
Avatar
Badge
Skeleton
Spinner
```

---

## Rendering Components

```txt
InfiniteList
VirtualList
MediaViewer
MediaCarousel
ImageViewer
VideoPlayer
```

---

## Social Components

```txt
PostCard
ReactionBar
CommentPreview
ShareSheet
StoryCard
FollowButton
```

---

## Creator/Admin Components

```txt
AnalyticsCard
ChartContainer
FilterBar
DataTable
MediaManager
```

---

## Responsive Strategy

### Desktop-first

For:

```txt
creator studio
analytics
admin dashboard
commerce dashboard
```

### Mobile-first UX

For:

```txt
feed
chat
live
media viewing
```

---

## Output Artifacts

### MUST CREATE

```txt
figma component library
responsive guidelines
spacing guideline
accessibility checklist
motion guideline
```

---

# 9. PHASE 3 — AUTH + IDENTITY PLATFORM

## Goal

Authentication lifecycle.

---

## Features

```txt
login
register
social login
session restore
silent refresh
multi-tab sync
route guards
permission rendering
```

---

## Permission Strategy

Backend returns:

```json
{
  "permissions": {
    "canPost": true
  }
}
```

Frontend NEVER:

```txt
role === ADMIN
```

---

## Security Requirements

```txt
csrf awareness
xss awareness
secure token handling
request cancellation
session expiration handling
```

---

## Output Artifacts

### MUST CREATE

```txt
auth flow diagram
permission rendering guideline
session lifecycle diagram
security checklist
```

---

# 10. PHASE 4 — MEDIA PLATFORM

## Goal

Media upload + rendering lifecycle.

---

## Upload Flow

```txt
FE
 ↓
request signed url
 ↓
upload direct to s3/minio
 ↓
confirm upload
```

---

## NEVER

```txt
upload media through api gateway
```

---

## Features

```txt
image upload
video upload
upload progress
drag-drop upload
preview generation
media validation
```

---

## Rendering Optimization

```txt
lazy loading
srcset
blur placeholder
video preload strategy
viewport lifecycle
memory cleanup
```

---

## Output Artifacts

### MUST CREATE

```txt
media lifecycle diagram
upload sequence diagram
media rendering rules
cdn optimization guide
```

---

# 11. PHASE 5 — SOCIAL PLATFORM

## Goal

Feed rendering + interaction engine.

---

## Modules

```txt
feed/
post/
comment/
reaction/
follow/
profile/
```

---

## Feed Architecture

```txt
FeedPage
 └── FeedList
      └── FeedItem
           ├── PostCard
           ├── MediaCarousel
           ├── ReactionBar
           └── CommentPreview
```

---

## MUST HAVE

```txt
virtual rendering
infinite scrolling
skeleton loading
incremental rendering
lazy hydration
```

---

## MUST NOT

```txt
render 500 full dom nodes
full feed rerender
```

---

## Optimistic UI

Allowed:

```txt
like
follow
bookmark
```

NOT allowed:

```txt
transaction truth
inventory truth
wallet balance truth
```

---

## Output Artifacts

### MUST CREATE

```txt
feed rendering guideline
infinite scroll architecture
social ui figma
interaction ux rules
```

---

# 12. PHASE 6 — REALTIME PLATFORM

## Goal

Realtime UX layer.

---

## Features

```txt
notifications
unread count
presence
typing status
live comments
realtime invalidation
```

---

## Websocket Event Strategy

Example:

```json
{
  "type": "NEW_MESSAGE",
  "conversationId": "123"
}
```

Frontend receives signal.
Frontend fetches actual data via HTTP/API.

---

## MUST HAVE

```txt
heartbeat
reconnect strategy
backoff retry
stale event protection
```

---

## Output Artifacts

### MUST CREATE

```txt
websocket event catalog
realtime ux guideline
presence state diagram
reconnect strategy docs
```

---

# 13. PHASE 7 — SEARCH PLATFORM

## Goal

Global search experience.

---

## Features

```txt
instant search
search suggestions
recent history
infinite results
category search
```

---

## RxJS Strategy

Mandatory:

```txt
switchMap
debounceTime
distinctUntilChanged
```

---

## Search MUST BE

```txt
cancellation-safe
race-condition safe
```

---

## Output Artifacts

### MUST CREATE

```txt
search ux flow
search result rendering rules
search interaction figma
```

---

# 14. PHASE 8 — CREATOR STUDIO PLATFORM

## Goal

Enterprise-scale dashboard system.

---

## Modules

```txt
studio/
analytics/
moderation/
wallet/
media-manager/
shop-dashboard/
```

---

## MUST HAVE

```txt
route-based code splitting
chart lazy loading
table virtualization
heavy form optimization
```

---

## IMPORTANT

Desktop-first architecture.

---

## Output Artifacts

### MUST CREATE

```txt
creator studio figma
analytics dashboard specs
moderation flow docs
component ownership docs
```

---

# 15. PHASE 9 — CHAT PLATFORM

## Goal

Messaging experience.

---

## Features

```txt
conversation list
message history
media messages
presence
read status
typing status
```

---

## MUST HAVE

```txt
virtual message rendering
scroll anchoring
message pagination
optimistic send
```

---

## IMPORTANT

Message history source of truth = backend.

---

## Output Artifacts

### MUST CREATE

```txt
chat ui figma
message lifecycle docs
realtime messaging flow
chat rendering rules
```

---

# 16. PHASE 10 — COMMERCE PLATFORM

## Goal

Commerce workflow UI.

---

## Features

```txt
cart
checkout
wallet
order history
transaction states
payment lifecycle
```

---

## IMPORTANT

Backend owns:

```txt
pricing
inventory
wallet truth
transaction validation
```

---

## MUST HAVE

```txt
idempotent ui actions
checkout lock
request dedupe
retry awareness
```

---

## Output Artifacts

### MUST CREATE

```txt
checkout flow
wallet ui figma
payment lifecycle diagram
commerce interaction docs
```

---

# 17. PHASE 11 — LIVE PLATFORM

## Goal

Livestream interaction UX.

---

## Features

```txt
live video
live chat
gift animation
viewer count
stream switching
```

---

## MUST HAVE

```txt
video buffer cleanup
chat dom cleanup
viewport lifecycle
memory protection
```

---

## IMPORTANT

Live pages are memory-sensitive.

---

## Output Artifacts

### MUST CREATE

```txt
live architecture docs
stream interaction figma
memory cleanup checklist
```

---

# 18. PHASE 12 — RECOMMENDATION PLATFORM

## Goal

Recommendation rendering.

---

## Frontend Responsibility

```txt
render recommendation blocks
track interactions
prefetch nhẹ
```

---

## Frontend NEVER

```txt
calculate recommendation ranking
```

---

## Features

```txt
recommended creators
watch next
related products
personalized feed blocks
```

---

## Output Artifacts

### MUST CREATE

```txt
recommendation ui rules
personalization rendering docs
tracking events catalog
```

---

# 19. PHASE 13 — PERFORMANCE PLATFORM

## Goal

Production optimization.

---

## MUST HAVE

```txt
route lazy loading
chunk splitting
bundle governance
memory leak detection
image optimization
websocket optimization
```

---

## Monitoring

Integrate:

```txt
sentry
frontend tracing
core web vitals
performance telemetry
```

---

## Mandatory Rules

```txt
OnPush everywhere
trackBy everywhere
takeUntilDestroyed
async pipe first
```

---

## Output Artifacts

### MUST CREATE

```txt
performance checklist
bundle governance docs
memory profiling guide
telemetry architecture
```

---

# 20. PHASE 14 — PLATFORM ENGINEERING

## Goal

Operational maturity.

---

## Features

```txt
feature flags
canary rollout
ci/cd
bundle analysis
environment management
release governance
```

---

## MUST HAVE

```txt
nx dependency constraints
import boundaries
build caching
affected pipeline
```

---

## IMPORTANT

Forbidden:

```txt
feed importing commerce internals
chat importing live internals
cross-domain hidden coupling
```

---

## Output Artifacts

### MUST CREATE

```txt
release flow docs
ci pipeline docs
monorepo governance
module boundary rules
```

---

# 21. AI AGENT SETUP REQUIREMENTS

## Required AI Agents

### Frontend Architect Agent

Responsibilities:

```txt
architecture decisions
import boundaries
rendering strategy
performance governance
```

---

### Angular Generator Agent

Responsibilities:

```txt
generate modules
components
signals store
routing
```

---

### UI System Agent

Responsibilities:

```txt
generate shared ui
figma mapping
responsive components
```

---

### API Integration Agent

Responsibilities:

```txt
swagger sync
generated sdk
api integration
error mapping
```

---

### Performance Agent

Responsibilities:

```txt
detect rerender
memory leak detection
bundle analysis
websocket optimization
```

---

### QA Agent

Responsibilities:

```txt
render validation
responsive testing
interaction testing
accessibility testing
```

---

# 22. FIGMA REQUIREMENTS

## Mandatory Design Files

### Design Token File

Contains:

```txt
colors
spacing
typography
radius
motion
icons
```

---

### Shared UI Kit

Contains:

```txt
buttons
inputs
cards
modals
tables
charts
```

---

### Product UX Flows

Contains:

```txt
feed flow
chat flow
checkout flow
creator studio flow
live flow
```

---

# 23. SRS REQUIREMENTS

## Mandatory Documents

### Functional SRS

Per domain:

```txt
feed
chat
commerce
creator studio
media
search
```

---

### Non-functional SRS

Must define:

```txt
performance targets
bundle limits
memory limits
latency targets
realtime targets
browser support
```

---

### Frontend Standards Document

Must define:

```txt
folder structure
naming convention
component split
api strategy
state strategy
rendering strategy
```

---

# 24. FINAL PRODUCTION RECOMMENDATION

## Recommended Stack

```txt
Angular
Signals
RxJS
TailwindCSS
Angular CDK
Nx
```

---

## DO NOT ADD EARLY

```txt
microfrontend
full ngrx
complex ssr
realtime full sync
generic abstraction framework
```

---

# 21. PHASE 15 — SOCIAL INTELLIGENCE PLATFORM

## Goal

Aggregate, monitor, and surface trending content from internal and external social platforms.

---

## Features

### Content Aggregation

```txt
auto-check trending
content deduplication
cross-platform tagging
sentiment analysis
engagement metrics
viral prediction
```

### Trending Discovery

```txt
hashtag tracking
trending creators
viral content detection
category trends
geographic trends
temporal patterns
```

### Content Monitoring

```txt
feed monitoring
real-time alerts
anomaly detection
quality scoring
engagement prediction
```

---

## Tech Stack

```txt
RxJS for real-time streams
Web Workers for heavy lifting
IndexedDB for local caching
Background Fetch API
Service Worker for persistent checks
```

---

## Architecture

```txt
FE monitors backend aggregation
FE does NOT scrape platforms directly
Backend pulls from social APIs (TikTok, Instagram, Facebook, X/Twitter)
FE renders trending insights and alerts
```

---

## IMPORTANT

```txt
FE NEVER makes direct API calls to TikTok, Instagram, Facebook, X
FE NEVER stores auth tokens for external platforms
All platform auth and data fetching = backend responsibility
FE only renders and tracks user engagement with trending content
```

---

## Output Artifacts

### MUST CREATE

```txt
trending content feed figma
monitoring dashboard specs
alert notification flow
content dedup algorithm docs
engagement metrics tracking guide
```

---

# 22. PHASE 16 — SOCIAL PLATFORM UX REPLICATION

## Goal

Replicate UI/UX patterns and features from leading social platforms: TikTok, Instagram, Facebook, X.

---

## Supported Platforms & UX Patterns

### TikTok UX
- Vertical feed layout (full viewport cards)
- Swipe down/up for next video (infinite scroll mobile-optimized)
- Comment overlay and comment drawer
- Duet/Stitch feature inspiration
- Music/sound attribution UI
- Trending sounds sidebar
- Bottom tab navigation (Home, Discover, Inbox, Me)

### Instagram UX
- Reels vertical player
- Stories carousel (circular avatar row, swipe between stories)
- Explore grid (multi-column, infinite masonry)
- Profile grid (fixed columns, dynamic heights)
- Direct messaging sidebar
- Like/comment/share buttons (consistent placement)
- Share sheet (story, dm, external)

### Facebook UX
- Feed timeline (mixed content: status, photo, video, link)
- Group feed UI (distinct styling)
- Live video player (corner video, chat sidebar)
- Trending section (sidebar on desktop, collapsed on mobile)
- Notification badge system
- Profile cover image + avatar overlap
- Friend/follow button variants

### X/Twitter UX
- Timeline feed (text + media + embedded content)
- Thread view (connected boxes showing conversation)
- Retweet/quote tweet patterns
- Trending sidebar (hashtag + description + engagement)
- Compose tweet modal (expandable)
- Media carousel (4-up gallery)
- Like/retweet/reply/share buttons (consistent)

---

## UI Components to Replicate

### Video Player Variants
```txt
TikTok-style fullscreen vertical
Instagram Reels player
Facebook Live overlay
YouTube-inspired controls
```

### Feed Layout Variants
```txt
vertical infinite scroll (TikTok)
horizontal masonry grid (Instagram Explore)
timeline mixed content (Facebook)
text-focused feed (X/Twitter)
```

### Interaction Patterns
```txt
swipe gestures (TikTok)
double-tap to like
long-press menu
drag to expand
pinch to zoom
```

### Navigation Patterns
```txt
bottom tab bar (mobile, TikTok style)
top navigation (desktop, X/Twitter style)
side drawer (Instagram mobile)
sticky sidebar (Facebook desktop)
```

---

## Functional Features to Build

### Content Interaction
```txt
like/unlike
comment/reply
share/retweet
save/bookmark
report/flag
```

### Creator Tools
```txt
duet/collab (TikTok inspiration)
retweet with quote (X/Twitter)
story editor (Instagram)
live stream controls (Facebook)
```

### Discovery
```txt
trending hashtags
trending sounds (music)
recommended creators
algorithm-driven suggestions
category browse
```

### Notifications
```txt
like notifications
comment notifications
mention notifications
follow notifications
trending alert notifications
```

---

## IMPORTANT

```txt
FE builds native UI/UX inspired by platforms
FE does NOT embed external player or SDKs
FE uses internal video player
FE manages all state and interactions
No dependency on external platform code
```

---

## Tech Stack

```txt
Angular for component hierarchy
RxJS for interaction streams
TailwindCSS for responsive layout
Signals for UI state
Custom video player (HLS/DASH)
Gesture library for swipe/long-press
Canvas for animated overlays
```

---

## Performance Considerations

```txt
lazy load feed items
virtual scroll for large lists
image optimization and lazy load
video preload strategy (next 1-2 videos)
memory cleanup on unmount
smooth transitions and animations
60fps gesture responsiveness
```

---

## Output Artifacts

### MUST CREATE

```txt
TikTok feed UI figma
Instagram Explore UI figma
Facebook timeline UI figma
X/Twitter feed UI figma
video player component specs
interaction pattern library
animation guideline
gesture handling docs
responsive breakpoint guide
```

---

# 25. MOST IMPORTANT PRINCIPLE

Large-scale frontend systems fail because of:

```txt
render inefficiency
memory leaks
websocket abuse
over-engineering
poor boundaries
media lifecycle issues
over-reliance on external SDKs
```

NOT because of framework choice.

