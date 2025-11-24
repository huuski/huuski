export enum QuestionType {
  TEXT = 1,
  TEXTAREA = 2,
  SINGLE_SELECT = 3,
  MULTI_SELECT = 4,
  IMAGE_UPLOAD = 5,
  STOCK_CONTROL = 6,
}

export type ExecutionFlowStepQuestionOption = {
  id: string;
  title: string;
  value: string;
  enableExtraAnswer: boolean;
  extraAnswerMaxLength?: number;
};

export type ExecutionFlowStepQuestion = {
  id: string;
  order: number;
  title: string;
  subtitle?: string;
  description: string;
  type: QuestionType;
  options: ExecutionFlowStepQuestionOption[];
  extraAnswer?: string;
  maxLength?: number;
  maxImages?: number;
  acceptedImageTypes?: string[];
};

export type ExecutionFlowStep = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  stepNumber: number;
  questions: ExecutionFlowStepQuestion[];
};

export type ExecutionFlow = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  steps: ExecutionFlowStep[];
};

export type ExecutionFlowFormData = Omit<ExecutionFlow, "id" | "createdAt" | "updatedAt" | "deletedAt">;

