"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Exito() {
  const params = useSearchParams();

  useEffect(() => {
    const data = params.get("data");

    if (data) {
      const turno = JSON.parse(decodeURIComponent(data));

      supabase.from("turnos").insert([turno]);
    }
  }, []);

  return <h1>Pago exitoso 🎉</h1>;
}