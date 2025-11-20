# STEP 1 — Project Folder Structure

## Complete GoBuild CRM Folder Structure

```
gobuild-crm/
├── .next/                          # Next.js build output (generated)
├── .prisma/                        # Prisma generated client (generated)
├── node_modules/                   # Dependencies (generated)
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── migrations/                # Prisma migrations
│   └── seed.ts                    # Database seed file
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── placeholder-avatar.png
│   │   └── illustrations/
│   ├── fonts/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── signin/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── leads/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── kanban/
│   │   │   │       └── page.tsx
│   │   │   ├── quotations/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   ├── inventory/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   ├── customers/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── notifications/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── profile/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── team/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── company/
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── dashboard/
│   │   │   │   └── route.ts
│   │   │   ├── leads/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── activities/
│   │   │   │   └── route.ts
│   │   │   ├── quotations/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── pdf/
│   │   │   │           └── route.ts
│   │   │   ├── inventory/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── orders/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── customers/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── notifications/
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── error.tsx
│   ├── components/
│   │   ├── ui/                    # Shadcn/UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── radio-group.tsx
│   │   │   └── skeleton.tsx
│   │   ├── auth/
│   │   │   ├── signin-form.tsx
│   │   │   ├── signup-form.tsx
│   │   │   ├── google-signin-button.tsx
│   │   │   └── auth-guard.tsx
│   │   ├── dashboard/
│   │   │   ├── stats-cards.tsx
│   │   │   ├── revenue-chart.tsx
│   │   │   ├── leads-chart.tsx
│   │   │   ├── recent-activities.tsx
│   │   │   └── quick-actions.tsx
│   │   ├── leads/
│   │   │   ├── lead-card.tsx
│   │   │   ├── lead-form.tsx
│   │   │   ├── lead-kanban.tsx
│   │   │   ├── lead-kanban-column.tsx
│   │   │   ├── lead-details.tsx
│   │   │   ├── activities-timeline.tsx
│   │   │   ├── activity-form.tsx
│   │   │   ├── follow-up-reminder.tsx
│   │   │   └── lead-filters.tsx
│   │   ├── quotations/
│   │   │   ├── quotation-form.tsx
│   │   │   ├── quotation-items-table.tsx
│   │   │   ├── quotation-item-row.tsx
│   │   │   ├── quotation-preview.tsx
│   │   │   ├── quotation-pdf.tsx
│   │   │   └── quotation-list.tsx
│   │   ├── inventory/
│   │   │   ├── inventory-table.tsx
│   │   │   ├── inventory-form.tsx
│   │   │   ├── low-stock-alert.tsx
│   │   │   ├── stock-history.tsx
│   │   │   └── inventory-filters.tsx
│   │   ├── orders/
│   │   │   ├── order-form.tsx
│   │   │   ├── order-list.tsx
│   │   │   ├── order-details.tsx
│   │   │   ├── delivery-tracker.tsx
│   │   │   ├── payment-status.tsx
│   │   │   └── invoice-preview.tsx
│   │   ├── customers/
│   │   │   ├── customer-profile.tsx
│   │   │   ├── customer-stats.tsx
│   │   │   ├── customer-orders.tsx
│   │   │   ├── customer-list.tsx
│   │   │   └── customer-form.tsx
│   │   ├── notifications/
│   │   │   ├── notification-bell.tsx
│   │   │   ├── notification-list.tsx
│   │   │   ├── notification-item.tsx
│   │   │   └── notification-preferences.tsx
│   │   ├── settings/
│   │   │   ├── profile-form.tsx
│   │   │   ├── team-table.tsx
│   │   │   ├── invite-member-form.tsx
│   │   │   └── company-settings-form.tsx
│   │   └── shared/
│   │       ├── navbar.tsx
│   │       ├── sidebar.tsx
│   │       ├── header.tsx
│   │       ├── loading-spinner.tsx
│   │       ├── error-boundary.tsx
│   │       ├── search-bar.tsx
│   │       ├── data-table.tsx
│   │       ├── pagination.tsx
│   │       ├── modal.tsx
│   │       └── empty-state.tsx
│   ├── lib/
│   │   ├── auth.ts                # NextAuth configuration
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── utils.ts               # Utility functions
│   │   ├── validations/
│   │   │   ├── auth.ts
│   │   │   ├── lead.ts
│   │   │   ├── quotation.ts
│   │   │   ├── inventory.ts
│   │   │   ├── order.ts
│   │   │   └── customer.ts
│   │   ├── pdf/
│   │   │   ├── quotation-generator.ts
│   │   │   └── invoice-generator.ts
│   │   ├── email/
│   │   │   ├── templates/
│   │   │   │   ├── welcome.tsx
│   │   │   │   ├── quotation.tsx
│   │   │   │   └── reminder.tsx
│   │   │   └── send-email.ts
│   │   └── constants.ts
│   ├── actions/
│   │   ├── auth.ts
│   │   ├── dashboard.ts
│   │   ├── leads.ts
│   │   ├── activities.ts
│   │   ├── quotations.ts
│   │   ├── inventory.ts
│   │   ├── orders.ts
│   │   ├── customers.ts
│   │   └── notifications.ts
│   ├── hooks/
│   │   ├── use-user.ts
│   │   ├── use-toast.ts
│   │   ├── use-leads.ts
│   │   ├── use-quotations.ts
│   │   ├── use-inventory.ts
│   │   ├── use-orders.ts
│   │   ├── use-customers.ts
│   │   └── use-notifications.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── lead.ts
│   │   ├── quotation.ts
│   │   ├── inventory.ts
│   │   ├── order.ts
│   │   ├── customer.ts
│   │   └── notification.ts
│   └── middleware.ts              # Auth middleware
├── .env                           # Environment variables (git-ignored)
├── .env.example                   # Example env file
├── .eslintrc.json                 # ESLint configuration
├── .gitignore                     # Git ignore rules
├── components.json                # Shadcn/UI config
├── next.config.js                 # Next.js configuration
├── package.json                   # Dependencies
├── postcss.config.js              # PostCSS config
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # Project documentation
```

