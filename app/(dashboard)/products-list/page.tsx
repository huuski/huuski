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
import { ProductForm } from "@/components/products/product-form";
import { fetchProducts, createProduct } from "@/lib/api/product";
import type { Product } from "@/lib/types/product";
import { ProductStatus } from "@/lib/types/product";
import { getProductCategoryLabel } from "@/lib/types/product-category";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30, 50, 100];

const statusLabels: Record<ProductStatus, string> = {
  [ProductStatus.ACTIVE]: "Ativo",
  [ProductStatus.INACTIVE]: "Inativo",
  [ProductStatus.OUT_OF_STOCK]: "Sem estoque",
  [ProductStatus.DISCONTINUED]: "Descontinuado",
};

const statusVariants: Record<ProductStatus, "default" | "secondary" | "destructive" | "outline"> = {
  [ProductStatus.ACTIVE]: "default",
  [ProductStatus.INACTIVE]: "secondary",
  [ProductStatus.OUT_OF_STOCK]: "destructive",
  [ProductStatus.DISCONTINUED]: "outline",
};

export default function ProductsListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao carregar produtos";
        setError(errorMessage);
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleRetry = () => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao carregar produtos";
        setError(errorMessage);
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  };

  const handleSubmit = async (data: Omit<Product, "id" | "createdAt" | "updatedAt" | "deletedAt">) => {
    if (editingProduct) {
      // Editar produto existente (ainda não implementado na API)
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                ...data,
                updatedAt: new Date(),
              }
            : product,
        ),
      );
      setEditingProduct(null);
      setShowForm(false);
      console.log("Product updated (local only):", data);
    } else {
      // Criar novo produto
      try {
        setSaving(true);
        
        // Converter category de string para number (ou 0 se não houver)
        const categoryNumber = data.category ? parseInt(data.category, 10) : 0;
        
        // Preparar payload para a API
        const payload = {
          name: data.name,
          description: data.description || "",
          category: categoryNumber,
          amount: data.price,
          image: "", // Campo opcional, pode ser adicionado depois se necessário
        };
        
        // Chamar a API para criar
        const newProduct = await createProduct(payload);
        
        // Adicionar à lista local
        setProducts([...products, newProduct]);
        setShowForm(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao criar produto";
        console.error("Error creating product:", err);
        alert(errorMessage);
        // Não fechar o formulário em caso de erro
      } finally {
        setSaving(false);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      setProducts(products.filter((product) => product.id !== id));
      const totalPages = Math.ceil((products.length - 1) / rowsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    }
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  // Paginação
  const paginatedProducts = (() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return products.slice(start, end);
  })();

  const totalPages = Math.ceil(products.length / rowsPerPage);

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
          <h1 className="text-3xl font-semibold">Produtos</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seus produtos e estoque
          </p>
        </div>
        <Button onClick={handleNewProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Carregando produtos...</p>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Erro ao carregar produtos</CardTitle>
            <CardDescription className="space-y-2">
              <p>{error}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Verifique se a API está rodando em http://localhost:5026/api/product
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRetry} variant="outline">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : products.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum produto cadastrado</CardTitle>
            <CardDescription>
              Comece criando seu primeiro produto clicando no botão acima.
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
                  <TableHead>SKU</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Atualizado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product) => {
                  const isLowStock = product.minStock && product.stock <= product.minStock;
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        {product.sku ? (
                          <span className="text-muted-foreground">{product.sku}</span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{formatCurrency(product.price)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={isLowStock && product.stock > 0 ? "text-orange-600 dark:text-orange-400" : product.stock === 0 ? "text-destructive" : ""}>
                            {product.stock}
                          </span>
                          {isLowStock && product.stock > 0 && (
                            <Badge variant="outline" className="text-xs">
                              Estoque baixo
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.category ? (
                          <span className="text-muted-foreground">{getProductCategoryLabel(product.category)}</span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariants[product.status]}>
                          {statusLabels[product.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(product.updatedAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(product)}>
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
              <span>{products.length} produto(s) no total.</span>
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
            <DialogTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Atualize as informações do produto"
                : "Preencha os dados do novo produto"}
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            key={editingProduct?.id || "new"}
            onSubmit={handleSubmit}
            initialData={editingProduct || undefined}
            onCancel={handleCancelForm}
            loading={saving}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
