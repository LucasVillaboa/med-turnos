import { NextResponse } from "next/server";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN && challenge) {
    return new Response(challenge, {
      status: 200,
    });
  }

  return new Response("Forbidden", {
    status: 403,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log(
      "WHATSAPP WEBHOOK:",
      JSON.stringify(body, null, 2)
    );

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("Error en webhook de WhatsApp:", error);

    return NextResponse.json(
      {
        ok: false,
      },
      {
        status: 400,
      }
    );
  }
}