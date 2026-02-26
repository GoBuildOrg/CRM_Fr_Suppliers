"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AlertCircle,
    Loader2,
    Plus,
    X,
} from "lucide-react";
import { createOrder } from "@/actions/orders";
import { getCustomers } from "@/actions/customers";

interface Customer {
    id: string;
    name: string;
}

export function OrderForm({ customers }: { customers: Customer[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState([
        { itemName: "", description: "", quantity: 1, unit: "pcs", unitPrice: 0, total: 0 }
    ]);
    const [formData, setFormData] = useState({
        customerCompanyId: "",
        deliveryAddress: "",
        deliveryNotes: "",
        taxPercent: 18,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        
        // Auto-calculate total
        if (field === "quantity" || field === "unitPrice") {
            const qty = field === "quantity" ? value : newItems[index].quantity;
            const price = field === "unitPrice" ? value : newItems[index].unitPrice;
            newItems[index].total = qty * price;
        }
        
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { itemName: "", description: "", quantity: 1, unit: "pcs", unitPrice: 0, total: 0 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal * formData.taxPercent) / 100;
    const total = subtotal + taxAmount;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.customerCompanyId) {
            setError("Please select a customer");
            return;
        }

        if (items.length === 0 || items.some(item => !item.itemName || item.quantity === 0)) {
            setError("Please add valid items to the order");
            return;
        }

        setLoading(true);

        try {
            await createOrder({
                customerCompanyId: formData.customerCompanyId,
                deliveryAddress: formData.deliveryAddress || undefined,
                deliveryNotes: formData.deliveryNotes || undefined,
                items: items.map(item => ({
                    itemName: item.itemName,
                    description: item.description,
                    quantity: item.quantity,
                    unit: item.unit,
                    unitPrice: item.unitPrice,
                    total: item.total,
                })),
                subtotal,
                taxPercent: formData.taxPercent,
                taxAmount,
                discount: 0,
                total,
            });
            router.push("/orders");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Order</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Order Details</h3>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Customer *
                            </label>
                            <select
                                name="customerCompanyId"
                                value={formData.customerCompanyId}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select a customer</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Delivery Address
                            </label>
                            <input
                                type="text"
                                name="deliveryAddress"
                                value={formData.deliveryAddress}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter delivery address"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Delivery Notes
                            </label>
                            <textarea
                                name="deliveryNotes"
                                value={formData.deliveryNotes}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="Enter delivery notes"
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Order Items</h3>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={addItem}
                                className="gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Item
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                                    <div className="flex items-start justify-between">
                                        <h4 className="font-medium">Item {index + 1}</h4>
                                        {items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-medium mb-1">
                                                Item Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={item.itemName}
                                                onChange={(e) => handleItemChange(index, "itemName", e.target.value)}
                                                required
                                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Product name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">
                                                Quantity *
                                            </label>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value) || 0)}
                                                required
                                                min="0.01"
                                                step="0.01"
                                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">
                                                Unit
                                            </label>
                                            <input
                                                type="text"
                                                value={item.unit}
                                                onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="pcs"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-medium mb-1">
                                                Description
                                            </label>
                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Item description"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">
                                                Unit Price *
                                            </label>
                                            <input
                                                type="number"
                                                value={item.unitPrice}
                                                onChange={(e) => handleItemChange(index, "unitPrice", parseFloat(e.target.value) || 0)}
                                                required
                                                min="0"
                                                step="0.01"
                                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">
                                                Total
                                            </label>
                                            <div className="px-2 py-1.5 bg-gray-50 rounded text-sm font-medium">
                                                ₹{item.total.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Tax ({formData.taxPercent}%):</span>
                            <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Total:</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Order"
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
