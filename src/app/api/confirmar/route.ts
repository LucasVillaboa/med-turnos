import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Verificar si ya existe
    const { data: existente } = await supabase
      .from("turnos")
      .select("id")
      .eq("doctor", data.doctor)
      .eq("fecha", data.fecha)
      .eq("hora", data.hora);

    if (existente && existente.length > 0) {
      return NextResponse.json(
        {
          error: "Horario ocupado",
        },
        {
          status: 400,
        }
      );
    }

    // Guardar turno
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
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

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