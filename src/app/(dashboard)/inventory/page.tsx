import { getInventoryItems, getLowStockItems } from "@/actions/inventory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Plus, AlertTriangle, Package, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default async function InventoryPage() {
    const [items, lowStockItems] = await Promise.all([
        getInventoryItems(),
        getLowStockItems(),
    ]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Inventory</h1>
                    <p className="text-muted-foreground">
                        Manage your construction materials stock
                    </p>
                </div>
                <Link href="/inventory/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                    </Button>
                </Link>
            </div>

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                            <CardTitle className="text-orange-900">Low Stock Alert</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-orange-800">
                            {lowStockItems.length} item{lowStockItems.length > 1 ? "s are" : " is"} below minimum stock level
                        </p>
                        <div className="mt-2 space-y-1">
                            {lowStockItems.slice(0, 3).map((item) => (
                                <div key={item.id} className="text-sm text-orange-700">
                                    • {item.name} ({item.currentStock} {item.unit})
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Inventory Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Current Stock</TableHead>
                                <TableHead className="text-right">Selling Price</TableHead>
                                <TableHead>Shop</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item) => {
                                const isLowStock = item.currentStock <= item.minStockLevel;

                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="w-12 h-12 relative rounded overflow-hidden border bg-muted">
                                                {item.primaryImage || (item.images && item.images.length > 0) ? (
                                                    <img
                                                        src={item.primaryImage || item.images[0]}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/inventory/${item.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {item.name}
                                            </Link>
                                            {item.brand && (
                                                <p className="text-xs text-muted-foreground">
                                                    {item.brand}
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{item.category}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="font-medium">
                                                {item.currentStock} {item.unit}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Min: {item.minStockLevel}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatCurrency(item.sellingPrice)}
                                        </TableCell>
                                        <TableCell>
                                            {item.isVisibleOnShop ? (
                                                <Badge variant="secondary" className="gap-1">
                                                    <Eye className="h-3 w-3" />
                                                    Visible
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="gap-1">
                                                    <EyeOff className="h-3 w-3" />
                                                    Hidden
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {isLowStock ? (
                                                <Badge variant="destructive" className="gap-1">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    Low Stock
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="gap-1">
                                                    <Package className="h-3 w-3" />
                                                    In Stock
                                                </Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                        No inventory items found. Add your first item to get started.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
