import Link from "next/link";

interface Props {
  params: Promise<{ doctor: string }>;
}

export default async function DoctorPage({ params }: Props) {

  const { doctor } = await params;

  const esLavadero = doctor === "lavadero";

  const doctors: Record<string, string> = {
    lavadero: "Lavadero",
    lopez: "Dra. María López",
    demo: "Consultorio Demo",
  };

  const specialties: Record<string, string> = {
    lavadero: "Lavado premium y detallado",
    lopez: "Especialista en Cardiología",
    demo: "Sistema de turnos online",
  };

  return (

    <div className={`
      min-h-screen
      flex
      items-center
      justify-center
      px-4

      ${
        esLavadero
          ? "bg-black"
          : "bg-slate-50"
      }
    `}>

      <div className={`
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
            : "bg-white border-slate-200"
        }
      `}>

        {/* IMAGEN */}
        <div className="mb-6">

          {esLavadero ? (

            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1400&auto=format&fit=crop"
              alt="Auto deportivo"
              className="
                w-full
                h-64
                object-cover
                rounded-3xl
                shadow-2xl
                border
                border-yellow-500/30
              "
            />

          ) : (

            <div className="
              w-28
              h-28
              bg-emerald-100
              rounded-full
              mx-auto
              flex
              items-center
              justify-center
              text-5xl
            ">
              🩺
            </div>

          )}

        </div>

        {/* TITULO */}
        <h1 className={`
          text-4xl
          font-bold
          mb-2

          ${
            esLavadero
              ? "text-yellow-400"
              : "text-slate-800"
          }
        `}>
          {doctors[doctor] || "Profesional"}
        </h1>

        {/* SUB */}
        <p className={`
          mb-8
          text-lg

          ${
            esLavadero
              ? "text-yellow-200"
              : "text-slate-500"
          }
        `}>
          {specialties[doctor]}
        </p>

        {/* DESC */}
        <p className={`
          mb-8
          leading-relaxed
          max-w-lg
          mx-auto

          ${
            esLavadero
              ? "text-zinc-300"
              : "text-slate-500"
          }
        `}>
          {esLavadero
            ? "Reservá tu lavado premium online de forma rápida y moderna."
            : "Reservá turnos online de forma rápida, moderna y segura."
          }
        </p>

        {/* BOTON */}
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
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }
          `}
        >
          {esLavadero
            ? "Reservar lavado"
            : "Reservar turno"
          }
        </Link>

      </div>

    </div>

  );

}