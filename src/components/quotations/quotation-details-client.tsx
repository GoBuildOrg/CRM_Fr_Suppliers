"use client";

import { getQuotationById } from "@/actions/quotations";
import { generateQuotationPDF, downloadPDF } from "@/lib/pdf/quotation-generator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Download, Edit, Printer } from "lucide-react";
import Link from "next/link";

interface QuotationDetailsClientProps {
    quotation: Awaited<ReturnType<typeof getQuotationById>>;
}

const STATUS_COLORS: Record<string, string> = {
    DRAFT: "bg-gray-500",
    SENT: "bg-blue-500",
    ACCEPTED: "bg-green-500",
    REJECTED: "bg-red-500",
    EXPIRED: "bg-orange-500",
};

export function QuotationDetailsClient({ quotation }: QuotationDetailsClientProps) {
    const handleDownloadPDF = async () => {
        const html = await generateQuotationPDF(quotation);
        downloadPDF(html, `Quotation-${quotation.quotationNumber}.html`);
    };

    const handlePrint = async () => {
        const html = await generateQuotationPDF(quotation);
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
            }, 250);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold">{quotation.quotationNumber}</h1>
                        <Badge className={`${STATUS_COLORS[quotation.status]} text-white`}>
                            {quotation.status}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">{quotation.title}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                    <Button variant="outline" onClick={handleDownloadPDF}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                    {quotation.status === "DRAFT" && (
                        <Link href={`/quotations/${quotation.id}/edit`}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(quotation.total)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Valid Until</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatDate(quotation.validUntil)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{quotation.items.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Customer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium truncate">{quotation.customerCompany.name}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Items Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Quotation Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead className="text-right">Unit Price</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quotation.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{item.itemName}</div>
                                            {item.description && (
                                                <div className="text-sm text-muted-foreground">{item.description}</div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell>{item.unit}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                    <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Totals */}
                    <div className="mt-6 space-y-2 max-w-sm ml-auto">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span>{formatCurrency(quotation.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Tax ({quotation.taxPercent}%):</span>
                            <span>{formatCurrency(quotation.taxAmount)}</span>
                        </div>
                        {quotation.discount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span>Discount:</span>
                                <span>- {formatCurrency(quotation.discount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-bold pt-2 border-t">
                            <span>Total:</span>
                            <span>{formatCurrency(quotation.total)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Terms & Notes */}
            {(quotation.terms || quotation.notes) && (
                <div className="grid gap-4 md:grid-cols-2">
                    {quotation.terms && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Terms & Conditions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm whitespace-pre-wrap">{quotation.terms}</p>
                            </CardContent>
                        </Card>
                    )}
                    {quotation.notes && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm whitespace-pre-wrap">{quotation.notes}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}
