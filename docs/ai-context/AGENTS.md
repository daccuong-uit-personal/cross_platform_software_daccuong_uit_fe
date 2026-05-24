# AI Agents Reference & Coordination

**Purpose:** Central hub for all AI agent skills, roles, and coordination  
**Last Updated:** May 2026  
**Maintained By:** Frontend Architect

---

## Quick Navigation

| Agent | Specialty | Primary Skill | Secondary Skills |
|-------|-----------|---------------|------------------|
| **Frontend Architect** | Codebase organization & governance | [frontend-architecture.md](../ai-context/frontend-architecture.md) | [project-structure.md](../architecture/nx-workspace.md) |
| **Angular Generator** | Component & feature scaffolding | [angular-component-generation.md](../ai-context/angular-component-generation.md) | [design-system-component-generation.md](../ai-context/design-system-component-generation.md) |
| **API Integration** | Backend synchronization & contracts | [api-integration.md](../ai-context/api-integration.md) | [api/backend-contracts.md](../api/backend-contracts.md) |
| **Performance & QA** | Optimization & quality assurance | [performance-qa.md](../ai-context/performance-qa.md) | [frontend-playbook.md](./frontend-ai-playbook.md) |
| **Social UX & Intelligence** | Social features & feed algorithms | [social-ux-intelligence.md](../ai-context/social-ux-intelligence.md) | [project-structure.md](../architecture/nx-workspace.md) |

---

## Agent Roles Overview

### Frontend Architect Agent
**Responsibility:** Codebase organization, workspace governance, performance strategy

**Key Tasks:**
- Define Nx workspace structure and import boundaries
- Enforce architectural patterns and design decisions
- Review monorepo organization
- Optimize for scalability and maintainability
- Ensure CI/CD governance and release strategy

**When to Invoke:** Architecture reviews, new feature planning, monorepo refactoring

**Skill File:** [frontend-architecture.md](./ai-context/frontend-architecture.md)

**Key Topics:**
- Nx monorepo structure (apps, libs, boundaries)
- Import rules and ESLint configuration
- Lazy loading strategy
- TypeScript strict mode enforcement
- Build & deployment optimization

---

### Angular Generator Agent
**Responsibility:** Component and feature scaffolding, code generation

**Key Tasks:**
- Generate standalone Angular components
- Create feature modules and routes
- Implement Signal-based state management
- Build form components with validation
- Create domain services with proper typing

**When to Invoke:** Building new features, creating components, feature scaffolding

**Skill File:** [angular-component-generation.md](./ai-context/angular-component-generation.md)

**Key Topics:**
- Standalone component patterns
- Signal-based state (vs RxJS)
- Feature route configuration
- Service generation templates
- Reactive forms
- Unit testing patterns

---

### UI System Agent
**Responsibility:** Design system, component library, styling consistency

**Key Tasks:**
- Build reusable UI components
- Manage design tokens and theming
- Ensure responsive and accessible design
- Convert Figma designs to components
- Maintain design system consistency

**When to Invoke:** Creating UI components, design system updates, style refactoring

**Skill File:** [design-system-component-generation.md](./ai-context/design-system-component-generation.md)

**Key Topics:**
- Design tokens usage (CSS variables)
- Component size standards
- Typography standards
- Color system and themes
- Reusable component patterns (FormLayout, COMPONENT_STYLES)
- Glassmorphism patterns

---

### API Integration Agent
**Responsibility:** Backend contract synchronization, type safety, API communication

**Key Tasks:**
- Sync OpenAPI/Swagger contracts with frontend
- Generate typed client SDKs
- Implement error handling interceptors
- Map backend DTOs to frontend models
- Manage authentication and token refresh

**When to Invoke:** API changes, backend integration, type generation, error handling

**Skill File:** [api-integration.md](./ai-context/api-integration.md)

**Key Topics:**
- HttpClient wrapper patterns
- Domain service patterns
- Error handling and mapping
- Authentication flows
- Error interceptor implementation
- Type generation from OpenAPI
- Response standardization

---

### Performance & QA Agent
**Responsibility:** Performance optimization, accessibility, quality assurance

