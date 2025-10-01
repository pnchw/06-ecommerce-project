"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductImages({ images, name }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <section className="md:w-1/2 flex flex-col items-center">
      {/* Main Image */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-xl bg-gray-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentIndex]}
              alt={name}
              fill
              className="object-cover w-full h-full rounded-lg"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Prev Button */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md backdrop-blur-sm p-3 rounded-full hover:bg-amber-500 hover:text-white active:scale-90 active:brightness-90 transition w-12 h-12 cursor-pointer flex items-center justify-center"
        >
          ◀
        </button>

        {/* Next Button */}
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md backdrop-blur-sm p-3 rounded-full hover:bg-amber-500 hover:text-white active:scale-90 active:brightness-90 transition w-12 h-12 cursor-pointer flex items-center justify-center"
        >
          ▶
        </button>
      </div>

      {/* Thumbnail Gallery */}
      <div className="flex gap-4 mt-6">
        {images.map((img, idx) => (
          <motion.button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-20 h-20 rounded-lg border-2 overflow-hidden shadow-sm cursor-pointer ${
              currentIndex === idx ? "border-blue-500" : "border-transparent"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </motion.button>
        ))}
      </div>
    </section>
  );
}
