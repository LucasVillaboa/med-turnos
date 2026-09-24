"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, MapPin } from "lucide-react";

interface Props {
  params: Promise<{ doctor: string }>;
}

const serviciosBarberia = [
  {
    imagen: "/corte-barberia.jpeg",
    alt: "Corte de cabello",
    titulo: "Corte",
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

const barberos = [
  {
    nombre: "Lucas",
    imagen: "/Lucas.jpeg",
  },
  {
    nombre: "Agustín",
    imagen: "/Agustin.jpeg",
  },
  {
    nombre: "Felipe",
    imagen: "/Felipe.jpeg",
  },
  {
    nombre: "Demian",
    imagen: "/Demian.jpeg",
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
    barberia: "El Templo",
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
              className="w-48 h-48 object-cover rounded-3xl mx-auto mb-5 border-2 border-blue-500 shadow-lg"
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

      {/* =========================
          HERO
      ========================= */}

     <section className="relative aspect-[16/9] w-full overflow-hidden bg-black md:aspect-auto md:h-[75vh] md:min-h-[560px]">

        {/* DETALLES DORADOS SUTILES DEL FONDO */}

        <div className="absolute left-1/2 top-[28%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-yellow-500/5 blur-3xl" />

        <div className="absolute left-[8%] top-[18%] h-32 w-32 rounded-full bg-yellow-600/5 blur-3xl" />

        <div className="absolute right-[8%] top-[35%] h-40 w-40 rounded-full bg-yellow-500/5 blur-3xl" />

        {/* LOGO / IMAGEN HERO */}

        <div className="absolute inset-0 flex items-center justify-center bg-black">

<img
  src="/barberia.jpeg"
  alt="El Templo Barbería"
  className="
    h-full
    w-full
    object-cover
    object-center
    md:object-contain
    md:px-5
    md:py-8
  "
/>

        </div>

        {/* SUAVE VIGNETTE */}

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50" />

        {/* TAGLINE */}

        <div className="absolute inset-x-0 bottom-12 z-20 flex justify-center px-6">

          <p
            className="
              text-center
              font-serif
              text-xl
              italic
              font-semibold
              tracking-wide
              text-yellow-400
              drop-shadow-[0_3px_10px_rgba(0,0,0,0.95)]
              sm:text-2xl
            "
          >
          </p>

        </div>

      </section>

      {/* =========================
          CONTENIDO
      ========================= */}

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

        {/* =========================
            CARRUSEL DE SERVICIOS
        ========================= */}

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

                    <h3 className="text-3xl font-bold">
                      {servicio.titulo}
                    </h3>

                    <p className="mt-1 text-xl font-semibold text-yellow-400">
                      {servicio.precio}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>

          {/* PUNTOS */}

<div className="mt-5 flex items-center justify-center gap-2">
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
            ? "w-8 bg-yellow-500"
            : "w-2.5 bg-zinc-700"
        }
      `}
    />
  ))}
</div>

        </div>

        {/* =========================
            NUESTRO EQUIPO
        ========================= */}

        <div className="mt-14">

          <div className="mb-6">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-500">
              Nuestro equipo
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Conoce a nuestros barberos.
            </h2>

          </div>

          {/* DESKTOP: 4 TARJETAS / MOBILE: SCROLL HORIZONTAL */}

          <div
            className="
              flex
              gap-4
              overflow-x-auto
              pb-3
              snap-x
              snap-mandatory
              scrollbar-hide
              md:grid
              md:grid-cols-2
              md:overflow-visible
            "
          >

            {barberos.map((barbero) => (

              <div
                key={barbero.nombre}
                className="
                  min-w-[78%]
                  snap-center
                  overflow-hidden
                  rounded-3xl
                  border
                  border-zinc-800
                  bg-zinc-900
                  shadow-xl
                  md:min-w-0
                "
              >

                <div className="aspect-[4/5] overflow-hidden bg-zinc-800">

                  <img
                    src={barbero.imagen}
                    alt={`Barbero ${barbero.nombre}`}
                    draggable={false}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition
                      duration-500
                      hover:scale-105
                    "
                  />

                </div>

                <div className="px-5 py-4">

                  <p className="text-xs uppercase tracking-[0.2em] text-yellow-500">
                    Barbero
                  </p>

                  <h3 className="mt-1 text-2xl font-bold">
                    {barbero.nombre}
                  </h3>

                </div>

              </div>

            ))}

          </div>

          {/* INDICACIÓN MOBILE */}

          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-zinc-500 md:hidden">
  <span className="text-yellow-500">←</span>
  <span>Deslizá para ver más barberos</span>
  <span className="text-yellow-500">→</span>
</div>
        </div>

        {/* =========================
            INFORMACIÓN
        ========================= */}

        <div className="mt-12 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

          {/* UBICACIÓN */}

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/10">
              <MapPin className="h-5 w-5 text-yellow-400" />
            </div>

            <div>

              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Ubicación
              </p>

              <a
                href="https://maps.app.goo.gl/bMexJPiYsirPRTyM8?g_st=iw"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block font-semibold transition hover:text-yellow-400"
              >
                Resistencia, Chaco
              </a>

              <a
                href="https://maps.app.goo.gl/bMexJPiYsirPRTyM8?g_st=iw"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-yellow-400 transition hover:text-yellow-300"
              >
                Como llegar
                <span className="text-base">↗</span>
              </a>

            </div>

          </div>

          <div className="my-5 h-px bg-zinc-800" />

          {/* HORARIOS */}

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800/80">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>

            <div>

              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Horarios
              </p>

              <p className="mt-1 font-semibold">
                Lunes a sábado
              </p>

              <p className="mt-1 text-sm text-zinc-400">
                09:00 a 22:00
              </p>

              <p className="mt-3 font-semibold">
                Domingo
              </p>

              <p className="mt-1 text-sm text-zinc-400">
                11:00 a 14:00
              </p>

              <p className="mt-1 text-sm text-zinc-400">
                17:00 a 20:00
              </p>

            </div>

          </div>

        </div>

        {/* =========================
            CTA
        ========================= */}

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



