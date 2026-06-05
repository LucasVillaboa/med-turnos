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
            Panel Fútbol 5
          </h1>

          <p className="text-slate-500 mt-2 text-sm">
            Administración de reservas
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-5"
        >

          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="w-full min-h-[58px] border border-slate-300 rounded-2xl px-5"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full min-h-[58px] border border-slate-300 rounded-2xl px-5"
          />

          <button
            className="min-h-[58px] bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold"
          >
            Ingresar
          </button>

        </form>

      </div>

    </div>

  );

}