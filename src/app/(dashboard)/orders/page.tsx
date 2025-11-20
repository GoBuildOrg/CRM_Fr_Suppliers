import { getOrders } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Plus, Package, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";

const ORDER_STATUS_CONFIG = {
    PENDING: { label: "Pending", icon: Clock, variant: "secondary" as const, color: "text-yellow-600" },
    CONFIRMED: { label: "Confirmed", icon: CheckCircle, variant: "default" as const, color: "text-blue-600" },
    IN_PROGRESS: { label: "In Progress", icon: Package, variant: "default" as const, color: "text-purple-600" },
    DELIVERED: { label: "Delivered", icon: CheckCircle, variant: "secondary" as const, color: "text-green-600" },
    CANCELLED: { label: "Cancelled", icon: XCircle, variant: "outline" as const, color: "text-red-600" },
};

const PAYMENT_STATUS_CONFIG = {
    PENDING: { label: "Pending", variant: "outline" as const, color: "text-gray-600" },
    PARTIAL: { label: "Partial", variant: "secondary" as const, color: "text-orange-600" },
    PAID: { label: "Paid", variant: "default" as const, color: "text-green-600" },
    OVERDUE: { label: "Overdue", variant: "destructive" as const, color: "text-red-600" },
};

export default async function OrdersPage() {
    const orders = await getOrders();

    // Calculate stats
    const stats = {
        total: orders.length,
        pending: orders.filter((o) => o.status === "PENDING" || o.status === "CONFIRMED").length,
        inProgress: orders.filter((o) => o.status === "IN_PROGRESS").length,
        delivered: orders.filter((o) => o.status === "DELIVERED").length,
        totalRevenue: orders
            .filter((o) => o.status !== "CANCELLED")
            .reduce((sum, o) => sum + o.total, 0),
        pendingPayment: orders
            .filter((o) => o.paymentStatus !== "PAID")
            .reduce((sum, o) => sum + (o.total - o.paidAmount), 0),
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Orders</h1>
                    <p className="text-muted-foreground">
                        Manage and track customer orders
                    </p>
                </div>
                <Link href="/orders/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Order
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">
                            All time
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending + stats.inProgress}</div>
                        <p className="text-xs text-muted-foreground">
                            Pending + In Progress
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <div className="h-4 w-4 text-muted-foreground">₹</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground">
                            From {stats.delivered} delivered orders
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.pendingPayment)}</div>
                        <p className="text-xs text-muted-foreground">
                            Outstanding amount
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order Number</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-right">Paid</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => {
                                const statusConfig = ORDER_STATUS_CONFIG[order.status];
                                const paymentConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus];
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <TableRow key={order.id}>
                                        <TableCell>
                                            <Link
                                                href={`/orders/${order.id}`}
                                                className="font-mono text-sm font-medium hover:underline"
                                            >
                                                {order.orderNumber}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {order.customerCompany.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {order.customerCompany.contactPerson}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-muted-foreground">
                                                {order.items.length} item{order.items.length > 1 ? "s" : ""}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatCurrency(order.total)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="text-sm">
                                                {formatCurrency(order.paidAmount)}
                                            </div>
                                            {order.paidAmount < order.total && (
                                                <div className="text-xs text-muted-foreground">
                                                    Due: {formatCurrency(order.total - order.paidAmount)}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusConfig.variant} className="gap-1">
                                                <StatusIcon className="h-3 w-3" />
                                                {statusConfig.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={paymentConfig.variant}>
                                                {paymentConfig.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {orders.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                        No orders found. Create your first order to get started.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
