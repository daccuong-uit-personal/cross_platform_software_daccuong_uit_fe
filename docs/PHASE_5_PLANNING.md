# Phase 5 Planning - Social Media UI Prototype

> **Mục đích**: Triển khai giao diện social app tĩnh theo hướng TikTok x Instagram, chưa nối backend, dùng dữ liệu giả, flexible cho UX.

## 📊 Scope Split

### Phase 5A — Social UI Prototype (current focus)
- Build rich UI flows and interactions with placeholder/mock data.
- No API integration, no backend contract required yet.
- Focus on UX patterns, layout, animations, transitions, responsive design.
- Make it look and feel like TikTok + Instagram:
  - vertical scrolling feed
  - story/reel row
  - immersive post cards
  - profile grid/gallery
  - overlay comments and reactions
- Keep components flexible so backend wiring can plug in later.

### Phase 5B — Social Integration (deferred)
- Add real API, data fetching, state management, and backend contracts.
- Connect follow, post, like, comment, notification, and search flows.
- Enable real-time updates and dynamic content only after backend is ready.

---

## ⚖️ Phase 5 Boundary Rules

### Allowed in Phase 5
- Full social UI experience with static or mocked content.
- TikTok/Instagram-style feed, reels, stories, profile, comments, likes, hashtags.
- Local UI interactions, animations, and placeholder flows for creation, sharing, and reactions.
- Search UI and chat screens as visual prototypes only.

### Avoid in Phase 5
- Building backend engines or services for later phases.
- Real-time sync/Socket logic beyond simple UI animation.
- Search engine implementation or production search backend.
- Full chat/message backend integration.
- Recommendation/ranking algorithm work.
- Commerce checkout, payment, live-streaming backend.

---

## 🎯 Core Features

> Note: Phase 5 chỉ cần tránh code phần backend/core engine của các phase khác. UI có thể thoải mái làm giống TikTok/Instagram, dùng mock data và stub flow.
### 1. **Social Graph & Following System**
- [ ] Follow/Unfollow người dùng khác
- [ ] Followers list (xem danh sách người theo dõi)
- [ ] Following list (xem danh sách đang theo dõi)
- [ ] Block/Unblock người dùng
- [ ] Người dùng suggestions (gợi ý theo dõi)
- [ ] Follow requests (nếu tài khoản private)
- [ ] Mutual followers detection

### 2. **Feed System**
- [ ] Personal feed (dòng thời gian cá nhân)
- [ ] Discover feed (khám phá nội dung)
- [ ] Feed infinite scroll/pagination
- [ ] Feed caching & optimization
- [ ] Trending posts/hashtags
- [ ] Lọc feed (theo ngôn ngữ, theo dõi, v.v.)

### 3. **Posts & Content Management**
- [ ] Create post (text, images, video)
- [ ] Edit post
- [ ] Delete post
- [ ] Post privacy settings (public, private, friends only)
- [ ] Draft posts
- [ ] Schedule posts (đặt lịch đăng)
- [ ] Repost/Share content
- [ ] Pin posts

### 4. **Interactions - Likes**
- [ ] Like/Unlike posts
- [ ] Like count display
- [ ] List người đã like (likes list)
- [ ] Like notifications
- [ ] Animated like button

### 5. **Comments System**
- [ ] Add comment to post
- [ ] Edit comment
- [ ] Delete comment
- [ ] Reply to comment (nested comments)
- [ ] Comment count
- [ ] Paginated comments
- [ ] Comment notifications
- [ ] Like comments
- [ ] Mention users in comments (@username)

### 6. **Notifications System**

- [ ] Push notifications
- [ ] In-app notifications
- [ ] Notification types:
  - [ ] Like notifications
  - [ ] Comment notifications
  - [ ] Follow notifications
  - [ ] Message notifications
  - [ ] Mention notifications
  - [ ] Tag notifications
- [ ] Notification bell icon with badge count
- [ ] Mark notifications as read
- [ ] Clear all notifications
- [ ] Notification preferences/settings

