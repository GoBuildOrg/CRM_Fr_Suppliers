import { getCustomers } from "@/actions/customers";
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
import { Plus, Users, Building2, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default async function CustomersPage() {
    const customers = await getCustomers();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Customers</h1>
                    <p className="text-muted-foreground">
                        Manage your customer companies
                    </p>
                </div>
                <Link href="/customers/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Customer
                    </Button>
                </Link>
            </div>

            {/* Stats Card */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{customers.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {customers.filter((c) => c._count.orders > 0).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            With orders
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <div className="h-4 w-4 text-muted-foreground">#</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {customers.reduce((sum, c) => sum + c._count.orders, 0)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Customers Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Customers</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Company Name</TableHead>
                                <TableHead>Contact Person</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead className="text-center">Orders</TableHead>
                                <TableHead className="text-center">Leads</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell>
                                        <Link
                                            href={`/customers/${customer.id}`}
                                            className="font-medium hover:underline flex items-center gap-2"
                                        >
                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                            {customer.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{customer.contactPerson}</TableCell>
                                    <TableCell>
                                        <a
                                            href={`tel:${customer.phone}`}
                                            className="flex items-center gap-2 text-sm hover:underline"
                                        >
                                            <Phone className="h-3 w-3" />
                                            {customer.phone}
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        {customer.email ? (
                                            <a
                                                href={`mailto:${customer.email}`}
                                                className="flex items-center gap-2 text-sm hover:underline"
                                            >
                                                <Mail className="h-3 w-3" />
                                                {customer.email}
                                            </a>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {[customer.city, customer.state].filter(Boolean).join(", ") || "-"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary">
                                            {customer._count.orders}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline">
                                            {customer._count.leads}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {customers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No customers found. Add your first customer to get started.
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
