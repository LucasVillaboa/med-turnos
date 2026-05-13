"use client";

import { useEffect } from "react";

export default function Exito() {

  useEffect(() => {

    const turno = localStorage.getItem("turno");

    if (!turno) return;

    const confirmar = async () => {

      const data = JSON.parse(turno);

      const res = await fetch("/api/confirmar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        localStorage.removeItem("turno");
      }
    };

    confirmar();

  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">

      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full border border-green-100">

        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          ✅
        </div>

        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Pago confirmado
        </h1>

        <p className="text-slate-600 leading-relaxed">
          Tu turno fue reservado correctamente.
          <br />
          Te enviamos un email con los detalles de la reserva.
        </p>

      </div>
    </div>
  );
}