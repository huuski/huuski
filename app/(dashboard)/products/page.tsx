"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n-client";
import { Plus, Pencil, Trash2, Play, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, MoreVertical, Loader2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExecutionFlowForm } from "@/components/execution-flow/execution-flow-form";
import { ExecutionFlowSimulator, ExecutionFlowSimulatorFooter } from "@/components/execution-flow/execution-flow-simulator";
import { fetchExecutionFlows, fetchExecutionFlowById, updateExecutionFlow, createExecutionFlow } from "@/lib/api/execution-flow";
import type { ExecutionFlow, ExecutionFlowStep } from "@/lib/types/execution-flow";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30, 50, 100];

export default function ProductsPage() {
  const { t } = useI18n();
  const [showForm, setShowForm] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [editingFlow, setEditingFlow] = useState<ExecutionFlow | null>(null);
  const [simulatingFlow, setSimulatingFlow] = useState<ExecutionFlow | null>(null);
  const [simulatorStepIndex, setSimulatorStepIndex] = useState(0);
  const [simulatorAnswers, setSimulatorAnswers] = useState<Record<string, string | string[] | undefined>>({});
  const [simulatorExtraAnswers, setSimulatorExtraAnswers] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [flows, setFlows] = useState<ExecutionFlow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingSimulation, setLoadingSimulation] = useState(false);

  useEffect(() => {
    const loadFlows = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchExecutionFlows();
        setFlows(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao carregar fluxos de execução";
        setError(errorMessage);
        console.error("Error loading execution flows:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFlows();
  }, []);

  const handleRetry = () => {
    const loadFlows = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchExecutionFlows();
        setFlows(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao carregar fluxos de execução";
        setError(errorMessage);
        console.error("Error loading execution flows:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFlows();
  };

  const handleSubmit = async (data: { title: string; steps: ExecutionFlowStep[] }) => {
    if (editingFlow) {
      // Editar fluxo existente
      try {
        setSaving(true);
        
        // Limpar e preparar os steps para envio
        const cleanedSteps = data.steps.map((step) => {
          const cleanedStep: any = {
            id: step.id,
            title: step.title,
            subtitle: step.subtitle || null,
            description: step.description || null,
            stepNumber: step.stepNumber,
            questions: step.questions.map((question) => {
              const cleanedQuestion: any = {
                id: question.id,
                order: question.order,
                title: question.title,
                subtitle: question.subtitle || null,
                description: question.description || null,
                type: question.type,
                options: question.options.map((option) => ({
                  id: option.id,
                  title: option.title,
                  value: option.value,
                  enableExtraAnswer: option.enableExtraAnswer || false,
                  extraAnswerMaxLength: option.extraAnswerMaxLength || null,
                })),
                required: true, // Campo obrigatório na API
              };
              
              // Adicionar campos opcionais apenas se existirem
              if (question.maxLength !== undefined && question.maxLength !== null) {
                cleanedQuestion.maxLength = question.maxLength;
              }
              if (question.maxImages !== undefined && question.maxImages !== null) {
                cleanedQuestion.maxImages = question.maxImages;
              }
              if (question.acceptedImageTypes !== undefined && question.acceptedImageTypes !== null && question.acceptedImageTypes.length > 0) {
                cleanedQuestion.acceptedImageTypes = question.acceptedImageTypes;
              }
              
              return cleanedQuestion;
            }),
          };
          return cleanedStep;
        });
        
        // Serializar os steps como JSON string
        const flowJson = JSON.stringify({ steps: cleanedSteps });
        console.log("Flow JSON to send:", flowJson);
        
        // Chamar a API para atualizar
        const updatedFlow = await updateExecutionFlow(editingFlow.id, {
          title: data.title,
          flow: flowJson,
        });
        
        // Atualizar a lista local
        setFlows(
          flows.map((flow) =>
            flow.id === editingFlow.id ? updatedFlow : flow,
          ),
        );
        setEditingFlow(null);
        setShowForm(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar fluxo de execução";
        console.error("Error updating execution flow:", err);
        alert(errorMessage);
        // Não fechar o formulário em caso de erro
      } finally {
        setSaving(false);
      }
    } else {
      // Criar novo fluxo
      try {
        setSaving(true);
        
        // Limpar e preparar os steps para envio (mesma lógica do update)
        const cleanedSteps = data.steps.map((step) => {
          const cleanedStep: any = {
            id: step.id,
            title: step.title,
            subtitle: step.subtitle || null,
            description: step.description || null,
            stepNumber: step.stepNumber,
            questions: step.questions.map((question) => {
              const cleanedQuestion: any = {
                id: question.id,
                order: question.order,
                title: question.title,
                subtitle: question.subtitle || null,
                description: question.description || null,
                type: question.type,
                options: question.options.map((option) => ({
                  id: option.id,
                  title: option.title,
                  value: option.value,
                  enableExtraAnswer: option.enableExtraAnswer || false,
                  extraAnswerMaxLength: option.extraAnswerMaxLength || null,
                })),
                required: true, // Campo obrigatório na API
              };
              
              // Adicionar campos opcionais apenas se existirem
              if (question.maxLength !== undefined && question.maxLength !== null) {
                cleanedQuestion.maxLength = question.maxLength;
              }
              if (question.maxImages !== undefined && question.maxImages !== null) {
                cleanedQuestion.maxImages = question.maxImages;
              }
              if (question.acceptedImageTypes !== undefined && question.acceptedImageTypes !== null && question.acceptedImageTypes.length > 0) {
                cleanedQuestion.acceptedImageTypes = question.acceptedImageTypes;
              }
              
              return cleanedQuestion;
            }),
          };
          return cleanedStep;
        });
        
        // Serializar os steps como JSON string
        const flowJson = JSON.stringify({ steps: cleanedSteps });
        console.log("Flow JSON to send:", flowJson);
        
        // Chamar a API para criar
        const newFlow = await createExecutionFlow({
          title: data.title,
          flow: flowJson,
        });
        
        // Adicionar à lista local
        setFlows([...flows, newFlow]);
        setShowForm(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao criar fluxo de execução";
        console.error("Error creating execution flow:", err);
        alert(errorMessage);
        // Não fechar o formulário em caso de erro
      } finally {
        setSaving(false);
      }
    }
  };

  const handleEdit = async (flow: ExecutionFlow) => {
    try {
      setLoading(true);
      // Buscar os dados atualizados da API
      const updatedFlow = await fetchExecutionFlowById(flow.id);
      setEditingFlow(updatedFlow);
      setShowForm(true);
    } catch (error) {
      console.error("Error loading execution flow for edit:", error);
      // Se houver erro, usar os dados locais como fallback
      setEditingFlow(flow);
      setShowForm(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este fluxo?")) {
      setFlows(flows.filter((flow) => flow.id !== id));
      // Ajustar página se necessário
      const totalPages = Math.ceil((flows.length - 1) / rowsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    }
  };

  const handleNewFlow = () => {
    setEditingFlow(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingFlow(null);
  };

  const handleSimulate = async (flow: ExecutionFlow) => {
    try {
      setLoadingSimulation(true);
      // Buscar o fluxo atualizado da API antes de iniciar a simulação
      const updatedFlow = await fetchExecutionFlowById(flow.id);
      setSimulatingFlow(updatedFlow);
      setSimulatorStepIndex(0);
      setSimulatorAnswers({});
      setSimulatorExtraAnswers({});
      setShowSimulator(true);
    } catch (error) {
      console.error("Error loading execution flow for simulation:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao carregar fluxo para simulação";
      alert(errorMessage);
      // Não abrir o simulador em caso de erro
    } finally {
      setLoadingSimulation(false);
    }
  };

  const handleCloseSimulator = () => {
    setShowSimulator(false);
    setSimulatingFlow(null);
    setSimulatorStepIndex(0);
    setSimulatorAnswers({});
    setSimulatorExtraAnswers({});
  };

  const getCurrentStep = () => {
    if (!simulatingFlow) return null;
    return simulatingFlow.steps[simulatorStepIndex];
  };

  const isQuestionAnswered = (questionId: string): boolean => {
    const answer = simulatorAnswers[questionId];
    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
    return answer !== undefined && answer !== "";
  };

  const allQuestionsAnswered = getCurrentStep()?.questions.every((q) => isQuestionAnswered(q.id)) ?? false;
  const isFirstStep = simulatorStepIndex === 0;
  const isLastStep = simulatingFlow ? simulatorStepIndex === simulatingFlow.steps.length - 1 : false;

  const handleSimulatorNext = () => {
    if (!isLastStep && simulatingFlow) {
      setSimulatorStepIndex((prev) => prev + 1);
    }
  };

  const handleSimulatorPrevious = () => {
    if (!isFirstStep) {
      setSimulatorStepIndex((prev) => prev - 1);
    }
  };

  const handleSimulatorSubmit = () => {
    const allAnswers = {
      answers: simulatorAnswers,
      extraAnswers: simulatorExtraAnswers,
    };
    console.log("Simulation completed:", allAnswers);
    alert("Simulação concluída! Verifique o console para ver as respostas.");
    handleCloseSimulator();
  };

  // Paginação
  const paginatedFlows = (() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return flows.slice(start, end);
  })();

  const totalPages = Math.ceil(flows.length / rowsPerPage);

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

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">
              {editingFlow ? "Editar Fluxo de Execução" : "Novo Fluxo de Execução"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure todas as etapas e perguntas do fluxo
            </p>
          </div>
          <Button variant="outline" onClick={handleCancel}>
            Voltar
          </Button>
        </div>
        <ExecutionFlowForm
          onSubmit={handleSubmit}
          initialData={
            editingFlow
              ? {
                  title: editingFlow.title,
                  steps: editingFlow.steps,
                }
              : undefined
          }
          loading={saving}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{t("menu.pages.executionFlow.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("menu.pages.executionFlow.description")}
          </p>
        </div>
        <Button onClick={handleNewFlow}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Novo Fluxo
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Carregando fluxos de execução...</p>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Erro ao carregar fluxos de execução</CardTitle>
            <CardDescription className="space-y-2">
              <p>{error}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Verifique se a API está rodando em http://localhost:5026/api/executionflow
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRetry} variant="outline">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : flows.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum fluxo criado</CardTitle>
            <CardDescription>
              Comece criando seu primeiro fluxo de execução clicando no botão acima.
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
                  <TableHead>Título</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead>Data de Atualização</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedFlows.map((flow) => {
                  return (
                    <TableRow key={flow.id}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSimulate(flow)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">{flow.title}</TableCell>
                      <TableCell>{formatDate(flow.createdAt)}</TableCell>
                      <TableCell>{formatDate(flow.updatedAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(flow)}>
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
              <span>{flows.length} linha(s) no total.</span>
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

      <Dialog open={showSimulator} onOpenChange={(open) => {
        if (!open) {
          handleCloseSimulator();
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
          <div className="px-6 pt-6 pb-4 border-b flex-shrink-0">
            <DialogHeader>
              <DialogTitle>Simulação do Fluxo</DialogTitle>
              <DialogDescription>
                Preencha todas as perguntas para avançar entre as etapas
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin min-h-0">
            {simulatingFlow && (
              <ExecutionFlowSimulator
                flow={simulatingFlow}
                onClose={handleCloseSimulator}
                currentStepIndex={simulatorStepIndex}
                onStepChange={setSimulatorStepIndex}
                answers={simulatorAnswers}
                onAnswerChange={(questionId, value) => {
                  setSimulatorAnswers((prev) => ({ ...prev, [questionId]: value }));
                }}
                extraAnswers={simulatorExtraAnswers}
                onExtraAnswerChange={(optionId, value) => {
                  setSimulatorExtraAnswers((prev) => ({ ...prev, [optionId]: value }));
                }}
              />
            )}
          </div>
          {simulatingFlow && (
            <div className="px-6 py-4 border-t bg-background flex-shrink-0">
              <ExecutionFlowSimulatorFooter
                flow={simulatingFlow}
                currentStepIndex={simulatorStepIndex}
                onPrevious={handleSimulatorPrevious}
                onNext={handleSimulatorNext}
                onSubmit={handleSimulatorSubmit}
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                allQuestionsAnswered={allQuestionsAnswered}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

