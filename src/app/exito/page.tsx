"use client";

import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Exito() {

  useEffect(() => {
    const turno = localStorage.getItem("turno");

    if (!turno) return;

    const data = JSON.parse(turno);

    const guardar = async () => {
      const { error } = await supabase.from("turnos").insert([data]);

      if (!error) {
        localStorage.removeItem("turno"); //  evita duplicados
      }
    };

    guardar();
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold text-green-600">
        Pago exitoso 🎉
      </h1>
      <p>Tu turno fue confirmado</p>
    </div>
  );
}