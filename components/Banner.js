import Image from "next/image";

export default function Banner() {
	return (
		<div className="relative bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-2xl overflow-hidden shadow-lg mb-8">
			<div className="absolute inset-0 bg-black/20" />

			<div className="relative mx-auto px-8 py-12 flex flex-col gap-6 md:flex-row items-center justify-evenly">
				{/* Text Section */}
				<div className="text-center md:text-left max-w-lg">
					<h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4">
						Super Sale!!
					</h1>
					<p className="text-3xl md:text-5xl text-amber-300 font-extrabold drop-shadow-md mb-4">
						GET 40% OFF
					</p>
					<p className="text-lg md:text-xl text-white/90 mb-6">
						Enjoy discounts on your favorite characters
					</p>
					<button className="px-6 py-3 bg-amber-400 text-black font-bold rounded-full shadow-lg transform transition duration-150 hover:scale-105 active:scale-95 active:brightness-90 cursor-pointer">
						Shop Now
					</button>
				</div>

				{/* Image Section */}
				<div className="relative w-2/3 md:w-1/3 aspect-square">
					<Image
						src="/assets/images/gojo-banner.png"
						fill
						alt="Banner Image"
						className="object-contain drop-shadow-2xl"
					/>
				</div>
			</div>
		</div>
	);
}
