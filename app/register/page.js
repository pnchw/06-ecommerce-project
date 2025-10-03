"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import TextInput from "@/components/TextInput";
import PasswordInput from "@/components/PasswordInput";

export default function SignUpPage() {
	const router = useRouter();
	const [credentials, setCredentials] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState(null);
	const [emailLoading, setEmailLoading] = useState(false);
	const [googleLoading, setGoogleLoading] = useState(false);
	const [emailError, setEmailError] = useState("");

	const handleChange = (e) => {
		setCredentials({ ...credentials, [e.target.name]: e.target.value });
	};

	const handleEmailSignUp = async (e) => {
		e.preventDefault();
		setEmailLoading(true);
		setError(null);

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(credentials.email)) {
			setEmailError("Invalid email address");
			setEmailLoading(false);
			return;
		} else {
			setEmailError("");
		}

		try {
			const res = await fetch("/api/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(credentials),
			});

			const data = await res.json();

			if (!res.ok) {
				if (data.error && data.error.includes("User already exists")) {
					setEmailError("Email already exists");
				} else {
					throw new Error(data.error || "Registration failed");
				}
				return;
			}

			// After successful sign-up, automatically sign in the user
			const loginRes = await signIn("credentials", {
				email: credentials.email,
				password: credentials.password,
				redirect: false,
			});

			if (loginRes.error) {
				throw new Error(loginRes.error);
			}

			router.push("/");
		} catch (error) {
			setError(error.message);
		} finally {
			setEmailLoading(false);
		}
	};

	const handleEmailBlur = () => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(credentials.email)) {
			setEmailError("Invalid email address");
		} else {
			setEmailError("");
		}
	};

	const handleGoogleSignIn = async () => {
		setGoogleLoading(true);
		try {
			await signIn("google", { callbackUrl: "/" });
		} catch (error) {
			setError("Sign in failed, please try again");
		} finally {
			setGoogleLoading(false);
		}
	};

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<div className="flex justify-center items-start pt-20 px-4 pb-10">
				<div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
					<h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
						Create Account
					</h2>

					{error && (
						<div
							role="alert"
							className="mb-4 rounded-lg border border-red-400 bg-red-50 p-3 text-red-700 text-center font-medium"
						>
							{error}
						</div>
					)}

					<form onSubmit={handleEmailSignUp} className="space-y-5" noValidate>
						<TextInput
							label="Name"
							id="name"
							type="text"
							name="name"
							placeholder="Enter your name"
							value={credentials.name}
							onChange={handleChange}
							autoComplete="name"
						/>
						<div className="relative">
							<TextInput
								label="Email"
								id="email"
								type="email"
								name="email"
								placeholder="Enter your email"
								value={credentials.email}
								onChange={handleChange}
								onBlur={handleEmailBlur}
								autoComplete="email"
								error={emailError}
							/>
							{emailError && (
								<p className="absolute text-red-600 text-sm left-2">
									{emailError}
								</p>
							)}
						</div>

						<PasswordInput
							value={credentials.password}
							confirmValue={credentials.confirmPassword}
							onChange={handleChange}
							autoComplete="new-password"
							confirm={true}
							error={error}
						/>

						<button
							type="submit"
							disabled={emailLoading || googleLoading}
							className={`w-full rounded-xl mt-3 py-3 font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-500 shadow-lg hover:from-blue-500 hover:to-indigo-600 active:scale-95 active:brightness-90 transition-all duration-200
              							${
															emailLoading
																? "opacity-70 cursor-not-allowed"
																: "cursor-pointer"
														}`}
						>
							{emailLoading ? "Signing up..." : "Sign Up"}
						</button>
					</form>

					<div className="my-6 flex items-center justify-center text-gray-400">
						<span className="border-b w-1/4"></span>
						<span className="mx-3 select-none">OR</span>
						<span className="border-b w-1/4"></span>
					</div>

					{/* Google Sign In Button */}
					<button
						onClick={handleGoogleSignIn}
						disabled={googleLoading || emailLoading}
						className={`w-full rounded-xl py-3 font-semibold text-white bg-red-600 shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 active:scale-95 active:brightness-90 transition-all duration-200
        							${googleLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
						aria-label="Sign in with Google"
					>
						{googleLoading ? "Signing in..." : "Sign in with Google"}
					</button>

					<p className="mt-6 text-center text-gray-600">
						Have an account?{" "}
						<a
							href="/login"
							className="text-indigo-600 hover:underline focus:outline-none"
						>
							Log In
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
