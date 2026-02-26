import { getCustomers } from "@/actions/customers";
import { getLeads } from "@/actions/leads";
import { getInventoryItems } from "@/actions/inventory";
import { QuotationForm } from "@/components/quotations/quotation-form";

export default async function NewQuotationPage() {
    const [customers, leads, inventory] = await Promise.all([
        getCustomers(),
        getLeads(),
        getInventoryItems(),
    ]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Create New Quotation</h1>
                <p className="text-muted-foreground">
                    Add a new quotation for a customer
                </p>
            </div>

            {/* Form */}
            <QuotationForm
                customers={customers.map(c => ({ id: c.id, name: c.name }))}
                leads={leads.map(l => ({ id: l.id, title: l.title }))}
                inventory={inventory.map(i => ({
                    id: i.id,
                    name: i.name,
                    sellingPrice: i.sellingPrice,
                }))}
            />
        </div>
    );
}
