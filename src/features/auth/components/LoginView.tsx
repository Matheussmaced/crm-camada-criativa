"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants/routes";
import { LoginForm } from "./LoginForm";

export function LoginView() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace(ROUTES.dashboard);
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center pb-4 text-center">
          <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Box className="h-5 w-5" />
          </div>
          <CardTitle>Entrar no CRM</CardTitle>
          <CardDescription>Acesse o painel da sua empresa de impressão 3D.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
