import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      nombre,
      telefono,
      email,
      fecha,
      hora,
      doctor,
    } = body;

    // 🔥 VERIFICAR SI YA EXISTE
    const { data: existente } = await supabase
      .from("turnos")
      .select("*")
      .eq("doctor", doctor)
      .eq("fecha", fecha)
      .eq("hora", hora)
      .single();

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
      .insert([
        {
          nombre,
          telefono,
          email,
          fecha,
          hora,
          doctor,
        },
      ]);

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

    return NextResponse.json({
      ok: true,
    });

  } catch {

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