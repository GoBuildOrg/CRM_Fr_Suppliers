import { getLeads } from "@/actions/leads";
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
    NEW: "bg-blue-500",
    CONTACTED: "bg-yellow-500",
    QUALIFIED: "bg-green-500",
    PROPOSAL: "bg-purple-500",
    NEGOTIATION: "bg-orange-500",
    WON: "bg-emerald-600",
    LOST: "bg-red-500",
};

export default async function LeadsPage() {
    const leads = await getLeads();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Leads</h1>
                    <p className="text-muted-foreground">
                        Manage and track your sales opportunities
                    </p>
                </div>
                <Link href="/leads/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Lead
                    </Button>
                </Link>
            </div>

            {/* Leads Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Leads</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Probability</TableHead>
                                <TableHead>Close Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Assigned To</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leads.map((lead) => (
                                <TableRow key={lead.id}>
                                    <TableCell className="font-medium max-w-xs truncate">
                                        {lead.title}
                                    </TableCell>
                                    <TableCell>{lead.customerCompany?.name || "-"}</TableCell>
                                    <TableCell>
                                        {lead.estimatedValue ? formatCurrency(lead.estimatedValue) : "-"}
                                    </TableCell>
                                    <TableCell>
                                        {lead.probability ? `${lead.probability}%` : "-"}
                                    </TableCell>
                                    <TableCell>
                                        {lead.expectedCloseDate
                                            ? formatDate(lead.expectedCloseDate)
                                            : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${STATUS_COLORS[lead.status]} text-white`}>
                                            {lead.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {lead.assignedTo?.name || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/leads/${lead.id}`}>
                                            <Button variant="ghost" size="sm">
                                                <FileText className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {leads.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                        No leads found. Create your first lead to get started.
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
