import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        "X-Idempotency-Key": Date.now().toString(),
      },
      body: JSON.stringify({
        items: [
          {
            title: `Turno Dr. ${body.doctor}`,
            quantity: 1,
            unit_price: 1,
            currency_id: "ARS",
          },
        ],

        // ✔ metadata BIEN (esto lo usa el webhook)
        metadata: {
          nombre: body.nombre,
          telefono: body.telefono,
          email: body.email,
          fecha: body.fecha,
          hora: body.hora,
          doctor: body.doctor,
        },

        payer: {
          name: body.nombre || "Cliente",
          email: body.email,
        },

back_urls: {
  success: `${process.env.NEXT_PUBLIC_URL}/exito`,
  failure: `${process.env.NEXT_PUBLIC_URL}/error`,
  pending: `${process.env.NEXT_PUBLIC_URL}/exito`,
},
auto_return: "approved",
notification_url: `${process.env.NEXT_PUBLIC_URL}/api/webhook`,
       
      }),
    });

    const data = await response.json();

    // 🔥 debug clave
    if (!data.init_point) {
      console.log("ERROR MP:", data);
      return NextResponse.json({
        url: null,
        error: data,
      });
    }

    return NextResponse.json({
      url: data.init_point,
    });

  } catch (error) {
    console.log("ERROR SERVER:", error);

    return NextResponse.json({
      url: null,
      error: "Error servidor",
    });
  }
}