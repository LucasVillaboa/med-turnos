"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
  params: Promise<{ doctor: string }>;
}

const serviciosBarberia = [
  {
    imagen: "/corte-barberia.jpeg",
    alt: "Corte de cabello",
    titulo: "Cortes",
    precio: "$15.000",
  },
  {
    imagen: "/barba-barberia.jpeg",
    alt: "Barba",
    titulo: "Barba",
    precio: "$8.000",
  },
  {
    imagen: "/perfilado-cejas-barberia.jpeg",
    alt: "Perfilado de cejas",
    titulo: "Perfilado de cejas",
    precio: "$5.000",
  },
];

export default async function DoctorPage({ params }: Props) {
  const { doctor } = await params;

  const esLavadero = doctor === "lavadero";
  const esFutbol5 = doctor === "futbol5";
  const esPadel = doctor === "padel";
  const esBarberia = doctor === "barberia";

  const doctors: Record<string, string> = {
    lavadero: "Lavadero",
    futbol5: "Complejo Fútbol 5",
    consultorio: "Consultorio Médico",
    padel: "Canchas de Pádel",
    barberia: "Black Barber",
  };

  const specialties: Record<string, string> = {
    lavadero: "Lavado premium y detallado",
    futbol5: "Reserva de canchas online",
    consultorio: "Turnos médicos online",
    padel: "Reserva de canchas online",
    barberia: "Barbería · Estilo · Precisión",
  };

  /* =========================
     INICIO BARBERÍA
  ========================= */

  if (esBarberia) {
    return <Barberia />;
  }

  /* =========================
     RESTO DE LOS RUBROS
  ========================= */

  return (
    <div
      className={`
        min-h-screen
        flex
        items-center
        justify-center
        px-4

        ${
          esLavadero
            ? "bg-black"
            : esFutbol5
            ? "bg-green-50"
            : esPadel
            ? "bg-blue-50"
            : "bg-slate-50"
        }
      `}
    >
      <div
        className={`
          w-full
          max-w-2xl
          rounded-3xl
          shadow-2xl
          border
          p-10
          text-center

          ${
            esLavadero
              ? "bg-zinc-950 border-yellow-500/30"
              : esFutbol5
              ? "bg-white border-green-300"
              : esPadel
              ? "bg-white border-blue-300"
              : "bg-white border-slate-200"
          }
        `}
      >
        <div className="mb-6">
          {esLavadero ? (
            <img
              src="/lavadero.jpeg"
              alt="Lavadero"
              className="w-48 h-48 object-cover rounded-3xl mx-auto mb-5 border-2 border-yellow-500 shadow-lg"
            />
          ) : esFutbol5 ? (
            <img
              src="/futbol5.jpeg"
              alt="Fútbol 5"
              className="w-48 h-48 object-cover rounded-3xl mx-auto mb-5 border-2 border-yellow-500 shadow-lg"
            />
          ) : esPadel ? (
            <img
              src="/padel.jpeg"
              alt="Pádel"
              className="w-48 h-48 object-cover rounded-3xl mx-auto mb-5 border-2 border-yellow-500 shadow-lg"
            />
          ) : (
            <img
              src="/turnomedico.jpeg"
              alt="Consultorio Médico"
              className="w-48 h-48 object-cover rounded-3xl mx-auto mb-5 border-2 border-yellow-500 shadow-lg"
            />
          )}
        </div>

        <h1
          className={`
            text-4xl
            font-bold
            mb-2

            ${
              esLavadero
                ? "text-yellow-400"
                : esFutbol5
                ? "text-green-700"
                : esPadel
                ? "text-blue-700"
                : "text-slate-800"
            }
          `}
        >
          {doctors[doctor] || "Sistema de reservas"}
        </h1>

        <p
          className={`
            mb-8
            text-lg

            ${
              esLavadero
                ? "text-yellow-200"
                : esFutbol5
                ? "text-green-600"
                : esPadel
                ? "text-blue-600"
                : "text-slate-500"
            }
          `}
        >
          {specialties[doctor]}
        </p>

        <p
          className={`
            mb-8
            leading-relaxed
            max-w-lg
            mx-auto

            ${esLavadero ? "text-zinc-300" : "text-slate-500"}
          `}
        >
          {esLavadero
            ? "Reservá tu lavado premium online de forma rápida y moderna."
            : esFutbol5
            ? "Reservá tu cancha online en segundos."
            : esPadel
            ? "Reservá tu cancha de pádel online en segundos."
            : "Reservá turnos médicos online de forma rápida y segura."}
        </p>

        <Link
          href={`/${doctor}/reservar`}
          className={`
            inline-block
            px-8
            py-4
            rounded-2xl
            font-semibold
            text-lg
            shadow-lg
            transition

            ${
              esLavadero
                ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                : esFutbol5
                ? "bg-green-600 hover:bg-green-700 text-white"
                : esPadel
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }
          `}
        >
          {esLavadero
            ? "Reservar lavado"
            : esFutbol5
            ? "Reservar cancha"
            : esPadel
            ? "Reservar cancha"
            : "Reservar turno"}
        </Link>
      </div>
    </div>
  );
}

/* =========================
   COMPONENTE BARBERÍA
========================= */

