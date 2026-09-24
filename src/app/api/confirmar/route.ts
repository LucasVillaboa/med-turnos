import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    let barberoFinal = data.barbero || null;

    // ==========================================
    // LÓGICA ESPECIAL PARA BARBERÍA
    // ==========================================

    if (data.doctor === "barberia") {

      const barberos = [
        "Lucas",
        "Agustin",
        "Felipe",
        "Demian",
      ];

      // ------------------------------------------
      // CUALQUIER BARBERO
      // ------------------------------------------

      if (data.barbero === "Cualquier barbero") {

        const { data: turnosExistentes, error: errorConsulta } =
          await supabase
            .from("turnos")
            .select("barbero")
            .eq("doctor", data.doctor)
            .eq("fecha", data.fecha)
            .eq("hora", data.hora);

        if (errorConsulta) {
          console.error(errorConsulta);

          return NextResponse.json(
            { error: errorConsulta.message },
            { status: 500 }
          );
        }

        const barberosOcupados =
          turnosExistentes?.map((turno) => turno.barbero) || [];

        // Buscar el primer barbero disponible
        const barberoDisponible = barberos.find(
          (barbero) => !barberosOcupados.includes(barbero)
        );

        // Si los 4 están ocupados
        if (!barberoDisponible) {
          return NextResponse.json(
            { error: "Horario ocupado" },
            { status: 400 }
          );
        }

        // Asignar automáticamente el barbero disponible
        barberoFinal = barberoDisponible;
      }

      // ------------------------------------------
      // BARBERO ESPECÍFICO
      // ------------------------------------------

      else {

        const { data: existente, error: errorConsulta } =
          await supabase
            .from("turnos")
            .select("id")
            .eq("doctor", data.doctor)
            .eq("fecha", data.fecha)
            .eq("hora", data.hora)
            .eq("barbero", data.barbero);

        if (errorConsulta) {
          console.error(errorConsulta);

          return NextResponse.json(
            { error: errorConsulta.message },
            { status: 500 }
          );
        }

        if (existente && existente.length > 0) {
          return NextResponse.json(
            { error: "Horario ocupado" },
            { status: 400 }
          );
        }
      }
    }

    // ==========================================
    // RESTO DE SERVICIOS
    // ==========================================

    else {

      const { data: existente, error: errorConsulta } =
        await supabase
          .from("turnos")
          .select("id")
          .eq("doctor", data.doctor)
          .eq("fecha", data.fecha)
          .eq("hora", data.hora);

      if (errorConsulta) {
        console.error(errorConsulta);

        return NextResponse.json(
          { error: errorConsulta.message },
          { status: 500 }
        );
      }

      if (existente && existente.length > 0) {
        return NextResponse.json(
          { error: "Horario ocupado" },
          { status: 400 }
        );
      }
    }

    // ==========================================
    // GUARDAR TURNO
    // ==========================================

    const { error } = await supabase
      .from("turnos")
      .insert([
        {
          doctor: data.doctor,
          nombre: data.nombre,
          telefono: data.telefono,
          email: data.email || null,
          fecha: data.fecha,
          hora: data.hora,
          barbero: barberoFinal,

          // Datos del servicio para Barbería
          servicio: data.doctor === "barberia"
            ? data.servicio
            : null,

          precio: data.doctor === "barberia"
            ? data.precio
            : null,
        },
      ]);

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // ==========================================
    // EMAIL
    // ==========================================

    let titulo = "Confirmación de reserva";

    if (data.doctor === "lavadero") {
      titulo = "Confirmación de lavado";
    }

    if (data.doctor === "futbol5") {
      titulo = "Confirmación de reserva de cancha";
    }

    // En Barbería no enviamos email porque el formulario
    // no solicita correo electrónico.
    if (data.email) {
      await resend.emails.send({
        from: "Turnos <onboarding@resend.dev>",
        to: data.email,
        subject: titulo,
        html: `
          <h2>${titulo}</h2>

          <p><strong>Nombre:</strong> ${data.nombre}</p>
          <p><strong>Teléfono:</strong> ${data.telefono}</p>
          <p><strong>Fecha:</strong> ${data.fecha}</p>
          <p><strong>Hora:</strong> ${data.hora}</p>
          <p><strong>Servicio:</strong> ${data.doctor}</p>

          ${
            barberoFinal
              ? `<p><strong>Barbero:</strong> ${barberoFinal}</p>`
              : ""
          }

          <br/>

          <p>Gracias por utilizar nuestro sistema de reservas.</p>
        `,
      });
    }

    return NextResponse.json({
      ok: true,
      barbero: barberoFinal,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Error interno",
      },
      {
        status: 500,
      }
    );
  }
}





