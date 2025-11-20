import { getCustomers, getTeamMembers } from "@/actions/leads";
import { LeadForm } from "@/components/leads/lead-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewLeadPage() {
    const [customers, teamMembers] = await Promise.all([
        getCustomers(),
        getTeamMembers(),
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Create New Lead</h1>
                <p className="text-muted-foreground">
                    Add a new sales opportunity to your pipeline
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lead Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <LeadForm customers={customers} teamMembers={teamMembers} />
                </CardContent>
            </Card>
        </div>
    );
}
