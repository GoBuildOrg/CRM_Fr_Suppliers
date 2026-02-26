"use client";

import { useState } from "react";
import { Save, Mail, Lock, Bell, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        email: "user@example.com",
        companyName: "GoBuild Inc",
        language: "en",
        theme: "light",
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: false,
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (key: string, value: any) => {
        setSettings((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate saving
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSaving(false);
    };

    const settingsSections = [
        {
            title: "Account Settings",
            icon: Mail,
            items: [
                {
                    label: "Email Address",
                    key: "email",
                    type: "email",
                    description: "Your primary email for notifications",
                },
                {
                    label: "Company Name",
                    key: "companyName",
                    type: "text",
                    description: "Your organization name",
                },
            ],
        },
        {
            title: "Preferences",
            icon: Palette,
            items: [
                {
                    label: "Language",
                    key: "language",
                    type: "select",
                    description: "Preferred language",
                    options: [
                        { value: "en", label: "English" },
                        { value: "es", label: "Español" },
                        { value: "fr", label: "Français" },
                    ],
                },
                {
                    label: "Theme",
                    key: "theme",
                    type: "select",
                    description: "Color theme",
                    options: [
                        { value: "light", label: "Light" },
                        { value: "dark", label: "Dark" },
                    ],
                },
            ],
        },
        {
            title: "Notifications",
            icon: Bell,
            items: [
                {
                    label: "Email Notifications",
                    key: "emailNotifications",
                    type: "toggle",
                    description: "Receive email notifications",
                },
                {
                    label: "Push Notifications",
                    key: "pushNotifications",
                    type: "toggle",
                    description: "Receive push notifications",
                },
                {
                    label: "Marketing Emails",
                    key: "marketingEmails",
                    type: "toggle",
                    description: "Receive marketing communications",
                },
            ],
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account and preferences
                </p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
                {settingsSections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Card key={section.title} className="p-6">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                                <Icon className="h-5 w-5 text-primary" />
                                <h2 className="text-xl font-semibold">
                                    {section.title}
                                </h2>
                            </div>

                            <div className="space-y-6">
                                {section.items.map((item) => (
                                    <div
                                        key={item.key}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex-1">
                                            <Label className="text-base font-medium">
                                                {item.label}
                                            </Label>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {item.description}
                                            </p>
                                        </div>

                                        <div className="w-48">
                                            {item.type === "text" || item.type === "email" ? (
                                                <Input
                                                    type={item.type}
                                                    value={settings[item.key as keyof typeof settings]}
                                                    onChange={(e) =>
                                                        handleChange(item.key, e.target.value)
                                                    }
                                                    className="w-full"
                                                />
                                            ) : item.type === "select" ? (
                                                <select
                                                    value={settings[item.key as keyof typeof settings]}
                                                    onChange={(e) =>
                                                        handleChange(item.key, e.target.value)
                                                    }
                                                    className="w-full px-3 py-2 border rounded-md bg-background"
                                                >
                                                    {(item.options || []).map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : item.type === "toggle" ? (
                                                <button
                                                    onClick={() =>
                                                        handleChange(
                                                            item.key,
                                                            !settings[item.key as keyof typeof settings]
                                                        )
                                                    }
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                        settings[item.key as keyof typeof settings]
                                                            ? "bg-primary"
                                                            : "bg-muted"
                                                    }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                            settings[item.key as keyof typeof settings]
                                                                ? "translate-x-5"
                                                                : "translate-x-1"
                                                        }`}
                                                    />
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving} size="lg">
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
}
