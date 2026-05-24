# Project Structure Quick Reference

**Last Updated:** May 2026 | [Full Documentation](./architecture/nx-workspace.md) | [Documentation Index](./README.md)

---

## Directory Tree (Simplified)

```
cross_platform_software_daccuong_uit_fe/
│
├── 📄 Configuration Files
│   ├── package.json               # Dependencies
│   ├── tsconfig.base.json        # TypeScript config
│   ├── nx.json                   # Nx workspace
│   ├── jest.config.ts            # Testing
│   ├── eslint.config.mjs         # Linting
│   ├── .prettierrc               # Formatting
│   ├── docker-compose.yml        # Docker
│   ├── Dockerfile                # Container
│   └── nginx.conf                # Web server
│
├── 📱 apps/
│   └── app-shell/               # Main Angular application
│       └── src/
│           ├── main.ts          # Bootstrap
│           ├── index.html       # Root template
│           ├── app/             # Root component
│           ├── routes/          # Route definitions
│           ├── environments/    # Config
│           └── assets/
│               └── i18n/        # Translations (en, vi)
│
├── 📚 libs/
│   │
│   ├── core/                    # Shared utilities
│   │   └── lib/
│   │       ├── config/          # Configuration
│   │       ├── guards/          # Route guards
│   │       ├── interceptors/    # HTTP interceptors
│   │       ├── services/        # API, Auth, Cache, Theme
│   │       └── design-system/   # Design tokens
│   │
│   ├── domain/                  # Business logic
│   │   ├── media/               # Media service
│   │   ├── profile/             # Profile service
│   │   └── social/              # Social (posts, comments, users)
│   │
│   ├── features/                # Feature modules
│   │   ├── auth/                # Login & Registration
│   │   ├── home/                # Main feed & UI
│   │   ├── dashboard/           # Dashboard
│   │   ├── media/               # Media management & studio
│   │   ├── profile/             # User profiles
│   │   ├── settings/            # Settings & preferences
│   │   └── social/              # Social interactions
│   │
│   └── ui/                      # UI Component library
│       └── lib/
│           ├── button/          # Buttons
│           ├── input/           # Inputs
│           ├── card/            # Cards
│           ├── header/          # Headers
│           ├── footer/          # Footers
│           ├── loader/          # Loading spinners
│           ├── skeleton/        # Skeleton screens
│           ├── components/      # Complex components
│           │   ├── shared-header/
│           │   ├── shared-table/
│           │   ├── sidebar-menu/
│           │   └── social/      # Social components
│           │       ├── post-card/
│           │       ├── user-card/
│           │       ├── like-button/
│           │       ├── comment-section/
│           │       └── follow-button/
│           └── directives/      # Custom directives
│
├── 📖 docs/
│   ├── README.md                # Documentation index
│   ├── architecture/
│   │   ├── nx-workspace.md      # Full structure (detailed)
│   │   ├── i18n-guidelines.md
│   │   ├── media-feature.md
│   │   └── auth-redirect-note.md
│   ├── api/
│   │   └── backend-contracts.md # API documentation
│   ├── requirements/
│   │   └── product-requirements.md # Roadmap
│   ├── ui-ux/
│   │   ├── INDEX.md              # Design system overview
│   │   ├── DESIGN_TOKENS.md      # Design tokens reference
│   │   ├── DESIGN_SYSTEM_GUIDE.md # Usage guide
│   │   ├── IMPLEMENTATION_SUMMARY.md # What was created
│   │   └── design-tokens.json    # Machine-readable tokens
│   ├── development/
│   │   └── coding-standards.md   # This quick reference
│   ├── ai-context/
│   │   ├── AGENTS.md             # AI Agent coordination & skills
│   │   ├── frontend-ai-playbook.md
│   │   ├── frontend-architecture.md
│   │   ├── angular-component-generation.md
│   │   ├── design-system-component-generation.md
│   │   ├── api-integration.md
│   │   ├── performance-qa.md
│   │   └── social-ux-intelligence.md
│   ├── modules/                  # (Empty for now)
│   └── decisions/                # (Empty for now)
│
└── 🔧 Generated (not committed)
    ├── node_modules/            # Dependencies
    ├── .angular/               # Angular cache
    ├── .nx/                    # Nx cache
    └── tmp/                    # Build outputs

```

