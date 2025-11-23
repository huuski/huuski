"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, MoreVertical, Loader2 } from "lucide-react";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServiceForm } from "@/components/services/service-form";
import { fetchServices, updateService, createService } from "@/lib/api/service";
import type { Service } from "@/lib/types/service";
import { ServiceStatus } from "@/lib/types/service";
import { getServiceCategoryLabel } from "@/lib/types/service-category";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30, 50, 100];

const statusLabels: Record<ServiceStatus, string> = {
  [ServiceStatus.ACTIVE]: "Ativo",
  [ServiceStatus.INACTIVE]: "Inativo",
  [ServiceStatus.DISCONTINUED]: "Descontinuado",
};

const statusVariants: Record<ServiceStatus, "default" | "secondary" | "destructive" | "outline"> = {
  [ServiceStatus.ACTIVE]: "default",
  [ServiceStatus.INACTIVE]: "secondary",
  [ServiceStatus.DISCONTINUED]: "outline",
};

export default function ServicesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchServices();
        setServices(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao carregar serviços";
        setError(errorMessage);
        console.error("Error loading services:", err);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const handleRetry = () => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchServices();
        setServices(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao carregar serviços";
        setError(errorMessage);
        console.error("Error loading services:", err);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  };

  const handleSubmit = async (data: Omit<Service, "id" | "createdAt" | "updatedAt" | "deletedAt">) => {
    if (editingService) {
      // Editar serviço existente
      try {
        setSaving(true);
        
        // Converter duração de minutos para formato "HH:MM:SS"
        const durationString = data.duration 
          ? `${String(Math.floor(data.duration / 60)).padStart(2, "0")}:${String(data.duration % 60).padStart(2, "0")}:00`
          : "00:00:00";
        
        // Converter category de string para number (ou 0 se não houver)
        const categoryNumber = data.category ? parseInt(data.category, 10) : 0;
        
        // Preparar payload para a API
        const payload = {
          name: data.name,
          description: data.description || "",
          category: categoryNumber,
          amount: data.price,
          image: "", // Campo opcional, pode ser adicionado depois se necessário
          duration: durationString,
          executionFlowId: data.executionFlowId || null,
        };
        
        // Chamar a API para atualizar
        const updatedService = await updateService(editingService.id, payload);
        
        // Atualizar a lista local
        setServices(
          services.map((service) =>
            service.id === editingService.id ? updatedService : service,
          ),
        );
        setEditingService(null);
        setShowForm(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar serviço";
        console.error("Error updating service:", err);
        alert(errorMessage);
        // Não fechar o formulário em caso de erro
      } finally {
        setSaving(false);
      }
    } else {
      // Criar novo serviço
      try {
        setSaving(true);
        
        // Converter duração de minutos para formato "HH:MM:SS"
        const durationString = data.duration 
          ? `${String(Math.floor(data.duration / 60)).padStart(2, "0")}:${String(data.duration % 60).padStart(2, "0")}:00`
          : "00:00:00";
        
        // Converter category de string para number (ou 0 se não houver)
        const categoryNumber = data.category ? parseInt(data.category, 10) : 0;
        
        // Preparar payload para a API
        const payload = {
          name: data.name,
          description: data.description || "",
          category: categoryNumber,
          amount: data.price,
          image: "", // Campo opcional, pode ser adicionado depois se necessário
          duration: durationString,
          executionFlowId: data.executionFlowId || null,
        };
        
        // Chamar a API para criar
        const newService = await createService(payload);
        
        // Adicionar à lista local
        setServices([...services, newService]);
        setShowForm(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao criar serviço";
        console.error("Error creating service:", err);
        alert(errorMessage);
        // Não fechar o formulário em caso de erro
      } finally {
        setSaving(false);
      }
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      setServices(services.filter((service) => service.id !== id));
      const totalPages = Math.ceil((services.length - 1) / rowsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    }
  };

  const handleNewService = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingService(null);
  };

  // Paginação
  const paginatedServices = (() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return services.slice(start, end);
  })();

  const totalPages = Math.ceil(services.length / rowsPerPage);

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

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "-";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Serviços</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seus serviços e ofertas
          </p>
        </div>
        <Button onClick={handleNewService}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Serviço
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Carregando serviços...</p>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Erro ao carregar serviços</CardTitle>
            <CardDescription className="space-y-2">
              <p>{error}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Verifique se a API está rodando em http://localhost:5026/api/service
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRetry} variant="outline">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : services.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum serviço cadastrado</CardTitle>
            <CardDescription>
              Comece criando seu primeiro serviço clicando no botão acima.
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
                  <TableHead>Preço</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Atualizado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>
                      {service.code ? (
                        <span className="text-muted-foreground">{service.code}</span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(service.price)}</TableCell>
                    <TableCell>{formatDuration(service.duration)}</TableCell>
                    <TableCell>
                      {service.category ? (
                        <span className="text-muted-foreground">{getServiceCategoryLabel(service.category)}</span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[service.status]}>
                        {statusLabels[service.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(service.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(service)}>
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
              <span>{services.length} serviço(s) no total.</span>
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
            <DialogTitle>{editingService ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
            <DialogDescription>
              {editingService
                ? "Atualize as informações do serviço"
                : "Preencha os dados do novo serviço"}
            </DialogDescription>
          </DialogHeader>
          <ServiceForm
            key={editingService?.id || "new"}
            onSubmit={handleSubmit}
            initialData={editingService || undefined}
            onCancel={handleCancelForm}
            loading={saving}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
