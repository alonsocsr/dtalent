"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { loginUser } from "@/lib/fetch";
import { LoginResponse } from '@/lib/types';

const loginSchema = z.object({
  username: z
    .string()
    .min(3, "El numero de documento o la contraseña son incorrectas")
    .min(1),
  password: z
    .string()
    .min(3, "El numero de documento o la contraseña son incorrectas")
    .min(1),
});

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState({ username: false, password: false })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validation = loginSchema.safeParse({ username, password });
    if (!validation.success) {
      const errorField = validation.error.errors[0].path[0] as "email" | "password";
      setFieldError((prev) => ({ ...prev, [errorField]: true }));
      setError("Numero de documento o contraseña incorrectos");
      return;
    }

    try {
      const credentials = { username, password };
      const { token, user }: LoginResponse = await loginUser(credentials);

      localStorage.setItem('token', token);
      localStorage.setItem("user", JSON.stringify(user));

      router.push(`/dashboard/users`);

    } catch (err) {
      setError("Numero de documento o contraseña incorrectos");
      const errorField = err as "email" | "password";
      setFieldError((prev) => ({ ...prev, [errorField]: true }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <Card className="w-full max-w-md p-4 bg-black border-none">
        <CardHeader className="flex flex-col items-center mb-6">
          <Image
            src="/dTalentLogo.png"
            alt="Logo"
            width={200}
            height={200}
            className="mb-4"
          />
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent>
            <div className="mb-8">
              <FloatingLabelInput
                type="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Numero de documento"
                hasError={fieldError.username}
                errorMessage={error}
              />
            </div>

            <div className="mb-8">
              <FloatingLabelInput
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                hasError={fieldError.password}
                errorMessage={error}
              />
            </div>
          </CardContent>

          <CardFooter>
            <div className="flex-col w-full">
              <Button type="submit" className="w-full bg-blue-700 text-white hover:bg-blue-800">
                INICIAR SESIÓN
              </Button>
              <div
                className=" flex justify-center items-center w-full text-blue-600 hover:text-blue-700 mt-8"
              >
                ¿Olvidaste tu contraseña?
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
