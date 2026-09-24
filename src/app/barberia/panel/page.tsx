"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
  LogOut,
  CalendarDays,
  CalendarCheck,
  Trash2,
  User,
  Phone,
  Clock,
  Scissors,
  Search,
  History,
  X,
  Users,
  DollarSign,
  BarChart3,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Turno = {
  id: string;
  nombre: string;
  telefono: string;
  fecha: string;
  hora: string;
  servicio?: string;
  precio?: number;
  barbero?: string;
  created_at?: string;
};

export default function BarberiaPanelPage() {
  const router = useRouter();

  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [cargando, setCargando] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Turno | null>(null);

  const fechaActual = new Date();

  const [mesSeleccionado, setMesSeleccionado] = useState(
    `${fechaActual.getFullYear()}-${String(
      fechaActual.getMonth() + 1
    ).padStart(2, "0")}`
  );

  useEffect(() => {
    const cargarTurnos = async () => {
      try {
        const response = await fetch(
          "/api/turnos?doctor=barberia"
        );

        const data = await response.json();

        if (Array.isArray(data)) {
          setTurnos(data);
        }
      } catch (error) {
        console.error("Error cargando turnos:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarTurnos();
  }, []);

  const eliminarTurno = async (id: string) => {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar esta reserva?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("turnos")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("No se pudo eliminar la reserva.");
      return;
    }

    setTurnos((prev) =>
      prev.filter((turno) => turno.id !== id)
    );
  };

  const cerrarSesion = () => {
    router.push("/barberia/login");
  };

  const formatearFecha = (fecha: string) => {
    if (!fecha) return "-";

    const partes = fecha.split("-");

    if (partes.length !== 3) {
      return fecha;
    }

    const [anio, mes, dia] = partes;

    return `${dia}/${mes}/${anio}`;
  };

  const hoy = new Date();

  const fechaHoy = `${hoy.getFullYear()}-${String(
    hoy.getMonth() + 1
  ).padStart(2, "0")}-${String(hoy.getDate()).padStart(
    2,
    "0"
  )}`;

  const reservasHoy = turnos.filter(
    (turno) => turno.fecha === fechaHoy
  );

  const turnosDelMes = turnos.filter((turno) =>
    turno.fecha?.startsWith(mesSeleccionado)
  );

  const clientesDelMes = new Set(
    turnosDelMes.map((turno) => turno.telefono)
  ).size;

  const cortesDelMes = turnosDelMes.reduce(
    (total, turno) => {
      const servicio = String(
        turno.servicio || ""
      ).toLowerCase();

      return (
        total +
        (servicio.includes("corte") ? 1 : 0)
      );
    },
    0
  );

  const barbasDelMes = turnosDelMes.reduce(
    (total, turno) => {
      const servicio = String(
        turno.servicio || ""
      ).toLowerCase();

      return (
        total +
        (servicio.includes("barba") ? 1 : 0)
      );
    },
    0
  );

  const cejasDelMes = turnosDelMes.reduce(
    (total, turno) => {
      const servicio = String(
        turno.servicio || ""
      ).toLowerCase();

      return (
        total +
        (servicio.includes("ceja") ? 1 : 0)
      );
    },
    0
  );

  const ingresosDelMes = turnosDelMes.reduce(
    (total, turno) => {
      return total + Number(turno.precio || 0);
    },
    0
  );

  const nombreMes = new Date(
    `${mesSeleccionado}-01T12:00:00`
  ).toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });

  const clientesUnicos = Array.from(
    new Map(
      turnos.map((turno) => [
        turno.telefono,
        turno,
      ])
    ).values()
  );

  const clientesFiltrados = clientesUnicos.filter(
    (cliente) => {
      const texto = busqueda.toLowerCase();

      return (
        cliente.nombre
          ?.toLowerCase()
          .includes(texto) ||
        cliente.telefono
          ?.toLowerCase()
          .includes(texto)
      );
    }
  );

  const historialCliente = clienteSeleccionado
    ? turnos
        .filter(
          (turno) =>
            turno.telefono ===
            clienteSeleccionado.telefono
        )
        .sort((a, b) => {
          const fechaA = `${a.fecha || ""} ${
            a.hora || ""
          }`;

          const fechaB = `${b.fecha || ""} ${
            b.hora || ""
          }`;

          return fechaB.localeCompare(fechaA);
        })
    : [];

  const totalGastadoCliente =
    historialCliente.reduce(
      (total, turno) =>
        total + Number(turno.precio || 0),
      0
    );

  const turnosOrdenados = [...turnos].sort(
    (a, b) => {
      const fechaA = a.created_at
        ? new Date(a.created_at).getTime()
        : 0;

      const fechaB = b.created_at
        ? new Date(b.created_at).getTime()
        : 0;

      return fechaB - fechaA;
    }
  );

  if (cargando) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">
          Cargando panel...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HEADER */}

      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/barberia.jpeg"
                alt="Barbería"
                className="h-14 w-14 rounded-full object-cover border border-yellow-500/40"
              />

              <div>
                <h1 className="text-xl font-black">
                  Panel de administración
                </h1>

                <p className="text-sm text-zinc-500">
                  Barbería · Gestión de reservas
                </p>
              </div>
            </div>

            <button
              onClick={cerrarSesion}
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-red-500/40 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* RESUMEN GENERAL */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500">
                Total de reservas
              </p>

              <CalendarDays className="h-5 w-5 text-yellow-500" />
            </div>

            <p className="mt-3 text-3xl font-black">
              {turnos.length}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500">
                Reservas hoy
              </p>

              <CalendarCheck className="h-5 w-5 text-yellow-500" />
            </div>

            <p className="mt-3 text-3xl font-black">
              {reservasHoy.length}
            </p>
          </div>
        </section>

        {/* RESUMEN MENSUAL */}

        <section className="mt-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black">
                Resumen mensual
              </h2>

              <p className="text-sm capitalize text-zinc-500">
                {nombreMes}
              </p>
            </div>

            <input
              type="month"
              value={mesSeleccionado}
              onChange={(e) =>
                setMesSeleccionado(e.target.value)
              }
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-white outline-none focus:border-yellow-500"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {/* TURNOS */}

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">
                  Turnos
                </p>

                <BarChart3 className="h-5 w-5 text-yellow-500" />
              </div>

              <p className="mt-3 text-3xl font-black text-white">
                {turnosDelMes.length}
              </p>
            </div>

            {/* CLIENTES */}

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">
                  Clientes
                </p>

                <Users className="h-5 w-5 text-yellow-500" />
              </div>

              <p className="mt-3 text-3xl font-black text-white">
                {clientesDelMes}
              </p>
            </div>

            {/* CORTES */}

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">
                  Cortes
                </p>

                <Scissors className="h-5 w-5 text-yellow-500" />
              </div>

              <p className="mt-3 text-3xl font-black text-white">
                {cortesDelMes}
              </p>
            </div>

            {/* BARBAS */}

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">
                  Barbas
                </p>

                <Scissors className="h-5 w-5 text-yellow-500" />
              </div>

              <p className="mt-3 text-3xl font-black text-white">
                {barbasDelMes}
              </p>
            </div>

            {/* CEJAS */}

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">
                  Cejas
                </p>

                <Scissors className="h-5 w-5 text-yellow-500" />
              </div>

              <p className="mt-3 text-3xl font-black text-white">
                {cejasDelMes}
              </p>
            </div>

            {/* INGRESOS */}

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">
                  Ingresos
                </p>

                <DollarSign className="h-5 w-5 text-yellow-500" />
              </div>

              <p className="mt-3 text-3xl font-black text-white">
                ${ingresosDelMes}
              </p>
            </div>
          </div>
        </section>

        {/* HISTORIAL DE CLIENTES */}

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-black">
              Historial de clientes
            </h2>

            <p className="text-sm text-zinc-500">
              Buscá un cliente por nombre o número de teléfono
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

            <input
              type="text"
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
              placeholder="Buscar por nombre o teléfono..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-12 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-yellow-500"
            />
          </div>

          {busqueda && (
            <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
              {clientesFiltrados.length === 0 ? (
                <div className="p-5 text-sm text-zinc-500">
                  No se encontraron clientes.
                </div>
              ) : (
                clientesFiltrados.map((cliente) => (
                  <button
                    key={cliente.telefono}
                    onClick={() =>
                      setClienteSeleccionado(cliente)
                    }
                    className="flex w-full items-center justify-between border-b border-zinc-800 px-5 py-4 text-left transition last:border-b-0 hover:bg-zinc-900"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        {cliente.nombre}
                      </p>

                      <p className="text-sm text-zinc-500">
                        {cliente.telefono}
                      </p>
                    </div>

                    <History className="h-5 w-5 text-yellow-500" />
                  </button>
                ))
              )}
            </div>
          )}
        </section>

        {/* TABLA DE RESERVAS */}

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-black">
              Reservas
            </h2>

            <p className="text-sm text-zinc-500">
              Todas las reservas de la barbería
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
            {turnosOrdenados.length === 0 ? (
              <div className="p-8 text-center text-sm text-zinc-500">
                No hay reservas todavía.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left">
                  <thead className="border-b border-zinc-800 bg-zinc-900/60">
                    <tr>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Cliente
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Teléfono
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Fecha
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Hora
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Servicio
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Barbero
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Precio
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Acción
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {turnosOrdenados.map((turno) => (
                      <tr
                        key={turno.id}
                        className="border-b border-zinc-800 last:border-b-0"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-yellow-500" />

                            <span className="font-medium text-white">
                              {turno.nombre}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-zinc-400">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />

                            {turno.telefono}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-zinc-400">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />

                            {formatearFecha(
                              turno.fecha
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-zinc-400">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />

                            {turno.hora}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-zinc-400">
                          {turno.servicio || "-"}
                        </td>

                        <td className="px-5 py-4 text-sm text-zinc-400">
                          {turno.barbero || "-"}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-white">
                          ${turno.precio || 0}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() =>
                              eliminarTurno(turno.id)
                            }
                            className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                            title="Eliminar reserva"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* MODAL HISTORIAL CLIENTE */}

      {clienteSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <div>
                <h3 className="font-black text-white">
                  Historial del cliente
                </h3>

                <p className="text-sm text-zinc-500">
                  {clienteSeleccionado.nombre}
                </p>
              </div>

              <button
                onClick={() =>
                  setClienteSeleccionado(null)
                }
                className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-900 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto">
              <div className="border-b border-zinc-800 bg-zinc-900/40 px-5 py-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      Teléfono
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      {clienteSeleccionado.telefono}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      Reservas
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      {historialCliente.length}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      Total gastado
                    </p>

                    <p className="mt-1 text-sm font-semibold text-yellow-500">
                      ${totalGastadoCliente}
                    </p>
                  </div>
                </div>
              </div>

              {historialCliente.length === 0 ? (
                <div className="p-6 text-center text-sm text-zinc-500">
                  No hay reservas para este cliente.
                </div>
              ) : (
                <div className="divide-y divide-zinc-800">
                  {historialCliente.map((turno) => (
                    <div
                      key={turno.id}
                      className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-white">
                          {turno.servicio || "Servicio"}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-4 text-sm text-zinc-500">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="h-4 w-4" />

                            {formatearFecha(
                              turno.fecha
                            )}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />

                            {turno.hora}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Scissors className="h-4 w-4" />

                            {turno.barbero || "-"}
                          </span>
                        </div>
                      </div>

                      <p className="font-bold text-yellow-500">
                        ${turno.precio || 0}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}








