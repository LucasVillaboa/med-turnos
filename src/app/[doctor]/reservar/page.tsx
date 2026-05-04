"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function ReservarTurno() {
  const params = useParams();
  const doctor = params.doctor as string;

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    fecha: "",
    hora: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // 🔥 GUARDAR TURNO LOCALMENTE (ANTES DE PAGAR)
    localStorage.setItem(
      "turno",
      JSON.stringify({
        nombre: form.nombre,
        telefono: form.telefono,
        email: form.email,
        fecha: form.fecha,
        hora: form.hora,
        doctor: doctor,
      })
    );

    try {
      const res = await fetch("/api/pago", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          doctor,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error al generar el pago");
      }
    } catch (error) {
      alert("Error en el servidor");
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-4">
        Reservar turno con Dr. {doctor}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">

        <input
          type="text"
          placeholder="Nombre"
          className="border p-2"
          required
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />

        <input
          type="text"
          placeholder="Teléfono"
          className="border p-2"
          required
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="date"
          className="border p-2"
          required
          onChange={(e) => setForm({ ...form, fecha: e.target.value })}
        />

        {/* 🕒 HORARIOS CADA 30 MIN */}
    <div className="grid grid-cols-4 gap-2">
  {[
    "08:00","08:30",
    "09:00","09:30",
    "10:00","10:30",
    "11:00","11:30",
    "12:00","12:30",
    "13:00","13:30",
    "14:00","14:30",
    "15:00","15:30",
    "16:00","16:30",
    "17:00","17:30",
    "18:00","18:30",
    "19:00","19:30",
    "20:00"
  ].map((hora) => (
    <button
      type="button"
      key={hora}
      onClick={() => setForm({ ...form, hora })}
      className={`p-2 border rounded 
        ${form.hora === hora ? "bg-green-600 text-white" : "bg-white"}
      `}
    >
      {hora}
    </button>
  ))}
</div>

        <button className="bg-green-600 text-white p-2 rounded">
          Confirmar y pagar seña
        </button>
      </form>
    </div>
  );
}