---

## Layer Structure

```
┌──────────────────────────────────┐
│  apps/app-shell                  │  ← User Application
├──────────────────────────────────┤
│  libs/features/*                 │  ← Feature Modules
│ (auth, home, media, etc.)        │
├──────────────────────────────────┤
│  libs/domain/*                   │  ← Business Logic
│ (media, profile, social)         │
├──────────────────────────────────┤
│  libs/core          libs/ui      │  ← Shared Layer
│ (utilities)    (components)      │
└──────────────────────────────────┘
```

### Import Rules
✅ Can import → ✅ Can import ✅ Can import
- features → domain, core, ui
- domain → core, ui
- core ↔ ui (isolated)

❌ No reverse imports allowed

---

## Key Files

| File | Purpose |
|------|---------|
| `package.json` | Root dependencies |
| `tsconfig.base.json` | TypeScript config |
| `nx.json` | Nx workspace |
| `apps/app-shell/src/main.ts` | App bootstrap |
| `apps/app-shell/src/app/routes/app.routes.ts` | Route definitions |
| `libs/core/src/lib/services/` | Core services |
| `libs/ui/src/index.ts` | UI component exports |
| `apps/app-shell/public/assets/i18n/` | Translations |

---

## Common Paths

| Task | File/Folder |
|------|-----------|
| Add global styles | `apps/app-shell/src/styles.css` |
| Add design tokens | `libs/core/src/lib/design-system/design-tokens.ts` |
| Add UI component | `libs/ui/src/lib/{type}/` |
| Add feature | `libs/features/{feature-name}/` |
| Add service | `libs/domain/{domain}/src/lib/services/` |
| Add translations | `apps/app-shell/public/assets/i18n/{lang}.json` |
| Add route | `apps/app-shell/src/app/routes/app.routes.ts` |

---

## Feature Overview

| Feature | Location | Purpose |
|---------|----------|---------|
| **Auth** | `libs/features/auth/` | Login & Registration |
| **Home** | `libs/features/home/` | Main feed & social interface |
| **Dashboard** | `libs/features/dashboard/` | Analytics & overview |
| **Media** | `libs/features/media/` | Media upload & studio |
| **Profile** | `libs/features/profile/` | User profiles |
| **Settings** | `libs/features/settings/` | Preferences |
| **Social** | `libs/features/social/` | Social feed |

---

## Domain Services

| Domain | Services | Models |
|--------|----------|--------|
| **Core** | API, Auth, Cache, Theme | Error |
| **Media** | Media | - |
| **Profile** | Profile | - |
| **Social** | Post, Comment, User, Search, Notification | Post, Comment, User, etc. |

---

## Quick Commands

```bash
# Setup
npm install
nx serve app-shell

# Build
nx build app-shell --configuration=production

# Test
nx test {lib}           # Test specific library
nx test                 # Test all

# Generate
nx generate @nx/angular:component my-comp --project=ui

# Code Quality
nx lint
nx format:check
nx format:write
```

---

## Documentation Map

```
START HERE
    ↓
┌─ [Documentation Index](./README.md)
│
├─ Structure: [architecture/nx-workspace.md](./architecture/nx-workspace.md)
├─ Dev Guide: [Frontend AI Playbook](./ai-context/frontend-ai-playbook.md)
├─ API: [Backend CRUD](./api/backend-contracts.md)
└─ More: [Full Index](./README.md)
```

---

## File Statistics

- **Total Project Files:** ~280
- **Source Files:** ~150 (.ts, .html, .css)
- **Configuration:** ~30
- **Documentation:** ~12
- **Assets & i18n:** ~8

---

## Technology Stack

| Layer | Tech |
|-------|------|
| Framework | Angular 21 |
| Language | TypeScript |
| Build | Nx + Vite |
| Testing | Jest |
| Style | CSS + Design Tokens |
| i18n | Transloco (en, vi) |
| Container | Docker |

---

## See Also

📖 **Full Documentation:** [architecture/nx-workspace.md](./architecture/nx-workspace.md)

🤖 **Development Guide:** [Frontend AI Playbook](./ai-context/frontend-ai-playbook.md)


📑 **All Docs:** [Documentation Index](./README.md)

---

**Generated:** May 23, 2026
