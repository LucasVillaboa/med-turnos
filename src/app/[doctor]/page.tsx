import Link from "next/link";

interface Props {
  params: Promise<{ doctor: string }>;
}

export default async function DoctorPage({ params }: Props) {

  const { doctor } = await params;

  const esLavadero = doctor === "lavadero";
  const esFutbol5 = doctor === "futbol5";
  const esPadel = doctor === "padel";

  const doctors: Record<string, string> = {
    lavadero: "Lavadero",
    futbol5: "Complejo Fútbol 5",
    consultorio: "Consultorio Médico",
    padel: "Canchas de Pádel",
  };

  const specialties: Record<string, string> = {
    lavadero: "Lavado premium y detallado",
    futbol5: "Reserva de canchas online",
    consultorio: "Turnos médicos online",
    padel: "Reserva de canchas online",
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
          : esFutbol5
          ? "bg-green-50"
          : esPadel
          ? "bg-blue-50"
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
            : esFutbol5
            ? "bg-white border-green-300"
            : esPadel
            ? "bg-white border-blue-300"
            : "bg-white border-slate-200"
        }
      `}>

        <div className="mb-6">

          {esLavadero ? (

               <img
  src="/lavadero.jpeg"
  alt="Lavadero"
  className="
    w-48
    h-48
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

          : esFutbol5 ?

          (

              <img
  src="/futbol5.jpeg"
  alt="Lavadero"
  className="
    w-48
    h-48
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
        w-48
        h-48
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
  alt="Lavadero"
  className="
    w-48
    h-48
    object-cover
    rounded-3xl
    mx-auto
    mb-5
    border-2
    border-yellow-500
    shadow-lg
  "
/>

          )}

        </div>

        <h1 className={`
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
        `}>
          {doctors[doctor] || "Sistema de reservas"}
        </h1>

        <p className={`
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
        `}>
          {specialties[doctor]}
        </p>

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
            : esFutbol5
            ? "Reservá tu cancha online en segundos."
            : esPadel
            ? "Reservá tu cancha de pádel online en segundos."
            : "Reservá turnos médicos online de forma rápida y segura."
          }

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
            : "Reservar turno"
          }

        </Link>

      </div>

    </div>

  );

}



