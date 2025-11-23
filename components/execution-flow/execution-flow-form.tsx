"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical, X, AlertCircle, CheckCircle2, HelpCircle, ChevronDown, ChevronUp, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  QuestionType,
  type ExecutionFlowStep,
  type ExecutionFlowStepQuestion,
  type ExecutionFlowStepQuestionOption,
} from "@/lib/types/execution-flow";

type ExecutionFlowFormProps = {
  onSubmit: (data: { title: string; steps: ExecutionFlowStep[] }) => void | Promise<void>;
  initialData?: { title: string; steps: ExecutionFlowStep[] };
  loading?: boolean;
};

export function ExecutionFlowForm({ onSubmit, initialData, loading = false }: ExecutionFlowFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [steps, setSteps] = useState<ExecutionFlowStep[]>(
    initialData?.steps || [
      {
        id: crypto.randomUUID(),
        title: "",
        subtitle: undefined,
        description: undefined,
        stepNumber: 1,
        questions: [],
      },
    ],
  );
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(
    new Set(initialData?.steps.map((s) => s.id) || [])
  );
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const addStep = () => {
    const newStepId = crypto.randomUUID();
    setSteps([
      ...steps,
      {
        id: newStepId,
        title: "",
        subtitle: undefined,
        description: undefined,
        stepNumber: steps.length + 1,
        questions: [],
      },
    ]);
    // Auto-expand new step
    setExpandedSteps((prev) => new Set([...prev, newStepId]));
  };

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const moveStep = (stepId: string, direction: "up" | "down") => {
    const index = steps.findIndex((s) => s.id === stepId);
    if (index === -1) return;
    
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;

    const newSteps = [...steps];
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    
    // Update step numbers
    newSteps.forEach((s, i) => {
      s.stepNumber = i + 1;
    });
    
    setSteps(newSteps);
  };

  const removeStep = (stepId: string) => {
    const newSteps = steps
      .filter((s) => s.id !== stepId)
      .map((s, index) => ({ ...s, stepNumber: index + 1 }));
    setSteps(newSteps);
  };

  const updateStep = (stepId: string, updates: Partial<ExecutionFlowStep>) => {
    setSteps(steps.map((s) => (s.id === stepId ? { ...s, ...updates } : s)));
  };

  const addQuestion = (stepId: string) => {
    const newQuestionId = crypto.randomUUID();
    setSteps(
      steps.map((s) => {
        if (s.id === stepId) {
          return {
            ...s,
            questions: [
              ...s.questions,
              {
                id: newQuestionId,
                order: s.questions.length + 1,
                title: "",
                subtitle: undefined,
                description: "",
                type: QuestionType.TEXT,
                options: [],
              },
            ],
          };
        }
        return s;
      }),
    );
    // Auto-expand new question and its step
    setExpandedQuestions((prev) => new Set([...prev, newQuestionId]));
    setExpandedSteps((prev) => new Set([...prev, stepId]));
  };

  const removeQuestion = (stepId: string, questionId: string) => {
    setSteps(
      steps.map((s) => {
        if (s.id === stepId) {
          const newQuestions = s.questions
            .filter((q) => q.id !== questionId)
            .map((q, index) => ({ ...q, order: index + 1 }));
          return { ...s, questions: newQuestions };
        }
        return s;
      }),
    );
  };

  const updateQuestion = (
    stepId: string,
    questionId: string,
    updates: Partial<ExecutionFlowStepQuestion>,
  ) => {
    setSteps(
      steps.map((s) => {
        if (s.id === stepId) {
          return {
            ...s,
            questions: s.questions.map((q) =>
              q.id === questionId ? { ...q, ...updates } : q,
            ),
          };
        }
        return s;
      }),
    );
  };

  const addOption = (stepId: string, questionId: string) => {
    setSteps(
      steps.map((s) => {
        if (s.id === stepId) {
          return {
            ...s,
            questions: s.questions.map((q) => {
              if (q.id === questionId) {
                return {
                  ...q,
                  options: [
                    ...q.options,
                    {
                      id: crypto.randomUUID(),
                      title: "",
                      value: "",
                      enableExtraAnswer: false,
                    },
                  ],
                };
              }
              return q;
            }),
          };
        }
        return s;
      }),
    );
  };

  const removeOption = (stepId: string, questionId: string, optionId: string) => {
    setSteps(
      steps.map((s) => {
        if (s.id === stepId) {
          return {
            ...s,
            questions: s.questions.map((q) => {
              if (q.id === questionId) {
                return {
                  ...q,
                  options: q.options.filter((o) => o.id !== optionId),
                };
              }
              return q;
            }),
          };
        }
        return s;
      }),
    );
  };

  const updateOption = (
    stepId: string,
    questionId: string,
    optionId: string,
    updates: Partial<ExecutionFlowStepQuestionOption>,
  ) => {
    setSteps(
      steps.map((s) => {
        if (s.id === stepId) {
          return {
            ...s,
            questions: s.questions.map((q) => {
              if (q.id === questionId) {
                return {
                  ...q,
                  options: q.options.map((o) =>
                    o.id === optionId ? { ...o, ...updates } : o,
                  ),
                };
              }
              return q;
            }),
          };
        }
        return s;
      }),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, steps });
  };

  const questionTypeLabels: Record<QuestionType, string> = {
    [QuestionType.TEXT]: "Texto",
    [QuestionType.TEXTAREA]: "Área de texto",
    [QuestionType.SINGLE_SELECT]: "Seleção única",
    [QuestionType.MULTI_SELECT]: "Seleção múltipla",
    [QuestionType.IMAGE_UPLOAD]: "Upload de fotos",
  };

  const getStepValidationStatus = (step: ExecutionFlowStep) => {
    const hasTitle = step.title.trim() !== "";
    const hasQuestions = step.questions.length > 0;
    const allQuestionsValid = step.questions.every(
      (q) => q.title.trim() !== "" && (
        q.type === QuestionType.TEXT || 
        q.type === QuestionType.TEXTAREA || 
        q.type === QuestionType.IMAGE_UPLOAD ||
        q.options.length > 0
      ),
    );
    return { hasTitle, hasQuestions, allQuestionsValid, isValid: hasTitle && hasQuestions && allQuestionsValid };
  };

  const totalQuestions = steps.reduce((acc, step) => acc + step.questions.length, 0);
  const isValid = title.trim() !== "" && steps.length > 0 && steps.every((s) => getStepValidationStatus(s).isValid);

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Informações do Fluxo
                {title.trim() !== "" && (
                  <Badge variant="secondary" className="ml-2">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Válido
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Configure o título e identificação do fluxo de execução.</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">{steps.length} etapa{steps.length !== 1 ? "s" : ""}</Badge>
              <Badge variant="outline">{totalQuestions} pergunta{totalQuestions !== 1 ? "s" : ""}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="title">Título *</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Nome descritivo do fluxo de execução</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Anamnese, Questionário de execução..."
              required
              className={title.trim() === "" ? "border-destructive" : ""}
            />
            {title.trim() === "" && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                O título é obrigatório
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {steps.map((step, stepIndex) => {
          const validation = getStepValidationStatus(step);
          const isExpanded = expandedSteps.has(step.id);
          return (
            <Card 
              key={step.id} 
              className={`transition-all duration-200 ${
                validation.isValid 
                  ? "border-green-500/20 bg-green-500/5" 
                  : "border-orange-500/20 bg-orange-500/5"
              } ${isExpanded ? "shadow-md" : "shadow-sm"}`}
            >
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg" onClick={() => toggleStep(step.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="flex items-center gap-2">
                        Etapa {step.stepNumber}
                        {step.title && (
                          <span className="text-sm font-normal text-muted-foreground">
                            - {step.title}
                          </span>
                        )}
                        {validation.isValid ? (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Completa
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Incompleta
                          </Badge>
                        )}
                        <Badge variant="outline" className="ml-2">
                          {step.questions.length} pergunta{step.questions.length !== 1 ? "s" : ""}
                        </Badge>
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Configure as informações e perguntas desta etapa.
                    </CardDescription>
                    {!validation.isValid && (
                      <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {!validation.hasTitle && "Título obrigatório • "}
                        {!validation.hasQuestions && "Adicione pelo menos uma pergunta • "}
                        {validation.hasQuestions && !validation.allQuestionsValid && "Algumas perguntas estão incompletas"}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {steps.length > 1 && (
                      <>
                        {stepIndex > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveStep(step.id, "up");
                                }}
                                className="h-8 w-8"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Mover para cima</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {stepIndex < steps.length - 1 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveStep(step.id, "down");
                                }}
                                className="h-8 w-8"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Mover para baixo</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Tem certeza que deseja remover a etapa ${step.stepNumber}?`)) {
                                  removeStep(step.id);
                                }
                              }}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remover etapa</p>
                          </TooltipContent>
                        </Tooltip>
                      </>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStep(step.id);
                      }}
                      className="h-8 w-8"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {isExpanded && (
              <CardContent className="space-y-4 animate-in slide-in-from-top-2 duration-200">
              <div className="space-y-2">
                <Label htmlFor={`step-title-${step.id}`}>Título *</Label>
                <Input
                  id={`step-title-${step.id}`}
                  value={step.title}
                  onChange={(e) => updateStep(step.id, { title: e.target.value })}
                  placeholder='Ex: "1 - Perguntas gerais", "2 - Laser"...'
                  required
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold">Perguntas</h4>
                    <p className="text-xs text-muted-foreground">
                      Adicione perguntas para esta etapa
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addQuestion(step.id)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Pergunta
                  </Button>
                </div>

                {step.questions.map((question) => {
                  const isQuestionValid =
                    question.title.trim() !== "" &&
                    (question.type === QuestionType.TEXT ||
                      question.type === QuestionType.TEXTAREA ||
                      question.type === QuestionType.IMAGE_UPLOAD ||
                      question.options.length > 0);
                  const isQuestionExpanded = expandedQuestions.has(question.id);
                  return (
                    <Card 
                      key={question.id} 
                      className={`transition-all duration-200 bg-muted/30 ${
                        isQuestionValid 
                          ? "border-green-500/20" 
                          : "border-orange-500/20"
                      } ${isQuestionExpanded ? "shadow-sm" : ""}`}
                    >
                      <CardHeader 
                        className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg"
                        onClick={() => toggleQuestion(question.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <CardTitle className="text-base flex items-center gap-2">
                              Pergunta {question.order}
                              {question.title && (
                                <span className="text-sm font-normal text-muted-foreground">
                                  - {question.title}
                                </span>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {questionTypeLabels[question.type]}
                              </Badge>
                              {isQuestionValid && (
                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                              )}
                            </CardTitle>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm("Tem certeza que deseja remover esta pergunta?")) {
                                      removeQuestion(step.id, question.id);
                                    }
                                  }}
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remover pergunta</p>
                              </TooltipContent>
                            </Tooltip>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleQuestion(question.id);
                              }}
                              className="h-8 w-8"
                            >
                              {isQuestionExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    {isQuestionExpanded && (
                    <CardContent className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                      <div className="space-y-2">
                        <Label htmlFor={`q-title-${question.id}`}>Título *</Label>
                        <Input
                          id={`q-title-${question.id}`}
                          value={question.title}
                          onChange={(e) =>
                            updateQuestion(step.id, question.id, { title: e.target.value })
                          }
                          placeholder="Título da pergunta"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`q-description-${question.id}`}>Descrição</Label>
                        <Textarea
                          id={`q-description-${question.id}`}
                          value={question.description}
                          onChange={(e) =>
                            updateQuestion(step.id, question.id, { description: e.target.value })
                          }
                          placeholder="Descrição da pergunta"
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`q-type-${question.id}`}>Tipo *</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Selecione o tipo de resposta esperada para esta pergunta</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Select
                          value={question.type.toString()}
                          onValueChange={(value) =>
                            updateQuestion(step.id, question.id, {
                              type: Number(value) as QuestionType,
                              options:
                                Number(value) === QuestionType.SINGLE_SELECT ||
                                Number(value) === QuestionType.MULTI_SELECT
                                  ? question.options
                                  : [],
                            })
                          }
                        >
                          <SelectTrigger id={`q-type-${question.id}`}>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(questionTypeLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {(question.type === QuestionType.TEXT ||
                        question.type === QuestionType.TEXTAREA) && (
                        <div className="space-y-2">
                          <Label htmlFor={`q-maxlength-${question.id}`}>
                            Tamanho máximo (caracteres)
                          </Label>
                          <Input
                            id={`q-maxlength-${question.id}`}
                            type="number"
                            min="1"
                            value={question.maxLength || ""}
                            onChange={(e) =>
                              updateQuestion(step.id, question.id, {
                                maxLength: e.target.value ? Number(e.target.value) : undefined,
                              })
                            }
                            placeholder="Ex: 255"
                          />
                          <p className="text-xs text-muted-foreground">
                            Deixe em branco para sem limite
                          </p>
                        </div>
                      )}

                      {question.type === QuestionType.IMAGE_UPLOAD && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`q-maximages-${question.id}`}>
                              Número máximo de fotos
                            </Label>
                            <Input
                              id={`q-maximages-${question.id}`}
                              type="number"
                              min="1"
                              value={question.maxImages || ""}
                              onChange={(e) =>
                                updateQuestion(step.id, question.id, {
                                  maxImages: e.target.value ? Number(e.target.value) : undefined,
                                })
                              }
                              placeholder="Ex: 5"
                            />
                            <p className="text-xs text-muted-foreground">
                              Deixe em branco para sem limite
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`q-acceptedtypes-${question.id}`}>
                              Tipos de arquivo aceitos (separados por vírgula)
                            </Label>
                            <Input
                              id={`q-acceptedtypes-${question.id}`}
                              value={question.acceptedImageTypes?.join(", ") || ""}
                              onChange={(e) =>
                                updateQuestion(step.id, question.id, {
                                  acceptedImageTypes: e.target.value
                                    ? e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                                    : undefined,
                                })
                              }
                              placeholder="Ex: image/jpeg, image/png, image/webp"
                            />
                            <p className="text-xs text-muted-foreground">
                              Ex: image/jpeg, image/png, image/webp
                            </p>
                          </div>
                        </div>
                      )}

                      {(question.type === QuestionType.SINGLE_SELECT ||
                        question.type === QuestionType.MULTI_SELECT) && (
                        <div className="space-y-3 rounded-lg border bg-background p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="text-sm font-semibold flex items-center gap-2">
                                Opções
                                <Badge variant="outline" className="text-xs">
                                  {question.options.length} opção{question.options.length !== 1 ? "ões" : ""}
                                </Badge>
                              </h5>
                              <p className="text-xs text-muted-foreground">
                                Adicione as opções de resposta para esta pergunta
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addOption(step.id, question.id)}
                            >
                              <Plus className="mr-2 h-3 w-3" />
                              Adicionar Opção
                            </Button>
                          </div>
                          {question.options.length === 0 && (
                            <div className="text-center py-4 text-sm text-muted-foreground border border-dashed rounded-md">
                              <AlertCircle className="h-4 w-4 mx-auto mb-2" />
                              Nenhuma opção adicionada. Adicione pelo menos uma opção.
                            </div>
                          )}
                          {question.options.map((option, optIndex) => (
                            <div key={option.id} className="space-y-2 rounded-md border p-3 bg-card">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  Opção {optIndex + 1}
                                </Badge>
                                {option.enableExtraAnswer && (
                                  <Badge variant="secondary" className="text-xs">
                                    Resposta extra habilitada
                                  </Badge>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <div className="flex-1 space-y-1">
                                  <Label htmlFor={`opt-title-${option.id}`} className="text-xs">
                                    Título
                                  </Label>
                                  <Input
                                    id={`opt-title-${option.id}`}
                                    placeholder="Título da opção"
                                    value={option.title}
                                    onChange={(e) =>
                                      updateOption(step.id, question.id, option.id, {
                                        title: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="w-32 space-y-1">
                                  <Label htmlFor={`opt-value-${option.id}`} className="text-xs">
                                    Valor
                                  </Label>
                                  <Input
                                    id={`opt-value-${option.id}`}
                                    placeholder="Valor"
                                    value={option.value}
                                    onChange={(e) =>
                                      updateOption(step.id, question.id, option.id, {
                                        value: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="flex items-end gap-2">
                                  <div className="flex items-center gap-2 px-3 py-2 border rounded-md h-10">
                                    <input
                                      type="checkbox"
                                      id={`enable-extra-${option.id}`}
                                      checked={option.enableExtraAnswer}
                                      onChange={(e) =>
                                        updateOption(step.id, question.id, option.id, {
                                          enableExtraAnswer: e.target.checked,
                                        })
                                      }
                                      className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <Label
                                      htmlFor={`enable-extra-${option.id}`}
                                      className="text-xs whitespace-nowrap cursor-pointer"
                                    >
                                      Extra
                                    </Label>
                                  </div>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                          if (confirm("Tem certeza que deseja remover esta opção?")) {
                                            removeOption(step.id, question.id, option.id);
                                          }
                                        }}
                                        className="h-10 w-10 text-destructive hover:text-destructive"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Remover opção</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </div>
                              {option.enableExtraAnswer && (
                                <div className="space-y-2 pl-2 border-l-2 border-primary/20">
                                  <Label htmlFor={`extra-maxlength-${option.id}`} className="text-xs">
                                    Tamanho máximo da resposta extra (caracteres)
                                  </Label>
                                  <Input
                                    id={`extra-maxlength-${option.id}`}
                                    type="number"
                                    min="1"
                                    value={option.extraAnswerMaxLength || ""}
                                    onChange={(e) =>
                                      updateOption(step.id, question.id, option.id, {
                                        extraAnswerMaxLength: e.target.value
                                          ? Number(e.target.value)
                                          : undefined,
                                      })
                                    }
                                    placeholder="Ex: 500"
                                    className="w-48"
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    Deixe em branco para sem limite
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    )}
                  </Card>
                  );
                })}
              </div>
            </CardContent>
            )}
          </Card>
          );
        })}

        <Button 
          type="button" 
          variant="outline" 
          onClick={addStep} 
          className="w-full border-dashed hover:border-primary/50 hover:bg-primary/5 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Etapa
        </Button>
      </div>

      <Card className={`bg-muted/30 border-2 transition-all duration-200 ${
        isValid 
          ? "border-green-500/30 shadow-lg shadow-green-500/10" 
          : "border-orange-500/30 shadow-md"
      }`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Status do Formulário</p>
              <div className="flex items-center gap-2 text-xs">
                {isValid ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 animate-pulse" />
                    <span className="text-green-700 dark:text-green-400 font-medium">
                      Formulário válido e pronto para salvar
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-orange-700 dark:text-orange-400">
                      Complete todos os campos obrigatórios
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={!isValid || loading} 
                className={`transition-all duration-200 ${
                  isValid && !loading
                    ? "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30" 
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Salvar Fluxo
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
    </TooltipProvider>
  );
}

