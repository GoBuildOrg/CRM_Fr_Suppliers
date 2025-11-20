import { InventoryForm } from "@/components/inventory/inventory-form";

export default function NewInventoryPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Add New Item</h1>
                <p className="text-muted-foreground">
                    Add a new product to your inventory
                </p>
            </div>

            <InventoryForm mode="create" />
        </div>
    );
}