**Key Tasks:**
- Analyze and optimize bundle size
- Implement OnPush change detection
- Add virtual scrolling for lists
- Ensure WCAG 2.1 AA compliance
- Monitor Core Web Vitals
- Implement error tracking and analytics

**When to Invoke:** Performance issues, accessibility audits, testing strategy, monitoring

**Skill File:** [performance-qa.md](./ai-context/performance-qa.md)

**Key Topics:**
- Core Web Vitals measurement
- Change detection optimization (OnPush, trackBy)
- Bundle analysis and lazy loading
- Accessibility (WCAG 2.1 AA)
- Unit & E2E testing patterns
- Memory leak prevention
- Error tracking (Sentry)
- Analytics implementation

---

### Social UX & Intelligence Agent
**Responsibility:** Social features, feed design, UX patterns from TikTok/Instagram/X

**Key Tasks:**
- Build social features (posts, comments, likes)
- Implement infinite scrolling feeds
- Create trending/discovery pages
- Replicate successful UX patterns
- Design engagement loops
- Implement social interactions

**When to Invoke:** Social feature development, feed optimization, UX pattern implementation

**Skill File:** [social-ux-intelligence.md](./ai-context/social-ux-intelligence.md)

**Key Topics:**
- Feed architecture and infinite scroll
- Post card components
- Comment and interaction patterns
- Trending & discovery pages
- User profile pages
- Swipeable/gesture controls
- Real-time engagement updates

---

## How to Use Agents

### 1. Ask Agent for Code Generation
```
"Create an Angular component for displaying user profiles 
following the UI System design."
→ Uses: UI System Agent + Angular Generator Agent
```

### 2. Ask Agent for Architecture Review
```
"Review the current monorepo structure and suggest improvements 
for scalability."
→ Uses: Frontend Architect Agent
```

### 3. Ask Agent for Feature Implementation
```
"Implement a new social feed with infinite scroll and 
trending posts."
→ Uses: Social UX Agent + Angular Generator Agent + Performance Agent
```

### 4. Ask Agent for Optimization
```
"The home feed is slow - analyze and optimize performance."
→ Uses: Performance & QA Agent
```

### 5. Ask Agent for API Integration
```
"Add type-safe API calls for the new user API endpoint."
→ Uses: API Integration Agent
```

---

## Skill File Organization

### Directory Structure
```
docs/
├── ai-context/
│   ├── AGENTS.md                   ← Coordination (what you're reading)
│   └── frontend-ai-playbook.md     ← Global development standards
└── ai-context/
    ├── frontend-architecture.md    ← Frontend Architect skill
    ├── angular-component-generation.md  ← Angular Generator skill
    ├── design-system-component-generation.md  ← UI System skill
    ├── api-integration.md           ← API Integration skill
    ├── performance-qa.md            ← Performance & QA skill
    └── social-ux-intelligence.md    ← Social UX skill
```

### Using Skills in Context

Each skill file contains:
1. **Overview** - When and how to use
2. **Core Principles** - Fundamental rules
3. **Detailed Patterns** - Code examples
4. **Best Practices** - Do's and don'ts
5. **References** - Links to related docs

---

## Agent Collaboration Patterns

### Feature Development Workflow

```
1. Frontend Architect Agent
   ↓ Plans feature structure and import boundaries
   
2. Angular Generator Agent
   ↓ Scaffolds components and routes
   
3. UI System Agent
   ↓ Creates/refines UI components with design tokens
   
4. API Integration Agent
   ↓ Adds typed API calls and error handling
   
5. Performance & QA Agent
   ↓ Optimizes performance and tests
   
6. Social UX & Intelligence Agent (if applicable)
   ↓ Adds social features and engagement patterns
   
7. Frontend Architect Agent
   ↓ Final review and governance check
```

### Example: Adding a New Feature

**Task:** Create a "Trending Posts" feature

**Step 1:** Architect Agent
- Plan folder structure in `libs/features/trending/`
- Define import boundaries
- Create `lib.routes.ts` template

**Step 2:** Angular Generator Agent
- Generate `trending.component.ts`
- Create `trending.facade.ts` for state
- Generate `trending.service.ts`

**Step 3:** UI System Agent
- Create `trending-card.component.ts`
- Design responsive grid layout
- Apply design tokens

