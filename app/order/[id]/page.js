"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";

export default function OrderDetailsPage() {
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params.id) {
      console.log("No order id param");
      return;
    }

    async function fetchOrderDetails() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/order?id=${params.id}`);
        if (!res.ok) {
          if (res.status === 404) {
            notFound();
          } else {
            throw new Error("Failed to fetch order");
          }
        }
        const data = await res.json();
        setOrder(data.order);
      } catch (err) {
        setError(err.message);
        console.error(err);
      }
    }

    fetchOrderDetails();
  }, [params.id]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!order) {
    return <p>Loading order...</p>;
  }

  return (

    <main className="mt-15">
      <OrderDetailsTable order={order} />
    </main>
  );
}