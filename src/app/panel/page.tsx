"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PanelPage() {

  const router = useRouter();

  const [turnos, setTurnos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [busqueda, setBusqueda] = useState("");

  const doctor =
    typeof window !== "undefined"
      ? localStorage.getItem("doctor")
      : null;

  const esLavadero = doctor === "lavadero";

  // 🔥 PROTEGER PANEL
  useEffect(() => {

    const auth = localStorage.getItem("auth");

    if (auth !== "true") {
      router.push(
        esLavadero
          ? "/lavadero/login"
          : "/login"
      );
    }

  }, [router, esLavadero]);

  // 🔥 TRAER TURNOS
  useEffect(() => {

    const obtenerTurnos = async () => {

      const doctor = localStorage.getItem("doctor");

      const { data, error } = await supabase
        .from("turnos")
        .select("*")
        .eq("doctor", doctor)
        .order("fecha", { ascending: true });

      if (!error && data) {
        setTurnos(data);
      }

      setLoading(false);
    };

    obtenerTurnos();

  }, []);

  // 🔥 ELIMINAR
  const eliminarTurno = async (id: number) => {

    const confirmar = confirm(
      "¿Seguro que querés eliminar este turno?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("turnos")
      .delete()
      .eq("id", id);

    if (!error) {
      setTurnos(turnos.filter((t) => t.id !== id));
    }

  };

  // 🔥 LOGOUT
  const logout = () => {

    localStorage.removeItem("auth");
    localStorage.removeItem("doctor");

    router.push(
      esLavadero
        ? "/lavadero/login"
        : "/login"
    );

  };

  // 🔥 FILTRO
  const turnosFiltrados = useMemo(() => {

    return turnos.filter((turno) =>
      turno.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      turno.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
      turno.telefono?.toLowerCase().includes(busqueda.toLowerCase())
    );

  }, [turnos, busqueda]);

  // 🔥 ESTADÍSTICAS
  const totalTurnos = turnos.length;

  const fechaHoy = new Date().toISOString().split("T")[0];

  const turnosHoy = turnos.filter(
    (t) => t.fecha === fechaHoy
  ).length;

  return (

    <div className={`
      min-h-screen
      ${
        esLavadero
          ? "bg-black text-white"
          : "bg-slate-100"
      }
    `}>

      {/* SIDEBAR DESKTOP */}
      <div className={`
        fixed
        top-0
        left-0
        h-full
        w-72
        hidden
        lg:flex
        flex-col

        ${
          esLavadero
            ? "bg-zinc-950 text-white border-r border-yellow-500/20"
            : "bg-slate-900 text-white"
        }
      `}>

        <div className={`
          p-8

          ${
            esLavadero
              ? "border-b border-yellow-500/20"
              : "border-b border-slate-800"
          }
        `}>

          <div className={`
            w-16
            h-16
            rounded-2xl
            flex
            items-center
            justify-center
            text-3xl
            mb-4
            overflow-hidden

            ${
              esLavadero
                ? "bg-yellow-500"
                : "bg-emerald-500"
            }
          `}>

            {
              esLavadero ? (

                <img
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop"
                  alt="Auto"
                  className="w-full h-full object-cover"
                />

              ) : (

                "🩺"

              )
            }

          </div>

          <h2 className="text-2xl font-bold">

            {
              esLavadero
                ? "Panel Lavadero"
                : "Turnos"
            }

          </h2>

          <p className={`
            text-sm
            mt-2

            ${
              esLavadero
                ? "text-yellow-200"
                : "text-slate-400"
            }
          `}>

            {
              esLavadero
                ? "Administración de reservas"
                : "Panel profesional"
            }

          </p>

        </div>

        <div className="flex-1 p-6">

          <div className={`
            rounded-2xl
            p-5

            ${
              esLavadero
                ? "bg-zinc-900 border border-yellow-500/20"
                : "bg-slate-800"
            }
          `}>

            <p className={`
              text-sm
              mb-1

              ${
                esLavadero
                  ? "text-yellow-200"
                  : "text-slate-400"
              }
            `}>
              Estado del sistema
            </p>

            <h3 className={`
              font-semibold

              ${
                esLavadero
                  ? "text-yellow-400"
                  : "text-emerald-400"
              }
            `}>
              Operativo
            </h3>

          </div>

        </div>

        <div className="p-6">

          <button
            onClick={logout}
            className={`
              w-full
              transition
              py-3
              rounded-2xl
              font-semibold

              ${
                esLavadero
                  ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }
            `}
          >
            Cerrar sesión
          </button>

        </div>

      </div>

      {/* CONTENIDO */}
      <main className="lg:ml-72 p-4 md:p-8">

        {/* MOBILE HEADER */}
        <div className="lg:hidden mb-6">

          <div className={`
            rounded-3xl
            p-6
            shadow-xl

            ${
              esLavadero
                ? "bg-zinc-950 text-white border border-yellow-500/20"
                : "bg-slate-900 text-white"
            }
          `}>

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-4">

                <div className={`
                  w-14
                  h-14
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  text-2xl
                  overflow-hidden

                  ${
                    esLavadero
                      ? "bg-yellow-500"
                      : "bg-emerald-500"
                  }
                `}>

                  {
                    esLavadero ? (

                      <img
                        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop"
                        alt="Auto"
                        className="w-full h-full object-cover"
                      />

                    ) : (

                      "🩺"

                    )
                  }

                </div>

                <div>

                  <h1 className="text-2xl font-bold">

                    {
                      esLavadero
                        ? "Lavadero"
                        : "Turnos"
                    }

                  </h1>

                  <p className={`
                    text-sm

                    ${
                      esLavadero
                        ? "text-yellow-200"
                        : "text-slate-300"
                    }
                  `}>

                    {
                      esLavadero
                        ? "Panel de reservas"
                        : "Panel profesional"
                    }

                  </p>

                </div>

              </div>

              <button
                onClick={logout}
                className={`
                  transition
                  px-4
                  py-2
                  rounded-2xl
                  text-sm
                  font-semibold
                  whitespace-nowrap

                  ${
                    esLavadero
                      ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }
                `}
              >
                Salir
              </button>

            </div>

          </div>

        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className={`
            rounded-3xl
            p-6
            shadow-sm
            border

            ${
              esLavadero
                ? "bg-zinc-950 border-yellow-500/20"
                : "bg-white border-slate-200"
            }
          `}>

            <div className="flex items-center justify-between">

              <div>

                <p className={`
                  text-sm

                  ${
                    esLavadero
                      ? "text-yellow-200"
                      : "text-slate-500"
                  }
                `}>
                  Total reservas
                </p>

                <h2 className={`
                  text-5xl
                  font-bold
                  mt-2

                  ${
                    esLavadero
                      ? "text-yellow-400"
                      : "text-slate-800"
                  }
                `}>
                  {totalTurnos}
                </h2>

              </div>

              <div className={`
                w-14
                h-14
                rounded-2xl
                flex
                items-center
                justify-center
                text-2xl

                ${
                  esLavadero
                    ? "bg-yellow-500 text-black"
                    : "bg-emerald-100"
                }
              `}>
                📅
              </div>

            </div>

          </div>

          <div className={`
            rounded-3xl
            p-6
            shadow-sm
            border

            ${
              esLavadero
                ? "bg-zinc-950 border-yellow-500/20"
                : "bg-white border-slate-200"
            }
          `}>

            <div className="flex items-center justify-between">

              <div>

                <p className={`
                  text-sm

                  ${
                    esLavadero
                      ? "text-yellow-200"
                      : "text-slate-500"
                  }
                `}>
                  Reservas hoy
                </p>

                <h2 className={`
                  text-5xl
                  font-bold
                  mt-2

                  ${
                    esLavadero
                      ? "text-yellow-400"
                      : "text-emerald-600"
                  }
                `}>
                  {turnosHoy}
                </h2>

              </div>

              <div className={`
                w-14
                h-14
                rounded-2xl
                flex
                items-center
                justify-center
                text-2xl

                ${
                  esLavadero
                    ? "bg-yellow-500 text-black"
                    : "bg-emerald-100"
                }
              `}>
                ✅
              </div>

            </div>

          </div>

        </div>

      </main>

    </div>

  );

}
        
  