"use client";

import { useState } from "react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Negotiation } from "@/lib/types/negotiation";
import { NegotiationStatus } from "@/lib/types/negotiation";
import { getCustomers } from "@/lib/negotiations";

type NegotiationFormProps = {
  onSubmit: (data: Omit<Negotiation, "id" | "createdAt" | "updatedAt" | "deletedAt">) => void;
  initialData?: Negotiation;
  onCancel?: () => void;
};

const statusLabels: Record<NegotiationStatus, string> = {
  [NegotiationStatus.OPEN]: "Aberta",
  [NegotiationStatus.IN_PROGRESS]: "Em Andamento",
  [NegotiationStatus.CLOSED]: "Fechada",
  [NegotiationStatus.CANCELLED]: "Cancelada",
};

export function NegotiationForm({ onSubmit, initialData, onCancel }: NegotiationFormProps) {
  const customers = getCustomers();
  
  const getInitialFormData = () => ({
    customerId: initialData?.customerId || "",
    customerName: initialData?.customerName || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    value: initialData?.value?.toString() || "",
    status: initialData?.status || NegotiationStatus.OPEN,
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split("T")[0] : "",
  });

  const [formData, setFormData] = useState(getInitialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerId) {
      newErrors.customerId = "O cliente é obrigatório";
    }

    if (!formData.title.trim()) {
      newErrors.title = "O título é obrigatório";
    }

    if (formData.value && (isNaN(Number(formData.value)) || Number(formData.value) < 0)) {
      newErrors.value = "O valor deve ser um número válido maior ou igual a zero";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    setFormData({
      ...formData,
      customerId,
      customerName: customer?.name || "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      customerId: formData.customerId,
      customerName: formData.customerName,
      title: formData.title.trim(),
      description: formData.description?.trim() || undefined,
      value: Number(formData.value) || 0,
      status: formData.status,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{initialData ? "Editar Negociação" : "Nova Negociação"}</CardTitle>
          <CardDescription>
            {initialData ? "Atualize as informações da negociação" : "Preencha os dados da nova negociação"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerId">
              Cliente <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.customerId}
              onValueChange={handleCustomerChange}
            >
              <SelectTrigger id="customerId" className={errors.customerId ? "border-destructive" : ""}>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.customerId && <p className="text-xs text-destructive">{errors.customerId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Título da negociação"
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição da negociação"
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="value">
                Valor <span className="text-destructive">*</span>
              </Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                min="0"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="0.00"
                className={errors.value ? "border-destructive" : ""}
              />
              {errors.value && <p className="text-xs text-destructive">{errors.value}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as NegotiationStatus })}
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">
                Data de Início <span className="text-destructive">*</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Data de Término</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
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
        <Button type="submit">{initialData ? "Salvar Alterações" : "Criar Negociação"}</Button>
      </div>
    </form>
  );
}