function Barberia() {
  const [activo, setActivo] = useState(0);
  const [inicioX, setInicioX] = useState<number | null>(null);

  /* CAMBIO AUTOMÁTICO */
  useEffect(() => {
    const intervalo = setInterval(() => {
      setActivo((actual) => (actual + 1) % serviciosBarberia.length);
    }, 4000);

    return () => clearInterval(intervalo);
  }, []);

  /* DESLIZAMIENTO */
  const comenzarDeslizamiento = (x: number) => {
    setInicioX(x);
  };

  const terminarDeslizamiento = (x: number) => {
    if (inicioX === null) return;

    const diferencia = inicioX - x;

    if (Math.abs(diferencia) > 50) {
      if (diferencia > 0) {
        setActivo((actual) => (actual + 1) % serviciosBarberia.length);
      } else {
        setActivo(
          (actual) =>
            (actual - 1 + serviciosBarberia.length) %
            serviciosBarberia.length
        );
      }
    }

    setInicioX(null);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* HERO */}

      <section className="relative h-[75vh] min-h-[560px] overflow-hidden">

        <img
          src="/barberia.jpeg"
          alt="Black Barber"
          className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
        />

        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/30 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-xl flex-col justify-end px-6 pb-12">

          <span className="mb-5 w-fit rounded-full border border-yellow-500/50 bg-black/40 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-yellow-400 backdrop-blur-md">
            BLACK BARBER
          </span>

          <h1 className="text-5xl font-black leading-none tracking-tight sm:text-6xl">
            Tu estilo.
            <br />
            Tu momento.
          </h1>

          <p className="mt-5 max-w-md text-lg leading-relaxed text-zinc-300">
            Cortes, barba y estilo personalizado en un espacio pensado
            para vos.
          </p>

        </div>
      </section>

      {/* CONTENIDO */}

      <section className="mx-auto max-w-xl px-6 pb-12">

        {/* PRESENTACIÓN */}

        <div className="pt-10">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-500">
            Nuestra barbería
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Estilo que habla por vos.
          </h2>

          <p className="mt-4 leading-relaxed text-zinc-400">
            Elegí el servicio que querés, seleccioná el día y encontrá
            rápidamente un horario disponible.
          </p>

        </div>

        {/* CARRUSEL */}

        <div className="mt-8">

          <div
            className="relative h-[300px] touch-pan-y select-none"
            onMouseDown={(e) => comenzarDeslizamiento(e.clientX)}
            onMouseUp={(e) => terminarDeslizamiento(e.clientX)}
            onMouseLeave={(e) => terminarDeslizamiento(e.clientX)}
            onTouchStart={(e) =>
              comenzarDeslizamiento(e.touches[0].clientX)
            }
            onTouchEnd={(e) =>
              terminarDeslizamiento(e.changedTouches[0].clientX)
            }
          >

            {serviciosBarberia.map((servicio, index) => {

              let posicion = index - activo;

              if (posicion < -1) {
                posicion += serviciosBarberia.length;
              }

              if (posicion > 1) {
                posicion -= serviciosBarberia.length;
              }

              const esActivo = posicion === 0;
              const esAnterior = posicion === -1;
              const esSiguiente = posicion === 1;

              return (
                <div
                  key={servicio.imagen}
                  className={`
                    absolute
                    left-0
                    top-0
                    h-full
                    w-full
                    overflow-hidden
                    rounded-3xl
                    transition-all
                    duration-700
                    ease-out

                    ${
                      esActivo
                        ? "z-30 translate-x-0 scale-100 opacity-100"
                        : esSiguiente
                        ? "z-20 translate-x-[12%] scale-[0.92] opacity-70"
                        : esAnterior
                        ? "z-20 -translate-x-[12%] scale-[0.92] opacity-70"
                        : "z-0 scale-75 opacity-0"
                    }
                  `}
                >

                  <img
                    src={servicio.imagen}
                    alt={servicio.alt}
                    draggable={false}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  <div className="absolute bottom-6 left-6">

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
                      Servicio
                    </p>

                    <h3 className="mt-1 text-3xl font-bold">
                      {servicio.titulo}
                    </h3>

                    {servicio.precio && (
                      <p className="mt-1 text-xl font-semibold text-yellow-400">
                        {servicio.precio}
                      </p>
                    )}

                  </div>

                </div>
              );
            })}

          </div>

          {/* PUNTOS */}

          <div className="mt-5 flex justify-center gap-2">

            {serviciosBarberia.map((servicio, index) => (
              <button
                key={servicio.titulo}
                type="button"
                aria-label={`Ver ${servicio.titulo}`}
                onClick={() => setActivo(index)}
                className={`
                  h-2.5
                  rounded-full
                  transition-all
                  duration-300

                  ${
                    activo === index
                      ? "w-7 bg-yellow-500"
                      : "w-2.5 bg-zinc-700 hover:bg-zinc-500"
                  }
                `}
              />
            ))}

          </div>

        </div>

        {/* INFORMACIÓN */}

        <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

          <div className="flex items-start gap-4">

            <div className="text-xl">
              📍
            </div>

            <div>

              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Ubicación
              </p>

              <p className="mt-1 font-semibold">
                Resistencia, Chaco
              </p>

            </div>

          </div>

          <div className="my-5 h-px bg-zinc-800" />

          <div className="flex items-start gap-4">

            <div className="text-xl">
              🕐
            </div>

            <div>

              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Horarios
              </p>

              <p className="mt-1 font-semibold">
                Lunes a sábado
              </p>

              <p className="mt-1 text-sm text-zinc-400">
                09:00 a 20:00
              </p>

            </div>

          </div>

        </div>

        {/* CTA */}

        <Link
          href="/barberia/reservar"
          className="
            mt-8
            flex
            min-h-[64px]
            w-full
            items-center
            justify-center
            rounded-2xl
            bg-yellow-500
            px-6
            text-lg
            font-bold
            text-black
            shadow-[0_10px_40px_rgba(234,179,8,0.18)]
            transition
            hover:bg-yellow-400
            active:scale-[0.98]
          "
        >
          Reservar mi turno
        </Link>

        <p className="mt-5 text-center text-xs text-zinc-600">
          Reservá online de forma rápida y sencilla
        </p>

      </section>

    </main>
  );
}