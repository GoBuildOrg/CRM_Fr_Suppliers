import { CustomerForm } from "@/components/customers/customer-form";

export default function NewCustomerPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Add New Customer</h1>
                <p className="text-muted-foreground">
                    Create a new customer company in the system
                </p>
            </div>
            <div className="max-w-2xl">
                <CustomerForm />
            </div>
        </div>
    );
}
