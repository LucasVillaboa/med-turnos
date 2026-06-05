"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function ReservarTurno() {

  const params = useParams();

  const doctor = params.doctor as string;

  const esLavadero = doctor === "lavadero";
  const esFutbol5 = doctor === "futbol5";

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    fecha: "",
    hora: "",
  });

  const [horarios, setHorarios] = useState<string[]>([]);
  const [ocupados, setOcupados] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 GENERAR HORARIOS
  const generarHorarios = () => {

    const lista = [];

    for (let h = 9; h <= 18; h++) {

      lista.push(`${h}:00`);

      if (h !== 18) {
        lista.push(`${h}:30`);
      }

    }

    return lista;

  };

  // 🔥 CAMBIO FECHA
  const handleFechaChange = async (fecha: string) => {

    setForm({
      ...form,
      fecha,
      hora: "",
    });

    const lista = generarHorarios();

    setHorarios(lista);

    try {

      const res = await fetch(
        `/api/turnos?doctor=${doctor}&fecha=${fecha}`
      );

      const data = await res.json();

      setOcupados(
        data.map((t: any) => t.hora)
      );

    } catch {

      setOcupados([]);

    }

  };

  // 🔥 ENVIAR
  const handleSubmit = async (e: any) => {

    e.preventDefault();

    setLoading(true);

    try {

      const res = await fetch("/api/confirmar", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...form,
          doctor,
        }),

      });

      const data = await res.json();

      if (!res.ok) {

        if (data.error === "Horario ocupado") {

          alert(
            "Ese horario ya fue reservado."
          );

          handleFechaChange(form.fecha);

      } else {
  alert(data.error);
}

        setLoading(false);

        return;

      }

      window.location.href = "/exito";

    } catch {

      alert("Ocurrió un error");

    }

    setLoading(false);

  };

  return (

    <div className={`
      min-h-screen
      flex
      items-center
      justify-center
      px-4
      py-10

      ${
        esLavadero
          ? "bg-black"
          : "bg-slate-50"
      }
    `}>

      <div className={`
        w-full
        max-w-2xl
        rounded-[28px]
        border
        shadow-2xl
        p-6
        md:p-8

        ${
          esLavadero
            ? "bg-zinc-950 border-yellow-500/20"
            : "bg-white border-slate-200"
        }
      `}>

        {/* HEADER */}
        <div className="text-center mb-8">

          {
            
  esLavadero ? (

    <img
      src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1400&auto=format&fit=crop"
      alt="Auto"
      className="
        w-full
        h-56
        object-cover
        rounded-3xl
        mb-6
        border
        border-yellow-500/30
      "
    />

  ) : esFutbol5 ? (

    <div className="
      w-20
      h-20
      rounded-full
      bg-green-100
      flex
      items-center
      justify-center
      mx-auto
      mb-5
      text-4xl
    ">
      ⚽
    </div>

  ) : (

    <div className="
      w-20
      h-20
      rounded-full
      bg-emerald-100
      flex
      items-center
      justify-center
      mx-auto
      mb-5
      text-3xl
    ">
      🩺
    </div>

  )
            }

          <h1 className={`
            text-3xl
            md:text-4xl
            font-bold

            ${
              esLavadero
                ? "text-yellow-400"
                : "text-slate-800"
            }
          `}>

          {
  esLavadero
    ? "Reservá tu lavado"
    : esFutbol5
    ? "Reservá tu cancha"
    : "Reservá tu turno"
}

          </h1>

          <p className={`
            mt-3

            ${
              esLavadero
                ? "text-zinc-400"
                : "text-slate-500"
            }
          `}>
            Seleccioná fecha y horario disponible
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          {/* NOMBRE */}
          <input
            type="text"
            placeholder="Nombre completo"
            required
            onChange={(e) =>
              setForm({
                ...form,
                nombre: e.target.value,
              })
            }
            className={`
              w-full
              min-h-[56px]
              rounded-2xl
              px-4
              outline-none
              transition
              border

              ${
                esLavadero
                  ? "bg-zinc-900 border-zinc-700 text-white focus:border-yellow-500"
                  : "border-slate-300 text-slate-900 focus:border-emerald-600"
              }
            `}
          />

          {/* TELEFONO */}
          <input
            type="text"
            placeholder="Teléfono"
            required
            onChange={(e) =>
              setForm({
                ...form,
                telefono: e.target.value,
              })
            }
            className={`
              w-full
              min-h-[56px]
              rounded-2xl
              px-4
              outline-none
              transition
              border

              ${
                esLavadero
                  ? "bg-zinc-900 border-zinc-700 text-white focus:border-yellow-500"
                  : "border-slate-300 text-slate-900 focus:border-emerald-600"
              }
            `}
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className={`
              w-full
              min-h-[56px]
              rounded-2xl
              px-4
              outline-none
              transition
              border

              ${
                esLavadero
                  ? "bg-zinc-900 border-zinc-700 text-white focus:border-yellow-500"
                  : "border-slate-300 text-slate-900 focus:border-emerald-600"
              }
            `}
          />

{/* FECHA */}
<div className="relative">

  <input
    type="date"
    required
    value={form.fecha}
    onChange={(e) =>
      handleFechaChange(e.target.value)
    }
    className={`
      w-full
      h-[56px]
      rounded-2xl
      px-4
      outline-none
      border
      transition

      ${
        esLavadero
          ? "bg-zinc-900 border-zinc-700 text-white focus:border-yellow-500"
          : "border-slate-300 text-slate-900 focus:border-emerald-600"
      }
    `}
    style={{
      color: form.fecha
        ? esLavadero
          ? "white"
          : "#0f172a"
        : "transparent",
    }}
  />

  {
    !form.fecha && (
      <span
        className={`
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          pointer-events-none
          text-sm

          ${
            esLavadero
              ? "text-zinc-400"
              : "text-slate-400"
          }
        `}
      >
        Fecha y hora
      </span>
    )
  }

</div>

{
  !form.fecha && (
    <div
      className={`
        pointer-events-none
        -mt-[44px]
        ml-4
        text-sm

        ${
          esLavadero
            ? "text-zinc-400"
            : "text-slate-400"
        }
      `}
    >
     
    </div>
  )
}

          {/* HORARIOS */}
          {
            form.fecha && (

              <div>

                <h3 className={`
                  font-semibold
                  mb-4

                  ${
                    esLavadero
                      ? "text-yellow-400"
                      : "text-slate-800"
                  }
                `}>
                  Seleccionar horario
                </h3>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">

                  {
                    horarios.map((h) => {

                      const ocupado =
                        ocupados.includes(h);

                      return (

                        <button
                          type="button"
                          key={h}
                          disabled={ocupado}
                          onClick={() =>
                            setForm({
                              ...form,
                              hora: h,
                            })
                          }
                          className={`
                            min-h-[52px]
                            rounded-2xl
                            text-sm
                            font-semibold
                            border
                            transition-all

                            ${
                              ocupado
                                ? "bg-red-900/30 text-red-400 border-red-500/30 cursor-not-allowed"
                                : form.hora === h
                                ? esLavadero
                                  ? "bg-yellow-500 text-black border-yellow-500"
                                  : "bg-emerald-600 text-white border-emerald-600"
                                : esLavadero
                                ? "bg-zinc-900 text-yellow-300 border-zinc-700 hover:border-yellow-500"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-emerald-50"
                            }
                          `}
                        >
                          {
                            ocupado
                              ? `${h} ✕`
                              : h
                          }
                        </button>

                      );

                    })
                  }

                </div>

              </div>

            )
          }

          {/* BOTON */}
          <button
            disabled={!form.hora || loading}
            className={`
              mt-6
              min-h-[58px]
              rounded-2xl
              font-semibold
              text-lg
              shadow-md
              transition

              ${
                esLavadero
                  ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }
            `}
          >

     {
  loading
    ? "Procesando..."
    : esLavadero
    ? "Confirmar lavado"
    : esFutbol5
    ? "Confirmar reserva"
    : "Confirmar turno"
}

          </button>

        </form>

      </div>

    </div>

  );

}