import { getInventoryById } from "@/actions/inventory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import {
    ArrowLeft,
    Edit,
    Package,
    AlertTriangle,
    DollarSign,
    TrendingUp,
    Tag,
    Boxes,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface InventoryDetailsPageProps {
    params: {
        id: string;
    };
}

export default async function InventoryDetailsPage({
    params,
}: InventoryDetailsPageProps) {
    let item;

    try {
        item = await getInventoryById(params.id);
    } catch (error) {
        notFound();
    }

    const isLowStock = item.currentStock <= item.minStockLevel;
    const profitMargin =
        item.sellingPrice > 0
            ? ((item.sellingPrice - item.costPrice) / item.sellingPrice) * 100
            : 0;
    const profitPerUnit = item.sellingPrice - item.costPrice;

    // Parse specifications if available
    let specs: Record<string, any> = {};
    try {
        specs = item.specifications ? JSON.parse(item.specifications) : {};
    } catch (e) {
        specs = {};
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/inventory">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{item.name}</h1>
                        <p className="text-muted-foreground">SKU: {item.sku}</p>
                    </div>
                </div>
                <Link href={`/inventory/${item.id}/edit`}>
                    <Button>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Item
                    </Button>
                </Link>
            </div>

            {/* Status Badge */}
            <div className="flex gap-2">
                {isLowStock && (
                    <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Low Stock
                    </Badge>
                )}
                {item.isVisibleOnShop && (
                    <Badge variant="secondary">Visible on Shop</Badge>
                )}
                <Badge variant="outline">{item.category}</Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Images */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {item.images && item.images.length > 0 ? (
                            <div className="space-y-4">
                                {/* Primary Image */}
                                <div className="aspect-square relative rounded-lg overflow-hidden border">
                                    <img
                                        src={item.primaryImage || item.images[0]}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Thumbnail Grid */}
                                {item.images.length > 1 && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {item.images.map((img: string, idx: number) => (
                                            <div
                                                key={idx}
                                                className="aspect-square relative rounded overflow-hidden border"
                                            >
                                                <img
                                                    src={img}
                                                    alt={`${item.name} ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="aspect-square flex items-center justify-center bg-muted rounded-lg">
                                <Package className="h-16 w-16 text-muted-foreground" />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Stock & Pricing Stats */}
                <div className="space-y-4">
                    {/* Stock Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Boxes className="h-5 w-5" />
                                Stock Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Current</p>
                                    <p className="text-2xl font-bold">
                                        {item.currentStock}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.unit}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Min Level</p>
                                    <p className="text-2xl font-bold">
                                        {item.minStockLevel}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.unit}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Max Level</p>
                                    <p className="text-2xl font-bold">
                                        {item.maxStockLevel || "-"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.maxStockLevel ? item.unit : ""}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Pricing
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Cost Price
                                </span>
                                <span className="font-medium">
                                    {formatCurrency(item.costPrice)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Selling Price
                                </span>
                                <span className="font-bold text-lg">
                                    {formatCurrency(item.sellingPrice)}
                                </span>
                            </div>
                            <Separator />
                            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                        Profit Margin
                                    </span>
                                    <span className="font-bold text-green-700 dark:text-green-300">
                                        {profitMargin.toFixed(2)}%
                                    </span>
                                </div>
                                <div className="text-xs text-green-600 dark:text-green-400">
                                    {formatCurrency(profitPerUnit)} per {item.unit}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Description & Details */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {item.description ? (
                            <p className="text-sm whitespace-pre-line">
                                {item.description}
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No description provided
                            </p>
                        )}

                        {item.shortDescription && (
                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                    Shop Description
                                </p>
                                <p className="text-sm">{item.shortDescription}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Additional Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {item.brand && (
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Brand</span>
                                <span className="font-medium">{item.brand}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Category</span>
                            <Badge variant="outline">{item.category}</Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Unit</span>
                            <span className="font-medium">{item.unit}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <Badge variant={item.isActive ? "secondary" : "outline"}>
                                {item.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>

                        {Object.keys(specs).length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <p className="text-sm font-medium mb-2">
                                        Specifications
                                    </p>
                                    <div className="space-y-2">
                                        {Object.entries(specs).map(([key, value]) => (
                                            <div
                                                key={key}
                                                className="flex justify-between text-sm"
                                            >
                                                <span className="text-muted-foreground">
                                                    {key}
                                                </span>
                                                <span className="font-medium">
                                                    {String(value)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
