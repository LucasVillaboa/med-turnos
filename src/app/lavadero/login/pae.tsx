"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LavaderoLoginPage() {

  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: any) => {

    e.preventDefault();

    const users: any = {

      lavadero: {
        password: "lavadero2026",
        doctor: "lavadero",
      },

    };

    const user = users[usuario];

    if (
      user &&
      user.password === password
    ) {

      localStorage.setItem("auth", "true");

      localStorage.setItem(
        "doctor",
        user.doctor
      );

      router.push("/lavadero/panel");

    } else {

      alert("Usuario o contraseña incorrectos");

    }

  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-zinc-950 border border-yellow-500/30 rounded-[32px] shadow-2xl p-8">

        <div className="text-center mb-8">

          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop"
            alt="Auto"
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

          <h1 className="text-3xl font-bold text-yellow-400">
            Panel Lavadero
          </h1>

          <p className="text-zinc-400 mt-2 text-sm">
            Administrá reservas y clientes
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-5"
        >

          <div>

            <label className="block text-sm font-semibold text-yellow-400 mb-2">
              Usuario
            </label>

            <input
              type="text"
              placeholder="Ingresar usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="
                w-full
                min-h-[58px]
                bg-zinc-900
                text-white
                placeholder:text-zinc-500
                border
                border-zinc-700
                rounded-2xl
                px-5
                text-base
                outline-none
                focus:border-yellow-500
                focus:ring-4
                focus:ring-yellow-500/20
                transition
              "
            />

          </div>

          <div>

            <label className="block text-sm font-semibold text-yellow-400 mb-2">
              Contraseña
            </label>

            <input
              type="password"
              placeholder="Ingresar contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full
                min-h-[58px]
                bg-zinc-900
                text-white
                placeholder:text-zinc-500
                border
                border-zinc-700
                rounded-2xl
                px-5
                text-base
                outline-none
                focus:border-yellow-500
                focus:ring-4
                focus:ring-yellow-500/20
                transition
              "
            />

          </div>

          <button
            className="
              mt-2
              min-h-[58px]
              bg-yellow-500
              hover:bg-yellow-400
              transition
              text-black
              rounded-2xl
              font-bold
              text-lg
              shadow-lg
            "
          >
            Ingresar al panel
          </button>

        </form>

      </div>

    </div>

  );

}