## Directory Purpose Overview

### `/prisma`
Contains database schema, migrations, and seed data for PostgreSQL database using Prisma ORM.

### `/public`
Static assets including images, fonts, and icons served directly by Next.js.

### `/src/app/(auth)`
Authentication routes (signin, signup, forgot-password) with shared auth layout.

### `/src/app/(dashboard)`
Protected dashboard routes for all CRM modules with shared dashboard layout.

### `/src/app/api`
API route handlers for server-side operations and NextAuth configuration.

### `/src/components/ui`
Reusable Shadcn/UI component primitives with consistent styling.

### `/src/components/*`
Feature-specific components organized by module (auth, dashboard, leads, quotations, inventory, orders, customers, notifications, settings).

### `/src/components/shared`
Shared components used across multiple modules (navbar, sidebar, data-table, modals).

### `/src/lib`
Core utilities, configurations, and helper functions including NextAuth config, Prisma client, validations, PDF generation, and email templates.

### `/src/actions`
Server actions for database operations following Next.js App Router patterns.

### `/src/hooks`
Custom React hooks for state management and data fetching.

### `/src/types`
TypeScript type definitions and interfaces for type safety.

### `/src/middleware.ts`
Next.js middleware for authentication and route protection.

## Key Architecture Decisions

1. **App Router**: Using Next.js 13+ App Router with route groups `(auth)` and `(dashboard)` for layout separation
2. **Server Actions**: Primary data mutation pattern using server actions in `/src/actions`
3. **Route Handlers**: API routes for complex operations, file downloads, and PDF generation
4. **Component Organization**: Feature-based organization with shared UI primitives
5. **Type Safety**: Centralized type definitions with Prisma-generated types
6. **Validation**: Dedicated validation schemas per feature in `/src/lib/validations`

---

**STEP 1 COMPLETE** ✓

This folder structure is production-ready and follows Next.js best practices with clear separation of concerns, modular architecture, and scalability for the complete CRM system.
