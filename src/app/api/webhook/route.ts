import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 🔥 importante (no el anon)
);


export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🔥 verificar que sea pago aprobado
    if (body.type === "payment") {
      const paymentId = body.data.id;

      // 👉 consultar pago en Mercado Pago
      const res = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          },
        }
      );

      const payment = await res.json();

      // 🔥 solo si está aprobado
      if (payment.status === "approved") {
        const metadata = payment.metadata;

        // 👉 guardar turno en BD
        const { error } = await supabase.from("turnos").insert([
          {
            nombre: metadata.nombre,
            telefono: metadata.telefono,
            email: metadata.email,
            fecha: metadata.fecha,
            hora: metadata.hora,
            doctor: metadata.doctor,
          },
        ]);

        if (error) {
          console.log("Error guardando turno:", error);
        } else {
          console.log("Turno guardado correctamente");
        }
      }
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.log("ERROR WEBHOOK:", error);
    return NextResponse.json({ error: true });
  }


}