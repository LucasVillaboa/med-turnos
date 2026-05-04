"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function ExitoContent() {
  const params = useSearchParams();

  useEffect(() => {
    const data = params.get("data");

    if (data) {
      const turno = JSON.parse(decodeURIComponent(data));

      supabase.from("turnos").insert([turno]);
    }
  }, [params]);

  return <h1>Pago exitoso 🎉</h1>;
}

export default function Exito() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <ExitoContent />
    </Suspense>
  );
}