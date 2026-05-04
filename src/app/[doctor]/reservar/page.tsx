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

        <input
          type="time"
          className="border p-2"
          required
          onChange={(e) => setForm({ ...form, hora: e.target.value })}
        />

        <button className="bg-green-600 text-white p-2 rounded">
          Confirmar y pagar seña
        </button>
      </form>
    </div>
  );
}