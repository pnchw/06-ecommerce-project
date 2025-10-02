import Link from "next/link";

export default function LoadingPage({ page }) {
	return (
		<div className="flex justify-center items-center h-100vh">
			<p className="text-xl text-center mb-2">{page}</p>{" "}
			<Link
				href="/"
				className="text-blue-600 hover:underline font-semibold"
				tabIndex={0}
			>
				Go Shopping
			</Link>
		</div>
	);
}
