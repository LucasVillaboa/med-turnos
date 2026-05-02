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
    email: "",
    fecha: "",
    hora: "",
  });

  const [ocupados, setOcupados] = useState<any[]>([]);

  // 🔥 horarios disponibles
  const horarios = [
    "09:00","09:30","10:00","10:30",
    "11:00","11:30","12:00",
    "16:00","16:30","17:00","17:30","18:00"
  ];

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

    if (!form.hora) {
      alert("Seleccioná un horario");
      return;
    }

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

      window.location.href = data.url;

    } catch (error) {
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        
        <h2 className="text-2xl font-bold mb-4 text-center">
          Reservar turno con Dr. {doctor}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Nombre"
            className="border p-2 rounded"
            required
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />

          <input
            type="text"
            placeholder="Teléfono"
            className="border p-2 rounded"
            required
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          />
          <input
  type="emaill"
  placeholder="Email"
  className="border p-2 rounded"
  required
  onChange={(e) => setForm({ ...form, email: e.target.value })}
/>

          <input
            type="date"
            className="border p-2 rounded"
            required
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          />

          {/* 🔥 HORARIOS PRO */}
          {form.fecha && (
            <div>
              <p className="font-semibold">Seleccioná un horario:</p>

              <div className="grid grid-cols-3 gap-2 mt-2">
                {horarios.map((h) => {
                  const ocupado = ocupados.some((t) => t.hora === h);

                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={ocupado}
                      onClick={() => setForm({ ...form, hora: h })}
                      className={`
                        p-2 rounded border text-sm
                        ${form.hora === h ? "bg-green-600 text-white" : "bg-white"}
                        ${ocupado ? "bg-gray-300 cursor-not-allowed" : "hover:bg-green-100"}
                      `}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button className="bg-green-600 text-white p-2 rounded mt-2">
            Confirmar y pagar seña
          </button>
        </form>

        {/* Horarios ocupados */}
        {ocupados.length > 0 && (
          <div className="mt-4 text-sm">
            <p className="font-semibold">Horarios ocupados:</p>
            <ul className="list-disc ml-4">
              {ocupados.map((t) => (
                <li key={t.id}>{t.hora}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}