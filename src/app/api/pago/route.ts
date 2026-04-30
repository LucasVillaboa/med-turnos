import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer APP_USR-3142183805894837-042909-f80d25e8e8ab7cbc47bfb5ea2feb66fe-3367646398`, // 👈 PEGÁ TU TOKEN TEST REAL
    },
    body: JSON.stringify({
      items: [
        {
          title: `Seña turno Dr. ${body.doctor}`,
          quantity: 1,
          unit_price: 3000,
        },
      ],
      back_urls: {
        success: "http://localhost:3000",
        failure: "http://localhost:3000",
      },
      auto_return: "approved",
    }),
  });

  const data = await response.json();

  return NextResponse.json({
    url: data.sandbox_init_point,
  });
}