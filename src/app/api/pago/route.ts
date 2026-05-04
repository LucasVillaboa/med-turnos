import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        "X-Idempotency-Key": Date.now().toString(), // 🔥 IMPORTANTE
      },
      body: JSON.stringify({
        items: [
          {
            title: `Turno Dr. ${body.doctor}`,
            quantity: 1,
            unit_price: 100,
            currency_id: "ARS",
          },
        ],
        payer: {
          name: body.nombre || "Cliente",
          email: body.email,

                  metadata: {
  nombre: body.nombre,
  telefono: body.telefono,
  email: body.email,
  fecha: body.fecha,
  hora: body.hora,
  doctor: body.doctor,
},
        },

        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}/exito`,
          failure: `${process.env.NEXT_PUBLIC_URL}/error`,
        },
        auto_return: "approved",
      }),
    });

    const data = await response.json();

    console.log("MP RESPONSE:", data);

    // 🔥 clave para debug
    if (!data.init_point) {
      return NextResponse.json({
        url: null,
        error: data,
      });
    }

    return NextResponse.json({
      url: data.init_point,
    });

  } catch (error) {
    console.log("ERROR:", error);

    return NextResponse.json({
      url: null,
      error: "Error servidor",
    });
  }
}