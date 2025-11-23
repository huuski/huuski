import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statCards = [
  { label: "Total Sales", value: "$612.9K", change: "+2.08%" },
  { label: "Total Orders", value: "34.760", change: "+12.4%" },
  { label: "Visitors", value: "14.987", change: "-2.08%", negative: true },
  { label: "Sold Products", value: "12.987", change: "+12.1%" },
];

const geo = [
  { label: "United States", value: 2417 },
  { label: "Germany", value: 2281 },
  { label: "Australia", value: 812 },
  { label: "France", value: 287 },
];

export default function ReportPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Sales report
        </p>
        <h1 className="text-3xl font-bold">Resumo de desempenho</h1>
        <p className="text-sm text-muted-foreground">
          Dados consolidados do dia 15/12/2023 para todas as lojas conectadas.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="pb-2">
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className="text-2xl">{card.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={card.negative ? "destructive" : "secondary"}>
                {card.change}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Performance mensal</CardTitle>
            <CardDescription>Comparativo de receita e visitas.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-4">
              {[35, 48, 60, 52, 70, 66].map((value, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto flex h-48 w-12 items-end rounded-full bg-muted p-1">
                    <div
                      className="w-full rounded-full bg-primary"
                      style={{ height: `${value}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"][index]}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Origem das vendas</CardTitle>
            <CardDescription>Top regiões do último mês.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {geo.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl border px-4 py-3"
              >
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">Clientes ativos</p>
                </div>
                <Badge variant="outline">{item.value}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Exportar relatório</CardTitle>
            <CardDescription>
              Gere um CSV com pedidos, margens e tributos para compartilhar com o financeiro.
            </CardDescription>
          </div>
          <Button>Download CSV</Button>
        </CardHeader>
      </Card>
    </div>
  );
}

