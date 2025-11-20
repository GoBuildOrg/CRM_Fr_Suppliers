import { getPublicInventory } from "@/actions/inventory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { Search, Package, Mail } from "lucide-react";
import Link from "next/link";

export default async function ShopPage({
    searchParams,
}: {
    searchParams: { category?: string; search?: string };
}) {
    const items = await getPublicInventory(
        searchParams.category,
        searchParams.search
    );

    // Get unique categories
    const categories = Array.from(new Set(items.map((item) => item.category)));

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">GoBuild Supply</h1>
                            <p className="text-sm text-muted-foreground">
                                Premium Construction Materials
                            </p>
                        </div>
                        <Link href="/signin">
                            <Button variant="outline">Supplier Login</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">
                        Quality Construction Materials
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Browse our catalog of premium construction supplies for your next
                        project
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-8 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="pl-10"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 overflow-x-auto">
                        <Link href="/shop">
                            <Badge
                                variant={
                                    !searchParams.category ? "default" : "outline"
                                }
                                className="cursor-pointer"
                            >
                                All
                            </Badge>
                        </Link>
                        {categories.map((category) => (
                            <Link
                                key={category}
                                href={`/shop?category=${category}`}
                            >
                                <Badge
                                    variant={
                                        searchParams.category === category
                                            ? "default"
                                            : "outline"
                                    }
                                    className="cursor-pointer"
                                >
                                    {category}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                {items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <Link key={item.id} href={`/shop/${item.id}`}>
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                                    {/* Product Image */}
                                    <div className="aspect-square relative bg-muted overflow-hidden">
                                        {item.primaryImage ||
                                            (item.images && item.images.length > 0) ? (
                                            <img
                                                src={
                                                    item.primaryImage ||
                                                    item.images[0]
                                                }
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="h-16 w-16 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>

                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg line-clamp-2">
                                                    {item.name}
                                                </CardTitle>
                                                {item.brand && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.brand}
                                                    </p>
                                                )}
                                            </div>
                                            <Badge variant="outline" className="ml-2">
                                                {item.category}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                        {item.shortDescription && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                {item.shortDescription}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-2xl font-bold">
                                                    {formatCurrency(item.sellingPrice)}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    per {item.unit}
                                                </p>
                                            </div>
                                            <Button size="sm" variant="outline">
                                                View Details
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <Card className="py-16">
                        <CardContent className="text-center">
                            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-xl font-semibold mb-2">
                                No products found
                            </h3>
                            <p className="text-muted-foreground">
                                Try adjusting your search or filters
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Footer CTA */}
                <div className="mt-16 p-8 bg-primary/5 rounded-lg text-center">
                    <h3 className="text-2xl font-bold mb-4">
                        Ready to Order?
                    </h3>
                    <p className="text-muted-foreground mb-6">
                        Contact us for bulk pricing and custom orders
                    </p>
                    <Button size="lg">
                        <Mail className="mr-2 h-4 w-4" />
                        Contact Supplier
                    </Button>
                </div>
            </div>
        </div>
    );
}
