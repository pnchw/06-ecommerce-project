"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
	label = "Password",
	name = "password",
	value,
	onChange,
	confirm,
	confirmLabel = "Confirm Password",
	confirmName = "confirmPassword",
	confirmValue,
	autoComplete,
	error,
}) {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	return (
		<>
			<div className="relative">
				<label
					htmlFor="password"
					className="block text-gray-700 font-medium mb-1"
				>
					{label}
				</label>
				<input
					id={name}
					type={showPassword ? "text" : "password"}
					name={name}
					placeholder="Enter your password"
					value={value}
					onChange={onChange}
					required
					className={`w-full rounded-xl border p-3 text-gray-900 
						outline-none bg-gray-50 hover:bg-white transition
						focus:ring-1 focus:ring-indigo-500
						${
							error
								? "border-red-500 focus:border-red-500"
								: "border-gray-300 focus:border-indigo-500"
						}`}
					autoComplete={autoComplete}
					aria-required="true"
					minLength={6}
				/>
				<button
					type="button"
					onClick={() => setShowPassword(!showPassword)}
					className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 cursor-pointer"
				>
					{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
				</button>
			</div>

			{confirm && (
				<div className="relative">
					<label
						htmlFor="confirmPassword"
						className="block text-gray-700 font-medium mb-1"
					>
						{confirmLabel}
					</label>
					<input
						id={confirmName}
						type={showConfirmPassword ? "text" : "password"}
						name={confirmName}
						placeholder="Confirm your password"
						value={confirmValue}
						onChange={onChange}
						required
						className={`w-full rounded-xl border p-3 text-gray-900 
						outline-none bg-gray-50 hover:bg-white transition
						focus:ring-1 focus:ring-indigo-500
						${
							error
								? "border-red-500 focus:border-red-500"
								: "border-gray-300 focus:border-indigo-500"
						}`}
						autoComplete={autoComplete}
						aria-required="true"
						minLength={6}
					/>
					<button
						type="button"
						onClick={() => setShowConfirmPassword(!showConfirmPassword)}
						className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 cursor-pointer"
					>
						{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
					</button>
				</div>
			)}
		</>
	);
}
