"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createQuotation } from "@/actions/quotations";
import {
    AlertCircle,
    Loader2,
    Plus,
    X,
} from "lucide-react";

interface Customer {
    id: string;
    name: string;
}

interface Lead {
    id: string;
    title: string;
}

interface Inventory {
    id: string;
    name: string;
    sellingPrice: number;
}

export function QuotationForm({
    customers,
    leads = [],
    inventory = [],
}: {
    customers: Customer[];
    leads?: Lead[];
    inventory?: Inventory[];
}) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState([
        { itemName: "", description: "", quantity: 1, unit: "pcs", unitPrice: 0, inventoryId: "" }
    ]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        customerCompanyId: "",
        leadId: "",
        validUntil: "",
        taxPercent: 18,
        discount: 0,
        terms: "",
        notes: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "taxPercent" || name === "discount" ? parseFloat(value) || 0 : value,
        }));
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };

        // Auto-populate item name and price from inventory selection
        if (field === "inventoryId" && value) {
            const selectedInventory = inventory.find(inv => inv.id === value);
            if (selectedInventory) {
                newItems[index].itemName = selectedInventory.name;
                newItems[index].unitPrice = selectedInventory.sellingPrice;
            }
        }

        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { itemName: "", description: "", quantity: 1, unit: "pcs", unitPrice: 0, inventoryId: "" }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = (subtotal * formData.taxPercent) / 100;
    const total = subtotal + taxAmount - formData.discount;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.title.trim()) {
            setError("Quote title is required");
            return;
        }

        if (!formData.customerCompanyId) {
            setError("Please select a customer");
            return;
        }

        if (!formData.validUntil) {
            setError("Please set a valid until date");
            return;
        }

        if (items.length === 0 || items.some(item => !item.itemName || item.quantity <= 0 || item.unitPrice < 0)) {
            setError("Please add valid items to the quotation");
            return;
        }

        setLoading(true);

        try {
            await createQuotation({
                title: formData.title,
                description: formData.description || undefined,
                customerCompanyId: formData.customerCompanyId,
                leadId: formData.leadId || undefined,
                validUntil: formData.validUntil,
                taxPercent: formData.taxPercent,
                discount: formData.discount,
                terms: formData.terms || undefined,
                notes: formData.notes || undefined,
                items: items.map(item => ({
                    itemName: item.itemName,
                    description: item.description,
                    quantity: item.quantity,
                    unit: item.unit,
                    unitPrice: item.unitPrice,
                    inventoryId: item.inventoryId || undefined,
                })),
            });

            toast({
                title: "Success",
                description: "Quotation created successfully",
            });

            router.push("/quotations");
            router.refresh();
        } catch (err) {
            toast({
                title: "Error",
                description: err instanceof Error ? err.message : "Failed to create quotation",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Quote Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">Quote Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., RCC Supply Quote"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="customerCompanyId">Customer *</Label>
                            <Select
                                value={formData.customerCompanyId}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, customerCompanyId: value })
                                }
                                disabled={loading}
                            >
                                <SelectTrigger id="customerCompanyId">
                                    <SelectValue placeholder="Select a customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {customers.map((customer) => (
                                        <SelectItem key={customer.id} value={customer.id}>
                                            {customer.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="leadId">Related Lead (Optional)</Label>
                            <Select
                                value={formData.leadId}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, leadId: value })
                                }
                                disabled={loading}
                            >
                                <SelectTrigger id="leadId">
                                    <SelectValue placeholder="Select a lead" />
                                </SelectTrigger>
                                <SelectContent>
                                    {leads.map((lead) => (
                                        <SelectItem key={lead.id} value={lead.id}>
                                            {lead.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="validUntil">Valid Until *</Label>
                            <Input
                                id="validUntil"
                                name="validUntil"
                                type="date"
                                value={formData.validUntil}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Add any additional details about this quotation"
                            disabled={loading}
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Quote Items */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Quote Items</CardTitle>
                    <Button
                        type="button"
                        onClick={addItem}
                        variant="outline"
                        size="sm"
                        disabled={loading}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="border rounded-lg p-4 space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium">Item {index + 1}</h4>
                                {items.length > 1 && (
                                    <Button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        variant="ghost"
                                        size="sm"
                                        disabled={loading}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor={`inventory-${index}`}>From Inventory (Optional)</Label>
                                    <Select
                                        value={item.inventoryId}
                                        onValueChange={(value) =>
                                            handleItemChange(index, "inventoryId", value)
                                        }
                                        disabled={loading}
                                    >
                                        <SelectTrigger id={`inventory-${index}`}>
                                            <SelectValue placeholder="Select from inventory" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {inventory.map((inv) => (
                                                <SelectItem key={inv.id} value={inv.id}>
                                                    {inv.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor={`itemName-${index}`}>Item Name *</Label>
                                    <Input
                                        id={`itemName-${index}`}
                                        value={item.itemName}
                                        onChange={(e) =>
                                            handleItemChange(index, "itemName", e.target.value)
                                        }
                                        placeholder="e.g., Portland Cement 50kg"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor={`description-${index}`}>Description</Label>
                                <Textarea
                                    id={`description-${index}`}
                                    value={item.description}
                                    onChange={(e) =>
                                        handleItemChange(index, "description", e.target.value)
                                    }
                                    placeholder="Item description"
                                    disabled={loading}
                                    rows={2}
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`quantity-${index}`}>Quantity *</Label>
                                    <Input
                                        id={`quantity-${index}`}
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            handleItemChange(index, "quantity", parseFloat(e.target.value) || 0)
                                        }
                                        step="0.01"
                                        min="0.01"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`unit-${index}`}>Unit *</Label>
                                    <Input
                                        id={`unit-${index}`}
                                        value={item.unit}
                                        onChange={(e) =>
                                            handleItemChange(index, "unit", e.target.value)
                                        }
                                        placeholder="e.g., pcs, bags, kg"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`unitPrice-${index}`}>Unit Price *</Label>
                                    <Input
                                        id={`unitPrice-${index}`}
                                        type="number"
                                        value={item.unitPrice}
                                        onChange={(e) =>
                                            handleItemChange(index, "unitPrice", parseFloat(e.target.value) || 0)
                                        }
                                        step="0.01"
                                        min="0"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`total-${index}`}>Total</Label>
                                    <Input
                                        id={`total-${index}`}
                                        type="number"
                                        value={(item.quantity * item.unitPrice).toFixed(2)}
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Totals */}
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="taxPercent">Tax Percentage (%)</Label>
                                <Input
                                    id="taxPercent"
                                    name="taxPercent"
                                    type="number"
                                    value={formData.taxPercent}
                                    onChange={handleChange}
                                    step="0.1"
                                    min="0"
                                    max="100"
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="discount">Discount Amount (₹)</Label>
                                <Input
                                    id="discount"
                                    name="discount"
                                    type="number"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span>Tax Amount ({formData.taxPercent}%):</span>
                            <span>₹{taxAmount.toFixed(2)}</span>
                        </div>

                        <div className="border-t pt-3 flex justify-between font-bold">
                            <span>Total:</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
                <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="terms">Terms & Conditions (Optional)</Label>
                        <Textarea
                            id="terms"
                            name="terms"
                            value={formData.terms}
                            onChange={handleChange}
                            placeholder="e.g., Payment terms, delivery conditions, etc."
                            disabled={loading}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Internal Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Internal notes about this quotation"
                            disabled={loading}
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex gap-4">
                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? "Creating..." : "Create Quotation"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}
