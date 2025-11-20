import { getLeads, getTeamMembers, getCustomers } from "@/actions/leads";
import { LeadKanban } from "@/components/leads/lead-kanban";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function LeadsPage() {
    const [leads, teamMembers, customers] = await Promise.all([
        getLeads(),
        getTeamMembers(),
        getCustomers(),
    ]);

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

            {/* Tabs */}
            <Tabs defaultValue="kanban" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="kanban">Kanban View</TabsTrigger>
                    <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>

                <TabsContent value="kanban" className="space-y-4">
                    <LeadKanban leads={leads} />
                </TabsContent>

                <TabsContent value="list" className="space-y-4">
                    <div className="rounded-md border">
                        <div className="p-8 text-center text-muted-foreground">
                            List view coming soon
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
