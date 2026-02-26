import { getCustomers, getTeamMembers } from "@/actions/leads";
import { LeadForm } from "@/components/leads/lead-form";

export default async function NewLeadPage() {
    const [customers, teamMembers] = await Promise.all([
        getCustomers(),
        getTeamMembers(),
    ]);

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold">Create New Lead</h1>
                <p className="text-muted-foreground">
                    Add a new sales opportunity to your pipeline
                </p>
            </div>

            <LeadForm customers={customers} teamMembers={teamMembers} />
        </div>
    );
}
