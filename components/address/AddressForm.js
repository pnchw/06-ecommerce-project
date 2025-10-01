"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { ArrowRight } from "lucide-react";

export default function AddressForm({
  shippingAddress,
  setShippingAddress,
  loading,
  isPending,
  onSubmit,
}) {
  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(shippingAddress);
  };

  return (
    <div className="flex justify-center items-start pt-20 px-4 pb-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-900">
          Shipping Address
        </h1>
        <p className="mb-8 text-center text-gray-600">
          Please provide your details for delivery
        </p>

        <form onSubmit={handleFormSubmit} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(shippingAddress).map(([key, value]) => (
              <div key={key} className={key === "address" ? "sm:col-span-2" : ""}>
                <label
                  htmlFor={key}
                  className="block font-semibold mb-1 text-gray-700"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </label>
                <input
                  id={key}
                  name={key}
                  type="text"
                  value={value}
                  onChange={handleChange}
                  placeholder={`Enter ${key}`}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          <Button
            type="submit"
            disabled={loading || isPending}
            className={`w-full flex justify-center items-center gap-2 px-6 py-3 font-semibold text-white 
              shadow-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500
              active:scale-95 active:brightness-90 transition-all duration-200 cursor-pointer
              ${loading || isPending ? "opacity-70 bg-gradient-to-r from-blue-500 to-indigo-500 cursor-not-allowed" : ""}`}
          >
            {(loading || isPending) && (
              <Loader className="w-5 h-5 animate-spin text-white" />
            )}
            Continue
            <ArrowRight className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
