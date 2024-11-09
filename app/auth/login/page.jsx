"use client";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState(null);

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    console.log(res);
    if (res.error) {
      setError(res.error);
    } else {
      router.push('/');
      router.refresh();
    }
  });

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-orange-500 mb-4 text-center">¡Bienvenido!</h2>
        <form onSubmit={onSubmit}>
          {error && (
            <p className="bg-red-500 text-lg text-white p-3 rounded mb-4">{error}</p>
          )}

          <h1 className="text-4xl font-bold text-black mb-6 text-center">Iniciar Sesión</h1>

          <label htmlFor="email" className="text-gray-700 mb-2 block text-sm">
            Correo:
          </label>
          <input
            type="email"
            {...register("email", {
              required: {
                value: true,
                message: "Correo requerido",
              },
            })}
            className="p-3 rounded-md block mb-2 bg-gray-100 border border-gray-300 text-black w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="usuario@correo.com"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}

          <label htmlFor="password" className="text-gray-700 mb-2 block text-sm mt-4">
            Contraseña:
          </label>
          <input
            type="password"
            {...register("password", {
              required: {
                value: true,
                message: "Contraseña requerida",
              },
            })}
            className="p-3 rounded-md block mb-2 bg-gray-100 border border-gray-300 text-black w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="******"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}

          <button className="w-full bg-orange-500 text-white p-3 rounded-md mt-6 hover:bg-orange-600 transition-colors duration-300">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
