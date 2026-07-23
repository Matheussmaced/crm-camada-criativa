"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants/routes";
import { loginSchema, type LoginFormValues } from "../schemas";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [authError, setAuthError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setAuthError(undefined);
    const success = await login(values.email, values.password);
    if (!success) {
      setAuthError("E-mail ou senha inválidos.");
      return;
    }
    router.replace(ROUTES.dashboard);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormField label="E-mail" error={errors.email?.message}>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input type="email" className="pl-8" autoFocus {...register("email")} />
        </div>
      </FormField>
      <FormField label="Senha" error={errors.password?.message}>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input type="password" className="pl-8" {...register("password")} />
        </div>
      </FormField>
      {authError && <p className="text-sm text-red-500">{authError}</p>}
      <Button type="submit" className="mt-1" isLoading={isSubmitting}>
        Entrar
      </Button>
    </form>
  );
}
