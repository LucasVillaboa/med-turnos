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

    // 🔥 VERIFICAR SI YA EXISTE EL TURNO
    const { data: existente } = await supabase
      .from("turnos")
      .select("*")
      .eq("doctor", data.doctor)
      .eq("fecha", data.fecha)
      .eq("hora", data.hora)
      .single();

    // 🔥 SI YA EXISTE
    if (existente) {

      return NextResponse.json(
        {
          error: "Horario ocupado",
        },
        {
          status: 400,
        }
      );

    }

    // 🔥 GUARDAR TURNO
    const { error } = await supabase
      .from("turnos")
      .insert([data]);

    if (error) {

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );

    }

    // 🔥 EMAIL
    await resend.emails.send({

      from: "Turnos Médicos <onboarding@resend.dev>",
      to: data.email,
      subject: "Turno confirmado ✅",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #1e293b;
          background: #f8fafc;
        ">

          <div style="
            max-width: 500px;
            margin: auto;
            background: white;
            padding: 30px;
            border-radius: 16px;
            border: 1px solid #dcfce7;
          ">

            <h2 style="
              color: #16a34a;
              margin-bottom: 20px;
            ">
              Turno confirmado ✅
            </h2>

            <p style="margin-bottom: 20px;">
              Hola <strong>${data.nombre}</strong>,
              tu reserva fue confirmada correctamente.
            </p>

            <div style="
              background: #f8fafc;
              padding: 16px;
              border-radius: 12px;
              margin-bottom: 24px;
            ">

              <p>
                <strong>Fecha:</strong>
                ${data.fecha}
              </p>

              <p>
                <strong>Horario:</strong>
                ${data.hora}
              </p>

            </div>

            <p style="margin-bottom: 10px;">
              Gracias por reservar tu turno online.
            </p>

            <p>
              Te esperamos.
            </p>

          </div>

        </div>
      `,
    });

    return NextResponse.json({
      ok: true,
    });

  } catch (err) {

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