### 8. **Hashtags & Tagging**
- [ ] Hashtag detection & linking
- [ ] Hashtag pages (xem tất cả posts với hashtag)
- [ ] Trending hashtags
- [ ] User tagging in posts
- [ ] Tag users in comments
- [ ] Auto-complete untuk hashtags & mentions

### 9. **User Profiles**
- [ ] User profile page
- [ ] Edit profile (bio, avatar, cover photo)
- [ ] User statistics:
  - [ ] Followers count
  - [ ] Following count
  - [ ] Posts count
  - [ ] Likes count
  - [ ] Engagement metrics
- [ ] User's posts grid/list view
- [ ] User's media gallery
- [ ] User's liked posts
- [ ] User bio with links support

### 10. **Search & Discovery**
- [ ] Search users
- [ ] Search posts/content
- [ ] Search hashtags
- [ ] Advanced search filters
- [ ] Search history
- [ ] Trending searches
- [ ] Search suggestions/autocomplete

### 11. **Content Moderation & Safety**
- [ ] Report post
- [ ] Report user
- [ ] Report comment
- [ ] Block user
- [ ] Mute user (ẩn nội dung nhưng không block)
- [ ] Content moderation review
- [ ] Hide inappropriate content
- [ ] Hide sensitive content warnings

### 12. **User Collections & Lists**
- [ ] Create custom lists
- [ ] Add users to lists
- [ ] Create reading lists (save posts)
- [ ] Bookmarks/Save posts
- [ ] Collections management

---

## 📱 Screens/Pages Required

### User-Facing Screens

| Screen | Purpose | Components |
|--------|---------|-----------|
| **Feed** | Dòng thời gian chính | Post list, Create post button, Stories |
| **Discover** | Khám phá nội dung | Trending, Suggestions, Search |
| **Profile** | Hồ sơ người dùng | User info, Posts grid, Stats, Follow button |
| **Profile Edit** | Sửa profile | Bio, Avatar, Cover photo, Settings |
| **Notifications** | Thông báo | Notification list, Filters, Mark as read |
| **Search Results** | Kết quả tìm kiếm | Users, Posts, Hashtags tabs |
| **Hashtag Page** | Trang hashtag | Posts with tag, Related tags, Tag info |
| **Post Detail** | Chi tiết post | Post content, Comments, Likes |
| **Comments Section** | Bình luận | Comment list, Add comment, Replies |
| **Followers/Following** | Danh sách theo dõi | User list, Follow/Unfollow buttons |
| **Suggestions** | Gợi ý theo dõi | User cards, Follow button |
| **Collections** | Bộ sưu tập | Lists, Saved posts |
| **Likes List** | Danh sách like | Users who liked the post |

---

## 🔌 Backend APIs Needed

### Posts
```
POST   /api/posts
GET    /api/posts
GET    /api/posts/{id}
PUT    /api/posts/{id}
DELETE /api/posts/{id}
POST   /api/posts/{id}/like
DELETE /api/posts/{id}/like
GET    /api/posts/{id}/likes
POST   /api/posts/{id}/repost
GET    /api/feed
GET    /api/discover
```

### Comments
```
POST   /api/comments
GET    /api/comments/{postId}
PUT    /api/comments/{id}
DELETE /api/comments/{id}
POST   /api/comments/{id}/like
GET    /api/comments/{id}/replies
POST   /api/comments/{id}/replies
```

### Follows
```
POST   /api/users/{id}/follow
DELETE /api/users/{id}/follow
GET    /api/users/{id}/followers
GET    /api/users/{id}/following
POST   /api/users/{id}/block
DELETE /api/users/{id}/block
GET    /api/users/suggestions
```

### Notifications

```
GET    /api/notifications
GET    /api/notifications/{id}
POST   /api/notifications/{id}/read
DELETE /api/notifications/{id}
POST   /api/notifications/read-all
```

### Search
```
GET    /api/search/users?q=query
GET    /api/search/posts?q=query
GET    /api/search/hashtags?q=query
```

