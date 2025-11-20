import { getInventoryById } from "@/actions/inventory";
import { InventoryForm } from "@/components/inventory/inventory-form";
import { notFound } from "next/navigation";

interface EditInventoryPageProps {
    params: {
        id: string;
    };
}

export default async function EditInventoryPage({
    params,
}: EditInventoryPageProps) {
    let item;

    try {
        item = await getInventoryById(params.id);
    } catch (error) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Edit Item</h1>
                <p className="text-muted-foreground">
                    Update product information for {item.name}
                </p>
            </div>

            <InventoryForm mode="edit" initialData={item} />
        </div>
    );
}
