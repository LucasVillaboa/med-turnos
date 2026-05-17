"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function ReservarTurno() {

  const params = useParams();
  const doctor = params.doctor as string;

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

  // 🔥 CAMBIO DE FECHA
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

  // 🔥 RESERVAR
  const handleSubmit = async (e: any) => {

    e.preventDefault();

    setLoading(true);

    try {

      // 🔥 VERIFICAR SI SIGUE LIBRE
      const verificar = await fetch(
        `/api/turnos?doctor=${doctor}&fecha=${form.fecha}`
      );

      const existentes = await verificar.json();

      const ocupado = existentes.some(
        (t: any) => t.hora === form.hora
      );

      // 🔥 YA OCUPADO
      if (ocupado) {

        alert(
          "Ese horario ya fue reservado. Elegí otro."
        );

        setOcupados(
          existentes.map((t: any) => t.hora)
        );

        setLoading(false);

        return;

      }

      // 🔥 GUARDAR LOCAL
      localStorage.setItem(
        "turno",
        JSON.stringify({
          ...form,
          doctor,
        })
      );

      // 🔥 GUARDAR EN SUPABASE
      await fetch("/api/guardar-turno", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          doctor,
        }),
      });

      // 🔥 DEMO SIN PAGO REAL
      window.location.href = "/exito";

      /*
      // 🔥 PAGO REAL
      const res = await fetch("/api/pago", {
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

      if (data.url) {

        window.location.href = data.url;

      } else {

        alert("Error al generar el pago");

      }
      */

    } catch {

      alert("Ocurrió un error");

    }

    setLoading(false);

  };

  return (

    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-2xl bg-white rounded-[28px] border border-slate-200 shadow-lg p-6 md:p-8">

        {/* HEADER */}
        <div className="text-center mb-8">

          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5 text-3xl">
            🩺
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            Reserva tu turno
          </h1>

          <p className="text-slate-500 mt-3">
            Seleccioná una fecha y horario disponible
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
            className="
              w-full
              min-h-[56px]
              border
              border-slate-300
              rounded-2xl
              px-4
              text-slate-900
              placeholder:text-slate-400
              outline-none
              transition
              focus:border-emerald-600
              focus:ring-2
              focus:ring-emerald-200
            "
          />

          {/* TELÉFONO */}
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
            className="
              w-full
              min-h-[56px]
              border
              border-slate-300
              rounded-2xl
              px-4
              text-slate-900
              placeholder:text-slate-400
              outline-none
              transition
              focus:border-emerald-600
              focus:ring-2
              focus:ring-emerald-200
            "
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
            className="
              w-full
              min-h-[56px]
              border
              border-slate-300
              rounded-2xl
              px-4
              text-slate-900
              placeholder:text-slate-400
              outline-none
              transition
              focus:border-emerald-600
              focus:ring-2
              focus:ring-emerald-200
            "
          />

          {/* FECHA */}
          <div>

            <label className="block mb-2 text-sm font-medium text-slate-700">
              Seleccionar fecha
            </label>

            <input
              type="date"
              required
              onChange={(e) =>
                handleFechaChange(e.target.value)
              }
              className="
                w-full
                min-h-[56px]
                border
                border-slate-300
                rounded-2xl
                px-4
                text-slate-900
                outline-none
                transition
                focus:border-emerald-600
                focus:ring-2
                focus:ring-emerald-200
              "
            />

          </div>

          {/* HORARIOS */}
          {form.fecha && (

            <div className="mt-2">

              <h3 className="font-semibold text-slate-800 mb-4">
                Horarios disponibles
              </h3>

              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">

                {horarios.map((h) => {

                  const ocupado = ocupados.includes(h);

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
                            ? "bg-slate-200 text-slate-400 border-slate-200 cursor-not-allowed"
                            : form.hora === h
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-105"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-emerald-50 hover:border-emerald-300"
                        }
                      `}
                    >
                      {h}
                    </button>

                  );

                })}

              </div>

            </div>

          )}

          {/* INFO */}
          <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">

            <p className="text-slate-800 font-semibold mb-2">
              Información de pago
            </p>

            <div className="space-y-1 text-sm text-slate-600">

              <p>
                Valor de la consulta:
                <strong className="text-slate-800">
                  {" "} $20.000
                </strong>
              </p>

              <p>
                Seña online:
                <strong className="text-emerald-700">
                  {" "} $5.000
                </strong>
              </p>

              <p>
                El saldo restante se abona el día del turno.
              </p>

            </div>

          </div>

          {/* BOTÓN */}
          <button
            disabled={!form.hora || loading}
            className="
              mt-6
              min-h-[58px]
              bg-emerald-600
              hover:bg-emerald-700
              transition
              text-white
              rounded-2xl
              font-semibold
              text-lg
              shadow-md
              disabled:bg-slate-300
              disabled:shadow-none
              disabled:cursor-not-allowed
            "
          >
            {loading
              ? "Procesando..."
              : "Confirmar turno"}
          </button>

        </form>

      </div>

    </div>

  );

}