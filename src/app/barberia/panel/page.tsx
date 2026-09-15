"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
  Scissors,
  LogOut,
  CalendarDays,
  CalendarCheck,
  Wifi,
  Trash2,
  User,
  Phone,
  Clock,
  MapPin,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BarberiaPanelPage() {
  const router = useRouter();

  const [turnos, setTurnos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    const doctor = localStorage.getItem("doctor");

    if (!auth || doctor !== "barberia") {
      router.push("/barberia/login");
      return;
    }

    obtenerTurnos();
  }, []);

  const obtenerTurnos = async () => {
    try {
      const res = await fetch("/api/turnos?doctor=barberia");
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

    router.push("/barberia/login");
  };

  const reservasHoy = turnos.filter(
    (t) =>
      t.fecha ===
      new Date().toISOString().split("T")[0]
  ).length;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* HEADER */}

      <header className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-500/30 bg-yellow-500/10">
              <Scissors className="h-8 w-8 text-yellow-400" />
            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-500">
                Barber
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                Panel de administración
              </h1>

            </div>

          </div>

          <button
            onClick={cerrarSesion}
            className="
              flex
              min-h-[48px]
              items-center
              justify-center
              gap-2
              rounded-2xl
              border
              border-zinc-700
              bg-zinc-900
              px-5
              font-semibold
              text-zinc-300
              transition
              hover:border-red-500/40
              hover:bg-red-500/10
              hover:text-red-400
            "
          >
            <LogOut className="h-5 w-5" />
            Cerrar sesión
          </button>

        </div>

      </header>

      {/* CONTENIDO */}

      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* PRESENTACIÓN */}

        <div className="mb-8">

          <p className="text-sm text-zinc-500">
            Resumen de actividad
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Tus reservas
          </h2>

        </div>

        {/* CARDS */}

        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">

          {/* RESERVAS TOTALES */}

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-zinc-500">
                  Reservas totales
                </p>

                <h2 className="mt-3 text-4xl font-black text-white">
                  {turnos.length}
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/10">
                <CalendarCheck className="h-6 w-6 text-yellow-400" />
              </div>

            </div>

          </div>

          {/* RESERVAS HOY */}

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-zinc-500">
                  Reservas hoy
                </p>

                <h2 className="mt-3 text-4xl font-black text-white">
                  {reservasHoy}
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/10">
                <CalendarDays className="h-6 w-6 text-yellow-400" />
              </div>

            </div>

          </div>

          {/* ESTADO */}

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-zinc-500">
                  Estado
                </p>

                <h2 className="mt-3 text-3xl font-black text-emerald-400">
                  Online
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10">
                <Wifi className="h-6 w-6 text-emerald-400" />
              </div>

            </div>

          </div>

        </div>

        {/* TABLA */}

        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">

          <div className="flex flex-col gap-2 border-b border-zinc-800 p-6 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-2xl font-bold">
                Reservas
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Turnos registrados en el sistema
              </p>

            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
              <CalendarDays className="h-5 w-5 text-yellow-400" />
            </div>

          </div>

          {loading ? (

            <div className="flex flex-col items-center justify-center p-16 text-center">

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-yellow-500/20 bg-yellow-500/10">
                <CalendarDays className="h-6 w-6 animate-pulse text-yellow-400" />
              </div>

              <p className="text-zinc-400">
                Cargando reservas...
              </p>

            </div>

          ) : turnos.length === 0 ? (

            <div className="flex flex-col items-center justify-center p-16 text-center">

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800">
                <CalendarDays className="h-7 w-7 text-zinc-500" />
              </div>

              <h3 className="text-lg font-semibold">
                No hay reservas todavía
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Cuando alguien reserve un turno aparecerá aquí.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[760px]">

                <thead>

                  <tr className="border-b border-zinc-800 bg-zinc-950/60">

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Cliente
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Teléfono
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Fecha
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Hora
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Acción
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {turnos.map((turno) => (

                    <tr
                      key={turno.id}
                      className="border-b border-zinc-800/80 transition hover:bg-zinc-800/30"
                    >

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800">
                            <User className="h-5 w-5 text-zinc-400" />
                          </div>

                          <span className="font-medium text-zinc-200">
                            {turno.nombre}
                          </span>

                        </div>

                      </td>

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2 text-zinc-400">

                          <Phone className="h-4 w-4" />

                          {turno.telefono}

                        </div>

                      </td>

                      <td className="px-6 py-5 text-zinc-300">
                        {turno.fecha}
                      </td>

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2">

                          <Clock className="h-4 w-4 text-yellow-500" />

                          <span className="font-medium text-zinc-200">
                            {turno.hora}
                          </span>

                        </div>

                      </td>

                      <td className="px-6 py-5">

                        <button
                          onClick={() =>
                            eliminarTurno(turno.id)
                          }
                          className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-red-500/20
                            bg-red-500/10
                            px-4
                            py-2.5
                            font-semibold
                            text-red-400
                            transition
                            hover:border-red-500/40
                            hover:bg-red-500/20
                            hover:text-red-300
                          "
                        >
                          <Trash2 className="h-4 w-4" />
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

        {/* FOOTER */}

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-600">

          <MapPin className="h-3.5 w-3.5" />

          <span>Barber · Resistencia, Chaco</span>

        </div>

      </div>

    </main>
  );
}

