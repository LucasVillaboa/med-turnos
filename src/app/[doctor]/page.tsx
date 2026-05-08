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
  };

  // 🔥 ESPECIALIDADES
  const specialties: Record<string, string> = {
    sandoval: "Especialista en Urología",
    lopez: "Especialista en Cardiología",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-green-100 p-10 text-center">

        {/* FOTO / INICIAL */}
        <div className="w-28 h-28 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold text-green-700">
          {doctor.charAt(0).toUpperCase()}
        </div>

        {/* NOMBRE */}
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          {doctors[doctor] || "Profesional"}
        </h1>

        {/* ESPECIALIDAD */}
        <p className="text-green-700 font-medium mb-6">
          {specialties[doctor] || "Especialista"}
        </p>

        {/* DESCRIPCIÓN */}
        <p className="text-slate-500 mb-8 leading-relaxed">
          Reservá tu turno online de forma rápida y segura.
          Elegí fecha y horario disponible desde cualquier dispositivo.
        </p>

        {/* BOTÓN */}
        <Link
          href={`/${doctor}/reservar`}
          className="
            inline-block
            bg-green-600
            hover:bg-green-700
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