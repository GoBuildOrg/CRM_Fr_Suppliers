"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import Link from "next/link";
import { Building2, Calendar, DollarSign, TrendingUp } from "lucide-react";

interface Lead {
    id: string;
    title: string;
    status: string;
    estimatedValue?: number | null;
    probability?: number | null;
    expectedCloseDate?: Date | null;
    customerCompany: {
        name: string;
    };
    assignedTo: {
        name: string;
    } | null;
}

interface LeadCardProps {
    lead: Lead;
}

export function LeadCard({ lead }: LeadCardProps) {
    return (
        <Link href={`/leads/${lead.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-sm line-clamp-2">{lead.title}</h3>
                        {lead.probability && (
                            <Badge variant="outline" className="ml-2 shrink-0">
                                {lead.probability}%
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {/* Customer */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span className="truncate">{lead.customerCompany.name}</span>
                    </div>

                    {/* Estimated Value */}
                    {lead.estimatedValue && (
                        <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-600">
                                {formatCurrency(lead.estimatedValue)}
                            </span>
                        </div>
                    )}

                    {/* Expected Close Date */}
                    {lead.expectedCloseDate && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(lead.expectedCloseDate)}</span>
                        </div>
                    )}

                    {/* Assigned To */}
                    {lead.assignedTo && (
                        <div className="flex items-center gap-2 pt-2 border-t">
                            <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                    {getInitials(lead.assignedTo.name)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground truncate">
                                {lead.assignedTo.name}
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
