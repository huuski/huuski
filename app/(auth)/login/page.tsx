import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md space-y-6 text-center">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          huuski
        </p>
        <h1 className="text-3xl font-bold">Acesse o dashboard</h1>
        <p className="text-sm text-muted-foreground">
          PoC para fluxos de atendimento
        </p>
      </div>
      <LoginForm />
    </div>
  );
}

