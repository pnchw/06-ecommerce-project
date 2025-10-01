"use client";

import { Card, CardContent } from "@/components/ui/card";
import PlaceOrderButton from "./PlaceOrderButton";

export default function OrderSummary({ itemsPrice, shippingPrice, totalPrice }) {
  return (
    <Card>
      <CardContent className="p-6 space-y-5">
        <div className="flex justify-between text-lg font-semibold">
          <div>Items:</div>
          <div>฿{itemsPrice}</div>
        </div>
        <div className="flex justify-between text-lg font-semibold">
          <div>Shipping:</div>
          <div>฿{shippingPrice}</div>
        </div>
        <div className="flex justify-between text-xl font-bold border-t pt-4">
          <div>Total:</div>
          <div>฿{totalPrice}</div>
        </div>
        <PlaceOrderButton />
      </CardContent>
    </Card>
  );
}
