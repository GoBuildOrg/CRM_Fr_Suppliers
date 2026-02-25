"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "./image-upload";
import { useToast } from "@/hooks/use-toast";
import { createInventoryItem, updateInventoryItem } from "@/actions/inventory";
import { Loader2 } from "lucide-react";

interface InventoryFormProps {
    mode: "create" | "edit";
    initialData?: Record<string, any>;
}

const CATEGORIES = [
    "Cement",
    "Steel",
    "Sand",
    "Gravel",
    "Bricks",
    "Concrete",
    "Timber",
    "Paint",
    "Plumbing",
    "Electrical",
    "Hardware",
    "Other",
];

const UNITS = [
    "bag",
    "ton",
    "kg",
    "cubic meter",
    "cubic feet",
    "piece",
    "box",
    "bundle",
    "roll",
    "liter",
    "gallon",
];

export function InventoryForm({ mode, initialData }: InventoryFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        sku: initialData?.sku || "",
        name: initialData?.name || "",
        description: initialData?.description || "",
        category: initialData?.category || "",
        unit: initialData?.unit || "",
        currentStock: initialData?.currentStock || 0,
        minStockLevel: initialData?.minStockLevel || 0,
        maxStockLevel: initialData?.maxStockLevel || 0,
        costPrice: initialData?.costPrice || 0,
        sellingPrice: initialData?.sellingPrice || 0,
        images: initialData?.images || [],
        primaryImage: initialData?.primaryImage || "",
        isVisibleOnShop: initialData?.isVisibleOnShop || false,
        shortDescription: initialData?.shortDescription || "",
        brand: initialData?.brand || "",
        specifications: initialData?.specifications || "",
    });

    const handleInputChange = (
        field: string,
        value: string | number | boolean
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImagesChange = (images: string[], primaryImage?: string) => {
        setFormData((prev) => ({
            ...prev,
            images,
            primaryImage: primaryImage || images[0] || "",
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === "create") {
                await createInventoryItem(formData);
                toast({
                    title: "Success",
                    description: "Inventory item created successfully",
                });
            } else {
                await updateInventoryItem({
                    ...formData,
                    id: initialData.id,
                });
                toast({
                    title: "Success",
                    description: "Inventory item updated successfully",
                });
            }

            router.push("/inventory");
            router.refresh();
        } catch (error: unknown) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to save inventory item",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="images">Images</TabsTrigger>
                    <TabsTrigger value="shop">Shop Details</TabsTrigger>
                </TabsList>

                {/* Basic Information Tab */}
                <TabsContent value="basic" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* SKU */}
                            <div className="grid gap-2">
                                <Label htmlFor="sku">SKU *</Label>
                                <Input
                                    id="sku"
                                    value={formData.sku}
                                    onChange={(e) => handleInputChange("sku", e.target.value)}
                                    placeholder="e.g., CEM-001"
                                    required
                                    disabled={mode === "edit"}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Unique product code (cannot be changed after creation)
                                </p>
                            </div>

                            {/* Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Product Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    placeholder="e.g., Premium Portland Cement"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="grid gap-2">
                                <Label htmlFor="description">Full Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    placeholder="Detailed product description, features, specifications..."
                                    rows={4}
                                />
                            </div>

                            {/* Category and Brand */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => handleInputChange("category", value)}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="brand">Brand</Label>
                                    <Input
                                        id="brand"
                                        value={formData.brand}
                                        onChange={(e) => handleInputChange("brand", e.target.value)}
                                        placeholder="e.g., ACC, UltraTech"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Stock Management</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Unit */}
                            <div className="grid gap-2">
                                <Label htmlFor="unit">Unit of Measurement *</Label>
                                <Select
                                    value={formData.unit}
                                    onValueChange={(value) => handleInputChange("unit", value)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {UNITS.map((unit) => (
                                            <SelectItem key={unit} value={unit}>
                                                {unit}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Stock Levels */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="currentStock">Current Stock *</Label>
                                    <Input
                                        id="currentStock"
                                        type="number"
                                        step="0.01"
                                        value={formData.currentStock}
                                        onChange={(e) =>
                                            handleInputChange("currentStock", parseFloat(e.target.value) || 0)
                                        }
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="minStockLevel">Min Level *</Label>
                                    <Input
                                        id="minStockLevel"
                                        type="number"
                                        step="0.01"
                                        value={formData.minStockLevel}
                                        onChange={(e) =>
                                            handleInputChange("minStockLevel", parseFloat(e.target.value) || 0)
                                        }
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="maxStockLevel">Max Level</Label>
                                    <Input
                                        id="maxStockLevel"
                                        type="number"
                                        step="0.01"
                                        value={formData.maxStockLevel}
                                        onChange={(e) =>
                                            handleInputChange("maxStockLevel", parseFloat(e.target.value) || 0)
                                        }
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="costPrice">Cost Price *</Label>
                                    <Input
                                        id="costPrice"
                                        type="number"
                                        step="0.01"
                                        value={formData.costPrice}
                                        onChange={(e) =>
                                            handleInputChange("costPrice", parseFloat(e.target.value) || 0)
                                        }
                                        placeholder="0.00"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Your purchase/manufacturing cost
                                    </p>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="sellingPrice">Selling Price *</Label>
                                    <Input
                                        id="sellingPrice"
                                        type="number"
                                        step="0.01"
                                        value={formData.sellingPrice}
                                        onChange={(e) =>
                                            handleInputChange("sellingPrice", parseFloat(e.target.value) || 0)
                                        }
                                        placeholder="0.00"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Price you sell to customers
                                    </p>
                                </div>
                            </div>

                            {formData.sellingPrice > 0 && formData.costPrice > 0 && (
                                <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm font-medium">
                                        Profit Margin:{" "}
                                        <span className="text-primary">
                                            {(
                                                ((formData.sellingPrice - formData.costPrice) /
                                                    formData.sellingPrice) *
                                                100
                                            ).toFixed(2)}
                                            %
                                        </span>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Profit per unit: ₹
                                        {(formData.sellingPrice - formData.costPrice).toFixed(2)}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Images Tab */}
                <TabsContent value="images" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Images</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Upload high-quality images of your product. The first image (or marked as primary)
                                will be the main display image.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <ImageUpload
                                images={formData.images}
                                primaryImage={formData.primaryImage}
                                onChange={handleImagesChange}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Shop Details Tab */}
                <TabsContent value="shop" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Public Shop Settings</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Control how this product appears on your public shop page
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Visibility Toggle */}
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <Label htmlFor="isVisibleOnShop" className="text-base font-medium">
                                        Show on Shop Page
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Make this product visible to customers on your public shop
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    id="isVisibleOnShop"
                                    checked={formData.isVisibleOnShop}
                                    onChange={(e) =>
                                        handleInputChange("isVisibleOnShop", e.target.checked)
                                    }
                                    className="h-5 w-5"
                                />
                            </div>

                            {/* Short Description */}
                            <div className="grid gap-2">
                                <Label htmlFor="shortDescription">Short Description</Label>
                                <Textarea
                                    id="shortDescription"
                                    value={formData.shortDescription}
                                    onChange={(e) =>
                                        handleInputChange("shortDescription", e.target.value)
                                    }
                                    placeholder="Brief description for product cards (max 200 characters)"
                                    rows={3}
                                    maxLength={200}
                                />
                                <p className="text-xs text-muted-foreground text-right">
                                    {formData.shortDescription.length}/200
                                </p>
                            </div>

                            {/* Specifications */}
                            <div className="grid gap-2">
                                <Label htmlFor="specifications">Technical Specifications</Label>
                                <Textarea
                                    id="specifications"
                                    value={formData.specifications}
                                    onChange={(e) =>
                                        handleInputChange("specifications", e.target.value)
                                    }
                                    placeholder='Add specs in JSON format, e.g.: {"Grade": "43", "Strength": "53 MPa"}'
                                    rows={4}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Optional: Add technical specs that customers might need
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Separator />

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/inventory")}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {mode === "create" ? "Create Item" : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}
