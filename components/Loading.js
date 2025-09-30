
import Link from "next/link";

export default function LoadingPage({page}) {
	return (
		<div className="text-center mt-20 text-xl">
			{page}{" "}
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
