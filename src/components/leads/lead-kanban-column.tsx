"use client";

import { LeadCard } from "./lead-card";

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

interface LeadKanbanColumnProps {
    title: string;
    status: string;
    leads: Lead[];
    count: number;
    color: string;
}

export function LeadKanbanColumn({
    title,
    status,
    leads,
    count,
    color,
}: LeadKanbanColumnProps) {
    return (
        <div className="flex-1 min-w-[300px]">
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <h3 className="font-semibold">{title}</h3>
                    <span className="text-sm text-muted-foreground">({count})</span>
                </div>
            </div>
            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {leads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} />
                ))}
                {leads.length === 0 && (
                    <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                        No leads in this stage
                    </div>
                )}
            </div>
        </div>
    );
}
