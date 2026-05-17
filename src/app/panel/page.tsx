"use client";

import { useEffect, useMemo, useState } from "react";
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

  const [busqueda, setBusqueda] = useState("");

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

  // 🔥 ELIMINAR
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

  // 🔥 FILTRO
  const turnosFiltrados = useMemo(() => {

    return turnos.filter((turno) =>
      turno.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      turno.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
      turno.telefono?.toLowerCase().includes(busqueda.toLowerCase())
    );

  }, [turnos, busqueda]);

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
    <div className="min-h-screen bg-slate-100">

      {/* SIDEBAR DESKTOP */}
      <div className="fixed top-0 left-0 h-full w-72 bg-slate-900 text-white hidden lg:flex flex-col">

        <div className="p-8 border-b border-slate-800">

          <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-3xl mb-4">
            🩺
          </div>

          <h2 className="text-2xl font-bold">
            Med Turnos
          </h2>

          <p className="text-slate-400 text-sm mt-2">
            Panel profesional
          </p>

        </div>

        <div className="flex-1 p-6">

          <div className="bg-slate-800 rounded-2xl p-5">

            <p className="text-slate-400 text-sm mb-1">
              Estado del sistema
            </p>

            <h3 className="text-emerald-400 font-semibold">
              Operativo
            </h3>

          </div>

        </div>

        <div className="p-6">

          <button
            onClick={logout}
            className="
              w-full
              bg-red-500
              hover:bg-red-600
              transition
              py-3
              rounded-2xl
              font-semibold
            "
          >
            Cerrar sesión
          </button>

        </div>

      </div>

      {/* CONTENIDO */}
      <main className="lg:ml-72 p-4 md:p-8">

        {/* MOBILE HEADER */}
        <div className="lg:hidden mb-6">

          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-2xl">
                  🩺
                </div>

                <div>

                  <h1 className="text-2xl font-bold">
                    Med Turnos
                  </h1>

                  <p className="text-slate-300 text-sm">
                    Panel profesional
                  </p>

                </div>

              </div>

              {/* 🔥 BOTÓN MOBILE */}
              <button
                onClick={logout}
                className="
                  bg-red-500
                  hover:bg-red-600
                  transition
                  px-4
                  py-2
                  rounded-2xl
                  text-sm
                  font-semibold
                  whitespace-nowrap
                "
              >
                Salir
              </button>

            </div>

          </div>

        </div>

        {/* TOP */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>

            <h1 className="text-4xl font-bold text-slate-800">
              Dashboard
            </h1>

            <p className="text-slate-500 mt-2">
              Gestión inteligente de turnos y pacientes
            </p>

          </div>

          <input
            type="text"
            placeholder="Buscar paciente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="
              w-full
              md:w-80
              bg-white
              text-slate-900
              placeholder:text-slate-400
              border
              border-slate-300
              rounded-2xl
              px-5
              py-4
              outline-none
              shadow-sm
              focus:ring-4
              focus:ring-emerald-100
              focus:border-emerald-500
            "
          />

        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500 text-sm">
                  Total turnos
                </p>

                <h2 className="text-5xl font-bold text-slate-800 mt-2">
                  {totalTurnos}
                </h2>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">
                📅
              </div>

            </div>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500 text-sm">
                  Pacientes únicos
                </p>

                <h2 className="text-5xl font-bold text-slate-800 mt-2">
                  {pacientesUnicos}
                </h2>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                👥
              </div>

            </div>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500 text-sm">
                  Turnos hoy
                </p>

                <h2 className="text-5xl font-bold text-emerald-600 mt-2">
                  {turnosHoy}
                </h2>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">
                ✅
              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}