import { getLeadById } from "@/actions/leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActivitiesTimeline } from "@/components/leads/activities-timeline";
import { ActivityForm } from "@/components/leads/activity-form";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import {
    Building2,
    Calendar,
    DollarSign,
    MapPin,
    TrendingUp,
    User,
    Edit,
    FileText,
    ShoppingCart,
} from "lucide-react";

export default async function LeadDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const lead = await getLeadById(params.id);

    const STATUS_COLORS: Record<string, string> = {
        NEW: "bg-blue-500",
        CONTACTED: "bg-yellow-500",
        QUALIFIED: "bg-green-500",
        PROPOSAL: "bg-purple-500",
        NEGOTIATION: "bg-orange-500",
        WON: "bg-emerald-600",
        LOST: "bg-red-500",
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold">{lead.title}</h1>
                        <Badge
                            className={`${STATUS_COLORS[lead.status]} text-white`}
                        >
                            {lead.status}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">{lead.customerCompany.name}</p>
                </div>
                <div className="flex gap-2">
                    <Link href={`/leads/${lead.id}/edit`}>
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                    <ActivityForm leadId={lead.id} />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Lead Details */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Lead Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Customer */}
                            <div className="flex items-start gap-3">
                                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Customer</p>
                                    <p className="text-sm text-muted-foreground">
                                        {lead.customerCompany.name}
                                    </p>
                                    {lead.customerCompany.email && (
                                        <p className="text-xs text-muted-foreground">
                                            {lead.customerCompany.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Assigned To */}
                            {lead.assignedTo && (
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Assigned To</p>
                                        <p className="text-sm text-muted-foreground">
                                            {lead.assignedTo.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {lead.assignedTo.role.replace("_", " ")}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Estimated Value */}
                            {lead.estimatedValue && (
                                <div className="flex items-start gap-3">
                                    <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Estimated Value</p>
                                        <p className="text-sm font-semibold text-green-600">
                                            {formatCurrency(lead.estimatedValue)}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Probability */}
                            {lead.probability !== null && (
                                <div className="flex items-start gap-3">
                                    <TrendingUp className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Win Probability</p>
                                        <p className="text-sm text-muted-foreground">
                                            {lead.probability}%
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Expected Close Date */}
                            {lead.expectedCloseDate && (
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Expected Close</p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(lead.expectedCloseDate)}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Site Address */}
                            {lead.siteAddress && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Site Address</p>
                                        <p className="text-sm text-muted-foreground">
                                            {lead.siteAddress.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {lead.siteAddress.city}, {lead.siteAddress.state}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {lead.description && (
                            <div className="pt-4 border-t">
                                <p className="text-sm font-medium mb-2">Description</p>
                                <p className="text-sm text-muted-foreground">
                                    {lead.description}
                                </p>
                            </div>
                        )}

                        {/* Source */}
                        {lead.source && (
                            <div className="pt-4 border-t">
                                <p className="text-sm font-medium mb-2">Source</p>
                                <p className="text-sm text-muted-foreground">{lead.source}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Quotations</span>
                                </div>
                                <span className="font-semibold">{lead.quotations.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Orders</span>
                                </div>
                                <span className="font-semibold">{lead.orders.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Activities</span>
                                </div>
                                <span className="font-semibold">{lead.activities.length}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Quotations */}
                    {lead.quotations.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Recent Quotations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {lead.quotations.slice(0, 3).map((quote) => (
                                        <Link
                                            key={quote.id}
                                            href={`/quotations/${quote.id}`}
                                            className="block p-2 rounded hover:bg-accent transition-colors"
                                        >
                                            <p className="text-sm font-medium">{quote.quotationNumber}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatCurrency(quote.total)}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Activities Timeline */}
            <ActivitiesTimeline activities={lead.activities} />
        </div>
    );
}