**Step 4:** API Integration Agent
- Create typed API calls for trending data
- Add error handling interceptor
- Map backend DTO to frontend model

**Step 5:** Performance & QA Agent
- Implement virtual scrolling
- Add unit tests
- Optimize bundle size

**Step 6:** Social UX Agent (if needed)
- Add engagement metrics display
- Implement sharing functionality
- Add trending filters

---

## Code Generation Checklists

### New Component Checklist
- [ ] Use standalone component pattern
- [ ] Implement OnPush change detection
- [ ] Add trackBy for loops
- [ ] Use design tokens for styling
- [ ] Document with JSDoc
- [ ] Write unit tests
- [ ] Export from barrel export

### New Feature Checklist
- [ ] Create `libs/features/{name}/` structure
- [ ] Define routes in `lib.routes.ts`
- [ ] Create facade service for state
- [ ] Add typed API service
- [ ] Build UI components
- [ ] Implement error handling
- [ ] Add to app routes with lazy loading
- [ ] Test with performance tools

### New API Integration Checklist
- [ ] Generate types from OpenAPI (if available)
- [ ] Create typed request/response interfaces
- [ ] Implement error mapping
- [ ] Add to auth interceptor (if needed)
- [ ] Handle 401/403 responses
- [ ] Add retry logic
- [ ] Document API contract
- [ ] Add tests for service

---

## Common Tasks & Agent Assignments

| Task | Primary Agent | Secondary Agents |
|------|---------------|------------------|
| Create new component | Angular Generator | UI System |
| Add feature | Frontend Architect | Angular Generator, API Integration |
| Fix performance issue | Performance & QA | Angular Generator |
| Implement API calls | API Integration | Angular Generator |
| Design system update | UI System | Frontend Architect |
| Social feature | Social UX | Angular Generator, UI System |
| Accessibility audit | Performance & QA | UI System |
| Bundle size optimization | Performance & QA | Frontend Architect |
| Type safety review | API Integration | Frontend Architect |
| Code quality review | Frontend Architect | Performance & QA |

---

## Standards & Guardrails

### All Agents Must Follow

1. **Strict TypeScript** - No `any` types, strict mode enforced
2. **Signals over NgRx** - Use Angular Signals for UI state
3. **OnPush Change Detection** - Mandatory for all components
4. **Design Tokens** - Always use, never hardcode values
5. **Lazy Loading** - Features loaded on-demand via routes
6. **Import Boundaries** - Respect Nx layer rules
7. **Accessibility** - WCAG 2.1 AA minimum
8. **Tests** - Unit tests alongside features
9. **Documentation** - JSDoc and README files
10. **Performance** - Monitor Core Web Vitals

---

## Integration Points

### With Backend
- **API Contract:** OpenAPI/Swagger from backend
- **Type Generation:** Automated from OpenAPI
- **Error Mapping:** Standardized error interceptor
- **Auth Token:** Managed in auth service + interceptor

### With Design System
- **Design Tokens:** CSS variables in `libs/core/`
- **Components:** Reusable in `libs/ui/`
- **Theming:** Multiple themes supported
- **Accessibility:** WCAG 2.1 AA compliance

### With CI/CD
- **Build:** Nx affected builds
- **Test:** Jest with coverage requirements
- **Lint:** ESLint with boundary enforcement
- **Bundle:** Size analysis in pipeline

---

## References & Links

**Skill Documentation:**
- [Frontend Architecture](./ai-context/frontend-architecture.md)
- [Angular Component Generation](./ai-context/angular-component-generation.md)
- [Design System Components](./ai-context/design-system-component-generation.md)
- [API Integration](./ai-context/api-integration.md)
- [Performance & QA](./ai-context/performance-qa.md)
- [Social UX & Intelligence](./ai-context/social-ux-intelligence.md)

**General Documentation:**
- [Frontend Playbook](./frontend-ai-playbook.md) - Development standards
- [Project Structure](../architecture/nx-workspace.md) - File organization

**Development Resources:**
- [Quick Reference](../development/coding-standards.md)
- [Backend CRUD](../api/backend-contracts.md)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 2026 | Initial agent skill documentation |

---

**Last Updated:** May 23, 2026  
**Maintained By:** Frontend Architect Agent  
**Status:** Active & Evolving
