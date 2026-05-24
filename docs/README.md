# Documentation Index

## Overview
Complete documentation hub for the **Cross-Platform Social Commerce Creator Platform (Frontend)**.

**Last Updated:** May 2026  
**Platform:** Angular 21 + Nx Monorepo

---

## Quick Navigation

### 🏗️ Architecture & Structure
- [Project Structure](./architecture/nx-workspace.md) - **START HERE** - Complete file tree and layer organization

### 🤖 AI Agent & Development
- [AI Agents Coordination](./ai-context/AGENTS.md) - **START HERE** - Agent skills, collaboration patterns
- [Frontend AI Playbook](./ai-context/frontend-ai-playbook.md) - Development workflow, standards, and best practices

### 🛠️ AI Agent Skills (Technical Guides)
- [Frontend Architecture](./ai-context/frontend-architecture.md) - Nx structure, boundaries, governance
- [Angular Component Generation](./ai-context/angular-component-generation.md) - Components, features, Signals
- [Design System Components](./ai-context/design-system-component-generation.md) - Design tokens, styling
- [API Integration](./ai-context/api-integration.md) - Backend contracts, type safety, services
- [Performance & QA](./ai-context/performance-qa.md) - Optimization, testing, accessibility
- [Social UX & Intelligence](./ai-context/social-ux-intelligence.md) - Feed design, social patterns

### 📋 Features & Implementation
- [Backend CRUD Modules](./api/backend-contracts.md) - API contract and backend integration points
- [Media Feature](./architecture/media-feature.md) - Media management feature specifications
- [i18n Guidelines](./architecture/i18n-guidelines.md) - Internationalization and localization standards
- [Authentication Flow](./architecture/auth-redirect-note.md) - Auth redirect and security patterns

### 🎨 Design & Styling
- [Design Tokens Reference](./ui-ux/DESIGN_TOKENS.md) - Token documentation and usage
- [Design Tokens (JSON)](./ui-ux/design-tokens.json) - Machine-readable token configuration
- [Implementation Summary](./ui-ux/IMPLEMENTATION_SUMMARY.md) - What was created and how to use

### 📅 Roadmap & Planning
- [Phase 5 Planning](./requirements/product-requirements.md) - Current development roadmap and milestones

---

## Project Structure at a Glance

```
project/
├── apps/app-shell/              # Main Angular application
├── libs/
│   ├── core/                    # Shared services & utilities
│   ├── domain/                  # Business logic domains
│   │   ├── media/
│   │   ├── profile/
│   │   └── social/
│   ├── features/                # Feature modules
│   │   ├── auth/
│   │   ├── home/
│   │   ├── media/
│   │   ├── profile/
│   │   ├── settings/
│   │   ├── dashboard/
│   │   └── social/
│   └── ui/                      # Reusable UI components
├── docs/                        # This documentation
└── [config files]
```

**See [Project Structure](./architecture/nx-workspace.md) for complete details.**

---

## Key Concepts

### Nx Monorepo Organization
- **Apps:** User-facing applications (only `app-shell` for now)
- **Libs - Core:** Cross-cutting concerns (auth, API, config)
- **Libs - Domain:** Business logic domains (media, profile, social)
- **Libs - Features:** Feature modules (auth, home, dashboard, media, profile, settings)
- **Libs - UI:** Reusable component library

### Development Standards
1. **Signals-first Angular:** Using Angular Signals for state management
2. **Standalone Components:** Preferred over module-based architecture
3. **Lazy Loading:** Features loaded on-demand via routing
4. **Design System:** Centralized design tokens and reusable components
5. **i18n Support:** English and Vietnamese translations built-in

### Layer Dependencies
```
apps → features → domain
                 ↓      ↓
                core & ui
```

**Golden Rule:** Features depend on core/domain/ui, but never the other way around.

---

## Development Workflows

### Setting Up Development Environment
1. Read [Frontend AI Playbook](./ai-context/frontend-ai-playbook.md) - overall development standards
2. Review [Project Structure](./architecture/nx-workspace.md) - understand codebase organization

### Implementing a New Feature
1. Create feature module in `libs/features/{feature}`
2. Define routes in feature's `lib.routes.ts`
3. Use domain services from `libs/domain`
4. Import UI components from `libs/ui`
5. Register in main `app.routes.ts`

### Adding UI Components
1. Create component in `libs/ui/src/lib/{type}/`
2. Follow [Design System Guide](./ui-ux/DESIGN_SYSTEM_GUIDE.md) guidelines
3. Use design tokens from [Design Tokens](./ui-ux/DESIGN_TOKENS.md)
4. Export via `libs/ui/src/index.ts`

