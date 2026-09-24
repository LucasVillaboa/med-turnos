"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

export default function BarberiaLoginPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const users: Record<
      string,
      {
        password: string;
        doctor: string;
      }
    > = {
      Barberia: {
        password: "Barberia2026",
        doctor: "barberia",
      },
    };

    const user = users[usuario];

    if (user && user.password === password) {
      localStorage.setItem("auth", "true");
      localStorage.setItem("doctor", user.doctor);

      router.push("/barberia/panel");
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md">

        {/* TARJETA */}

        <div className="rounded-[32px] border border-zinc-800 bg-zinc-900/95 shadow-2xl overflow-hidden">

          {/* CABECERA */}

          <div className="relative px-8 pt-10 pb-8 text-center">

            <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 via-transparent to-transparent pointer-events-none" />

            <div className="relative">

         <img
  src="/barberia.jpeg"
  alt="Black Barber"
  className="
    w-68
    h-68
    object-cover
    rounded-3xl
    mx-auto
    mb-5
    border-2
    border-yellow-500
    shadow-lg
  "
/>

              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-yellow-500">
                Barber
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight">
                Administración
              </h1>

              <p className="mt-2 text-sm text-zinc-400">
                Gestioná tus reservas desde un solo lugar
              </p>

            </div>

          </div>

          {/* FORMULARIO */}

          <div className="px-8 pb-8">

            <form
              onSubmit={handleLogin}
              className="flex flex-col gap-5"
              autoComplete="off"
            >

              {/* USUARIO */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-zinc-200">
                  Usuario
                </label>

                <div className="relative">

                  <User className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

                  <input
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="Ingresar usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    className="
                      min-h-[58px]
                      w-full
                      rounded-2xl
                      border
                      border-zinc-700
                      bg-zinc-950
                      pl-14
                      pr-5
                      text-base
                      text-white
                      placeholder:text-zinc-600
                      outline-none
                      transition
                      focus:border-yellow-500
                      focus:ring-4
                      focus:ring-yellow-500/10
                    "
                    style={{
                      WebkitTextFillColor: "#ffffff",
                    }}
                  />

                </div>

              </div>

              {/* CONTRASEÑA */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-zinc-200">
                  Contraseña
                </label>

                <div className="relative">

                  <Lock className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

                  <input
                    type={mostrarPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Ingresar contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="
                      min-h-[58px]
                      w-full
                      rounded-2xl
                      border
                      border-zinc-700
                      bg-zinc-950
                      pl-14
                      pr-14
                      text-base
                      text-white
                      placeholder:text-zinc-600
                      outline-none
                      transition
                      focus:border-yellow-500
                      focus:ring-4
                      focus:ring-yellow-500/10
                    "
                    style={{
                      WebkitTextFillColor: "#ffffff",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setMostrarPassword((actual) => !actual)
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      rounded-xl
                      p-2
                      text-zinc-500
                      transition
                      hover:bg-zinc-800
                      hover:text-yellow-400
                    "
                    aria-label={
                      mostrarPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    {mostrarPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>

                </div>

              </div>

              {/* BOTÓN */}

              <button
                type="submit"
                className="
                  mt-2
                  flex
                  min-h-[60px]
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-yellow-500
                  px-6
                  text-lg
                  font-bold
                  text-black
                  shadow-[0_10px_35px_rgba(234,179,8,0.15)]
                  transition
                  hover:bg-yellow-400
                  active:scale-[0.98]
                "
              >
                Ingresar
                <ArrowRight className="h-5 w-5" />
              </button>

            </form>

            {/* PIE */}

            <p className="mt-7 text-center text-xs text-zinc-600">
              Panel privado · Barber
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}

