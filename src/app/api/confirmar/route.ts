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

    const { data: existente } = await supabase
      .from("turnos")
      .select("id")
      .eq("doctor", data.doctor)
      .eq("fecha", data.fecha)
      .eq("hora", data.hora);

    if (existente && existente.length > 0) {
      return NextResponse.json(
        { error: "Horario ocupado" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("turnos")
      .insert([
        {
          doctor: data.doctor,
          nombre: data.nombre,
          telefono: data.telefono,
          email: data.email,
          fecha: data.fecha,
          hora: data.hora,
        },
      ]);

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    let titulo = "Confirmación de reserva";

    if (data.doctor === "lavadero") {
      titulo = "Confirmación de lavado";
    }

    if (data.doctor === "futbol5") {
      titulo = "Confirmación de reserva de cancha";
    }

    await resend.emails.send({
      from: "Turnos <onboarding@resend.dev>",
      to: data.email,
      subject: titulo,
      html: `
        <h2>${titulo}</h2>

        <p><strong>Nombre:</strong> ${data.nombre}</p>
        <p><strong>Teléfono:</strong> ${data.telefono}</p>
        <p><strong>Fecha:</strong> ${data.fecha}</p>
        <p><strong>Hora:</strong> ${data.hora}</p>
        <p><strong>Servicio:</strong> ${data.doctor}</p>

        <br/>

        <p>Gracias por utilizar nuestro sistema de reservas.</p>
      `,
    });

    return NextResponse.json({
      ok: true,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Error interno",
      },
      {
        status: 500,
      }
    );
  }
}