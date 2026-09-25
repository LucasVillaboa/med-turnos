"use client";

import { useEffect, useState } from "react";
import {
  Check,
  CalendarDays,
  Clock3,
  UserRound,
  Scissors,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

type Turno = {
  nombre?: string;
  telefono?: string;
  fecha?: string;
  hora?: string;
  barbero?: string;
  servicio?: string;
  precio?: number | string;
};

export default function Exito() {
  const [turno, setTurno] = useState<Turno | null>(null);

  useEffect(() => {
    const turnoGuardado = localStorage.getItem("turno");

    if (!turnoGuardado) return;

    try {
      const data = JSON.parse(turnoGuardado);

      setTurno(data);

      // Eliminamos el turno guardado porque ya fue confirmado.
      localStorage.removeItem("turno");
    } catch (error) {
      console.error("Error al cargar el turno:", error);
    }
  }, []);

  const formatearPrecio = (precio?: number | string) => {
    if (!precio) return "";

    const numero = Number(precio);

    if (isNaN(numero)) {
      return String(precio);
    }

    return `$${numero.toLocaleString("es-AR")}`;
  };

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return "";

    const partes = fecha.split("-");

    if (partes.length !== 3) {
      return fecha;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Encabezado */}
        <div className="text-center mb-7">

          <div className="w-20 h-20 mx-auto rounded-full border border-[#c9a227]/50 bg-[#151515] flex items-center justify-center shadow-[0_0_35px_rgba(201,162,39,0.12)]">

            <div className="w-14 h-14 rounded-full bg-[#c9a227] flex items-center justify-center">
              <Check
                size={32}
                strokeWidth={3}
                className="text-black"
              />
            </div>

          </div>

          <p className="text-[#c9a227] uppercase tracking-[0.25em] text-xs font-semibold mt-6">
            El Templo
          </p>

          <h1 className="text-3xl font-bold mt-2">
            ¡Turno confirmado!
          </h1>

          <p className="text-gray-400 mt-2 text-sm">
            Tu reserva fue realizada correctamente.
          </p>

        </div>

        {/* Detalle del turno */}
        <div className="bg-[#121212] border border-[#2a2a2a] rounded-3xl overflow-hidden shadow-2xl">

          <div className="px-6 py-5 border-b border-[#292929]">

            <p className="text-xs uppercase tracking-widest text-gray-500">
              Detalle de tu turno
            </p>

            <p className="text-lg font-semibold mt-1">
              Guardá estos datos
            </p>

          </div>

          <div className="p-6 space-y-5">

            {/* Fecha */}
            {turno?.fecha && (
              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-[#1b1b1b] border border-[#292929] flex items-center justify-center shrink-0">
                  <CalendarDays
                    size={20}
                    className="text-[#c9a227]"
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Fecha
                  </p>

                  <p className="text-base font-medium">
                    {formatearFecha(turno.fecha)}
                  </p>
                </div>

              </div>
            )}

            {/* Horario */}
            {turno?.hora && (
              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-[#1b1b1b] border border-[#292929] flex items-center justify-center shrink-0">
                  <Clock3
                    size={20}
                    className="text-[#c9a227]"
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Horario
                  </p>

                  <p className="text-base font-medium">
                    {turno.hora} hs
                  </p>
                </div>

              </div>
            )}

            {/* Barbero */}
            {turno?.barbero && (
              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-[#1b1b1b] border border-[#292929] flex items-center justify-center shrink-0">
                  <UserRound
                    size={20}
                    className="text-[#c9a227]"
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Barbero
                  </p>

                  <p className="text-base font-medium">
                    {turno.barbero}
                  </p>
                </div>

              </div>
            )}

            {/* Servicio */}
            {turno?.servicio && (
              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-[#1b1b1b] border border-[#292929] flex items-center justify-center shrink-0">
                  <Scissors
                    size={20}
                    className="text-[#c9a227]"
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Servicio
                  </p>

                  <p className="text-base font-medium">
                    {turno.servicio}
                  </p>
                </div>

              </div>
            )}

            {/* Precio */}
            {turno?.precio && (
              <div className="pt-5 mt-1 border-t border-[#292929] flex items-center justify-between">

                <span className="text-gray-400">
                  Total
                </span>

                <span className="text-xl font-bold text-[#c9a227]">
                  {formatearPrecio(turno.precio)}
                </span>

              </div>
            )}

          </div>
        </div>

        {/* Parte inferior */}
        <div className="text-center mt-6">

          <p className="text-sm text-gray-500">
            Te esperamos en{" "}
            <span className="text-gray-300">
              El Templo
            </span>
            .
          </p>

          <Link
            href="/barberia"
            className="inline-flex items-center justify-center gap-2 mt-6 w-full h-12 rounded-xl border border-[#333] bg-[#151515] text-sm font-medium text-gray-200 hover:border-[#c9a227]/50 hover:text-[#c9a227] transition"
          >
            <ArrowLeft size={17} />
            Volver al inicio
          </Link>

        </div>

      </div>
    </main>
  );
}