### Integration with Backend
1. Reference [Backend CRUD Modules](./api/backend-contracts.md) for API contract
2. Create service in `libs/domain/{domain}/services/`
3. Use `ApiService` from `libs/core` for HTTP calls
4. Follow [i18n Guidelines](./architecture/i18n-guidelines.md) for localized content

---

## Documentation Files

| Document | Purpose | Last Updated |
|----------|---------|--------------|
| [architecture/nx-workspace.md](./architecture/nx-workspace.md) | Complete file tree & architecture | May 2026 |
| [ui-ux/DESIGN_TOKENS.md](./ui-ux/DESIGN_TOKENS.md) | Design token guide | May 2026 |
| [ui-ux/DESIGN_SYSTEM_GUIDE.md](./ui-ux/DESIGN_SYSTEM_GUIDE.md) | Design system usage | May 2026 |
| [ui-ux/IMPLEMENTATION_SUMMARY.md](./ui-ux/IMPLEMENTATION_SUMMARY.md) | Implementation details | May 2026 |
| [ai-context/AGENTS.md](./ai-context/AGENTS.md) | AI agents coordination | May 2026 |
| [ai-context/frontend-ai-playbook.md](./ai-context/frontend-ai-playbook.md) | Development standards | May 2026 |
| [architecture/i18n-guidelines.md](./architecture/i18n-guidelines.md) | i18n standards | May 2026 |
| [architecture/media-feature.md](./architecture/media-feature.md) | Media feature spec | May 2026 |
| [architecture/auth-redirect-note.md](./architecture/auth-redirect-note.md) | Auth flow | May 2026 |
| [api/backend-contracts.md](./api/backend-contracts.md) | API contract | May 2026 |
| [requirements/product-requirements.md](./requirements/product-requirements.md) | Roadmap | May 2026 |
| [ai-context/design-system-component-generation.md](./ai-context/design-system-component-generation.md) | AI skill | May 2026 |

---

## Technology Stack

### Frontend Framework
- **Angular 21** - Latest Angular with Signals
- **TypeScript** - Strict type safety
- **Nx** - Monorepo management & tooling
- **Vite** - Fast build tool

### Testing & Quality
- **Jest** - Unit & integration tests
- **ESLint** - Code linting
- **Prettier** - Code formatting

### Styling & Design
- **CSS3** - Modern CSS with design tokens
- **Glassmorphism** - Modern UI patterns
- **Responsive Design** - Mobile-first approach

### Internationalization
- **Transloco** - Multi-language support
- **Language Support:** English (en), Vietnamese (vi)

### Development Tools
- **Docker** - Containerization
- **Nginx** - Production server
- **Git** - Version control

---

## Common Tasks

### Run Development Server
```bash
npm install
nx serve app-shell
# App available at http://localhost:4200
```

### Build for Production
```bash
nx build app-shell --configuration=production
```

### Run Tests
```bash
nx test core              # Test specific lib
nx test                   # Test all
```

### Generate Component
```bash
nx generate @nx/angular:component my-component --project=ui
```

### Lint Code
```bash
nx lint
```

---

## FAQ & Troubleshooting

### Where do I add a new feature?
→ Create folder in `libs/features/{feature-name}`. See [Project Structure](./architecture/nx-workspace.md#feature-libraries).

### How do I use services from the domain layer?
→ Import from `libs/domain/{domain}`. Services exported via `index.ts` barrel export.

### Where are UI components?
→ All components in `libs/ui/src/lib/`. Reference [Design System](./ui-ux/DESIGN_SYSTEM_GUIDE.md) for available components.

### How do I add translations?
→ Update `apps/app-shell/public/assets/i18n/{language}.json`. See [i18n Guidelines](./architecture/i18n-guidelines.md).

### What are design tokens?
→ Centralized style values (colors, spacing, fonts). See [Design Tokens](./ui-ux/DESIGN_TOKENS.md).

---

## Contributing

1. Review [Frontend AI Playbook](./ai-context/frontend-ai-playbook.md) for standards
2. Check [Project Structure](./architecture/nx-workspace.md) for organization
3. Follow [Design System](./ui-ux/DESIGN_SYSTEM_GUIDE.md) for components
4. Maintain import boundaries and lazy loading
5. Write tests alongside features

---

## Contact & Support

For questions about:
- **Development Standards:** Check [Frontend AI Playbook](./ai-context/frontend-ai-playbook.md)
- **Features:** Review feature-specific documentation in appropriate folder

---

**Last Generated:** May 23, 2026  
**Status:** Active & Maintained
