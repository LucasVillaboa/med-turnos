import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 🔥 cliente con permisos completos
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🔥 función reutilizable
async function handlePayment(paymentId: string) {
  try {
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

    // ❌ si no está aprobado, no guardamos
    if (payment.status !== "approved") {
      return NextResponse.json({ ok: false, status: payment.status });
    }

    const metadata = payment.metadata || {};

    // 🔥 INSERT EN BD
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
      console.log("ERROR BD:", error);
      return NextResponse.json({ ok: false, error });
    }

    console.log("✅ Turno guardado");

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.log("ERROR GENERAL:", err);
    return NextResponse.json({ ok: false });
  }
}

// 🔥 para cuando Mercado Pago llama (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const paymentId = body?.data?.id;

    if (!paymentId) {
      console.log("No paymentId en POST");
      return NextResponse.json({ ok: true });
    }

    return await handlePayment(paymentId);

  } catch (e) {
    console.log("ERROR POST:", e);
    return NextResponse.json({ ok: true });
  }
}

// 🔥 para cuando vos lo llamás desde /exito (GET)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get("payment_id");

  if (!paymentId) {
    return NextResponse.json({ ok: false });
  }

  return await handlePayment(paymentId);
}