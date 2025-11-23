"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { Service } from "@/lib/types/service";
import { ServiceStatus } from "@/lib/types/service";
import { fetchExecutionFlowsSimple } from "@/lib/api/execution-flow";
import type { ApiExecutionFlow } from "@/lib/api/execution-flow";
import { ServiceCategory, ServiceCategoryLabels, getServiceCategoryValue } from "@/lib/types/service-category";

type ServiceFormProps = {
  onSubmit: (data: Omit<Service, "id" | "createdAt" | "updatedAt" | "deletedAt">) => void | Promise<void>;
  initialData?: Service;
  onCancel?: () => void;
  loading?: boolean;
};

const statusLabels: Record<ServiceStatus, string> = {
  [ServiceStatus.ACTIVE]: "Ativo",
  [ServiceStatus.INACTIVE]: "Inativo",
  [ServiceStatus.DISCONTINUED]: "Descontinuado",
};

export function ServiceForm({ onSubmit, initialData, onCancel, loading = false }: ServiceFormProps) {
  const getInitialFormData = () => ({
    name: initialData?.name || "",
    code: initialData?.code || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    cost: initialData?.cost?.toString() || "",
    duration: initialData?.duration?.toString() || "",
    category: initialData?.category ? getServiceCategoryValue(initialData.category).toString() : ServiceCategory.Other.toString(),
    status: initialData?.status || ServiceStatus.ACTIVE,
    executionFlowId: initialData?.executionFlowId || undefined,
  });

  const [formData, setFormData] = useState(getInitialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [executionFlows, setExecutionFlows] = useState<ApiExecutionFlow[]>([]);
  const [loadingFlows, setLoadingFlows] = useState(true);

  useEffect(() => {
    const loadExecutionFlows = async () => {
      try {
        setLoadingFlows(true);
        const flows = await fetchExecutionFlowsSimple();
        setExecutionFlows(flows);
      } catch (error) {
        console.error("Error loading execution flows:", error);
        // Não bloquear o formulário se houver erro ao carregar os fluxos
      } finally {
        setLoadingFlows(false);
      }
    };

    loadExecutionFlows();
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "O nome é obrigatório";
    }

    if (formData.price && (isNaN(Number(formData.price)) || Number(formData.price) < 0)) {
      newErrors.price = "O preço deve ser um número válido maior ou igual a zero";
    }

    if (formData.cost && (isNaN(Number(formData.cost)) || Number(formData.cost) < 0)) {
      newErrors.cost = "O custo deve ser um número válido maior ou igual a zero";
    }

    if (formData.duration && (isNaN(Number(formData.duration)) || Number(formData.duration) < 0)) {
      newErrors.duration = "A duração deve ser um número válido maior ou igual a zero";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      code: formData.code.trim() || undefined,
      description: formData.description.trim() || undefined,
      price: Number(formData.price) || 0,
      cost: formData.cost ? Number(formData.cost) : undefined,
      duration: formData.duration ? Number(formData.duration) : undefined,
      category: formData.category ? formData.category : undefined,
      status: formData.status,
      executionFlowId: formData.executionFlowId || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nome <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do serviço"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Código do serviço"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição do serviço"
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">
                Preço <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                className={errors.price ? "border-destructive" : ""}
              />
              {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Custo</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                placeholder="0.00"
                className={errors.cost ? "border-destructive" : ""}
              />
              {errors.cost && <p className="text-xs text-destructive">{errors.cost}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Input
                id="duration"
                type="number"
                min="0"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="Ex: 60"
                className={errors.duration ? "border-destructive" : ""}
              />
              {errors.duration && <p className="text-xs text-destructive">{errors.duration}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ServiceCategoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="executionFlowId">Fluxo de execução</Label>
              <Select
                value={formData.executionFlowId || "none"}
                onValueChange={(value) => setFormData({ ...formData, executionFlowId: value === "none" ? undefined : value })}
                disabled={loadingFlows}
              >
                <SelectTrigger id="executionFlowId">
                  <SelectValue placeholder={loadingFlows ? "Carregando..." : "Selecione um fluxo"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {executionFlows.map((flow) => (
                    <SelectItem key={flow.id} value={flow.id}>
                      {flow.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as ServiceStatus })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            initialData ? "Salvar Alterações" : "Criar Serviço"
          )}
        </Button>
      </div>
    </form>
  );
}

