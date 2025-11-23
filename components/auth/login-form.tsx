"use client";

import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { loginAction, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" disabled={pending}>
      {pending ? "Entrando..." : "Entrar"}
    </Button>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [state, formAction] = useActionState<AuthState | undefined, FormData>(
    loginAction,
    undefined,
  );
  const [showPassword, setShowPassword] = useState(false);

  // Se o login foi bem-sucedido (sem erro), redirecionar
  useEffect(() => {
    if (state && !state.error && state.success === true) {
      // Pequeno delay para garantir que os cookies foram salvos
      const timer = setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Bem-vindo de volta</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {state?.error ? (
            <p className="text-sm font-medium text-destructive">{state.error}</p>
          ) : null}
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}

