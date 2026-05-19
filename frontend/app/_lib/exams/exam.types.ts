export type BackendQuestionDto = {
  id: number;
  topicId: number | null;
  topicName: string;
  questionText: string;
  questionImage: string | null;
  choices: Array<{
    id: number;
    choiceText: string;
    isCorrect: boolean;
  }>;
};

export type BackendExamDto = {
  id: number;
  positionTitle: string;
  durationMinutes: number | null;
  questionCount: number;
  windowStartTime: string | null;
  windowEndTime: string | null;
  questions: BackendQuestionDto[] | null;
};

export type ExamSummary = {
  id: number;
  positionTitle: string;
  durationMinutes?: number | null;
  questionCount: number;
  windowStartTime?: string | null;
  windowEndTime?: string | null;
};

export type Exam = {
  id: number;
  title: string;
  description: string;
  duration: string;
  durationMinutes?: number;
  questionCount: number;
  windowStartTime?: string;
  windowEndTime?: string;
  questionIds: number[];
  questions: BackendQuestionDto[];
};

export type CreateExamPayload = {
  positionTitle: string;
  durationMinutes?: number | null;
  windowStartTime?: string | null;
  windowEndTime?: string | null;
  questionIds?: number[];
};

export type UpdateExamPayload = {
  positionTitle?: string;
  durationMinutes?: number | null;
  windowStartTime?: string | null;
  windowEndTime?: string | null;
  addedQuestionIds?: number[];
  removedQuestionIds?: number[];
};

export type ExamsPaginatedResponse = {
  data: ExamSummary[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};
