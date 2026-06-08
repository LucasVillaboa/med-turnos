"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Futbol5LoginPage() {

  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: any) => {

    e.preventDefault();

    const users: any = {

      futbol5: {
        password: "futbol52026",
        doctor: "futbol5",
      },

    };

    const user = users[usuario];

    if (
      user &&
      user.password === password
    ) {

      localStorage.setItem("auth", "true");
      localStorage.setItem("doctor", user.doctor);

      router.push("/futbol5/panel");

    } else {

      alert("Usuario o contraseña incorrectos");

    }

  };

  return (

    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white border border-green-300 rounded-[32px] shadow-2xl p-8">

        <div className="text-center mb-8">

          <div className="w-28 h-28 bg-green-100 rounded-3xl mx-auto flex items-center justify-center text-6xl mb-5">
            ⚽
          </div>

          <h1 className="text-3xl font-bold text-green-700">
            Fútbol 5
          </h1>

          <p className="text-slate-500 mt-2 text-sm">
            Administración de reservas
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-5"
          autoComplete="off"
        >

          <div>

            <label className="block text-sm font-semibold text-green-700 mb-2">
              Usuario
            </label>

            <input
              type="text"
              autoComplete="off"
              spellCheck={false}
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
                focus:border-green-500
                focus:ring-4
                focus:ring-green-100
                transition
              "
              style={{
                WebkitTextFillColor: "#0f172a",
              }}
            />

          </div>

          <div>

            <label className="block text-sm font-semibold text-green-700 mb-2">
              Contraseña
            </label>

            <input
              type="password"
              autoComplete="new-password"
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
                focus:border-green-500
                focus:ring-4
                focus:ring-green-100
                transition
              "
              style={{
                WebkitTextFillColor: "#0f172a",
              }}
            />

          </div>

          <button
            className="
              min-h-[58px]
              bg-green-600
              hover:bg-green-700
              active:scale-[0.99]
              transition
              text-white
              rounded-2xl
              font-bold
              text-lg
              shadow-lg
            "
          >
            Ingresar
          </button>

        </form>

      </div>

    </div>

  );

}