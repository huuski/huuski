"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PromotionForm } from "@/components/promotions/promotion-form";
import { getPromotions } from "@/lib/promotions";
import type { Promotion } from "@/lib/types/promotion";
import { DiscountType } from "@/lib/types/promotion";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30, 50, 100];

export default function PromotionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [promotions, setPromotions] = useState<Promotion[]>(() => getPromotions());
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

  const handleSubmit = (data: Omit<Promotion, "id" | "createdAt" | "updatedAt" | "deletedAt" | "usageCount">) => {
    if (editingPromotion) {
      setPromotions(
        promotions.map((promo) =>
          promo.id === editingPromotion.id
            ? { ...promo, ...data, updatedAt: new Date() }
            : promo,
        ),
      );
      setEditingPromotion(null);
    } else {
      const newPromotion: Promotion = {
        id: crypto.randomUUID(),
        ...data,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setPromotions([...promotions, newPromotion]);
    }
    setShowForm(false);
  };

  const handleEdit = (promo: Promotion) => {
    setEditingPromotion(promo);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta promoção?")) {
      setPromotions(promotions.filter((promo) => promo.id !== id));
      const totalPages = Math.ceil((promotions.length - 1) / rowsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    }
  };

  const handleNew = () => {
    setEditingPromotion(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPromotion(null);
  };

  const paginatedItems = (() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return promotions.slice(start, end);
  })();

  const totalPages = Math.ceil(promotions.length / rowsPerPage);

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const formatDiscount = (promo: Promotion) => {
    if (promo.discountType === DiscountType.PERCENTAGE) {
      return `${promo.discountValue}%`;
    }
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(promo.discountValue);
  };

  const isActive = (promo: Promotion) => {
    const now = new Date();
    return promo.isActive && now >= promo.startDate && now <= promo.endDate;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Promoções</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie as promoções e descontos
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Promoção
        </Button>
      </div>

      {promotions.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhuma promoção cadastrada</CardTitle>
            <CardDescription>
              Comece criando sua primeira promoção clicando no botão acima.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Uso</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Atualizado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell className="font-medium">{promo.name}</TableCell>
                    <TableCell>
                      {promo.code ? (
                        <Badge variant="outline">{promo.code}</Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{formatDiscount(promo)}</span>
                        {promo.minPurchaseValue && (
                          <span className="text-xs text-muted-foreground">
                            Mín: {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(promo.minPurchaseValue)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span>{formatDate(promo.startDate)}</span>
                        <span className="text-muted-foreground">até</span>
                        <span>{formatDate(promo.endDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {promo.usageLimit ? (
                        <span>{promo.usageCount} / {promo.usageLimit}</span>
                      ) : (
                        <span>{promo.usageCount} / ∞</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={isActive(promo) ? "default" : "secondary"}>
                        {isActive(promo) ? "Ativa" : "Inativa"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(promo.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(promo)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="cursor-not-allowed opacity-50 text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between px-2">
            <div className="text-sm text-muted-foreground">
              <span>{promotions.length} promoção(ões) no total.</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Label htmlFor="rows-per-page" className="text-sm font-normal">
                  Linhas por página
                </Label>
                <Select value={String(rowsPerPage)} onValueChange={handleRowsPerPageChange}>
                  <SelectTrigger id="rows-per-page" className="h-8 w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={String(option)}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  Página {currentPage} de {totalPages || 1}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPromotion ? "Editar Promoção" : "Nova Promoção"}</DialogTitle>
            <DialogDescription>
              {editingPromotion
                ? "Atualize as informações da promoção"
                : "Preencha os dados da nova promoção"}
            </DialogDescription>
          </DialogHeader>
          <PromotionForm
            key={editingPromotion?.id || "new"}
            onSubmit={handleSubmit}
            initialData={editingPromotion || undefined}
            onCancel={handleCancelForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

