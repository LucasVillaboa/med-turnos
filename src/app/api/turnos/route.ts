import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);

  const doctor = searchParams.get("doctor");
  const fecha = searchParams.get("fecha");

  let query = supabase
    .from("turnos")
    .select("*")
    .eq("doctor", doctor);

  // 🔥 SOLO FILTRAR POR FECHA SI EXISTE
  if (fecha) {

    query = query.eq("fecha", fecha);

  }

  const { data, error } = await query;

  if (error) {

    return NextResponse.json([]);

  }

  return NextResponse.json(data);

}