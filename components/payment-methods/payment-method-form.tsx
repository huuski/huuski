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
import { Checkbox } from "@/components/ui/checkbox";
import type { PaymentMethod } from "@/lib/types/payment-method";
import { PaymentMethodType } from "@/lib/types/payment-method";

type PaymentMethodFormProps = {
  onSubmit: (data: Omit<PaymentMethod, "id" | "createdAt" | "updatedAt" | "deletedAt">) => void;
  initialData?: PaymentMethod;
  onCancel?: () => void;
};

const typeLabels: Record<PaymentMethodType, string> = {
  [PaymentMethodType.CASH]: "Dinheiro",
  [PaymentMethodType.CREDIT_CARD]: "Cartão de Crédito",
  [PaymentMethodType.DEBIT_CARD]: "Cartão de Débito",
  [PaymentMethodType.BANK_TRANSFER]: "Transferência Bancária",
  [PaymentMethodType.PIX]: "PIX",
  [PaymentMethodType.CHECK]: "Cheque",
  [PaymentMethodType.OTHER]: "Outro",
};

export function PaymentMethodForm({ onSubmit, initialData, onCancel }: PaymentMethodFormProps) {
  const getInitialFormData = () => ({
    name: initialData?.name || "",
    code: initialData?.code || "",
    description: initialData?.description || "",
    type: initialData?.type || PaymentMethodType.OTHER,
    isActive: initialData?.isActive ?? true,
    requiresApproval: initialData?.requiresApproval ?? false,
  });

  const [formData, setFormData] = useState(getInitialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "O nome é obrigatório";
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
      type: formData.type,
      isActive: formData.isActive,
      requiresApproval: formData.requiresApproval,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{initialData ? "Editar Forma de Pagamento" : "Nova Forma de Pagamento"}</CardTitle>
          <CardDescription>
            {initialData ? "Atualize as informações da forma de pagamento" : "Preencha os dados da nova forma de pagamento"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nome <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome da forma de pagamento"
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
                placeholder="Código da forma de pagamento"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição da forma de pagamento"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo <span className="text-destructive">*</span></Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as PaymentMethodType })}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(typeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Ativo
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiresApproval"
                checked={formData.requiresApproval}
                onCheckedChange={(checked) => setFormData({ ...formData, requiresApproval: checked as boolean })}
              />
              <Label htmlFor="requiresApproval" className="cursor-pointer">
                Requer aprovação
              </Label>
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
        <Button type="submit">{initialData ? "Salvar Alterações" : "Criar Forma de Pagamento"}</Button>
      </div>
    </form>
  );
}

