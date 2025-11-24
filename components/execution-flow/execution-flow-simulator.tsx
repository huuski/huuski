"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, Upload, X, Plus, Minus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExecutionFlow, QuestionType, ExecutionFlowStepQuestion } from "@/lib/types/execution-flow";
import { QuestionType as QT } from "@/lib/types/execution-flow";
import { fetchProducts } from "@/lib/api/product";
import type { Product } from "@/lib/types/product";

type AnswerValue = string | string[] | undefined;

type Answers = Record<string, AnswerValue>;

type ExecutionFlowSimulatorProps = {
  flow: ExecutionFlow;
  onClose: () => void;
  currentStepIndex?: number;
  onStepChange?: (index: number) => void;
  answers?: Answers;
  onAnswerChange?: (questionId: string, value: AnswerValue) => void;
  extraAnswers?: Record<string, string>;
  onExtraAnswerChange?: (optionId: string, value: string) => void;
};

type StockControlData = {
  [productId: string]: number;
};

type StockControlQuestionProps = {
  question: ExecutionFlowStepQuestion;
  answer: AnswerValue;
  onAnswerChange: (value: AnswerValue) => void;
};

function StockControlQuestion({ question, answer, onAnswerChange }: StockControlQuestionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<StockControlData>(() => {
    try {
      if (answer && typeof answer === "string") {
        return JSON.parse(answer);
      }
    } catch {
      // Ignore parse errors
    }
    return {};
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleProductToggle = (productId: string) => {
    const newSelected = { ...selectedProducts };
    if (newSelected[productId]) {
      delete newSelected[productId];
    } else {
      newSelected[productId] = 0;
    }
    setSelectedProducts(newSelected);
    onAnswerChange(JSON.stringify(newSelected));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    const newSelected = { ...selectedProducts };
    if (quantity <= 0) {
      delete newSelected[productId];
    } else {
      newSelected[productId] = quantity;
    }
    setSelectedProducts(newSelected);
    onAnswerChange(JSON.stringify(newSelected));
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Carregando produtos...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Nenhum produto disponível.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {products.map((product) => {
          const isSelected = product.id in selectedProducts;
          const quantity = selectedProducts[product.id] || 0;

          return (
            <div
              key={product.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                isSelected ? "bg-primary/5 border-primary/20" : "bg-background"
              }`}
            >
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="checkbox"
                  id={`product-${product.id}`}
                  checked={isSelected}
                  onChange={() => handleProductToggle(product.id)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor={`product-${product.id}`} className="cursor-pointer flex-1">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{product.name}</span>
                    <span className="text-sm text-muted-foreground">
                      - R$ {product.price.toFixed(2)}
                    </span>
                  </div>
                  {product.description && (
                    <p className="text-xs text-muted-foreground mt-1">{product.description}</p>
                  )}
                </Label>
              </div>
              {isSelected && (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(product.id, Math.max(0, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      handleQuantityChange(product.id, value);
                    }}
                    className="w-20 text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(product.id, quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {Object.keys(selectedProducts).length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-muted/30 border">
          <p className="text-sm font-medium mb-2">Resumo:</p>
          <div className="space-y-1">
            {Object.entries(selectedProducts).map(([productId, qty]) => {
              const product = products.find((p) => p.id === productId);
              if (!product) return null;
              return (
                <div key={productId} className="flex justify-between text-sm">
                  <span>{product.name}</span>
                  <span>
                    {qty} x R$ {product.price.toFixed(2)} = R$ {(qty * product.price).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 pt-2 border-t">
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>
                R${" "}
                {Object.entries(selectedProducts)
                  .reduce((sum, [productId, qty]) => {
                    const product = products.find((p) => p.id === productId);
                    return sum + (product ? qty * product.price : 0);
                  }, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ExecutionFlowSimulator({
  flow,
  currentStepIndex: externalStepIndex = 0,
  answers: externalAnswers,
  onAnswerChange: externalOnAnswerChange,
  extraAnswers: externalExtraAnswers,
  onExtraAnswerChange: externalOnExtraAnswerChange,
}: ExecutionFlowSimulatorProps) {
  const [internalAnswers, setInternalAnswers] = useState<Answers>({});
  const [internalExtraAnswers, setInternalExtraAnswers] = useState<Record<string, string>>({});

  const answers = externalAnswers ?? internalAnswers;
  const extraAnswers = externalExtraAnswers ?? internalExtraAnswers;

  // Normalizar índices e garantir que não haja erros de acesso
  const safeSteps = flow?.steps || [];
  const currentStepIndex = safeSteps.length > 0 
    ? Math.max(0, Math.min(externalStepIndex, safeSteps.length - 1))
    : 0;
  const currentStep = safeSteps[currentStepIndex];

  const handleAnswerChange = (questionId: string, value: AnswerValue) => {
    if (externalOnAnswerChange) {
      externalOnAnswerChange(questionId, value);
    } else {
      setInternalAnswers((prev) => ({ ...prev, [questionId]: value }));
    }
  };

  const handleExtraAnswerChange = (optionId: string, value: string) => {
    if (externalOnExtraAnswerChange) {
      externalOnExtraAnswerChange(optionId, value);
    } else {
      setInternalExtraAnswers((prev) => ({ ...prev, [optionId]: value }));
    }
  };


  const getQuestionAnswer = (questionId: string): AnswerValue => {
    return answers[questionId];
  };

  const getExtraAnswer = (optionId: string): string => {
    return extraAnswers[optionId] || "";
  };


  const renderQuestion = (question: ExecutionFlowStepQuestion) => {
    const answer = getQuestionAnswer(question.id);
    const questionTypeLabels: Record<QuestionType, string> = {
      [QT.TEXT]: "Texto",
      [QT.TEXTAREA]: "Área de texto",
      [QT.SINGLE_SELECT]: "Seleção única",
      [QT.MULTI_SELECT]: "Seleção múltipla",
      [QT.IMAGE_UPLOAD]: "Upload de fotos",
      [QT.STOCK_CONTROL]: "Controle de estoque",
    };

    return (
      <Card key={question.id} className="bg-muted/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-base">
                {question.order}. {question.title}
              </CardTitle>
              {question.subtitle && (
                <CardDescription className="mt-1">{question.subtitle}</CardDescription>
              )}
              {question.description && (
                <p className="mt-2 text-sm text-muted-foreground">{question.description}</p>
              )}
              <Badge variant="secondary" className="mt-2">
                {questionTypeLabels[question.type]}
                {question.maxLength && ` • Máx: ${question.maxLength} caracteres`}
                {question.maxImages && ` • Máx: ${question.maxImages} foto${question.maxImages !== 1 ? "s" : ""}`}
              </Badge>
            </div>
            {(() => {
              const answer = getQuestionAnswer(question.id);
              const isAnswered = Array.isArray(answer) ? answer.length > 0 : answer !== undefined && answer !== "";
              return isAnswered ? <Check className="h-5 w-5 text-green-600" /> : null;
            })()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {question.type === QT.TEXT && (
            <div className="space-y-2">
              <Input
                value={(answer as string) || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!question.maxLength || value.length <= question.maxLength) {
                    handleAnswerChange(question.id, value);
                  }
                }}
                placeholder="Digite sua resposta"
                maxLength={question.maxLength}
              />
              {question.maxLength && (
                <p className="text-xs text-muted-foreground">
                  {((answer as string) || "").length} / {question.maxLength} caracteres
                </p>
              )}
            </div>
          )}

          {question.type === QT.TEXTAREA && (
            <div className="space-y-2">
              <Textarea
                value={(answer as string) || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!question.maxLength || value.length <= question.maxLength) {
                    handleAnswerChange(question.id, value);
                  }
                }}
                placeholder="Digite sua resposta"
                rows={4}
                maxLength={question.maxLength}
              />
              {question.maxLength && (
                <p className="text-xs text-muted-foreground">
                  {((answer as string) || "").length} / {question.maxLength} caracteres
                </p>
              )}
            </div>
          )}

          {question.type === QT.SINGLE_SELECT && (
            <div className="space-y-3">
              {question.options && question.options.length > 0 ? (
                <>
                  <Select
                    value={(answer as string) || ""}
                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options.map((option) => (
                        <SelectItem key={option.id} value={option.value}>
                          {option.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {answer &&
                    question.options.find((opt) => opt.value === answer)?.enableExtraAnswer && (
                  <div className="space-y-2 rounded-lg border bg-background p-3">
                    <Label className="text-sm">Resposta adicional</Label>
                    <Textarea
                      value={getExtraAnswer(
                        question.options.find((opt) => opt.value === answer)!.id,
                      )}
                      onChange={(e) => {
                        const option = question.options.find((opt) => opt.value === answer)!;
                        const value = e.target.value;
                        if (
                          !option.extraAnswerMaxLength ||
                          value.length <= option.extraAnswerMaxLength
                        ) {
                          handleExtraAnswerChange(option.id, value);
                        }
                      }}
                      placeholder="Adicione informações adicionais"
                      rows={3}
                      maxLength={
                        question.options.find((opt) => opt.value === answer)?.extraAnswerMaxLength
                      }
                    />
                    {question.options.find((opt) => opt.value === answer)?.extraAnswerMaxLength && (
                      <p className="text-xs text-muted-foreground">
                        {getExtraAnswer(
                          question.options.find((opt) => opt.value === answer)!.id,
                        ).length}{" "}
                        /{" "}
                        {
                          question.options.find((opt) => opt.value === answer)!
                            .extraAnswerMaxLength
                        }{" "}
                        caracteres
                      </p>
                    )}
                  </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Esta pergunta não possui opções configuradas.
                </p>
              )}
            </div>
          )}

          {question.type === QT.MULTI_SELECT && (
            <div className="space-y-3">
              {question.options && question.options.length > 0 ? (
                question.options.map((option) => {
                  const selectedOptions = (answer as string[]) || [];
                  const isSelected = selectedOptions.includes(option.value);
                  return (
                    <div key={option.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`option-${option.id}`}
                          checked={isSelected}
                          onChange={(e) => {
                            const selected = (answer as string[]) || [];
                            if (e.target.checked) {
                              handleAnswerChange(question.id, [...selected, option.value]);
                            } else {
                              handleAnswerChange(
                                question.id,
                                selected.filter((v) => v !== option.value),
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor={`option-${option.id}`} className="cursor-pointer">
                          {option.title}
                        </Label>
                      </div>
                      {isSelected && option.enableExtraAnswer && (
                        <div className="ml-6 space-y-2 rounded-lg border bg-background p-3">
                          <Label className="text-sm">Resposta adicional</Label>
                          <Textarea
                            value={getExtraAnswer(option.id)}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (!option.extraAnswerMaxLength || value.length <= option.extraAnswerMaxLength) {
                                handleExtraAnswerChange(option.id, value);
                              }
                            }}
                            placeholder="Adicione informações adicionais"
                            rows={3}
                            maxLength={option.extraAnswerMaxLength}
                          />
                          {option.extraAnswerMaxLength && (
                            <p className="text-xs text-muted-foreground">
                              {getExtraAnswer(option.id).length} / {option.extraAnswerMaxLength}{" "}
                              caracteres
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">
                  Esta pergunta não possui opções configuradas.
                </p>
              )}
            </div>
          )}

          {question.type === QT.IMAGE_UPLOAD && (
            <div className="space-y-3">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor={`file-upload-${question.id}`}
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {question.acceptedImageTypes?.length
                        ? `Formatos aceitos: ${question.acceptedImageTypes.join(", ")}`
                        : "PNG, JPG, WEBP até 10MB"}
                    </p>
                  </div>
                  <input
                    id={`file-upload-${question.id}`}
                    type="file"
                    className="hidden"
                    multiple={!question.maxImages || question.maxImages > 1}
                    accept={question.acceptedImageTypes?.join(",") || "image/*"}
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const maxFiles = question.maxImages || files.length;
                      const selectedFiles = files.slice(0, maxFiles);
                      
                      // Convert files to base64 or file URLs for preview
                      const fileUrls = selectedFiles.map((file) => URL.createObjectURL(file));
                      handleAnswerChange(question.id, fileUrls);
                    }}
                  />
                </label>
              </div>

              {Array.isArray(answer) && answer.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {answer.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border bg-muted relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newUrls = (answer as string[]).filter((_, i) => i !== index);
                          handleAnswerChange(question.id, newUrls.length > 0 ? newUrls : undefined);
                          // Revoke object URL to free memory
                          URL.revokeObjectURL(url);
                        }}
                        className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {question.maxImages && Array.isArray(answer) && (
                <p className="text-xs text-muted-foreground text-center">
                  {answer.length} / {question.maxImages} foto{question.maxImages !== 1 ? "s" : ""} enviada{answer.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          )}

          {question.type === QT.STOCK_CONTROL && (
            <StockControlQuestion
              question={question}
              answer={answer}
              onAnswerChange={(value) => handleAnswerChange(question.id, value)}
            />
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{flow?.title || "Fluxo de Execução"}</h2>
          <p className="text-sm text-muted-foreground">
            {safeSteps.length > 0 ? `Etapa ${currentStepIndex + 1} de ${safeSteps.length}` : "Nenhuma etapa configurada"}
          </p>
        </div>
      </div>

      {currentStep ? (
        <Card>
          <CardHeader>
            <CardTitle>{currentStep.title || "Etapa sem título"}</CardTitle>
            {currentStep.subtitle && (
              <CardDescription>{currentStep.subtitle}</CardDescription>
            )}
            {currentStep.description && (
              <p className="mt-2 text-sm text-muted-foreground">{currentStep.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {currentStep.questions && currentStep.questions.length > 0 ? (
              currentStep.questions.map((question) => renderQuestion(question))
            ) : (
              <p className="text-sm text-muted-foreground">
                Esta etapa não possui perguntas configuradas.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8">
            <p className="text-sm text-muted-foreground text-center">
              Nenhuma etapa disponível para exibir.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

type ExecutionFlowSimulatorFooterProps = {
  flow: ExecutionFlow;
  currentStepIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  allQuestionsAnswered: boolean;
};

export function ExecutionFlowSimulatorFooter({
  flow,
  currentStepIndex,
  onPrevious,
  onNext,
  onSubmit,
  isFirstStep,
  isLastStep,
  allQuestionsAnswered,
}: ExecutionFlowSimulatorFooterProps) {
  return (
    <div className="flex items-center justify-between">
      <Button variant="outline" onClick={onPrevious} disabled={isFirstStep}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Anterior
      </Button>

      <div className="flex items-center gap-2">
        {flow.steps.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentStepIndex
                ? "bg-primary"
                : index < currentStepIndex
                  ? "bg-green-500"
                  : "bg-muted"
            }`}
          />
        ))}
      </div>

      {isLastStep ? (
        <Button onClick={onSubmit} disabled={!allQuestionsAnswered}>
          Finalizar Simulação
        </Button>
      ) : (
        <Button onClick={onNext} disabled={!allQuestionsAnswered}>
          Próxima
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

