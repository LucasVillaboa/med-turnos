import Link from "next/link";

interface Props {
  params: { doctor: string };
}

export default function DoctorPage({ params }: Props) {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">
        Dr. {params.doctor}
      </h1>

      <p className="mb-4">Especialidad: Urología</p>

      <Link
        href={`/${params.doctor}/reservar`}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Reservar turno
      </Link>
    </div>
  );
}
