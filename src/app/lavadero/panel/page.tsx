"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LavaderoPanelPage() {

  const router = useRouter();

  const [turnos, setTurnos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const auth = localStorage.getItem("auth");

    const doctor = localStorage.getItem("doctor");

    if (!auth || doctor !== "lavadero") {

      router.push("/lavadero/login");

      return;

    }

    obtenerTurnos();

  }, []);

  const obtenerTurnos = async () => {

    try {

      const doctor = localStorage.getItem("doctor");

      const res = await fetch(
        `/api/turnos?doctor=${doctor}`
      );

      const data = await res.json();

      setTurnos(data);

    } catch {

      alert("Error al obtener reservas");

    }

    setLoading(false);

  };

  const cerrarSesion = () => {

    localStorage.removeItem("auth");

    localStorage.removeItem("doctor");

    router.push("/lavadero/login");

  };

  return (

    <div className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <div className="border-b border-yellow-500/20 bg-zinc-950">

        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop"
              alt="Auto"
              className="
                w-20
                h-20
                rounded-2xl
                object-cover
                border-2
                border-yellow-500
              "
            />

            <div>

              <h1 className="text-3xl font-bold text-yellow-400">
                Panel Lavadero
              </h1>

              <p className="text-zinc-400 text-sm">
                Administración de reservas y clientes
              </p>

            </div>

          </div>

          <button
            onClick={cerrarSesion}
            className="
              bg-yellow-500
              hover:bg-yellow-400
              text-black
              font-semibold
              px-5
              py-3
              rounded-2xl
              transition
            "
          >
            Cerrar sesión
          </button>

        </div>

      </div>

      {/* CONTENIDO */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-6">

            <p className="text-zinc-400 text-sm mb-2">
              Reservas totales
            </p>

            <h2 className="text-4xl font-bold text-yellow-400">
              {turnos.length}
            </h2>

          </div>

          <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-6">

            <p className="text-zinc-400 text-sm mb-2">
              Reservas del día
            </p>

            <h2 className="text-4xl font-bold text-yellow-400">
              {
                turnos.filter(
                  (t) =>
                    t.fecha ===
                    new Date()
                      .toISOString()
                      .split("T")[0]
                ).length
              }
            </h2>

          </div>

          <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-6">

            <p className="text-zinc-400 text-sm mb-2">
              Sistema
            </p>

            <h2 className="text-2xl font-bold text-green-400">
              Online
            </h2>

          </div>

        </div>

        {/* TABLA */}
        <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl overflow-hidden">

          <div className="px-6 py-5 border-b border-yellow-500/10">

            <h2 className="text-2xl font-bold text-yellow-400">
              Reservas
            </h2>

          </div>

          {loading ? (

            <div className="p-10 text-center text-zinc-400">
              Cargando reservas...
            </div>

          ) : turnos.length === 0 ? (

            <div className="p-10 text-center text-zinc-400">
              No hay reservas todavía
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-zinc-950">

                  <tr>

                    <th className="text-left px-6 py-4 text-yellow-400">
                      Cliente
                    </th>

                    <th className="text-left px-6 py-4 text-yellow-400">
                      Teléfono
                    </th>

                    <th className="text-left px-6 py-4 text-yellow-400">
                      Fecha
                    </th>

                    <th className="text-left px-6 py-4 text-yellow-400">
                      Hora
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {turnos.map((turno, index) => (

                    <tr
                      key={index}
                      className="border-t border-zinc-800"
                    >

                      <td className="px-6 py-4">
                        {turno.nombre}
                      </td>

                      <td className="px-6 py-4">
                        {turno.telefono}
                      </td>

                      <td className="px-6 py-4">
                        {turno.fecha}
                      </td>

                      <td className="px-6 py-4">
                        {turno.hora}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}