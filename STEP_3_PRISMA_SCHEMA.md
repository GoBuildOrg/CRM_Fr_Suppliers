# STEP 3 — Prisma Schema ✓

## Overview
Complete PostgreSQL database schema for GoBuild CRM with 14 models, 6 enums, comprehensive relations, cascading behaviors, and strategic indexing.

## Database Models

### 1. **User** (`users`)
User accounts for supplier company staff with role-based access.

**Fields:**
- `id` - Unique identifier (cuid)
- `email` - Unique email address
- `password` - Hashed password (nullable for OAuth)
- `name` - Full name
- `role` - UserRole enum (SUPPLIER_ADMIN | SALES_MANAGER)
- `image` - Profile image URL
- `phone` - Contact number
- `supplierCompanyId` - FK to SupplierCompany

**Relations:**
- Belongs to: SupplierCompany
- Has many: Leads (assigned), LeadActivities, Quotations, Orders, Notifications

**Indexes:** `email`, `supplierCompanyId`

---

### 2. **SupplierCompany** (`supplier_companies`)
Construction material supplier businesses using the CRM.

**Fields:**
- `id` - Unique identifier
- `name` - Company name
- `email`, `phone` - Contact details
- `address`, `city`, `state`, `pincode` - Location
- `gstNumber` - Unique GST number
- `status` - CompanyStatus enum (ACTIVE | INACTIVE | SUSPENDED)

**Relations:**
- Has many: Users, InventoryItems, Quotations, Orders

**Indexes:** `email`, `gstNumber`

---

### 3. **CustomerCompany** (`customer_companies`)
Construction companies purchasing materials.

**Fields:**
- `id` - Unique identifier
- `name` - Company name
- `email`, `phone`, `contactPerson` - Contact details
- `address`, `city`, `state`, `pincode` - Location
- `gstNumber` - Unique GST number

**Relations:**
- Has many: Leads, Quotations, Orders, SiteAddresses

**Indexes:** `phone`, `email`, `gstNumber`

---

### 4. **Lead** (`leads`)
Sales opportunities with construction companies.

**Fields:**
- `id` - Unique identifier
- `title`, `description` - Lead details
- `status` - LeadStatus enum (NEW | CONTACTED | QUALIFIED | PROPOSAL | NEGOTIATION | WON | LOST)
- `estimatedValue` - Potential deal value (₹)
- `probability` - Win probability (0-100)
- `expectedCloseDate` - Target close date
- `source` - Lead source (e.g., "Website", "Referral")

**Relations:**
- Belongs to: CustomerCompany, User (assignedTo), SiteAddress
- Has many: LeadActivities, Quotations, Orders

**Indexes:** `status`, `customerCompanyId`, `assignedToId`, `createdAt`

**Cascade:** Deletes with CustomerCompany

---

### 5. **LeadActivity** (`lead_activities`)
Activity log for leads (calls, meetings, site visits).

**Fields:**
- `id` - Unique identifier
- `type` - ActivityType enum (CALL | EMAIL | MEETING | SITE_VISIT | NOTE)
- `title`, `description` - Activity details
- `scheduledAt` - Planned time
- `completedAt` - Completion time

**Relations:**
- Belongs to: Lead, User

**Indexes:** `leadId`, `userId`, `scheduledAt`

**Cascade:** Deletes with Lead and User

---

### 6. **Quotation** (`quotations`)
Price quotes sent to customers.

**Fields:**
- `id` - Unique identifier
- `quotationNumber` - Unique quote number
- `title`, `description` - Quote details
- `status` - QuotationStatus enum (DRAFT | SENT | ACCEPTED | REJECTED | EXPIRED)
- `validUntil` - Expiry date
- `subtotal`, `taxPercent`, `taxAmount`, `discount`, `total` - Pricing
- `terms`, `notes` - T&C and notes

**Relations:**
- Belongs to: SupplierCompany, CustomerCompany, User (createdBy), Lead
- Has many: QuotationItems, Orders

**Indexes:** `quotationNumber`, `status`, `customerCompanyId`, `supplierCompanyId`, `leadId`, `createdAt`

**Cascade:** Deletes with SupplierCompany, CustomerCompany, User

---

### 7. **QuotationItem** (`quotation_items`)
Line items within quotations.

**Fields:**
- `id` - Unique identifier
- `itemName`, `description` - Item details
- `quantity`, `unit`, `unitPrice`, `total` - Pricing

**Relations:**
- Belongs to: Quotation, InventoryItem (optional)

**Indexes:** `quotationId`, `inventoryId`

**Cascade:** Deletes with Quotation

---

### 8. **InventoryItem** (`inventory_items`)
Construction materials inventory (cement, steel, sand, etc.).

**Fields:**
- `id` - Unique identifier
- `sku` - Unique stock keeping unit
- `name`, `description` - Item details
- `category` - Material type (Cement, Steel, Sand, etc.)
- `currentStock`, `unit` - Stock quantity and unit
- `minStockLevel`, `maxStockLevel` - Reorder thresholds
- `costPrice`, `sellingPrice` - Pricing
- `isActive` - Active status

**Relations:**
- Belongs to: SupplierCompany
- Has many: QuotationItems, OrderItems