### Profile
```
GET    /api/users/{id}
PUT    /api/users/{id}
GET    /api/users/{id}/statistics
```

### Hashtags
```
GET    /api/hashtags/{tag}
GET    /api/hashtags/{tag}/posts
GET    /api/hashtags/trending
```

---

## 📦 NX Libraries Structure (Phase 5)

```
libs/
├── domain/
│   ├── social/          (NEW)
│   │   ├── models/      (Post, Comment, Like, Follow, etc.)
│   │   ├── services/    (Social data services)
│   │   └── state/       (NgRx store)
│   └── notifications/   (NEW)
│
├── features/
│   ├── social/          (NEW - Social features)
│   │   ├── feed/
│   │   ├── profile/
│   │   ├── search/
│   │   └── discover/
│   └── notifications/   (NEW - Notifications)
│
├── ui/
│   ├── social-components/ (NEW - Reusable components)
│   │   ├── post-card/
│   │   ├── comment-section/
│   │   ├── user-card/
│   │   ├── follow-button/
│   │   └── like-button/
│
└── core/
    ├── interceptors/    (Handle notifications, real-time)
    └── services/        (Real-time, WebSocket)
```

---

## 🛠️ Technology & Tools

### Frontend
- **Framework**: Angular 18+
- **State Management**: NgRx
- **Real-time**: WebSocket/SignalR for messaging & notifications
- **UI Library**: Existing UI library
- **Image Upload**: Cloud storage (AWS S3, Firebase, etc.)

### Backend
- **API**: RESTful or GraphQL
- **Database**: Support for relationships (follows, likes, comments)
- **Cache**: Redis for feed caching, trending data
- **Real-time**: WebSocket/SignalR server
- **Search**: Elasticsearch for posts/users search

### Infrastructure
- **CDN**: For media delivery
- **Message Queue**: RabbitMQ/Kafka for notifications
- **Analytics**: Track user interactions

---

## 📈 Implementation Priority

### Sprint 1-2 (MVP)
1. ✅ Social Graph (Follow/Unfollow)
2. ✅ Feed system
3. ✅ Basic posts (create, view, delete)
4. ✅ Likes
5. ✅ Basic profiles

### Sprint 3-4
1. ✅ Comments system
2. ✅ Direct messaging
3. ✅ Notifications
4. ✅ Hashtags & tagging

### Sprint 5-6
1. ✅ Search & discovery
2. ✅ User collections/bookmarks
3. ✅ Advanced profile features
4. ✅ Content moderation

### Sprint 7-8
1. ✅ Performance optimization
2. ✅ Real-time features polish
3. ✅ Analytics & reporting
4. ✅ Testing & QA

---

## 🎨 Design Considerations

- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Support for dark theme
- **Accessibility**: WCAG compliance
- **Performance**: Lazy loading, image optimization
- **Animations**: Smooth transitions for interactions

---

## ⚡ Performance Requirements

- Feed load time: < 2s
- Message delivery: < 1s
- Notification delivery: Real-time (< 500ms)
- Image optimization: WebP format, multiple sizes
- API response time: < 300ms
- Cache strategy: 1 hour for feed, 24h for profiles

---

## 🔐 Security Considerations

- [ ] Input validation & sanitization
- [ ] CSRF protection
- [ ] Rate limiting on API endpoints
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] Private message encryption
- [ ] User data privacy (GDPR compliance)

---

## 📊 Analytics & Metrics

- User engagement (likes, comments, shares)
- Feed performance
- Search effectiveness
- Notification engagement rate
- Message delivery success rate
- User retention & growth

---

## 🚀 Success Metrics

- Phải có tối thiểu 80% features hoàn thành
- API response time < 500ms
- Notification delivery rate > 99%
- User satisfaction score > 4.0/5.0
- Zero critical bugs in production

---

## 📝 Notes

- Cần coordination chặt chẽ với backend team
- Real-time features cần careful planning
- Database schema optimization là critical
- Cache strategy rất quan trọng cho performance

**Last Updated**: May 21, 2026
