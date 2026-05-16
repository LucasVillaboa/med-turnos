"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PanelPage() {

  const router = useRouter();

  const [turnos, setTurnos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 PROTEGER PANEL
  useEffect(() => {

    const auth = localStorage.getItem("auth");

    if (auth !== "true") {
      router.push("/login");
    }

  }, [router]);

  // 🔥 TRAER TURNOS
  useEffect(() => {

    const obtenerTurnos = async () => {

      const doctor = localStorage.getItem("doctor");

      const { data, error } = await supabase
        .from("turnos")
        .select("*")
        .eq("doctor", doctor)
        .order("fecha", { ascending: true });

      if (!error && data) {
        setTurnos(data);
      }

      setLoading(false);
    };

    obtenerTurnos();

  }, []);

  // 🔥 ELIMINAR TURNO
  const eliminarTurno = async (id: number) => {

    const confirmar = confirm(
      "¿Seguro que querés eliminar este turno?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("turnos")
      .delete()
      .eq("id", id);

    if (!error) {
      setTurnos(turnos.filter((t) => t.id !== id));
    }
  };

  // 🔥 LOGOUT
  const logout = () => {

    localStorage.removeItem("auth");
    localStorage.removeItem("doctor");

    router.push("/login");
  };

  // 🔥 ESTADÍSTICAS
  const totalTurnos = turnos.length;

  const pacientesUnicos = new Set(
    turnos.map((t) => t.email)
  ).size;

  const fechaHoy = new Date().toISOString().split("T")[0];

  const turnosHoy = turnos.filter(
    (t) => t.fecha === fechaHoy
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold text-slate-800">
              Panel profesional
            </h1>

            <p className="text-slate-500 text-sm mt-1">
              Gestión de turnos y pacientes
            </p>

          </div>

          <button
            onClick={logout}
            className="
              bg-red-500
              hover:bg-red-600
              transition
              text-white
              px-5
              py-3
              rounded-2xl
              font-medium
              shadow-sm
            "
          >
            Cerrar sesión
          </button>

        </div>

      </header>

      {/* CONTENIDO */}
      <main className="max-w-7xl mx-auto p-6">

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* TOTAL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

            <p className="text-slate-500 text-sm mb-2">
              Total turnos
            </p>

            <h2 className="text-4xl font-bold text-slate-800">
              {totalTurnos}
            </h2>

          </div>

          {/* PACIENTES */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

            <p className="text-slate-500 text-sm mb-2">
              Pacientes únicos
            </p>

            <h2 className="text-4xl font-bold text-slate-800">
              {pacientesUnicos}
            </h2>

          </div>

          {/* HOY */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

            <p className="text-slate-500 text-sm mb-2">
              Turnos de hoy
            </p>

            <h2 className="text-4xl font-bold text-emerald-600">
              {turnosHoy}
            </h2>

          </div>

        </div>

        {/* TABLA */}
        <div className="mt-8 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

          {/* HEADER TABLA */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-slate-800">
                Próximos turnos
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                Listado de pacientes registrados
              </p>

            </div>

          </div>

          {loading ? (

            <div className="p-10 text-center text-slate-500">
              Cargando turnos...
            </div>

          ) : turnos.length === 0 ? (

            <div className="p-10 text-center">

              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                Todavía no hay turnos
              </h3>

              <p className="text-slate-500">
                Los nuevos pacientes aparecerán acá automáticamente.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-100 text-slate-600 text-sm">

                  <tr>

                    <th className="text-left p-4">
                      Paciente
                    </th>

                    <th className="text-left p-4">
                      Fecha
                    </th>

                    <th className="text-left p-4">
                      Hora
                    </th>

                    <th className="text-left p-4">
                      Teléfono
                    </th>

                    <th className="text-left p-4">
                      Email
                    </th>

                    <th className="text-left p-4">
                      Acciones
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {turnos.map((turno) => (

                    <tr
                      key={turno.id}
                      className="border-t border-slate-100 hover:bg-slate-50 transition"
                    >

                      <td className="p-4 font-semibold text-slate-800">
                        {turno.nombre}
                      </td>

                      <td className="p-4 text-slate-600">
                        {turno.fecha}
                      </td>

                      <td className="p-4 text-slate-600">
                        {turno.hora}
                      </td>

                      <td className="p-4 text-slate-600">
                        {turno.telefono}
                      </td>

                      <td className="p-4 text-slate-600">
                        {turno.email}
                      </td>

                      <td className="p-4">

                        <button
                          onClick={() => eliminarTurno(turno.id)}
                          className="
                            bg-red-100
                            hover:bg-red-200
                            text-red-600
                            px-4
                            py-2
                            rounded-xl
                            text-sm
                            font-medium
                            transition
                          "
                        >
                          Eliminar
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}