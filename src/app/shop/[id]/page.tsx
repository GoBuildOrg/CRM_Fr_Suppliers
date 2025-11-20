import { getPublicInventoryById } from "@/actions/inventory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import {
    ArrowLeft,
    Package,
    MapPin,
    Mail,
    Phone,
    Building2,
    Tag,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ShopProductPageProps {
    params: {
        id: string;
    };
}

export default async function ShopProductPage({ params }: ShopProductPageProps) {
    let item;

    try {
        item = await getPublicInventoryById(params.id);
    } catch (error) {
        notFound();
    }

    // Parse specifications
    let specs: Record<string, any> = {};
    try {
        specs = item.specifications ? JSON.parse(item.specifications) : {};
    } catch (e) {
        specs = {};
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">GoBuild Supply</h1>
                            <p className="text-sm text-muted-foreground">
                                Premium Construction Materials
                            </p>
                        </div>
                        <Link href="/shop">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Shop
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 md:grid-cols-2">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-square relative rounded-lg overflow-hidden border bg-muted">
                            {item.primaryImage ||
                                (item.images && item.images.length > 0) ? (
                                <img
                                    src={item.primaryImage || item.images[0]}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-24 w-24 text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Grid */}
                        {item.images && item.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {item.images.map((img: string, idx: number) => (
                                    <div
                                        key={idx}
                                        className="aspect-square relative rounded overflow-hidden border cursor-pointer hover:border-primary transition-colors"
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

                    {/* Product Details */}
                    <div className="space-y-6">
                        <div>
                            <Badge variant="outline" className="mb-2">
                                {item.category}
                            </Badge>
                            <h1 className="text-4xl font-bold mb-2">{item.name}</h1>
                            {item.brand && (
                                <p className="text-lg text-muted-foreground">
                                    Brand: {item.brand}
                                </p>
                            )}
                        </div>

                        <div className="flex items-baseline gap-4">
                            <div>
                                <p className="text-4xl font-bold">
                                    {formatCurrency(item.sellingPrice)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    per {item.unit}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        {/* Description */}
                        <div>
                            <h3 className="font-semibold text-lg mb-2">
                                Product Description
                            </h3>
                            <p className="text-muted-foreground whitespace-pre-line">
                                {item.description || item.shortDescription || "No description available"}
                            </p>
                        </div>

                        {/* Specifications */}
                        {Object.keys(specs).length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold text-lg mb-4">
                                        Technical Specifications
                                    </h3>
                                    <div className="space-y-2">
                                        {Object.entries(specs).map(([key, value]) => (
                                            <div
                                                key={key}
                                                className="flex justify-between py-2 border-b"
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

                        <Separator />

                        {/* Contact for Quote */}
                        <Card className="bg-primary/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Request a Quote
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Interested in this product? Contact our supplier for
                                    pricing, availability, and bulk orders.
                                </p>
                                <Button size="lg" className="w-full">
                                    <Mail className="mr-2 h-4 w-4" />
                                    Contact Supplier
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Supplier Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5" />
                                    Supplier Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">
                                        {item.supplierCompany.name}
                                    </span>
                                </div>
                                {item.supplierCompany.email && (
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <a
                                            href={`mailto:${item.supplierCompany.email}`}
                                            className="text-sm hover:underline"
                                        >
                                            {item.supplierCompany.email}
                                        </a>
                                    </div>
                                )}
                                {item.supplierCompany.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <a
                                            href={`tel:${item.supplierCompany.phone}`}
                                            className="text-sm hover:underline"
                                        >
                                            {item.supplierCompany.phone}
                                        </a>
                                    </div>
                                )}
                                {(item.supplierCompany.city ||
                                    item.supplierCompany.state) && (
                                        <div className="flex items-center gap-3">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                {[
                                                    item.supplierCompany.city,
                                                    item.supplierCompany.state,
                                                ]
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </span>
                                        </div>
                                    )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
