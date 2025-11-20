import { getCustomerById, getCustomerStats } from "@/actions/customers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import {
    ArrowLeft,
    Edit,
    Building2,
    Mail,
    Phone,
    MapPin,
    FileText,
    Package,
    TrendingUp,
    Users,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CustomerDetailsPageProps {
    params: {
        id: string;
    };
}

export default async function CustomerDetailsPage({ params }: CustomerDetailsPageProps) {
    let customer;
    let stats;

    try {
        [customer, stats] = await Promise.all([
            getCustomerById(params.id),
            getCustomerStats(params.id),
        ]);
    } catch (error) {
        notFound();
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/customers">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{customer.name}</h1>
                        <p className="text-muted-foreground">
                            Contact: {customer.contactPerson}
                        </p>
                    </div>
                </div>
                <Button>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Customer
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalOrders}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                        <div className="h-4 w-4 text-muted-foreground">₹</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(stats.averageOrderValue)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalLeads}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Customer Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">{customer.name}</p>
                                <p className="text-xs text-muted-foreground">Company Name</p>
                            </div>
                        </div>

                        <Separator />

                        {customer.email && (
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <a href={`mailto:${customer.email}`} className="text-sm hover:underline">
                                        {customer.email}
                                    </a>
                                    <p className="text-xs text-muted-foreground">Email</p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <a href={`tel:${customer.phone}`} className="text-sm hover:underline">
                                    {customer.phone}
                                </a>
                                <p className="text-xs text-muted-foreground">Phone</p>
                            </div>
                        </div>

                        {(customer.address || customer.city || customer.state) && (
                            <>
                                <Separator />
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        {customer.address && <p className="text-sm">{customer.address}</p>}
                                        <p className="text-sm">
                                            {[customer.city, customer.state, customer.pincode]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Address</p>
                                    </div>
                                </div>
                            </>
                        )}

                        {customer.gstNumber && (
                            <>
                                <Separator />
                                <div className="flex items-center gap-3">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-mono">{customer.gstNumber}</p>
                                        <p className="text-xs text-muted-foreground">GST Number</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Site Addresses */}
                <Card>
                    <CardHeader>
                        <CardTitle>Site Addresses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {customer.siteAddresses.length > 0 ? (
                            <div className="space-y-4">
                                {customer.siteAddresses.map((site) => (
                                    <div key={site.id} className="p-3 border rounded-lg">
                                        <p className="font-medium">{site.name}</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {site.address}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {site.city}, {site.state} - {site.pincode}
                                        </p>
                                        {site.contactPerson && (
                                            <p className="text-xs text-muted-foreground mt-2">
                                                Contact: {site.contactPerson}
                                                {site.contactPhone && ` (${site.contactPhone})`}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No site addresses added yet
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Order History */}
            <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                    {customer.orders.length > 0 ? (
                        <div className="space-y-2">
                            {customer.orders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/orders/${order.id}`}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div>
                                        <p className="font-mono text-sm font-medium">
                                            {order.orderNumber}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge>{order.status}</Badge>
                                        <p className="font-bold">{formatCurrency(order.total)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No orders yet</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
