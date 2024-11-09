"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const router = useRouter();

    const onSubmit = handleSubmit(async (data) => {
        if (data.password !== data.confirmPassword) {
            return alert("Las contraseñas no coinciden");
        }

        const res = await fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
                username: data.username,
                email: data.email,
                password: data.password,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.ok) {
            router.push("/auth/login");
        } else {
            const errorData = await res.json();
            alert(errorData.message || "Error al registrar usuario");
        }
    });

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-orange-500 mb-6 text-center">¡Registrate!</h1>
                <h2 className="text-4xl font-bold text-black-500 mb-8 text-center">Crear Cuenta</h2>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Nombre de usuario
                        </label>
                        <input
                            type="text"
                            id="username"
                            {...register("username", {
                                required: {
                                    value: true,
                                    message: "Nombre de usuario es requerido",
                                },
                            })}
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-red-500"
                            placeholder="Ingresa tu nombre de usuario"
                        />
                        {errors.username && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register("email", {
                                required: {
                                    value: true,
                                    message: "Correo es requerido",
                                },
                            })}
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-red-500"
                            placeholder="Ingresa tu correo electrónico"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register("password", {
                                required: {
                                    value: true,
                                    message: "Contraseña es requerida",
                                },
                            })}
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-red-500"
                            placeholder="Ingresa tu contraseña"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Confirmar Contraseña
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            {...register("confirmPassword", {
                                required: {
                                    value: true,
                                    message: "Debes confirmar tu contraseña",
                                },
                            })}
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-red-500"
                            placeholder="Confirma tu contraseña"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-300"
                    >
                        Registrarse
                    </button>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{" "}
                        <a
                            href="/auth/login"
                            className="text-blue-500 hover:text-blue-700 font-semibold"
                        >
                            Iniciar sesión
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
