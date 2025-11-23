"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n-client";
import { Plus, Trash2, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, MoreVertical, Phone, User, Mail, MapPin, Calendar, FileText, Pencil, CreditCard, Activity, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { fetchCustomers } from "@/lib/api/customer";
import type { Customer } from "@/lib/types/customer";
import { CustomerStatus } from "@/lib/types/customer";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30, 50, 100];

const statusLabels: Record<CustomerStatus, string> = {
  [CustomerStatus.ACTIVE]: "Ativo",
  [CustomerStatus.INACTIVE]: "Inativo",
  [CustomerStatus.PENDING]: "Pendente",
  [CustomerStatus.BLOCKED]: "Bloqueado",
};

const statusVariants: Record<CustomerStatus, "default" | "secondary" | "destructive" | "outline"> = {
  [CustomerStatus.ACTIVE]: "default",
  [CustomerStatus.INACTIVE]: "secondary",
  [CustomerStatus.PENDING]: "outline",
  [CustomerStatus.BLOCKED]: "destructive",
};

export default function ConsumerPage() {
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao carregar clientes";
        setError(errorMessage);
        console.error("Error loading customers:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const handleRetry = () => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao carregar clientes";
        setError(errorMessage);
        console.error("Error loading customers:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      setCustomers(customers.filter((customer) => customer.id !== id));
      const totalPages = Math.ceil((customers.length - 1) / rowsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    }
  };

  // Paginação
  const paginatedCustomers = (() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return customers.slice(start, end);
  })();

  const totalPages = Math.ceil(customers.length / rowsPerPage);

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

  const maskPhone = (phone?: string): string => {
    if (!phone) return "-";
    // Remove todos os caracteres não numéricos
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 6) return phone; // Mínimo: código de área (2) + 4 últimos dígitos
    // Extrai código de área (2 primeiros dígitos) e últimos 4 dígitos
    const areaCode = digits.slice(0, 2);
    const lastFour = digits.slice(-4);
    return `(${areaCode}) ****-${lastFour}`;
  };

  const maskDocument = (document?: string): string => {
    if (!document) return "-";
    // Remove todos os caracteres não numéricos
    const digits = document.replace(/\D/g, "");
    if (digits.length < 5) return document;
    // Retorna os 3 primeiros e 2 últimos dígitos mascarados
    const firstThree = digits.slice(0, 3);
    const lastTwo = digits.slice(-2);
    const masked = "*".repeat(Math.max(0, digits.length - 5));
    return `${firstThree}.${masked}-${lastTwo}`;
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  const handleCloseModal = () => {
    setShowCustomerModal(false);
    setSelectedCustomer(null);
  };

  const formatFullAddress = (address?: Customer["address"]) => {
    if (!address) return "Não informado";
    return `${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ""}, ${address.neighborhood}, ${address.city} - ${address.state}, ${address.zipCode}${address.country ? `, ${address.country}` : ""}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{t("menu.items.customer")}</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seus clientes e informações de contato
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Carregando clientes...</p>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Erro ao carregar clientes</CardTitle>
            <CardDescription className="space-y-2">
              <p>{error}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Verifique se a API está rodando em http://localhost:5026/api/customer
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRetry} variant="outline">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : customers.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum cliente cadastrado</CardTitle>
            <CardDescription>
              Comece criando seu primeiro cliente clicando no botão acima.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Atualização</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCustomers.map((customer) => {
                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleViewCustomer(customer)}
                        >
                          <User className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>
                        {customer.phone ? (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {maskPhone(customer.phone)}
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{maskDocument(customer.document)}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariants[customer.status]}>
                          {statusLabels[customer.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(customer.updatedAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              className="cursor-not-allowed opacity-50"
                            >
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
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between px-2">
            <div className="text-sm text-muted-foreground">
              <span>{customers.length} linha(s) no total.</span>
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

      <Dialog open={showCustomerModal} onOpenChange={(open) => {
        if (!open) {
          handleCloseModal();
        }
      }}>
        <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          {selectedCustomer && (
            <>
              {/* Header fixo com perfil - similar à imagem */}
              <div className="px-8 pt-8 pb-6 border-b flex-shrink-0 bg-background">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                    <AvatarImage src={`/avatars/${selectedCustomer.id}.png`} alt={selectedCustomer.name} />
                    <AvatarFallback className="text-3xl font-semibold">{getInitials(selectedCustomer.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <DialogTitle className="text-3xl font-semibold mb-0">{selectedCustomer.name}</DialogTitle>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant={statusVariants[selectedCustomer.status]} className="text-xs">
                            {statusLabels[selectedCustomer.status]}
                          </Badge>
                          {selectedCustomer.address && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5" />
                                {selectedCustomer.address.city}, {selectedCustomer.address.state}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conteúdo scrollável */}
              <div className="flex-1 overflow-y-auto scrollbar-thin px-8 py-6 min-h-0">
                <div className="space-y-6">
                  {/* Informações detalhadas - estilo lista como na imagem */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Informações de Contato</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">E-mail</Label>
                        <p className="text-sm font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {selectedCustomer.email}
                        </p>
                      </div>
                      <Separator />
                      {selectedCustomer.phone && (
                        <>
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Telefone</Label>
                            <p className="text-sm font-medium flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {selectedCustomer.phone}
                            </p>
                          </div>
                          <Separator />
                        </>
                      )}
                      {selectedCustomer.document && (
                        <div className="space-y-1">
                          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Documento</Label>
                          <p className="text-sm font-medium flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            {selectedCustomer.document}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Cards de estatísticas/resumo - similar à imagem */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Data de Criação</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <p className="text-lg font-semibold">{formatDate(selectedCustomer.createdAt)}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Última Atualização</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-muted-foreground" />
                          <p className="text-lg font-semibold">{formatDate(selectedCustomer.updatedAt)}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">ID do Cliente</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <p className="text-lg font-semibold font-mono text-xs">{selectedCustomer.id}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Endereço */}
                  {selectedCustomer.address && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Endereço
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm font-medium">{formatFullAddress(selectedCustomer.address)}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Observações */}
                  {selectedCustomer.notes && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Observações</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedCustomer.notes}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
