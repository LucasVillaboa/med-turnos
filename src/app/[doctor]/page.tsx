import Link from "next/link";

interface Props {
  params: Promise<{ doctor: string }>;
}

export default async function DoctorPage({ params }: Props) {

  const { doctor } = await params;

  // 🔥 NOMBRES VISIBLES PARA LOS PACIENTES
  const doctors: Record<string, string> = {
    sandoval: "Dr. Juan Sandoval",
    lopez: "Dra. María López",

    // 🔥 DEMO
    demo: "Consultorio Demo",
  };

  // 🔥 ESPECIALIDADES
  const specialties: Record<string, string> = {
    sandoval: "Especialista en Urología",
    lopez: "Especialista en Cardiología",

    // 🔥 DEMO
    demo: "Sistema de turnos online",
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 p-10 text-center">

        {/* FOTO / ICONO */}
        <div className="w-28 h-28 bg-emerald-100 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl">
          🩺
        </div>

        {/* NOMBRE */}
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          {doctors[doctor] || "Profesional"}
        </h1>

        {/* ESPECIALIDAD */}
        <p className="text-emerald-700 font-medium mb-6">
          {specialties[doctor] || "Especialista"}
        </p>

        {/* DESCRIPCIÓN */}
        <p className="text-slate-500 mb-8 leading-relaxed max-w-lg mx-auto">
          Reservá turnos online de forma rápida, moderna y segura.
          Elegí fecha y horario disponible desde cualquier dispositivo.
        </p>

        {/* BOTÓN */}
        <Link
          href={`/${doctor}/reservar`}
          className="
            inline-block
            bg-emerald-600
            hover:bg-emerald-700
            transition
            text-white
            px-8
            py-4
            rounded-2xl
            font-semibold
            text-lg
            shadow-lg
          "
        >
          Reservar turno
        </Link>

      </div>

    </div>
  );
}