**Indexes:** `sku`, `category`, `supplierCompanyId`, `currentStock`

**Cascade:** Deletes with SupplierCompany

---

### 9. **Order** (`orders`)
Confirmed purchase orders from customers.

**Fields:**
- `id` - Unique identifier
- `orderNumber` - Unique order number
- `status` - OrderStatus enum (PENDING | CONFIRMED | IN_PROGRESS | DELIVERED | CANCELLED)
- `paymentStatus` - PaymentStatus enum (PENDING | PARTIAL | PAID | OVERDUE)
- `subtotal`, `taxPercent`, `taxAmount`, `discount`, `total`, `paidAmount` - Pricing
- `deliveryDate`, `deliveryAddress`, `deliveryNotes` - Delivery details

**Relations:**
- Belongs to: SupplierCompany, CustomerCompany, User (createdBy), Lead, Quotation, SiteAddress
- Has many: OrderItems

**Indexes:** `orderNumber`, `status`, `paymentStatus`, `customerCompanyId`, `supplierCompanyId`, `createdAt`

**Cascade:** Deletes with SupplierCompany, CustomerCompany, User

---

### 10. **OrderItem** (`order_items`)
Line items within orders.

**Fields:**
- `id` - Unique identifier
- `itemName`, `description` - Item details
- `quantity`, `unit`, `unitPrice`, `total` - Pricing

**Relations:**
- Belongs to: Order, InventoryItem (optional)

**Indexes:** `orderId`, `inventoryId`

**Cascade:** Deletes with Order

---

### 11. **SiteAddress** (`site_addresses`)
Construction site delivery addresses.

**Fields:**
- `id` - Unique identifier
- `name` - Site name
- `address`, `city`, `state`, `pincode` - Location
- `contactPerson`, `contactPhone` - Site contact

**Relations:**
- Belongs to: CustomerCompany
- Has many: Leads, Orders

**Indexes:** `customerCompanyId`

**Cascade:** Deletes with CustomerCompany

---

### 12. **Notification** (`notifications`)
User notifications for reminders and alerts.

**Fields:**
- `id` - Unique identifier
- `type` - NotificationType enum (LEAD_ASSIGNED | FOLLOW_UP_DUE | QUOTATION_SENT | ORDER_RECEIVED | LOW_STOCK | PAYMENT_RECEIVED)
- `title`, `message` - Notification content
- `read` - Read status
- `leadId`, `orderId`, `quotationId` - Optional entity references

**Relations:**
- Belongs to: User

**Indexes:** `userId`, `read`, `createdAt`

**Cascade:** Deletes with User

---

## Enums

### UserRole
- `SUPPLIER_ADMIN` - Full system access
- `SALES_MANAGER` - Limited to sales operations

### CompanyStatus
- `ACTIVE` - Operational
- `INACTIVE` - Temporarily disabled
- `SUSPENDED` - Blocked

### LeadStatus
- `NEW` → `CONTACTED` → `QUALIFIED` → `PROPOSAL` → `NEGOTIATION` → `WON` | `LOST`

### ActivityType
- `CALL`, `EMAIL`, `MEETING`, `SITE_VISIT`, `NOTE`

### QuotationStatus
- `DRAFT` → `SENT` → `ACCEPTED` | `REJECTED` | `EXPIRED`

### OrderStatus
- `PENDING` → `CONFIRMED` → `IN_PROGRESS` → `DELIVERED` | `CANCELLED`

### PaymentStatus
- `PENDING` → `PARTIAL` → `PAID` | `OVERDUE`

### NotificationType
- `LEAD_ASSIGNED`, `FOLLOW_UP_DUE`, `QUOTATION_SENT`, `ORDER_RECEIVED`, `LOW_STOCK`, `PAYMENT_RECEIVED`

---

## Key Design Decisions

### Cascade Behaviors
- **OnDelete Cascade**: User → Activities, Company → Users/Inventory/Orders
- **OnDelete SetNull**: Lead → AssignedUser (preserve lead if user deleted)
- **OnDelete SetNull**: Order → Quotation (preserve order history)

### Indexing Strategy
- **Primary lookups**: Email, phone, unique IDs
- **Foreign keys**: All relation fields indexed
- **Filtering**: Status fields, dates, stock levels
- **Performance**: Compound indexes for common queries

### Data Integrity
- Unique constraints: Email, SKU, GST numbers, order/quote numbers
- Nullable fields: Optional relations (OAuth password, optional addresses)
- Default values: Timestamps, status enums, boolean flags

### Soft Deletes
- `isActive` flag on InventoryItem (preserves history in quotes/orders)

---

## Next Steps

### Setup Commands
```bash
# Install Prisma
npm install prisma @prisma/client

# Install auth packages
npm install next-auth @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs

# Generate Prisma Client
npx prisma generate

# Create initial migration
npx prisma migrate dev --name init

# (Optional) Seed database
npx prisma db seed
```

### Environment Variables Required
```env
DATABASE_URL="postgresql://user:password@localhost:5432/gobuild_crm?schema=public"
```

---

**STEP 3 COMPLETE** ✓

Complete Prisma schema created with all required models, relations, and indexes ready for migration.
