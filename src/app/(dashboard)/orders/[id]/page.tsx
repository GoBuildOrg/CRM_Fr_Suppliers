import { getOrderById } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import {
    ArrowLeft,
    Edit,
    Package,
    CheckCircle,
    Clock,
    XCircle,
    Building2,
    MapPin,
    Calendar,
    FileText,
    DollarSign,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const ORDER_STATUS_CONFIG = {
    PENDING: { label: "Pending", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
    CONFIRMED: { label: "Confirmed", icon: CheckCircle, color: "bg-blue-100 text-blue-800" },
    IN_PROGRESS: { label: "In Progress", icon: Package, color: "bg-purple-100 text-purple-800" },
    DELIVERED: { label: "Delivered", icon: CheckCircle, color: "bg-green-100 text-green-800" },
    CANCELLED: { label: "Cancelled", icon: XCircle, color: "bg-red-100 text-red-800" },
};

const PAYMENT_STATUS_CONFIG = {
    PENDING: { label: "Pending", color: "bg-gray-100 text-gray-800" },
    PARTIAL: { label: "Partial", color: "bg-orange-100 text-orange-800" },
    PAID: { label: "Paid", color: "bg-green-100 text-green-800" },
    OVERDUE: { label: "Overdue", color: "bg-red-100 text-red-800" },
};

interface OrderDetailsPageProps {
    params: {
        id: string;
    };
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
    let order;

    try {
        order = await getOrderById(params.id);
    } catch (error) {
        notFound();
    }

    const statusConfig = ORDER_STATUS_CONFIG[order.status];
    const paymentConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus];
    const StatusIcon = statusConfig.icon;

    const pendingAmount = order.total - order.paidAmount;
    const paymentPercentage = (order.paidAmount / order.total) * 100;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/orders">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold font-mono">{order.orderNumber}</h1>
                        <p className="text-muted-foreground">
                            Created on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/orders/${order.id}/edit`}>
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Status Badges */}
            <div className="flex gap-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.color}`}>
                    <StatusIcon className="h-4 w-4" />
                    <span className="font-medium">{statusConfig.label}</span>
                </div>
                <div className={`px-3 py-1.5 rounded-full ${paymentConfig.color}`}>
                    <span className="font-medium">{paymentConfig.label}</span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Customer Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Customer Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-sm font-medium">{order.customerCompany.name}</p>
                            <p className="text-xs text-muted-foreground">Company Name</p>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm">{order.customerCompany.contactPerson}</p>
                            <p className="text-xs text-muted-foreground">Contact Person</p>
                        </div>
                        <div>
                            <a
                                href={`tel:${order.customerCompany.phone}`}
                                className="text-sm hover:underline"
                            >
                                {order.customerCompany.phone}
                            </a>
                            <p className="text-xs text-muted-foreground">Phone</p>
                        </div>
                        {order.customerCompany.email && (
                            <div>
                                <a
                                    href={`mailto:${order.customerCompany.email}`}
                                    className="text-sm hover:underline"
                                >
                                    {order.customerCompany.email}
                                </a>
                                <p className="text-xs text-muted-foreground">Email</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Delivery Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Delivery Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {order.deliveryDate && (
                            <div>
                                <p className="text-sm font-medium">
                                    {new Date(order.deliveryDate).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-muted-foreground">Expected Delivery</p>
                            </div>
                        )}
                        {order.siteAddress && (
                            <>
                                <Separator />
                                <div>
                                    <p className="text-sm font-medium">{order.siteAddress.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {order.siteAddress.address}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {order.siteAddress.city}, {order.siteAddress.state} -{" "}
                                        {order.siteAddress.pincode}
                                    </p>
                                </div>
                            </>
                        )}
                        {order.deliveryNotes && (
                            <>
                                <Separator />
                                <div>
                                    <p className="text-sm">{order.deliveryNotes}</p>
                                    <p className="text-xs text-muted-foreground">Notes</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Payment Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-2xl font-bold">{formatCurrency(order.total)}</p>
                            <p className="text-xs text-muted-foreground">Total Amount</p>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-lg font-semibold text-green-600">
                                {formatCurrency(order.paidAmount)}
                            </p>
                            <p className="text-xs text-muted-foreground">Paid Amount</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-orange-600">
                                {formatCurrency(pendingAmount)}
                            </p>
                            <p className="text-xs text-muted-foreground">Pending Amount</p>
                        </div>
                        {/* Payment Progress Bar */}
                        <div className="pt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-600 h-2 rounded-full transition-all"
                                    style={{ width: `${paymentPercentage}%` }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground text-center mt-1">
                                {paymentPercentage.toFixed(0)}% Paid
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Order Items */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead className="text-right">Unit Price</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">
                                        {item.itemName}
                                        {item.inventory && (
                                            <p className="text-xs text-muted-foreground">
                                                SKU: {item.inventory.sku}
                                            </p>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {item.description || "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {item.quantity} {item.unit}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(item.unitPrice)}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {formatCurrency(item.total)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pricing Summary */}
                    <div className="mt-6 flex justify-end">
                        <div className="w-full max-w-sm space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatCurrency(order.subtotal)}</span>
                            </div>
                            {order.taxPercent > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Tax ({order.taxPercent}%)
                                    </span>
                                    <span>{formatCurrency(order.taxAmount)}</span>
                                </div>
                            )}
                            {order.discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount</span>
                                    <span>-{formatCurrency(order.discount)}</span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>{formatCurrency(order.total)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Linked Records */}
            {(order.lead || order.quotation) && (
                <Card>
                    <CardHeader>
                        <CardTitle>Related Records</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                        {order.lead && (
                            <div className="flex items-center gap-2 p-3 border rounded-lg">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Lead</p>
                                    <Link
                                        href={`/leads/${order.leadId}`}
                                        className="text-xs text-blue-600 hover:underline"
                                    >
                                        {order.lead.title}
                                    </Link>
                                </div>
                            </div>
                        )}
                        {order.quotation && (
                            <div className="flex items-center gap-2 p-3 border rounded-lg">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Quotation</p>
                                    <Link
                                        href={`/quotations/${order.quotationId}`}
                                        className="text-xs text-blue-600 hover:underline"
                                    >
                                        {order.quotation.quotationNumber}
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
