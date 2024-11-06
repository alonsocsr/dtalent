"use client";


import React, { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { z } from "zod";
import axios from "axios";

// Definimos el esquema de validación usando Zod
const loginSchema = z.object({
  email: z
    .string()
    .email("Introduce un correo electrónico válido.")
    .min(1),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres.")
    .min(1),
});

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validamos los datos de entrada con el esquema de Zod
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    try {
      const response = await axios.post("/api/login", { email, password });

      if (response.status === 200) {
        router.push("/dashboard"); // Redirige a la página principal después del login exitoso
      } else {
        throw new Error("Credenciales incorrectas.");
      }
    } catch (err) {
      setError(
        (axios.isAxiosError(err) && err.response?.data?.message) ||
        "Error en el servidor."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <Card className="w-full max-w-md p-4 bg-gray-800">
        <CardHeader className="flex flex-col items-center">
          <Image
            src="/dTalentLogo.png" // Cambia esta ruta por la de tu logo
            alt="Logo"
            width={100}
            height={100}
            className="mb-4"
          />
          <CardTitle className="text-white text-2xl">Iniciar Sesión</CardTitle>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent>
            {error && (
              <p className="text-red-500 text-center mb-4">{error}</p>
            )}

            <div className="mb-4">
              <label htmlFor="email" className="text-gray-300 block mb-2">
                Correo electrónico
              </label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="text-gray-300 block mb-2">
                Contraseña
              </label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                placeholder="********"
                required
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
              Iniciar Sesión
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
