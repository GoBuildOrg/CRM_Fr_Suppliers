import { getQuotations } from "@/actions/quotations";
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
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, FileText } from "lucide-react";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
    DRAFT: "bg-gray-500",
    SENT: "bg-blue-500",
    ACCEPTED: "bg-green-500",
    REJECTED: "bg-red-500",
    EXPIRED: "bg-orange-500",
};

export default async function QuotationsPage() {
    const quotations = await getQuotations();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Quotations</h1>
                    <p className="text-muted-foreground">
                        Create and manage price quotes for customers
                    </p>
                </div>
                <Link href="/quotations/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Quotation
                    </Button>
                </Link>
            </div>

            {/* Quotations Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Quotations</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Quote Number</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Valid Until</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quotations.map((quotation) => (
                                <TableRow key={quotation.id}>
                                    <TableCell className="font-medium">
                                        {quotation.quotationNumber}
                                    </TableCell>
                                    <TableCell>{quotation.customerCompany.name}</TableCell>
                                    <TableCell>{quotation.title}</TableCell>
                                    <TableCell>{formatCurrency(quotation.total)}</TableCell>
                                    <TableCell>{formatDate(quotation.validUntil)}</TableCell>
                                    <TableCell>
                                        <Badge className={`${STATUS_COLORS[quotation.status]} text-white`}>
                                            {quotation.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/quotations/${quotation.id}`}>
                                            <Button variant="ghost" size="sm">
                                                <FileText className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {quotations.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No quotations found. Create your first quotation to get started.
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
