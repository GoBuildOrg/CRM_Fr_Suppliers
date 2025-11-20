"use client";

import { LeadKanbanColumn } from "./lead-kanban-column";
import { useMemo } from "react";

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

interface LeadKanbanProps {
    leads: Lead[];
}

const KANBAN_COLUMNS = [
    { status: "NEW", title: "New", color: "bg-blue-500" },
    { status: "CONTACTED", title: "Contacted", color: "bg-yellow-500" },
    { status: "QUALIFIED", title: "Qualified", color: "bg-green-500" },
    { status: "PROPOSAL", title: "Proposal", color: "bg-purple-500" },
    { status: "NEGOTIATION", title: "Negotiation", color: "bg-orange-500" },
    { status: "WON", title: "Won", color: "bg-emerald-600" },
    { status: "LOST", title: "Lost", color: "bg-red-500" },
];

export function LeadKanban({ leads }: LeadKanbanProps) {
    const leadsByStatus = useMemo(() => {
        return KANBAN_COLUMNS.map((column) => ({
            ...column,
            leads: leads.filter((lead) => lead.status === column.status),
        }));
    }, [leads]);

    return (
        <div className="flex gap-4 overflow-x-auto pb-4">
            {leadsByStatus.map((column) => (
                <LeadKanbanColumn
                    key={column.status}
                    title={column.title}
                    status={column.status}
                    leads={column.leads}
                    count={column.leads.length}
                    color={column.color}
                />
            ))}
        </div>
    );
}
