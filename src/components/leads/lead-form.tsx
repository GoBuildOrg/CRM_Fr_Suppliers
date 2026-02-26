"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { createLead, updateLead } from "@/actions/leads";
import { Loader2 } from "lucide-react";

interface LeadFormProps {
    customers: Array<{ id: string; name: string }>;
    teamMembers: Array<{ id: string; name: string }>;
    initialData?: Record<string, any>;
}

export function LeadForm({ customers, teamMembers, initialData }: LeadFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        status: initialData?.status || "NEW",
        estimatedValue: initialData?.estimatedValue?.toString() || "",
        probability: initialData?.probability?.toString() || "",
        expectedCloseDate: initialData?.expectedCloseDate
            ? new Date(initialData.expectedCloseDate).toISOString().split("T")[0]
            : "",
        source: initialData?.source || "",
        customerCompanyId: initialData?.customerCompanyId || "",
        assignedToId: initialData?.assignedToId || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = {
                ...formData,
                estimatedValue: formData.estimatedValue
                    ? parseFloat(formData.estimatedValue)
                    : undefined,
                probability: formData.probability
                    ? parseInt(formData.probability)
                    : undefined,
            };

            if (initialData?.id) {
                await updateLead({ ...data, id: initialData.id });
                toast({
                    title: "Success",
                    description: "Lead updated successfully",
                });
            } else {
                await createLead(data);
                toast({
                    title: "Success",
                    description: "Lead created successfully",
                });
            }

            router.push("/leads");
            router.refresh();
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 max-w-2xl">
                {/* Title */}
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title">Lead Title *</Label>
                    <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="New construction project"
                        required
                        disabled={isLoading}
                    />
                </div>

                {/* Customer */}
                <div className="space-y-2">
                    <Label htmlFor="customer">Customer *</Label>
                    <Select
                        value={formData.customerCompanyId}
                        onValueChange={(value) =>
                            setFormData({ ...formData, customerCompanyId: value })
                        }
                        disabled={isLoading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select customer" />
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

                {/* Status */}
                <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                        value={formData.status}
                        onValueChange={(value) =>
                            setFormData({ ...formData, status: value })
                        }
                        disabled={isLoading}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="NEW">New</SelectItem>
                            <SelectItem value="CONTACTED">Contacted</SelectItem>
                            <SelectItem value="QUALIFIED">Qualified</SelectItem>
                            <SelectItem value="PROPOSAL">Proposal</SelectItem>
                            <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
                            <SelectItem value="WON">Won</SelectItem>
                            <SelectItem value="LOST">Lost</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Estimated Value */}
                <div className="space-y-2">
                    <Label htmlFor="estimatedValue">Estimated Value (₹)</Label>
                    <Input
                        id="estimatedValue"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.estimatedValue}
                        onChange={(e) =>
                            setFormData({ ...formData, estimatedValue: e.target.value })
                        }
                        placeholder="500000"
                        disabled={isLoading}
                    />
                </div>

                {/* Probability */}
                <div className="space-y-2">
                    <Label htmlFor="probability">Probability (%)</Label>
                    <Input
                        id="probability"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.probability}
                        onChange={(e) =>
                            setFormData({ ...formData, probability: e.target.value })
                        }
                        placeholder="50"
                        disabled={isLoading}
                    />
                </div>

                {/* Expected Close Date */}
                <div className="space-y-2">
                    <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                    <Input
                        id="expectedCloseDate"
                        type="date"
                        value={formData.expectedCloseDate}
                        onChange={(e) =>
                            setFormData({ ...formData, expectedCloseDate: e.target.value })
                        }
                        disabled={isLoading}
                    />
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Additional details about this lead..."
                        rows={3}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Lead" : "Create Lead"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}
