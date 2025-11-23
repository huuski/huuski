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
import { NegotiationForm } from "@/components/negotiations/negotiation-form";
import { getNegotiations } from "@/lib/negotiations";
import type { Negotiation } from "@/lib/types/negotiation";
import { NegotiationStatus } from "@/lib/types/negotiation";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30, 50, 100];

const statusLabels: Record<NegotiationStatus, string> = {
  [NegotiationStatus.OPEN]: "Aberta",
  [NegotiationStatus.IN_PROGRESS]: "Em Andamento",
  [NegotiationStatus.CLOSED]: "Fechada",
  [NegotiationStatus.CANCELLED]: "Cancelada",
};

const statusVariants: Record<NegotiationStatus, "default" | "secondary" | "destructive" | "outline"> = {
  [NegotiationStatus.OPEN]: "outline",
  [NegotiationStatus.IN_PROGRESS]: "default",
  [NegotiationStatus.CLOSED]: "secondary",
  [NegotiationStatus.CANCELLED]: "destructive",
};

export default function NegotiationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [negotiations, setNegotiations] = useState<Negotiation[]>(() => getNegotiations());
  const [showForm, setShowForm] = useState(false);
  const [editingNegotiation, setEditingNegotiation] = useState<Negotiation | null>(null);

  const handleSubmit = (data: Omit<Negotiation, "id" | "createdAt" | "updatedAt" | "deletedAt">) => {
    if (editingNegotiation) {
      setNegotiations(
        negotiations.map((neg) =>
          neg.id === editingNegotiation.id
            ? { ...neg, ...data, updatedAt: new Date() }
            : neg,
        ),
      );
      setEditingNegotiation(null);
    } else {
      const newNegotiation: Negotiation = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setNegotiations([...negotiations, newNegotiation]);
    }
    setShowForm(false);
  };

  const handleEdit = (neg: Negotiation) => {
    setEditingNegotiation(neg);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta negociação?")) {
      setNegotiations(negotiations.filter((neg) => neg.id !== id));
      const totalPages = Math.ceil((negotiations.length - 1) / rowsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    }
  };

  const handleNew = () => {
    setEditingNegotiation(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingNegotiation(null);
  };

  const paginatedItems = (() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return negotiations.slice(start, end);
  })();

  const totalPages = Math.ceil(negotiations.length / rowsPerPage);

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Negociações</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie as negociações com clientes
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Negociação
        </Button>
      </div>

      {negotiations.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhuma negociação cadastrada</CardTitle>
            <CardDescription>
              Comece criando sua primeira negociação clicando no botão acima.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Início</TableHead>
                  <TableHead>Data de Término</TableHead>
                  <TableHead>Atualizado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.map((neg) => (
                  <TableRow key={neg.id}>
                    <TableCell className="font-medium">{neg.customerName}</TableCell>
                    <TableCell>{neg.title}</TableCell>
                    <TableCell>{formatCurrency(neg.value)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[neg.status]}>
                        {statusLabels[neg.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(neg.startDate)}</TableCell>
                    <TableCell>{neg.endDate ? formatDate(neg.endDate) : "-"}</TableCell>
                    <TableCell>{formatDate(neg.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(neg)}>
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
              <span>{negotiations.length} negociação(ões) no total.</span>
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
            <DialogTitle>{editingNegotiation ? "Editar Negociação" : "Nova Negociação"}</DialogTitle>
            <DialogDescription>
              {editingNegotiation
                ? "Atualize as informações da negociação"
                : "Preencha os dados da nova negociação"}
            </DialogDescription>
          </DialogHeader>
          <NegotiationForm
            key={editingNegotiation?.id || "new"}
            onSubmit={handleSubmit}
            initialData={editingNegotiation || undefined}
            onCancel={handleCancelForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

