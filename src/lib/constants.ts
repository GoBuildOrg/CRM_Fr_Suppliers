export const USER_ROLES = {
    SUPPLIER_ADMIN: "SUPPLIER_ADMIN",
    SALES_MANAGER: "SALES_MANAGER",
} as const;

export const LEAD_STATUS = {
    NEW: "NEW",
    CONTACTED: "CONTACTED",
    QUALIFIED: "QUALIFIED",
    PROPOSAL: "PROPOSAL",
    NEGOTIATION: "NEGOTIATION",
    WON: "WON",
    LOST: "LOST",
} as const;

export const ACTIVITY_TYPE = {
    CALL: "CALL",
    EMAIL: "EMAIL",
    MEETING: "MEETING",
    SITE_VISIT: "SITE_VISIT",
    NOTE: "NOTE",
} as const;

export const ORDER_STATUS = {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    IN_PROGRESS: "IN_PROGRESS",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
} as const;

export const PAYMENT_STATUS = {
    PENDING: "PENDING",
    PARTIAL: "PARTIAL",
    PAID: "PAID",
    OVERDUE: "OVERDUE",
} as const;

export const QUOTATION_STATUS = {
    DRAFT: "DRAFT",
    SENT: "SENT",
    ACCEPTED: "ACCEPTED",
    REJECTED: "REJECTED",
    EXPIRED: "EXPIRED",
} as const;

export const NOTIFICATION_TYPE = {
    LEAD_ASSIGNED: "LEAD_ASSIGNED",
    FOLLOW_UP_DUE: "FOLLOW_UP_DUE",
    QUOTATION_SENT: "QUOTATION_SENT",
    ORDER_RECEIVED: "ORDER_RECEIVED",
    LOW_STOCK: "LOW_STOCK",
    PAYMENT_RECEIVED: "PAYMENT_RECEIVED",
} as const;

export const MATERIAL_TYPES = [
    "Cement",
    "Steel",
    "Sand",
    "Aggregates",
    "RMC",
    "Bricks",
    "TMT Bars",
    "Concrete",
    "Other",
] as const;
