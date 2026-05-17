"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: any) => {

    e.preventDefault();

    // 🔥 USUARIOS DEMO
    const users: any = {
      consultorio: {
        password: "consultorio2026",
        doctor: "demo",
      },

      lopez: {
        password: "123456",
        doctor: "lopez",
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

      router.push("/panel");

    } else {

      alert("Usuario o contraseña incorrectos");

    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-[32px] shadow-xl p-8">

        <div className="text-center mb-8">

          <div className="w-24 h-24 rounded-3xl bg-emerald-100 flex items-center justify-center mx-auto mb-5 text-5xl shadow-sm">
            🩺
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            Panel profesional
          </h1>

          <p className="text-slate-500 mt-2 text-sm">
            Administrá turnos y pacientes desde cualquier dispositivo
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-5"
        >

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                bg-white
                text-slate-900
                placeholder:text-slate-400
                border
                border-slate-300
                rounded-2xl
                px-5
                text-base
                outline-none
                shadow-sm
                focus:border-emerald-500
                focus:ring-4
                focus:ring-emerald-100
                transition
              "
            />

          </div>

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                bg-white
                text-slate-900
                placeholder:text-slate-400
                border
                border-slate-300
                rounded-2xl
                px-5
                text-base
                outline-none
                shadow-sm
                focus:border-emerald-500
                focus:ring-4
                focus:ring-emerald-100
                transition
              "
            />

          </div>

          <button
            className="
              mt-2
              min-h-[58px]
              bg-emerald-600
              hover:bg-emerald-700
              active:scale-[0.99]
              transition
              text-white
              rounded-2xl
              font-semibold
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