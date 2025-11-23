import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { demoUser } from "@/lib/auth";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Perfil</h1>
        <p className="text-sm text-muted-foreground">
          Visualize e gerencie suas informações pessoais.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações pessoais</CardTitle>
          <CardDescription>Suas informações de conta e perfil.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/avatar.png" alt={demoUser.name} />
              <AvatarFallback className="text-2xl">FA</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{demoUser.name}</h3>
              <p className="text-sm text-muted-foreground">{demoUser.email}</p>
              <Badge variant="secondary" className="mt-2">
                {demoUser.role}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da conta</CardTitle>
          <CardDescription>Informações adicionais sobre sua conta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">Nome completo</p>
            <p className="text-sm text-muted-foreground">{demoUser.name}</p>
          </div>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-muted-foreground">{demoUser.email}</p>
          </div>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">Função</p>
            <p className="text-sm text-muted-foreground">{demoUser.role}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Próximas funcionalidades</CardTitle>
          <CardDescription>
            Em breve você poderá editar seu perfil, alterar senha e muito mais.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Esta página pode ser expandida para incluir formulários de edição, upload de foto de perfil,
          histórico de atividades e outras informações relevantes.
        </CardContent>
      </Card>
    </div>
  );
}

