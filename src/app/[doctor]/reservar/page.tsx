"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function ReservarTurno() {

  const params = useParams();

  const doctor = params.doctor as string;

  const esLavadero = doctor === "lavadero";
  const esFutbol5 = doctor === "futbol5";
  const esPadel = doctor === "padel";
  const esBarberia = doctor === "barberia";

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    fecha: "",
    hora: "",
    barbero: "",
    servicio: "",
    precio: 0,
  });

  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<
    { nombre: string; precio: number }[]
  >([]);

  const [horarios, setHorarios] = useState<string[]>([]);
  const [ocupados, setOcupados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // GENERAR HORARIOS
  // ==========================================

  const generarHorarios = (fecha?: string) => {

    const lista: string[] = [];

    if (esFutbol5) {

      for (let h = 18; h <= 23; h++) {
        lista.push(`${h}:00`);
      }

    } else if (esPadel) {

      for (let h = 17; h <= 23; h++) {
        lista.push(`${h}:00`);
      }

    } else if (esBarberia) {

      if (fecha) {

        const fechaSeleccionada = new Date(`${fecha}T00:00:00`);
        const diaSemana = fechaSeleccionada.getDay();

        // DOMINGO
        if (diaSemana === 0) {

          for (let h = 11; h <= 14; h++) {
            lista.push(`${h}:00`);
          }

          for (let h = 17; h <= 20; h++) {
            lista.push(`${h}:00`);
          }

        }

        // LUNES A SÁBADO
        else {

          for (let h = 8; h <= 22; h++) {
            lista.push(`${h}:00`);
          }

        }

      }

    } else {

      for (let h = 9; h <= 18; h++) {

        lista.push(`${h}:00`);

        if (h !== 18) {
          lista.push(`${h}:30`);
        }

      }

    }

    return lista;
  };

  // ==========================================
  // CAMBIO FECHA
  // ==========================================

  const handleFechaChange = async (fecha: string) => {

    setForm({
      ...form,
      fecha,
      hora: "",
    });

    const lista = generarHorarios(fecha);

    setHorarios(lista);

    try {

      const res = await fetch(
        `/api/turnos?doctor=${doctor}&fecha=${fecha}`
      );

      const data = await res.json();

      setOcupados(data);

    } catch {

      setOcupados([]);

    }

  };

  // ==========================================
  // CAMBIO DE BARBERO
  // ==========================================

  const handleBarberoChange = async (barbero: string) => {

    setForm({
      ...form,
      barbero,
      hora: "",
    });

    if (!form.fecha) {
      return;
    }

    try {

      const res = await fetch(
        `/api/turnos?doctor=${doctor}&fecha=${form.fecha}`
      );

      const data = await res.json();

      setOcupados(data);

    } catch {

      setOcupados([]);

    }

  };

  // ==========================================
  // CAMBIO DE SERVICIOS
  // ==========================================

  const handleServicioChange = (
    servicio: string,
    precio: number
  ) => {

    const yaSeleccionado = serviciosSeleccionados.some(
      (item) => item.nombre === servicio
    );

    let nuevosServicios;

    if (yaSeleccionado) {

      nuevosServicios = serviciosSeleccionados.filter(
        (item) => item.nombre !== servicio
      );

    } else {

      nuevosServicios = [
        ...serviciosSeleccionados,
        {
          nombre: servicio,
          precio,
        },
      ];

    }

    const precioTotal = nuevosServicios.reduce(
      (total, item) => total + item.precio,
      0
    );

    const serviciosTexto = nuevosServicios
      .map((item) => item.nombre)
      .join(" + ");

    setServiciosSeleccionados(nuevosServicios);

    setForm({
      ...form,
      servicio: serviciosTexto,
      precio: precioTotal,
    });

  };

  // ==========================================
  // VERIFICAR SI UN HORARIO ESTÁ OCUPADO
  // ==========================================

  const horarioOcupado = (hora: string) => {

    // Servicios normales
    if (!esBarberia) {

      return ocupados.some(
        (turno: any) => turno.hora === hora
      );

    }

    // Si todavía no seleccionó barbero,
    // no bloqueamos horarios
    if (!form.barbero) {
      return false;
    }

    // Barbero específico
    if (form.barbero !== "Cualquier barbero") {

      return ocupados.some(
        (turno: any) =>
          turno.hora === hora &&
          turno.barbero === form.barbero
      );

    }

    // Cualquier barbero:
    // el horario se bloquea solamente cuando
    // los 4 barberos están ocupados
    const barberos = [
      "Lucas",
      "Agustin",
      "Felipe",
      "Demian",
    ];

    const barberosOcupados = ocupados
      .filter((turno: any) => turno.hora === hora)
      .map((turno: any) => turno.barbero);

    return barberos.every(
      (barbero) => barberosOcupados.includes(barbero)
    );

  };

  // ==========================================
  // ENVIAR
  // ==========================================

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

    <div
      className={`
        min-h-screen
        flex
        items-center
        justify-center
        px-4
        py-10

        ${
          esLavadero
            ? "bg-black"
            : esPadel
            ? "bg-blue-50"
            : esBarberia
            ? "bg-zinc-950"
            : "bg-slate-50"
        }
      `}
    >

      <div
        className={`
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
              : esPadel
              ? "bg-white border-blue-300"
              : esBarberia
              ? "bg-black border-yellow-500/30"
              : "bg-white border-slate-200"
          }
        `}
      >

        {/* HEADER */}
        <div className="text-center mb-8">

          {
            esLavadero ? (

              <img
                src="/lavadero.jpeg"
                alt="Lavadero"
                className="
                  w-28
                  h-28
                  object-cover
                  rounded-3xl
                  mx-auto
                  mb-5
                  border-2
                  border-yellow-500
                  shadow-lg
                "
              />

            ) : esFutbol5 ? (

              <img
                src="/futbol5.jpeg"
                alt="Fútbol 5"
                className="
                  w-28
                  h-28
                  object-cover
                  rounded-3xl
                  mx-auto
                  mb-5
                  border-2
                  border-yellow-500
                  shadow-lg
                "
              />

            ) : esPadel ? (

              <img
                src="/padel.jpeg"
                alt="Pádel"
                className="
                  w-28
                  h-28
                  object-cover
                  rounded-3xl
                  mx-auto
                  mb-5
                  border-2
                  border-blue-500
                  shadow-lg
                "
              />

            ) : esBarberia ? (

              <img
                src="/barberia.jpeg"
                alt="Black Barber"
                className="
                  w-68
                  h-68
                  object-cover
                  rounded-3xl
                  mx-auto
                  mb-5
                  border-2
                  border-yellow-500
                  shadow-lg
                "
              />

            ) : (

              <img
                src="/turnomedico.jpeg"
                alt="Consultorio Médico"
                className="
                  w-28
                  h-28
                  object-cover
                  rounded-3xl
                  mx-auto
                  mb-5
                  border-2
                  border-yellow-500
                  shadow-lg
                "
              />

            )
          }

          <h1
            className={`
              text-3xl
              md:text-4xl
              font-bold

              ${
                esLavadero
                  ? "text-yellow-400"
                  : esPadel
                  ? "text-blue-700"
                  : esBarberia
                  ? "text-yellow-400"
                  : "text-slate-800"
              }
            `}
          >
            {
              esLavadero
                ? "Reservá tu lavado"
                : esFutbol5
                ? "Reservá tu cancha"
                : esPadel
                ? "Reservá tu cancha"
                : esBarberia
                ? "Reservá tu turno"
                : "Reservá tu turno"
            }
          </h1>

          <p
            className={`
              mt-3

              ${
                esLavadero
                  ? "text-zinc-400"
                  : esPadel
                  ? "text-blue-600"
                  : esBarberia
                  ? "text-zinc-400"
                  : "text-slate-500"
              }
            `}
          >
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
                  : esPadel
                  ? "border-blue-300 text-slate-900 focus:border-blue-600"
                  : esBarberia
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
                  : esPadel
                  ? "border-blue-300 text-slate-900 focus:border-blue-600"
                  : esBarberia
                  ? "bg-zinc-900 border-zinc-700 text-white focus:border-yellow-500"
                  : "border-slate-300 text-slate-900 focus:border-emerald-600"
              }
            `}
          />

          {/* SERVICIOS BARBERÍA */}
          {
            esBarberia && (

              <div>

                <label
                  className="
                    block
                    mb-3
                    text-sm
                    font-semibold
                    text-yellow-400
                  "
                >
                  Seleccioná uno o más servicios
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                  {/* CORTES */}

                  <button
                    type="button"
                    onClick={() =>
                      handleServicioChange("Corte", 13000)
                    }
                    className={`
                      min-h-[72px]
                      rounded-2xl
                      border
                      px-4
                      text-left
                      transition

                      ${
                        serviciosSeleccionados.some(
                          (item) => item.nombre === "Corte"
                        )
                          ? "bg-yellow-500 text-black border-yellow-500"
                          : "bg-zinc-900 text-yellow-300 border-zinc-700 hover:border-yellow-500"
                      }
                    `}
                  >
                    <div className="font-semibold">
                      Corte
                    </div>

                    <div className="text-sm mt-1">
                      $13.000
                    </div>
                  </button>

                  {/* BARBA */}

                  <button
                    type="button"
                    onClick={() =>
                      handleServicioChange("Barba", 6000)
                    }
                    className={`
                      min-h-[72px]
                      rounded-2xl
                      border
                      px-4
                      text-left
                      transition

                      ${
                        serviciosSeleccionados.some(
                          (item) => item.nombre === "Barba"
                        )
                          ? "bg-yellow-500 text-black border-yellow-500"
                          : "bg-zinc-900 text-yellow-300 border-zinc-700 hover:border-yellow-500"
                      }
                    `}
                  >
                    <div className="font-semibold">
                      Barba
                    </div>

                    <div className="text-sm mt-1">
                      $6.000
                    </div>
                  </button>

                  {/* PERFILADO */}

                  <button
                    type="button"
                    onClick={() =>
                      handleServicioChange(
                        "Perfilado de cejas",
                        3000
                      )
                    }
                    className={`
                      min-h-[72px]
                      rounded-2xl
                      border
                      px-4
                      text-left
                      transition

                      ${
                        serviciosSeleccionados.some(
                          (item) =>
                            item.nombre === "Perfilado de cejas"
                        )
                          ? "bg-yellow-500 text-black border-yellow-500"
                          : "bg-zinc-900 text-yellow-300 border-zinc-700 hover:border-yellow-500"
                      }
                    `}
                  >
                    <div className="font-semibold">
                      Perfilado de cejas
                    </div>

                    <div className="text-sm mt-1">
                      $3.000
                    </div>
                  </button>

                </div>

                {/* TOTAL */}

                {serviciosSeleccionados.length > 0 && (

                  <div className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    rounded-2xl
                    border
                    border-yellow-500/30
                    bg-yellow-500/10
                    px-5
                    py-4
                  ">

                    <span className="font-semibold text-zinc-300">
                      Total
                    </span>

                    <span className="text-xl font-black text-yellow-400">
                      ${form.precio.toLocaleString("es-AR")}
                    </span>

                  </div>

                )}

              </div>

            )
          }

          {/* BARBERO */}
          {
            esBarberia && (

              <div>

                <label
                  className="
                    block
                    mb-2
                    text-sm
                    font-semibold
                    text-yellow-400
                  "
                >
                </label>

                <select
                  required
                  value={form.barbero}
                  onChange={(e) =>
                    handleBarberoChange(e.target.value)
                  }
                  className="
                    w-full
                    min-h-[56px]
                    rounded-2xl
                    px-4
                    outline-none
                    transition
                    border
                    bg-zinc-900
                    border-zinc-700
                    text-zinc-400
                    focus:border-yellow-500
                  "
                >

                  <option value="" disabled>
                    Seleccioná un barbero
                  </option>

                  <option value="Cualquier barbero">
                    Cualquier barbero
                  </option>

                  <option value="Lucas">
                    Lucas
                  </option>

                  <option value="Agustin">
                    Agustin
                  </option>

                  <option value="Felipe">
                    Felipe
                  </option>

                  <option value="Demian">
                    Demian
                  </option>

                </select>

              </div>

            )
          }

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
                    : esPadel
                    ? "border-blue-300 text-slate-900 focus:border-blue-600"
                    : esBarberia
                    ? "bg-zinc-900 border-zinc-700 text-white focus:border-yellow-500"
                    : "border-slate-300 text-slate-900 focus:border-emerald-600"
                }
              `}
              style={{
                color: form.fecha
                  ? esLavadero || esBarberia
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
                      esLavadero || esBarberia
                        ? "text-zinc-400"
                        : esPadel
                        ? "text-blue-400"
                        : "text-slate-400"
                    }
                  `}
                >
                  Fecha y hora
                </span>
              )
            }

          </div>

          {/* HORARIOS */}
          {
            form.fecha && (

              <div>

                <h3
                  className={`
                    font-semibold
                    mb-4

                    ${
                      esLavadero
                        ? "text-yellow-400"
                        : esPadel
                        ? "text-blue-700"
                        : esBarberia
                        ? "text-yellow-400"
                        : "text-slate-800"
                    }
                  `}
                >
                  Seleccionar horario
                </h3>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">

                  {
                    horarios.map((h) => {

                      const ocupado = horarioOcupado(h);

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
                                  : esPadel
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : esBarberia
                                  ? "bg-yellow-500 text-black border-yellow-500"
                                  : "bg-emerald-600 text-white border-emerald-600"
                                : esLavadero
                                ? "bg-zinc-900 text-yellow-300 border-zinc-700 hover:border-yellow-500"
                                : esPadel
                                ? "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
                                : esBarberia
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
            disabled={
              !form.hora ||
              loading ||
              (esBarberia && !form.servicio)
            }
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
                  : esPadel
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : esBarberia
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
                : esPadel
                ? "Confirmar reserva"
                : esBarberia
                ? "Confirmar turno"
                : "Confirmar turno"
            }

          </button>

        </form>

      </div>

    </div>
  );
}







