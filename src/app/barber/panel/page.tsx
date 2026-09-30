"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { createClient } from "@supabase/supabase-js";

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
  created_at?: string;
};

export default function BarberPanelPage() {
  const router = useRouter();

  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Turno | null>(null);

  const [mesSeleccionado, setMesSeleccionado] = useState(() => {
    const ahora = new Date();
    return `${ahora.getFullYear()}-${String(
      ahora.getMonth() + 1
    ).padStart(2, "0")}`;
  });

  // =========================
  // CARGAR TURNOS
  // =========================

  useEffect(() => {
    cargarTurnos();
  }, []);

  const cargarTurnos = async () => {
    try {
      setCargando(true);

      const response = await fetch("/api/turnos?doctor=barber");

      if (!response.ok) {
        throw new Error("No se pudieron cargar los turnos");
      }

      const data = await response.json();

      setTurnos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando turnos:", error);
      setTurnos([]);
    } finally {
      setCargando(false);
    }
  };

  // =========================
  // ELIMINAR TURNO
  // =========================

  const eliminarTurno = async (id: string) => {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar esta reserva?"
    );

    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from("turnos")
        .delete()
        .eq("id", id)
        .eq("doctor", "barber");

      if (error) {
        console.error(error);
        alert("No se pudo eliminar la reserva.");
        return;
      }

      setTurnos((prev) => prev.filter((turno) => turno.id !== id));

      if (clienteSeleccionado?.id === id) {
        setClienteSeleccionado(null);
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al eliminar la reserva.");
    }
  };

  // =========================
  // CERRAR SESIÓN
  // =========================

  const cerrarSesion = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("doctor");

    router.push("/barber/login");
  };

  // =========================
  // FECHA ACTUAL
  // =========================

  const hoy = new Date();

  const fechaHoy = `${hoy.getFullYear()}-${String(
    hoy.getMonth() + 1
  ).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;

  // =========================
  // RESERVAS DE HOY
  // =========================

  const turnosDeHoy = useMemo(() => {
    return turnos
      .filter((turno) => turno.fecha === fechaHoy)
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }, [turnos, fechaHoy]);

  // =========================
  // MES SELECCIONADO
  // =========================

  const turnosDelMes = useMemo(() => {
    return turnos.filter((turno) =>
      turno.fecha.startsWith(mesSeleccionado)
    );
  }, [turnos, mesSeleccionado]);

  // =========================
  // CLIENTES DEL MES
  // =========================

  const clientesDelMes = useMemo(() => {
    const clientes = new Set(
      turnosDelMes.map((turno) => turno.telefono)
    );

    return clientes.size;
  }, [turnosDelMes]);

  // =========================
  // SERVICIOS DEL MES
  // =========================

  const cortesDelMes = useMemo(() => {
    return turnosDelMes.filter((turno) =>
      turno.servicio?.toLowerCase().includes("corte")
    ).length;
  }, [turnosDelMes]);

  const barbasDelMes = useMemo(() => {
    return turnosDelMes.filter((turno) =>
      turno.servicio?.toLowerCase().includes("barba")
    ).length;
  }, [turnosDelMes]);

  const cejasDelMes = useMemo(() => {
    return turnosDelMes.filter((turno) =>
      turno.servicio?.toLowerCase().includes("ceja")
    ).length;
  }, [turnosDelMes]);

  // =========================
  // INGRESOS DEL MES
  // =========================

  const ingresosDelMes = useMemo(() => {
    return turnosDelMes.reduce(
      (total, turno) => total + Number(turno.precio || 0),
      0
    );
  }, [turnosDelMes]);

  // =========================
  // SEMANA ACTUAL
  // =========================

  const inicioSemana = useMemo(() => {
    const fecha = new Date();

    const dia = fecha.getDay();

    const diferencia = dia === 0 ? 6 : dia - 1;

    fecha.setDate(fecha.getDate() - diferencia);
    fecha.setHours(0, 0, 0, 0);

    return fecha;
  }, []);

  const finSemana = useMemo(() => {
    const fecha = new Date(inicioSemana);

    fecha.setDate(fecha.getDate() + 6);
    fecha.setHours(23, 59, 59, 999);

    return fecha;
  }, [inicioSemana]);

  const turnosDeLaSemana = useMemo(() => {
    return turnos.filter((turno) => {
      const fecha = new Date(`${turno.fecha}T00:00:00`);

      return fecha >= inicioSemana && fecha <= finSemana;
    });
  }, [turnos, inicioSemana, finSemana]);

  const clientesDeLaSemana = useMemo(() => {
    const clientes = new Set(
      turnosDeLaSemana.map((turno) => turno.telefono)
    );

    return clientes.size;
  }, [turnosDeLaSemana]);

  const cortesDeLaSemana = useMemo(() => {
    return turnosDeLaSemana.filter((turno) =>
      turno.servicio?.toLowerCase().includes("corte")
    ).length;
  }, [turnosDeLaSemana]);

  const barbasDeLaSemana = useMemo(() => {
    return turnosDeLaSemana.filter((turno) =>
      turno.servicio?.toLowerCase().includes("barba")
    ).length;
  }, [turnosDeLaSemana]);

  const cejasDeLaSemana = useMemo(() => {
    return turnosDeLaSemana.filter((turno) =>
      turno.servicio?.toLowerCase().includes("ceja")
    ).length;
  }, [turnosDeLaSemana]);

  const ingresosDeLaSemana = useMemo(() => {
    return turnosDeLaSemana.reduce(
      (total, turno) => total + Number(turno.precio || 0),
      0
    );
  }, [turnosDeLaSemana]);

  const textoSemana = useMemo(() => {
    const opciones: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
    };

    return `${inicioSemana.toLocaleDateString(
      "es-AR",
      opciones
    )} - ${finSemana.toLocaleDateString("es-AR", opciones)}`;
  }, [inicioSemana, finSemana]);

  // =========================
  // CLIENTES
  // =========================

  const clientes = useMemo(() => {
    const mapa = new Map<string, Turno>();

    turnos.forEach((turno) => {
      if (!mapa.has(turno.telefono)) {
        mapa.set(turno.telefono, turno);
      }
    });

    return Array.from(mapa.values());
  }, [turnos]);

  const clientesFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    if (!texto) {
      return clientes;
    }

    return clientes.filter(
      (cliente) =>
        cliente.nombre.toLowerCase().includes(texto) ||
        cliente.telefono.toLowerCase().includes(texto)
    );
  }, [clientes, busqueda]);

  // =========================
  // HISTORIAL DEL CLIENTE
  // =========================

  const historialCliente = useMemo(() => {
    if (!clienteSeleccionado) return [];

    return turnos
      .filter(
        (turno) =>
          turno.telefono === clienteSeleccionado.telefono
      )
      .sort((a, b) => {
        const fechaA = `${a.fecha} ${a.hora}`;
        const fechaB = `${b.fecha} ${b.hora}`;

        return fechaB.localeCompare(fechaA);
      });
  }, [turnos, clienteSeleccionado]);

  const totalGastadoCliente = useMemo(() => {
    return historialCliente.reduce(
      (total, turno) => total + Number(turno.precio || 0),
      0
    );
  }, [historialCliente]);

  // =========================
  // TURNOS ORDENADOS
  // =========================

  const turnosOrdenados = useMemo(() => {
    return [...turnos].sort((a, b) => {
      const fechaA = a.created_at
        ? new Date(a.created_at).getTime()
        : 0;

      const fechaB = b.created_at
        ? new Date(b.created_at).getTime()
        : 0;

      return fechaB - fechaA;
    });
  }, [turnos]);

  // =========================
  // FORMATO DINERO
  // =========================

  const formatearPrecio = (precio?: number) => {
    return `$${Number(precio || 0).toLocaleString("es-AR")}`;
  };

  // =========================
  // FORMATO FECHA
  // =========================

  const formatearFecha = (fecha: string) => {
    const partes = fecha.split("-");

    if (partes.length !== 3) return fecha;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  // =========================
  // RENDER
  // =========================

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HEADER */}

      <header className="border-b border-yellow-500/20 bg-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full border border-yellow-500/50 bg-zinc-900">
              <img
                src="/barber-demo.jpeg"
                alt="Barbería"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-xl font-bold text-yellow-400 sm:text-2xl">
                Panel de administración
              </h1>

              <p className="text-sm text-zinc-400">
                Barbería · Gestión de reservas
              </p>
            </div>
          </div>

          <button
            onClick={cerrarSesion}
            className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">
              Cerrar sesión
            </span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* RESUMEN GENERAL */}

        <section>
          <div className="mb-4 flex items-center gap-2">
            <BarChart3
              size={22}
              className="text-yellow-400"
            />

            <h2 className="text-lg font-bold">
              Resumen general
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-xl bg-yellow-500/10 p-3">
                  <CalendarCheck
                    size={24}
                    className="text-yellow-400"
                  />
                </div>

                <span className="text-3xl font-bold">
                  {turnos.length}
                </span>
              </div>

              <p className="text-sm text-zinc-400">
                Total de reservas
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-xl bg-yellow-500/10 p-3">
                  <CalendarDays
                    size={24}
                    className="text-yellow-400"
                  />
                </div>

                <span className="text-3xl font-bold">
                  {turnosDeHoy.length}
                </span>
              </div>

              <p className="text-sm text-zinc-400">
                Reservas de hoy
              </p>
            </div>
          </div>
        </section>

        {/* RESUMEN MENSUAL */}

        <section>
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <CalendarDays
                size={22}
                className="text-yellow-400"
              />

              <h2 className="text-lg font-bold">
                Resumen mensual
              </h2>
            </div>

            <input
              type="month"
              value={mesSeleccionado}
              onChange={(e) =>
                setMesSeleccionado(e.target.value)
              }
              className="rounded-xl border border-yellow-500/20 bg-zinc-950 px-4 py-2 text-sm text-white outline-none focus:border-yellow-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-4">
              <CalendarCheck
                size={21}
                className="mb-3 text-yellow-400"
              />

              <p className="text-2xl font-bold">
                {turnosDelMes.length}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Turnos
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-4">
              <Users
                size={21}
                className="mb-3 text-yellow-400"
              />

              <p className="text-2xl font-bold">
                {clientesDelMes}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Clientes
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-4">
              <Scissors
                size={21}
                className="mb-3 text-yellow-400"
              />

              <p className="text-2xl font-bold">
                {cortesDelMes}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Cortes
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-4">
              <Scissors
                size={21}
                className="mb-3 text-yellow-400"
              />

              <p className="text-2xl font-bold">
                {barbasDelMes}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Barbas
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-4">
              <User
                size={21}
                className="mb-3 text-yellow-400"
              />

              <p className="text-2xl font-bold">
                {cejasDelMes}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Cejas
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-4">
              <DollarSign
                size={21}
                className="mb-3 text-yellow-400"
              />

              <p className="text-xl font-bold">
                {formatearPrecio(ingresosDelMes)}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Ingresos
              </p>
            </div>
          </div>
        </section>

        {/* RESUMEN SEMANAL */}

        <section>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <CalendarCheck
                size={22}
                className="text-yellow-400"
              />

              <h2 className="text-lg font-bold">
                Resumen semanal
              </h2>
            </div>

            <p className="mt-1 text-sm text-zinc-500">
              Semana del {textoSemana}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-4">
              <CalendarCheck
                size={21}
                className="mb-3 text-yellow-400"
              />

              <p className="text-2xl font-bold">
                {turnosDeLaSemana.length}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Turnos
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-4">
              <Users
                size={21}
                className="mb-3 text-yellow-400"
              />

              <p className="text-2xl font-bold">
                {clientesDeLaSemana}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Clientes
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-4">
              <Scissors
                size={21}
                className="mb-3 text-yellow-400"
              />

              <p className="text-2xl font-bold">
                {cortesDeLaSemana}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Cortes
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-4">
              <Scissors
                size={21}
                className="mb-3 text-yellow-400"
              />

              <p className="text-2xl font-bold">
                {barbasDeLaSemana}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Barbas
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-4">
              <User
                size={21}
                className="mb-3 text-yellow-400"
              />

              <p className="text-2xl font-bold">
                {cejasDeLaSemana}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Cejas
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-4">
              <DollarSign
                size={21}
                className="mb-3 text-yellow-400"
              />

              <p className="text-xl font-bold">
                {formatearPrecio(ingresosDeLaSemana)}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Ingresos
              </p>
            </div>
          </div>
        </section>

        {/* HISTORIAL DE CLIENTES */}

<section>
  <div className="mb-4 flex items-center gap-2">
    <History
      size={22}
      className="text-yellow-400"
    />

    <h2 className="text-lg font-bold">
      Historial de clientes
    </h2>
  </div>

  <div className="mb-5 flex items-center gap-3 rounded-xl border border-yellow-500/20 bg-zinc-950 px-4 py-3">
    <Search
      size={20}
      className="text-zinc-500"
    />

    <input
      type="text"
      value={busqueda}
      onChange={(e) =>
        setBusqueda(e.target.value)
      }
      placeholder="Buscar por nombre o teléfono..."
      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
    />
  </div>

  {busqueda.trim() && (
    <>
      {clientesFiltrados.length === 0 ? (
        <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-8 text-center">
          <Users
            size={38}
            className="mx-auto mb-3 text-zinc-600"
          />

          <p className="text-zinc-400">
            No se encontró ningún cliente.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clientesFiltrados.map((cliente) => {
            const cantidad = turnos.filter(
              (turno) =>
                turno.telefono === cliente.telefono
            ).length;

            const gasto = turnos
              .filter(
                (turno) =>
                  turno.telefono === cliente.telefono
              )
              .reduce(
                (total, turno) =>
                  total + Number(turno.precio || 0),
                0
              );

            return (
              <button
                key={cliente.telefono}
                onClick={() =>
                  setClienteSeleccionado(cliente)
                }
                className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-5 text-left transition hover:border-yellow-500/50 hover:bg-zinc-900"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-500/10">
                    <User
                      size={22}
                      className="text-yellow-400"
                    />
                  </div>

                  <History
                    size={19}
                    className="text-zinc-600"
                  />
                </div>

                <h3 className="font-semibold text-white">
                  {cliente.nombre}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500">
                  <Phone size={15} />
                  {cliente.telefono}
                </div>

                <div className="mt-4 flex justify-between border-t border-white/5 pt-4">
                  <div>
                    <p className="text-lg font-bold">
                      {cantidad}
                    </p>

                    <p className="text-xs text-zinc-600">
                      Reservas
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-yellow-400">
                      {formatearPrecio(gasto)}
                    </p>

                    <p className="text-xs text-zinc-600">
                      Total gastado
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </>
  )}
</section>

        {/* RESERVAS */}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck
                size={22}
                className="text-yellow-400"
              />

              <h2 className="text-lg font-bold">
                Reservas
              </h2>
            </div>

            <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
              {turnos.length} total
            </span>
          </div>

          {cargando ? (
            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-10 text-center">
              <p className="text-zinc-500">
                Cargando reservas...
              </p>
            </div>
          ) : turnosOrdenados.length === 0 ? (
            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-10 text-center">
              <CalendarDays
                size={40}
                className="mx-auto mb-3 text-zinc-600"
              />

              <p className="text-zinc-400">
                Todavía no hay reservas.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-yellow-500/20 bg-zinc-950">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-sm">
                  <thead className="border-b border-white/5 bg-zinc-900">
                    <tr>
                      <th className="px-5 py-4 text-left font-medium text-zinc-400">
                        Cliente
                      </th>

                      <th className="px-5 py-4 text-left font-medium text-zinc-400">
                        Teléfono
                      </th>

                      <th className="px-5 py-4 text-left font-medium text-zinc-400">
                        Fecha
                      </th>

                      <th className="px-5 py-4 text-left font-medium text-zinc-400">
                        Hora
                      </th>

                      <th className="px-5 py-4 text-left font-medium text-zinc-400">
                        Servicio
                      </th>

                      <th className="px-5 py-4 text-left font-medium text-zinc-400">
                        Precio
                      </th>

                      <th className="px-5 py-4 text-center font-medium text-zinc-400">
                        Acción
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {turnosOrdenados.map((turno) => (
                      <tr
                        key={turno.id}
                        className="border-b border-white/5 last:border-0"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-500/10">
                              <User
                                size={17}
                                className="text-yellow-400"
                              />
                            </div>

                            <span className="font-medium">
                              {turno.nombre}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-zinc-400">
                          {turno.telefono}
                        </td>

                        <td className="px-5 py-4 text-zinc-300">
                          {formatearFecha(turno.fecha)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-yellow-400">
                            <Clock size={16} />
                            {turno.hora}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-zinc-300">
                          {turno.servicio || "-"}
                        </td>

                        <td className="px-5 py-4 font-medium text-yellow-400">
                          {formatearPrecio(turno.precio)}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() =>
                              eliminarTurno(turno.id)
                            }
                            className="inline-flex rounded-lg p-2 text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                            title="Eliminar reserva"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* MODAL HISTORIAL CLIENTE */}

      {clienteSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-yellow-500/20 bg-zinc-950 shadow-2xl">
            {/* CABECERA MODAL */}

            <div className="flex items-center justify-between border-b border-white/5 p-5">
              <div>
                <h3 className="text-xl font-bold">
                  {clienteSeleccionado.nombre}
                </h3>

                <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
                  <Phone size={15} />

                  {clienteSeleccionado.telefono}
                </div>
              </div>

              <button
                onClick={() =>
                  setClienteSeleccionado(null)
                }
                className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* RESUMEN CLIENTE */}

            <div className="grid grid-cols-2 gap-4 border-b border-white/5 p-5">
              <div className="rounded-xl bg-zinc-900 p-4">
                <p className="text-2xl font-bold">
                  {historialCliente.length}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Reservas
                </p>
              </div>

              <div className="rounded-xl bg-zinc-900 p-4">
                <p className="text-2xl font-bold text-yellow-400">
                  {formatearPrecio(totalGastadoCliente)}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Total gastado
                </p>
              </div>
            </div>

            {/* HISTORIAL */}

            <div className="max-h-[55vh] overflow-y-auto p-5">
              <h4 className="mb-4 font-semibold">
                Historial de reservas
              </h4>

              <div className="space-y-3">
                {historialCliente.map((turno) => (
                  <div
                    key={turno.id}
                    className="rounded-xl border border-white/5 bg-zinc-900 p-4"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-white">
                          {turno.servicio || "Servicio"}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-zinc-500">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays size={15} />
                            {formatearFecha(
                              turno.fecha
                            )}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Clock size={15} />
                            {turno.hora}
                          </span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="font-semibold text-yellow-400">
                          {formatearPrecio(turno.precio)}
                        </p>

                        <button
                          onClick={() =>
                            eliminarTurno(turno.id)
                          }
                          className="mt-2 text-xs text-red-400 hover:text-red-300"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {historialCliente.length === 0 && (
                  <p className="py-6 text-center text-sm text-zinc-500">
                    No hay reservas registradas.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}