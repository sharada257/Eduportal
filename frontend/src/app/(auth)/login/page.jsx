"use client";

import React, { useEffect } from "react"
import "../../globals.css";
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { api, ENDPOINT } from "@/lib/api";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e) => {
        // try{
        //     if (!email || !password) {
        //         alert("Please fill the fields");
        //         return;
        //     }
        //     setIsLoading(true);
        //     const res = await api.post(ENDPOINT.login, {
        //         email: email,
        //         password: password,
        //     });
        //     console.log(res.data);
        //     if (res.status === 200) {
        //         router.push("/");
        //     }
        // } catch (err) {
        //     alert("Invalid creds");
        // } finally {
        //     setIsLoading(false);

        // }
        e.preventDefault()

        // ✅ For demo, accept any dummy email/password
        if (email && password) {
            // Optional: store dummy session
            localStorage.setItem("demoUser", JSON.stringify({ email }))

            // ✅ Redirect to home page
            router.push("/")
        } else {
            alert("Please enter email and password")
        }
    };


    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-semibold tracking-tight --color-foreground">Welcome back</h1>
                    <p className="mt-2 text-sm text-slate-600">Sign in to your account to continue</p>
                </div>

                <div className="mt-8 rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700">
                                Email address
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="border-slate-200 focus-visible:ring-slate-400"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-slate-700">
                                    Password
                                </Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-medium text-slate-600 hover:text-slate-800 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    className="border-slate-200 pr-10 focus-visible:ring-slate-400"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                                    ) : (
                                        <Eye className="h-4 w-4" aria-hidden="true" />
                                    )}
                                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                                </button>
                            </div>
                        </div>

                        <Button onClick={handleSubmit} type="submit" className="w-full bg-white text-gray-800 hover:bg-white" disabled={isLoading}>
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-white"></div>
                                    <span className="ml-2">Signing in...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    Sign in
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-white px-2 text-slate-500">Don't have an account?</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link href="/signup">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                >
                                    Create an account
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-500">
                    By signing in, you agree to our{" "}
                    <Link href="/terms" className="underline hover:text-slate-700">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline hover:text-slate-700">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </div>
    )
}
