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
  <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-10">

    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-green-100 p-8">

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-700">
          Reserva tu turno
        </h1>

        <p className="text-slate-500 mt-2">
          Dr. {doctor}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          type="text"
          placeholder="Nombre completo"
          className="border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-green-500"
          required
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />

        <input
          type="text"
          placeholder="Teléfono"
          className="border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-green-500"
          required
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-green-500"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <div>
          <label className="block mb-2 text-sm font-medium text-slate-600">
            Seleccionar fecha
          </label>

          <input
            type="date"
            className="w-full border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-green-500"
            required
            onChange={(e) => handleFechaChange(e.target.value)}
          />
        </div>

        {form.fecha && (
          <div className="mt-4">

            <h3 className="font-semibold text-slate-700 mb-3">
              Horarios disponibles
            </h3>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">

              {horarios.map((h) => {
                const ocupado = ocupados.includes(h);

                return (
                  <button
                    type="button"
                    key={h}
                    disabled={ocupado}
                    onClick={() => setForm({ ...form, hora: h })}
                    className={`
                      p-3
                      rounded-2xl
                      text-sm
                      font-medium
                      transition-all
                      border

                      ${
                        ocupado
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed border-slate-200"
                          : form.hora === h
                          ? "bg-green-600 text-white border-green-600 scale-105"
                          : "bg-white hover:bg-green-50 border-slate-200"
                      }
                    `}
                  >
                    {h}
                  </button>
                );
              })}

            </div>
          </div>
        )}

        <button
          disabled={!form.hora}
          className="
            mt-6
            bg-green-600
            hover:bg-green-700
            transition
            text-white
            p-4
            rounded-2xl
            font-semibold
            text-lg
            disabled:bg-slate-300
            disabled:cursor-not-allowed
          "
        >
          Confirmar y pagar seña
        </button>

      </form>
    </div>
  </div>
);
}