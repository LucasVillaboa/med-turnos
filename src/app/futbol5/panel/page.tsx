"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Futbol5PanelPage() {

  const router = useRouter();

  const [turnos, setTurnos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const auth = localStorage.getItem("auth");
    const doctor = localStorage.getItem("doctor");

    if (!auth || doctor !== "futbol5") {
      router.push("/futbol5/login");
      return;
    }

    obtenerTurnos();

  }, []);

  const obtenerTurnos = async () => {

    try {

      const res = await fetch("/api/turnos?doctor=futbol5");
      const data = await res.json();

      setTurnos(data);

    } catch {

      alert("Error al obtener reservas");

    }

    setLoading(false);

  };

  const eliminarTurno = async (id: number) => {

    const confirmar = confirm("¿Eliminar reserva?");

    if (!confirmar) return;

    const { error } = await supabase
      .from("turnos")
      .delete()
      .eq("id", id);

    if (error) {

      alert("Error al eliminar");
      return;

    }

    setTurnos((prev) =>
      prev.filter((t) => t.id !== id)
    );

  };

  const cerrarSesion = () => {

    localStorage.removeItem("auth");
    localStorage.removeItem("doctor");

    router.push("/futbol5/login");

  };

  return (

    <div className="min-h-screen bg-green-50">

      <div className="bg-white border-b border-green-200">

        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">

          <div className="flex items-center gap-4">

            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center text-5xl">
              ⚽
            </div>

            <div>

              <h1 className="text-3xl font-bold text-green-700">
                Panel Fútbol 5
              </h1>

              <p className="text-slate-500">
                Reservas de canchas
              </p>

            </div>

          </div>

          <button
            onClick={cerrarSesion}
            className="bg-red-500 text-white px-5 py-3 rounded-2xl"
          >
            Cerrar sesión
          </button>

        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white rounded-3xl p-6 shadow">

            <p className="text-slate-500">
              Reservas totales
            </p>

            <h2 className="text-4xl font-bold text-green-700">
              {turnos.length}
            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow">

            <p className="text-slate-500">
              Reservas hoy
            </p>

            <h2 className="text-4xl font-bold text-green-700">
              {
                turnos.filter(
                  (t) =>
                    t.fecha ===
                    new Date()
                      .toISOString()
                      .split("T")[0]
                ).length
              }
            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow">

            <p className="text-slate-500">
              Estado
            </p>

            <h2 className="text-3xl font-bold text-green-600">
              Online
            </h2>

          </div>

        </div>

        <div className="bg-white rounded-3xl shadow overflow-hidden">

          <div className="p-6 border-b">

            <h2 className="text-2xl font-bold text-green-700">
              Reservas
            </h2>

          </div>

          {loading ? (

            <div className="p-10">
              Cargando...
            </div>

          ) : (

            <table className="w-full">

              <thead>

                <tr className="bg-green-50">

                  <th className="text-left px-6 py-4">Cliente</th>
                  <th className="text-left px-6 py-4">Teléfono</th>
                  <th className="text-left px-6 py-4">Fecha</th>
                  <th className="text-left px-6 py-4">Hora</th>
                  <th className="text-left px-6 py-4">Acción</th>

                </tr>

              </thead>

              <tbody>

                {turnos.map((turno) => (

                  <tr key={turno.id} className="border-t">

                    <td className="px-6 py-4">{turno.nombre}</td>
                    <td className="px-6 py-4">{turno.telefono}</td>
                    <td className="px-6 py-4">{turno.fecha}</td>
                    <td className="px-6 py-4">{turno.hora}</td>

                    <td className="px-6 py-4">

                      <button
                        onClick={() =>
                          eliminarTurno(turno.id)
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded-xl"
                      >
                        Eliminar
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>

  );

}