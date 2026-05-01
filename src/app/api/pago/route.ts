import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        items: [
          {
            title: `Turno Dr. ${body.doctor}`,
            quantity: 1,
            unit_price: 3000,
            currency_id: "ARS", // 🔥 CLAVE
          },
        ],
        payer: {
          name: body.nombre || "Cliente",
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}`,
          failure: `${process.env.NEXT_PUBLIC_URL}`,
        },
        auto_return: "approved",
      }),
    });

    const data = await response.json();

    console.log("MP RESPONSE:", data);

    if (!data.init_point) {
      return NextResponse.json({
        error: "Mercado Pago no devolvió link",
        detalle: data,
      });
    }

    return NextResponse.json({
      url: data.init_point,
    });

  } catch (error) {
    return NextResponse.json({
      error: "Error en servidor",
    });
  }
}