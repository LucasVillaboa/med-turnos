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

  const [horarios, setHorarios] = useState<string[]>([]);
  const [ocupados, setOcupados] = useState<string[]>([]);

  const generarHorarios = () => {
    const lista = [];
    for (let h = 9; h <= 18; h++) {
      lista.push(`${h}:00`);
      lista.push(`${h}:30`);
    }
    return lista;
  };

  const handleFechaChange = async (fecha: string) => {
    setForm({ ...form, fecha, hora: "" });

    const lista = generarHorarios();
    setHorarios(lista);

    // 🔥 TRAER TURNOS OCUPADOS
    try {
      const res = await fetch(`/api/turnos?doctor=${doctor}&fecha=${fecha}`);
      const data = await res.json();

      setOcupados(data.map((t: any) => t.hora));
    } catch {
      setOcupados([]);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    localStorage.setItem(
      "turno",
      JSON.stringify({
        ...form,
        doctor,
      })
    );

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
          onChange={(e) => handleFechaChange(e.target.value)}
        />

        {/* 🔥 HORARIOS SOLO SI HAY FECHA */}
        {form.fecha && (
          <div className="grid grid-cols-3 gap-2">
            {horarios.map((h) => {
              const ocupado = ocupados.includes(h);

              return (
                <button
                  type="button"
                  key={h}
                  disabled={ocupado}
                  onClick={() => setForm({ ...form, hora: h })}
                  className={`p-2 rounded border text-sm
                    ${ocupado ? "bg-gray-300 cursor-not-allowed" : ""}
                    ${form.hora === h ? "bg-green-500 text-white" : "bg-white"}
                  `}
                >
                  {h}
                </button>
              );
            })}
          </div>
        )}

        <button
          disabled={!form.hora}
          className="bg-green-600 text-white p-2 rounded disabled:bg-gray-400"
        >
          Confirmar y pagar seña
        </button>
      </form>
    </div>
  );
}