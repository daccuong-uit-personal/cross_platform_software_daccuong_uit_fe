# Profile API Specification (Giao tiếp với Backend)

Tài liệu này định nghĩa các endpoint cần thiết để Backend (BE) phát triển và cung cấp dữ liệu cho trang Profile. Các endpoint này được suy ra từ giao diện và mock data hiện có trên Frontend (FE).

## 1. Lấy thông tin cơ bản của Profile (Profile Header & Stats)

**Endpoint:** `GET /api/v1/profiles/{userId}` hoặc `GET /api/v1/profiles/me`
**Mô tả:** Lấy thông tin người dùng, số lượng người theo dõi, và các liên kết mạng xã hội.

### Response Shape (JSON)
```json
{
  "id": "user-123",
  "displayName": "Người dùng Reals",
  "username": "nguoi_dung",
  "avatarUrl": "https://ui-avatars.com/api/?name=User&background=333&color=fff",
  "bannerUrl": "https://images.unsplash.com/photo-1511632765486-a01980e01a18",
  "isVerified": true,
  "joinDate": "2021-12-01T00:00:00Z",
  "socialLinks": {
    "facebook": "facebook.com/nguyendac.cuon...",
    "instagram": null
  },
  "stats": {
    "followingCount": 98,
    "followersCount": 1200
  }
}
```

---

## 2. Lấy dữ liệu thống kê tuần (Right Sidebar Stats)

**Endpoint:** `GET /api/v1/profiles/{userId}/statistics/weekly`
**Mô tả:** Trả về các chỉ số thống kê hiệu suất trang cá nhân trong tuần để hiển thị ở sidebar phải.

### Response Shape (JSON)
```json
{
  "weeklyVisits": {
    "total": 1254,
    "trendPercentage": 12.5,
    "isPositive": true
  },
  "contentViewsIncrease": {
    "stories": 450,
    "reels": 1200,
    "videos": 320,
    "posts": 890
  },
  "interactionsIncrease": {
    "comments": 156,
    "reactions": 842,
    "shares": 45,
    "totalTrendPercentage": 24.0
  }
}
```

---

## 3. Lấy danh sách Reels của người dùng

**Endpoint:** `GET /api/v1/profiles/{userId}/reels`
**Query Parameters:** `?page=1&limit=10`
**Mô tả:** Trả về danh sách các Reels hiển thị trong tab Reels.

### Response Shape (JSON)
```json
{
  "data": [
    {
      "id": "reel-1",
      "title": "Bí kíp quay video triệu view",
      "views": 1200000,
      "viewsFormatted": "1.2M",
      "coverUrl": "https://picsum.photos/300/500?random=11",
      "createdAt": "2026-06-10T10:00:00Z"
    }
  ],
  "meta": {
    "totalItems": 6,
    "currentPage": 1,
    "totalPages": 1
  }
}
```

---

## 4. Lấy danh sách Truyện (Stories) của người dùng

**Endpoint:** `GET /api/v1/profiles/{userId}/stories`
**Query Parameters:** `?page=1&limit=10`
**Mô tả:** Trả về danh sách các bộ truyện hiển thị trong tab Stories.

### Response Shape (JSON)
```json
{
  "data": [
    {
      "id": "story-1",
      "title": "Bí Ẩn Mùa Hè",
      "status": "Đang ra • 45 chương",
      "genre": "Tiểu thuyết, Bí ẩn, Hành động",
      "description": "Một câu chuyện hấp dẫn về những bí ẩn chưa có lời giải đáp...",
      "coverUrl": "https://picsum.photos/300/450?random=1",
      "metrics": {
        "likes": "1.2K",
        "comments": "450",
        "shares": "32",
        "views": "5.6K"
      },
      "createdAt": "2026-05-20T08:30:00Z"
    }
  ],
  "meta": {
    "totalItems": 2,
    "currentPage": 1,
    "totalPages": 1
  }
}
```

---

**Ghi chú cho BE:** 
- Định dạng dữ liệu ngày tháng cần trả về chuẩn `ISO 8601` (VD: `2026-06-11T10:00:00Z`).
- Với các con số lớn (như lượt xem, lượt like), BE có thể trả về số nguyên thật (VD: `1200000`) và FE sẽ tự format sang dạng rút gọn (VD: `1.2M`), hoặc BE format sẵn trong một trường `formatted` riêng tuỳ vào quy ước của team. Trên tài liệu này cung cấp cả hai dạng để linh hoạt.
