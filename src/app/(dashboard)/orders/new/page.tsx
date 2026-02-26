import { getCustomers } from "@/actions/customers";
import { OrderForm } from "@/components/orders/order-form";

export default async function NewOrderPage() {
    const customers = await getCustomers();

    // Transform customers to only include id and name
    const customerOptions = customers.map((c: any) => ({ 
        id: c.id, 
        name: c.name 
    }));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Create New Order</h1>
                <p className="text-muted-foreground">
                    Create a new order for a customer
                </p>
            </div>
            <div className="max-w-4xl">
                <OrderForm customers={customerOptions} />
            </div>
        </div>
    );
}
