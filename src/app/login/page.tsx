"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: any) => {
    e.preventDefault();

    // 🔥 LOGIN SIMPLE MVP
    if (
      usuario === "consultorio" &&
      password === "123456"
    ) {

      localStorage.setItem("auth", "true");

      router.push("/panel");

    } else {

      alert("Usuario o contraseña incorrectos");

    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-lg p-8">

        <div className="text-center mb-8">

          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5 text-4xl">
            🩺
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            Panel profesional
          </h1>

          <p className="text-slate-500 mt-2">
            Ingresá para administrar los turnos
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
        >

          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="
              w-full
              min-h-[56px]
              border
              border-slate-300
              rounded-2xl
              px-4
              outline-none
              focus:border-emerald-600
              focus:ring-2
              focus:ring-emerald-200
            "
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full
              min-h-[56px]
              border
              border-slate-300
              rounded-2xl
              px-4
              outline-none
              focus:border-emerald-600
              focus:ring-2
              focus:ring-emerald-200
            "
          />

          <button
            className="
              mt-4
              min-h-[56px]
              bg-emerald-600
              hover:bg-emerald-700
              transition
              text-white
              rounded-2xl
              font-semibold
              text-lg
            "
          >
            Ingresar
          </button>

        </form>

      </div>

    </div>
  );
}