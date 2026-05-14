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

  // 🔥 LOGOUT
  const logout = () => {

    localStorage.removeItem("auth");

    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">

        <div className="max-w-7xl mx-auto flex items-center justify-between">

          <div>

            <h1 className="text-2xl font-bold text-slate-800">
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
              py-2
              rounded-xl
              font-medium
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

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

            <p className="text-slate-500 text-sm mb-2">
              Total turnos
            </p>

            <h2 className="text-4xl font-bold text-slate-800">
              {turnos.length}
            </h2>

          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

            <p className="text-slate-500 text-sm mb-2">
              Pacientes
            </p>

            <h2 className="text-4xl font-bold text-slate-800">
              {turnos.length}
            </h2>

          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

            <p className="text-slate-500 text-sm mb-2">
              Señales pagadas
            </p>

            <h2 className="text-4xl font-bold text-emerald-600">
              {turnos.length}
            </h2>

          </div>

        </div>

        {/* TABLA */}
        <div className="mt-8 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

          <div className="p-6 border-b border-slate-200">

            <h2 className="text-xl font-bold text-slate-800">
              Próximos turnos
            </h2>

          </div>

          {loading ? (

            <div className="p-6 text-slate-500">
              Cargando turnos...
            </div>

          ) : turnos.length === 0 ? (

            <div className="p-6 text-slate-500">
              Todavía no hay turnos cargados.
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

                  </tr>

                </thead>

                <tbody>

                  {turnos.map((turno) => (

                    <tr
                      key={turno.id}
                      className="border-t border-slate-100"
                    >

                      <td className="p-4 font-medium text-slate-800">
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