import Link from "next/link";
import { SignInForm } from "@/components/auth/signin-form";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";
import { Separator } from "@/components/ui/separator";

export default function SignInPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground">
                    Sign in to your GoBuild CRM account
                </p>
            </div>

            <div className="space-y-4">
                <GoogleSignInButton />

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <SignInForm />
            </div>

            <div className="text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link
                    href="/signup"
                    className="font-medium text-primary hover:underline"
                >
                    Sign up
                </Link>
            </div>
        </div>
    );
}
