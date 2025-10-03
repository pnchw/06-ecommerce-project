"use client";

export default function TextInput({
	label,
	type = "text",
	name,
	placeholder,
	value,
	onChange,
	autoComplete,
	onBlur,
	error,
}) {
	return (
		<div>
			{label && (
				<label htmlFor={name} className="block text-gray-700 font-medium mb-1">
					{label}
				</label>
			)}
			<input
				id={name}
				name={name}
				type={type}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				placeholder={placeholder}
				required
				className={`w-full rounded-xl border p-3 text-gray-900 outline-none border-gray-300 bg-gray-50 hover:bg-white transition ${
					error
						? "border-red-500 focus:border-red-500"
						: "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
				}`}
				autoComplete={autoComplete}
				aria-required="true"
			/>
		</div>
	);
}
