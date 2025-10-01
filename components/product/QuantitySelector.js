"use client";

export default function QuantitySelector({ quantity, stock, onIncrease, onDecrease }) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <p className="text-gray-700">Quantity</p>
      <button
        onClick={onDecrease}
        disabled={quantity === 1}
        className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 active:bg-gray-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 flex justify-center items-center text-xl font-bold cursor-pointer"
      >
        -
      </button>
      <span className="text-2xl font-semibold">{quantity}</span>
      <button
        onClick={onIncrease}
        disabled={quantity === stock}
        className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 active:bg-gray-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 flex justify-center items-center text-xl font-bold cursor-pointer"
      >
        +
      </button>
      <p className="ml-6 text-gray-500 italic">
        {stock > 0 ? `In stock: ${stock}` : "Out of stock"}
      </p>
    </div>
  );
}
