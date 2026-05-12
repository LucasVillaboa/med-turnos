import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {

  try {

    const data = await req.json();

    // 🔥 GUARDAR TURNO
    const { error } = await supabase
      .from("turnos")
      .insert([data]);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // 🔥 ENVIAR EMAIL
    await resend.emails.send({
      from: "Turnos <onboarding@resend.dev>",
      to: data.email,
      subject: "Turno confirmado",
      html: `
        <h2>Tu turno fue confirmado ✅</h2>

        <p><strong>Médico:</strong> ${data.doctor}</p>
        <p><strong>Fecha:</strong> ${data.fecha}</p>
        <p><strong>Hora:</strong> ${data.hora}</p>

        <br/>

        <p>Gracias por reservar tu turno.</p>
      `,
    });

    return NextResponse.json({ ok: true });

  } catch (err) {

    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}