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
import { PaymentMethodForm } from "@/components/payment-methods/payment-method-form";
import { getPaymentMethods } from "@/lib/payment-methods";
import type { PaymentMethod } from "@/lib/types/payment-method";
import { PaymentMethodType } from "@/lib/types/payment-method";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30, 50, 100];

const typeLabels: Record<PaymentMethodType, string> = {
  [PaymentMethodType.CASH]: "Dinheiro",
  [PaymentMethodType.CREDIT_CARD]: "Cartão de Crédito",
  [PaymentMethodType.DEBIT_CARD]: "Cartão de Débito",
  [PaymentMethodType.BANK_TRANSFER]: "Transferência Bancária",
  [PaymentMethodType.PIX]: "PIX",
  [PaymentMethodType.CHECK]: "Cheque",
  [PaymentMethodType.OTHER]: "Outro",
};

export default function PaymentMethodsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => getPaymentMethods());
  const [showForm, setShowForm] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | null>(null);

  const handleSubmit = (data: Omit<PaymentMethod, "id" | "createdAt" | "updatedAt" | "deletedAt">) => {
    if (editingPaymentMethod) {
      setPaymentMethods(
        paymentMethods.map((pm) =>
          pm.id === editingPaymentMethod.id
            ? { ...pm, ...data, updatedAt: new Date() }
            : pm,
        ),
      );
      setEditingPaymentMethod(null);
    } else {
      const newPaymentMethod: PaymentMethod = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setPaymentMethods([...paymentMethods, newPaymentMethod]);
    }
    setShowForm(false);
  };

  const handleEdit = (pm: PaymentMethod) => {
    setEditingPaymentMethod(pm);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta forma de pagamento?")) {
      setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
      const totalPages = Math.ceil((paymentMethods.length - 1) / rowsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    }
  };

  const handleNew = () => {
    setEditingPaymentMethod(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPaymentMethod(null);
  };

  const paginatedItems = (() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return paymentMethods.slice(start, end);
  })();

  const totalPages = Math.ceil(paymentMethods.length / rowsPerPage);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Formas de Pagamento</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie as formas de pagamento disponíveis
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Forma de Pagamento
        </Button>
      </div>

      {paymentMethods.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhuma forma de pagamento cadastrada</CardTitle>
            <CardDescription>
              Comece criando sua primeira forma de pagamento clicando no botão acima.
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
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requer Aprovação</TableHead>
                  <TableHead>Atualizado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.map((pm) => (
                  <TableRow key={pm.id}>
                    <TableCell className="font-medium">{pm.name}</TableCell>
                    <TableCell>
                      {pm.code ? (
                        <span className="text-muted-foreground">{pm.code}</span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{typeLabels[pm.type]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={pm.isActive ? "default" : "secondary"}>
                        {pm.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {pm.requiresApproval ? (
                        <Badge variant="outline">Sim</Badge>
                      ) : (
                        <span className="text-muted-foreground">Não</span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(pm.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(pm)}>
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
              <span>{paymentMethods.length} forma(s) de pagamento no total.</span>
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
            <DialogTitle>{editingPaymentMethod ? "Editar Forma de Pagamento" : "Nova Forma de Pagamento"}</DialogTitle>
            <DialogDescription>
              {editingPaymentMethod
                ? "Atualize as informações da forma de pagamento"
                : "Preencha os dados da nova forma de pagamento"}
            </DialogDescription>
          </DialogHeader>
          <PaymentMethodForm
            key={editingPaymentMethod?.id || "new"}
            onSubmit={handleSubmit}
            initialData={editingPaymentMethod || undefined}
            onCancel={handleCancelForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

