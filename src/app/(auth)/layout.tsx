import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex-col justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-4">GoBuild CRM</h1>
                    <p className="text-blue-100 text-lg">
                        Streamline your construction material supply business
                    </p>
                </div>
                <div className="space-y-6 text-white">
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1">Lead Management</h3>
                            <p className="text-blue-100 text-sm">
                                Track and convert leads with powerful kanban boards
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1">Smart Quotations</h3>
                            <p className="text-blue-100 text-sm">
                                Generate professional quotes in seconds with PDF export
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1">Inventory Control</h3>
                            <p className="text-blue-100 text-sm">
                                Real-time stock tracking with automated low-stock alerts
                            </p>
                        </div>
                    </div>
                </div>
                <div className="text-blue-100 text-sm">
                    © 2025 GoBuild. All rights reserved.
                </div>
            </div>

            {/* Right side - Auth forms */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    );
}
