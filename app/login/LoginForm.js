"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [emailLoading, setEmailLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setEmailLoading(true);
        setError(null);

        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        const data = await res.json();
        setEmailLoading(false);

        if (res.ok) {
            await signIn("credentials", {
                email: credentials.email,
                password: credentials.password,
                redirect: false,
            });
            const callbackUrl = searchParams.get("callbackUrl") || "/";
            router.push(callbackUrl);
        } else {
            setError(data.error || "Login failed, please try again");
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            await signIn("google", { callbackUrl: "/" });
        } catch (error) {
            setError("Login failed, please try again");
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-center items-start pt-20 px-4 pb-10">
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
                        Welcome Back
                    </h2>

                    {error && (
                        <div
                            role="alert"
                            className="mb-4 rounded-lg border border-red-400 bg-red-50 p-3 text-red-700 text-center font-medium"
                        >
                            {error}
                        </div>
                    )}

                    {/* Email/Password Login */}
                    <form onSubmit={handleEmailLogin} className="space-y-5" noValidate>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-gray-700 font-medium mb-1"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={credentials.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 
                focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 
                outline-none bg-gray-50 hover:bg-white transition"
                                autoComplete="email"
                                aria-required="true"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-gray-700 font-medium mb-1"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 
                focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 
                outline-none bg-gray-50 hover:bg-white transition"
                                autoComplete="current-password"
                                aria-required="true"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={emailLoading || googleLoading}
                            className={`w-full rounded-xl mt-3 py-3 font-semibold text-white
              bg-gradient-to-r from-indigo-600 to-blue-500 shadow-lg
              hover:from-blue-500 hover:to-indigo-600
              active:scale-95 active:brightness-90 transition-all duration-200
              ${
                                emailLoading
                                    ? "opacity-70 cursor-not-allowed"
                                    : "cursor-pointer"
                            }`}
                        >
                            {emailLoading ? "Logging in..." : "Log In"}
                        </button>
                    </form>

                    <div className="my-6 flex items-center justify-center text-gray-400">
                        <span className="border-b w-1/4"></span>
                        <span className="mx-3 select-none">OR</span>
                        <span className="border-b w-1/4"></span>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={googleLoading || emailLoading}
                        className={`w-full rounded-xl py-3 font-semibold text-white
            bg-red-600 shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500
            active:scale-95 active:brightness-90 transition-all duration-200
            ${
                            googleLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
                        }`}
                        aria-label="Log in with Google"
                    >
                        {googleLoading ? "Logging in..." : "Continue with Google"}
                    </button>

                    <p className="mt-6 text-center text-gray-600">
                        Do not have an account?{" "}
                        <a
                            href="/register"
                            className="text-indigo-600 hover:underline focus:outline-none"
                        >
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
