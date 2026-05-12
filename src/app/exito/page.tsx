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
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">

      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full">

        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Pago exitoso 🎉
        </h1>

        <p className="text-slate-600">
          Tu turno fue confirmado correctamente.
        </p>

      </div>
    </div>
  );
}