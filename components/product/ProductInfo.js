"use client";

import { useState } from "react";
import QuantitySelector from "./QuantitySelector";
import { Loader } from "lucide-react";

export default function ProductInfo({ product, quantity, onIncrease, onDecrease, onAddToCart }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onAddToCart();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="md:w-1/2 flex flex-col justify-between">
      <div>
        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
        <p className="text-3xl font-extrabold text-amber-500 mb-6">฿{product.price}</p>

        <QuantitySelector
          quantity={quantity}
          stock={product.stock}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
        />

        <button
          onClick={handleClick}
          disabled={product.stock === 0 || loading}
          className="w-full relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:from-amber-600 hover:to-orange-600 active:scale-95 active:brightness-90 transition transform duration-150 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <Loader size={18} className="animate-spin mx-auto" />
          ) : product.stock === 0 ? (
            "Out of Stock"
          ) : (
            "🛒 Add to Cart"
          )}
          <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition duration-300"></span>
        </button>
      </div>
    </section>
  );
}
