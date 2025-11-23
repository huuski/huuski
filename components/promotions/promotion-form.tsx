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
import type { Promotion } from "@/lib/types/promotion";
import { DiscountType } from "@/lib/types/promotion";

type PromotionFormProps = {
  onSubmit: (data: Omit<Promotion, "id" | "createdAt" | "updatedAt" | "deletedAt" | "usageCount">) => void;
  initialData?: Promotion;
  onCancel?: () => void;
};

const discountTypeLabels: Record<DiscountType, string> = {
  [DiscountType.PERCENTAGE]: "Percentual (%)",
  [DiscountType.FIXED]: "Valor Fixo (R$)",
};

export function PromotionForm({ onSubmit, initialData, onCancel }: PromotionFormProps) {
  const getInitialFormData = () => ({
    name: initialData?.name || "",
    code: initialData?.code || "",
    description: initialData?.description || "",
    discountType: initialData?.discountType || DiscountType.PERCENTAGE,
    discountValue: initialData?.discountValue?.toString() || "",
    minPurchaseValue: initialData?.minPurchaseValue?.toString() || "",
    maxDiscountValue: initialData?.maxDiscountValue?.toString() || "",
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split("T")[0] : "",
    isActive: initialData?.isActive ?? true,
    usageLimit: initialData?.usageLimit?.toString() || "",
  });

  const [formData, setFormData] = useState(getInitialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "O nome é obrigatório";
    }

    if (formData.discountValue && (isNaN(Number(formData.discountValue)) || Number(formData.discountValue) < 0)) {
      newErrors.discountValue = "O valor do desconto deve ser um número válido maior ou igual a zero";
    }

    if (formData.discountType === DiscountType.PERCENTAGE && Number(formData.discountValue) > 100) {
      newErrors.discountValue = "O desconto percentual não pode ser maior que 100%";
    }

    if (formData.minPurchaseValue && (isNaN(Number(formData.minPurchaseValue)) || Number(formData.minPurchaseValue) < 0)) {
      newErrors.minPurchaseValue = "O valor mínimo de compra deve ser um número válido maior ou igual a zero";
    }

    if (formData.maxDiscountValue && (isNaN(Number(formData.maxDiscountValue)) || Number(formData.maxDiscountValue) < 0)) {
      newErrors.maxDiscountValue = "O valor máximo de desconto deve ser um número válido maior ou igual a zero";
    }

    if (formData.usageLimit && (isNaN(Number(formData.usageLimit)) || Number(formData.usageLimit) < 0)) {
      newErrors.usageLimit = "O limite de uso deve ser um número válido maior ou igual a zero";
    }

    if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = "A data de término deve ser posterior à data de início";
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
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue) || 0,
      minPurchaseValue: formData.minPurchaseValue ? Number(formData.minPurchaseValue) : undefined,
      maxDiscountValue: formData.maxDiscountValue ? Number(formData.maxDiscountValue) : undefined,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      isActive: formData.isActive,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{initialData ? "Editar Promoção" : "Nova Promoção"}</CardTitle>
          <CardDescription>
            {initialData ? "Atualize as informações da promoção" : "Preencha os dados da nova promoção"}
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
                placeholder="Nome da promoção"
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
                placeholder="Código da promoção"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição da promoção"
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="discountType">Tipo de Desconto <span className="text-destructive">*</span></Label>
              <Select
                value={formData.discountType}
                onValueChange={(value) => setFormData({ ...formData, discountType: value as DiscountType })}
              >
                <SelectTrigger id="discountType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(discountTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountValue">
                Valor do Desconto <span className="text-destructive">*</span>
              </Label>
              <Input
                id="discountValue"
                type="number"
                step="0.01"
                min="0"
                max={formData.discountType === DiscountType.PERCENTAGE ? 100 : undefined}
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                placeholder={formData.discountType === DiscountType.PERCENTAGE ? "Ex: 10" : "Ex: 50.00"}
                className={errors.discountValue ? "border-destructive" : ""}
              />
              {errors.discountValue && <p className="text-xs text-destructive">{errors.discountValue}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="minPurchaseValue">Valor Mínimo de Compra</Label>
              <Input
                id="minPurchaseValue"
                type="number"
                step="0.01"
                min="0"
                value={formData.minPurchaseValue}
                onChange={(e) => setFormData({ ...formData, minPurchaseValue: e.target.value })}
                placeholder="0.00"
                className={errors.minPurchaseValue ? "border-destructive" : ""}
              />
              {errors.minPurchaseValue && <p className="text-xs text-destructive">{errors.minPurchaseValue}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxDiscountValue">Valor Máximo de Desconto</Label>
              <Input
                id="maxDiscountValue"
                type="number"
                step="0.01"
                min="0"
                value={formData.maxDiscountValue}
                onChange={(e) => setFormData({ ...formData, maxDiscountValue: e.target.value })}
                placeholder="0.00"
                className={errors.maxDiscountValue ? "border-destructive" : ""}
              />
              {errors.maxDiscountValue && <p className="text-xs text-destructive">{errors.maxDiscountValue}</p>}
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
              <Label htmlFor="endDate">
                Data de Término <span className="text-destructive">*</span>
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className={errors.endDate ? "border-destructive" : ""}
              />
              {errors.endDate && <p className="text-xs text-destructive">{errors.endDate}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="usageLimit">Limite de Uso</Label>
              <Input
                id="usageLimit"
                type="number"
                min="0"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                placeholder="Deixe em branco para ilimitado"
                className={errors.usageLimit ? "border-destructive" : ""}
              />
              {errors.usageLimit && <p className="text-xs text-destructive">{errors.usageLimit}</p>}
              <p className="text-xs text-muted-foreground">
                Deixe em branco para uso ilimitado
              </p>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Ativo
                </Label>
              </div>
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
        <Button type="submit">{initialData ? "Salvar Alterações" : "Criar Promoção"}</Button>
      </div>
    </form>
  );
}

