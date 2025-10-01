"use client";

export default function TextInput({
	label,
	type = "text",
	name,
	placeholder,
	value,
	onChange,
    autoComplete,
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
				placeholder={placeholder}
				required
				className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 
                  						focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 
                  						outline-none bg-gray-50 hover:bg-white transition"
				autoComplete={autoComplete}
				aria-required="true"
			/>
		</div>
	);
}
