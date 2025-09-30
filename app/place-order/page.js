"use client";

import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PlaceOrderButton from "./place-order-button";

export default function PlaceOrder() {
  const { cart } = useCart();
  const router = useRouter();

  const [userAddress, setUserAddress] = useState(null);
  const [userPayment, setUserPayment] = useState(null);

  // Calculate item total
  const itemsPrice = cart.reduce((total, item) => {
    return total + Number(item.price) * item.quantity;
  }, 0);

  // Calculate shipping price (free if itemsPrice > 150)
  const shippingPrice = itemsPrice > 150 ? 0 : 35;

  // Calculate total price
  const totalPrice = itemsPrice + shippingPrice;

  useEffect(() => {
    const checkAuthCartAddress = async () => {
      // 1. Check if cart has items
      if (!cart || cart.length === 0) return router.push("/cart");

      // 2. Check if logged in
      const resAuth = await fetch("/api/auth/session");
      const dataAuth = await resAuth.json();
      const userId = dataAuth?.user?.id;

      if (!userId) {
        return router.push(
          `/login?callbackUrl=${encodeURIComponent("/address")}`
        );
      }

      // 3. Fetch user info
      const resUser = await fetch("/api/user");
      const dataUser = await resUser.json();

      const address = dataUser?.user?.address;
      const payment = dataUser?.user?.paymentMethod;

      if (!address) return router.push("/address");
      if (!payment) return router.push("/payment");

      // 4. Store in state
      setUserAddress(address);
      setUserPayment(payment);
    };

    checkAuthCartAddress();
  }, [cart, router]);

  return (
    <div className="mt-25 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      <h1 className="text-3xl font-extrabold mb-6 border-b border-gray-300 pb-3">
        Place Order
      </h1>
      <div className="grid md:grid-cols-3 md:gap-8">
        {/* Left side */}
        <div className="md:col-span-2 space-y-8 overflow-x-auto">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userAddress ? (
                <>
                  <p className="font-semibold text-lg">
                    {userAddress.fullname}
                  </p>
                  <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {userAddress.address},
                    <br />
                    {userAddress.city}, {userAddress.province},{" "}
                    {userAddress.postalCode}, {userAddress.country},
                    <br />
                    {userAddress.phone}
                  </p>
                </>
              ) : (
                <p>Loading address...</p>
              )}
              <div className="mt-4">
                <Link href={"/address"}>
                  <Button variant="outline" className="w-full sm:w-auto cursor-pointer">
                    Edit
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userPayment ? (
                <>
                  <p className="text-lg">{userPayment}</p>
                </>
              ) : (
                <p>Loading payment method...</p>
              )}
              <div className="mt-4">
                <Link href={"/payment"}>
                  <Button variant="outline" className="w-full sm:w-auto cursor-pointer">
                    Edit
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">Price/Unit</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-center">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="flex items-center space-x-3">
                        <Link
                          href={`/product/${item.id}`}
                          className="flex items-center"
                        >
                          {item.image && item.image.length > 0 && (
                            <Image
                              src={item.image[0]}
                              alt={item.name}
                              width={50}
                              height={50}
                              className="rounded-md"
                            />
                          )}
                          <span className="px-3 font-medium">{item.name}</span>
                        </Link>
                      </TableCell>

                      <TableCell className="text-center">
                        ฿{Number(item.price)}
                      </TableCell>

                      <TableCell className="text-center font-semibold">
                        {item.quantity}
                      </TableCell>

                      <TableCell className="text-center font-semibold">
                        ฿{(Number(item.price) * item.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4">
                <Link href={"/cart"}>
                  <Button variant="outline" className="w-full sm:w-auto cursor-pointer">
                    Edit
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side */}
        <div className="space-y-6">
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
        </div>
      </div>
    </div>
  );
}
