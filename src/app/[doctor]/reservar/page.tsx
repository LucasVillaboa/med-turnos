"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

export default function ReservarTurno() {
  const params = useParams();
  const doctor = params.doctor as string;

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    fecha: "",
    hora: "",
  });

  const [ocupados, setOcupados] = useState<any[]>([]);

  // 🔄 Traer turnos ocupados
  useEffect(() => {
    if (!form.fecha) return;

    const fetchTurnos = async () => {
      const { data } = await supabase
        .from("turnos")
        .select("*")
        .eq("doctor", doctor)
        .eq("fecha", form.fecha);

      setOcupados(data || []);
    };

    fetchTurnos();
  }, [form.fecha, doctor]);

  // 💳 Confirmar y pagar
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // 🚫 validar duplicado
    const existe = ocupados.find((t) => t.hora === form.hora);

    if (existe) {
      alert("Ese horario ya está ocupado");
      return;
    }

    try {
      const res = await fetch("/api/pago", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctor,
          ...form,
        }),
      });

      const data = await res.json();

      if (!data.url) {
        alert("Error al generar el pago");
        return;
      }

      // 👉 Redirige a Mercado Pago
      window.location.href = data.url;

    } catch (error) {
      alert("Error al conectar con el servidor");
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

      {/* Horarios ocupados */}
      {ocupados.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold">Horarios ocupados:</h3>
          <ul>
            {ocupados.map((t) => (
              <li key={t.id}>{t.hora}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}