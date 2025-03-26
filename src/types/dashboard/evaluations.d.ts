// Frontend view of an evaluation
export type EvaluationRowView = {
  id: number;
  title: string;
  type: string;
  status: string;
  deadline: string | null;
  submitDate: string | null;
  score: number | string | null;
  maxScore: number;
  feedback: string | null;
  description: string;
  url: string;
};

// Frontend of a question card
export type QuestionCardView = {
  index: number;
  identifier: string;
  label: string;
  description?: string;
  photoUrl?: string | null;
  answerOptions: Array<{
    identifier: string;
    label: string;
  }>;
  answerSelectedIdentifier?: string | string[] | number | boolean;
  required: boolean;
  isReadOnly: boolean;
  isCorrect?: boolean;
  type: 'radio_group' | 'checkbox' | 'dropdown' | 'text';
  onAnswerChange: (questionIdentifier: string, answerIdentifier: string) => void;
}

// Backend of an evaluation
export type Evaluation = {
  id: number;
  documentId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  deadlineDate: string;
  maxScore: number;
  type: string;
  availableDate: string;
  maxAttempts: number;
  isAvailable: boolean;
  questions: Array<{
    id: number;
    label: string;
    description?: string;
    identifier: string;
    answerOptions: Array<{
      id: number;
      identifier: string;
      label: string;
    }>;
    photo?: {
      id: number;
      documentId: string;
      name: string;
      url: string;
    };
  }>;
  cover: Array<{
    id: number;
    documentId: string;
    name: string;
    url: string;
  }>;
};

// Frontend New Object created in client to create an evaluation attempt in server
export type NewEvaluationAttempt = {
  deliveredDate: string;
  user: number,
  answeredQuestions: Array<{
    questionIdentifier: string;
    answerIdentifier: string;
  }>;
  contestCycle: number,
  evaluation: number,
};

// Backend of an evaluation attempt
export type EvaluationAttempt = {
  id: number;
  documentId: string;
  notes: string;
  passed: boolean | null;
  reviewStatus: string;
  score: number | string | null;
  deliveredDate: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  user: {
    id: number;
    documentId: string;
  };
  answeredQuestions: Array<{
    id: number;
    questionIdentifier: string;
    answerIdentifier: string;
    isRightAnswer: boolean;
  }>;
  contestCycle: {
    id: number;
    documentId: string;
  };
  evaluation: {
    id: number;
    documentId: string;
  };
};
