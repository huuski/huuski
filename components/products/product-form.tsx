"use client";

import { useState } from "react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/lib/types/product";
import { ProductStatus } from "@/lib/types/product";
import { ProductCategory, ProductCategoryLabels, getProductCategoryValue } from "@/lib/types/product-category";

type ProductFormProps = {
  onSubmit: (data: Omit<Product, "id" | "createdAt" | "updatedAt" | "deletedAt">) => void | Promise<void>;
  initialData?: Product;
  onCancel?: () => void;
  loading?: boolean;
};

const statusLabels: Record<ProductStatus, string> = {
  [ProductStatus.ACTIVE]: "Ativo",
  [ProductStatus.INACTIVE]: "Inativo",
  [ProductStatus.OUT_OF_STOCK]: "Sem estoque",
  [ProductStatus.DISCONTINUED]: "Descontinuado",
};

export function ProductForm({ onSubmit, initialData, onCancel, loading = false }: ProductFormProps) {
  const getInitialFormData = () => ({
    name: initialData?.name || "",
    sku: initialData?.sku || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    cost: initialData?.cost?.toString() || "",
    stock: initialData?.stock?.toString() || "",
    minStock: initialData?.minStock?.toString() || "",
    category: initialData?.category ? getProductCategoryValue(initialData.category).toString() : ProductCategory.Other.toString(),
    status: initialData?.status || ProductStatus.ACTIVE,
  });

  const [formData, setFormData] = useState(getInitialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    if (formData.stock && (isNaN(Number(formData.stock)) || Number(formData.stock) < 0)) {
      newErrors.stock = "O estoque deve ser um número válido maior ou igual a zero";
    }

    if (formData.minStock && (isNaN(Number(formData.minStock)) || Number(formData.minStock) < 0)) {
      newErrors.minStock = "O estoque mínimo deve ser um número válido maior ou igual a zero";
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
      sku: formData.sku.trim() || undefined,
      description: formData.description.trim() || undefined,
      price: Number(formData.price) || 0,
      cost: formData.cost ? Number(formData.cost) : undefined,
      stock: Number(formData.stock) || 0,
      minStock: formData.minStock ? Number(formData.minStock) : undefined,
      category: formData.category ? formData.category : undefined,
      status: formData.status,
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
                placeholder="Nome do produto"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Código SKU"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição do produto"
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
              <Label htmlFor="stock">
                Estoque <span className="text-destructive">*</span>
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
                className={errors.stock ? "border-destructive" : ""}
              />
              {errors.stock && <p className="text-xs text-destructive">{errors.stock}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStock">Estoque Mínimo</Label>
              <Input
                id="minStock"
                type="number"
                min="0"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                placeholder="0"
                className={errors.minStock ? "border-destructive" : ""}
              />
              {errors.minStock && <p className="text-xs text-destructive">{errors.minStock}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
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
                  {Object.entries(ProductCategoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as ProductStatus })}
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
            initialData ? "Salvar Alterações" : "Criar Produto"
          )}
        </Button>
      </div>
    </form>
  );
}

