# CLAUDE.md - Project Instructions

## Critical Context: GitHub Pages Hosting

**This site is deployed as a STATIC SITE on GitHub Pages.**

### Implications for Authentication:

1. **No Server-Side Processing**
   - No server middleware, no SSR at runtime
   - All authentication happens client-side in the browser
   - Cannot enforce auth rules server-side

2. **Static HTML is Always Accessible**
   - Protected pages' HTML is served regardless of auth status
   - Protection relies on JavaScript redirects
   - If JS is disabled, HTML content is visible

3. **Security Model**
   - Client-side auth only controls what users SEE
   - Data security MUST be enforced by Supabase RLS policies
   - API keys are exposed in client-side code (this is expected)

4. **What GitHub Pages CAN'T Do**
   - Server-side session validation
   - HTTP-only cookies set by server
   - Server middleware for route protection
   - Dynamic content based on auth status at request time

5. **What GitHub Pages CAN Do**
   - Serve static HTML/JS/CSS
   - HTTPS (via GitHub's SSL)
   - Custom domains
   - Client-side JavaScript execution

### Recommendations for This Project:

- **Always implement Supabase RLS policies** - this is the real security layer
- **Don't put sensitive data in static HTML** - fetch via authenticated API calls
- **Use client-side redirects** for UX, not security
- **Consider the auth as "access control UX"** not "security enforcement"

### Build Considerations:

- Use mock Supabase client during build (already implemented)
- Environment variables need `PUBLIC_` prefix for client-side access
- Static generation means no per-request auth checks

---

## Session Context (2026-01-28)

### Completed Tasks:

1. **Supabase Auth Security Analysis** ✅
   - Full analysis of auth implementation
   - Security audit completed
   - Documentation in `/Docs/supabase-auth-*.md`

2. **Security Implementation** ✅
   - `supabase/migrations/001_rls_policies.sql` (286 lines) - RLS policies
   - `src/utils/csrf.ts` (387 lines) - CSRF protection
   - `src/services/auth.service.ts` (763 lines) - Centralized auth service

3. **i18n Refactoring (Option A - Astro 5 Native)** ✅
   - New structure:
     ```
     src/i18n/
     ├── index.ts        # Main module with helpers
     ├── types.ts        # Strict types (no index signatures)
     └── translations/
         ├── index.ts    # Re-exports
         ├── fr.ts       # 103 keys
         └── en.ts       # 103 keys
     
     scripts/
     └── validate-i18n.ts  # Build-time validation
     ```
   - New usage: `useTranslations(locale)` with `t('key')` and `t.ns('namespace')`
   - Backward compatible: `loadTranslations()` still works (deprecated)
   - Validation: `npm run validate:i18n` (auto-runs on build)

### Validation Results:
- i18n: 103 keys, all locales valid ✅
- astro check: 0 errors, 109 hints (deprecation warnings expected) ✅

### Pending:
- Test site in browser after WSL memory increase
- Full build test with 16GB RAM

### Next Steps:
1. After WSL restart, run `npm run dev` and test in browser
2. Verify translations display correctly
3. Test auth flows
