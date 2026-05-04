import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("WEBHOOK BODY:", body); // 🔥 para ver qué llega

    // 🔥 SIEMPRE agarramos el paymentId así
    const paymentId = body?.data?.id;

    if (!paymentId) {
      console.log("No hay paymentId");
      return NextResponse.json({ ok: true });
    }

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

    console.log("PAYMENT:", payment);

    // 🔥 solo si está aprobado
    if (payment.status !== "approved") {
      console.log("Pago no aprobado:", payment.status);
      return NextResponse.json({ ok: true });
    }

    const metadata = payment.metadata || payment.additional_info || {};

    if (!metadata) {
      console.log("Sin metadata");
      return NextResponse.json({ ok: true });
    }

    // 👉 guardar turno en BD
const { error } = await supabase.from("turnos").insert([
  {
    nombre: metadata.nombre || "Sin nombre",
    telefono: metadata.telefono || "Sin telefono",
    email: metadata.email || "Sin email",
    fecha: metadata.fecha || "Sin fecha",
    hora: metadata.hora || "Sin hora",
    doctor: metadata.doctor || "General",
  },
]);

    if (error) {
      console.log("Error guardando turno:", error);
    } else {
      console.log("Turno guardado correctamente");
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.log("ERROR WEBHOOK:", error);
    return NextResponse.json({ error: true });
  }
}