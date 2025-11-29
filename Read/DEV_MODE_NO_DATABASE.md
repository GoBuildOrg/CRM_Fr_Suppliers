# Development Mode - No Database Required

## Auth Bypass Enabled ✅

I've configured the app to run **without a database** for UI testing:

### Changes Made:

1. **Middleware Updated** (`src/middleware.ts`)
   - Set `DEV_BYPASS_AUTH = true`
   - All routes now accessible without authentication
   - Console message will show "AUTH BYPASSED"

2. **Mock Data Created** (`src/lib/mock-data.ts`)
   - Sample leads, quotations, inventory
   - Dashboard stats
   - Activities and revenue data

### How to View the App:

1. **Start the dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Open your browser**:
   ```
   http://localhost:3000
   ```

3. **Navigate directly to any page**:
   - `http://localhost:3000/dashboard` - Main dashboard
   - `http://localhost:3000/leads` - Leads Kanban
   - `http://localhost:3000/quotations` - Quotations list
   - `http://localhost:3000/inventory` - Inventory management

### ⚠️ Important Notes:

- **Server actions will fail** since there's no database
- You can **view all UI components** and layouts
- **Mock data can be added** to pages manually for testing
- This is **temporary for frontend preview only**

### To Use Real Data Later:

1. Set up PostgreSQL database
2. Update `.env` with `DATABASE_URL`
3. Set `DEV_BYPASS_AUTH = false` in middleware
4. Run `npx prisma migrate dev`

### Mock Data Available:

You can import mock data in pages:
```typescript
import { mockLeads, mockDashboardStats } from '@/lib/mock-data';
```

The UI is now **fully viewable** without database setup! 🎉

---

**Try it now**: Open http://localhost:3000/dashboard
