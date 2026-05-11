export interface Choice {
  id?: number;
  choiceText: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  questionText: string;
  topicId?: number;
  topicName: string;
  questionImage?: string;
  choices: Choice[];
}

export interface Topic {
  id: number;
  topicName: string;
}

export interface PaginationData {
  data: Question[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface QuestionFormData {
  questionText: string;
  imageUrl: string;
  topicId: string;
  choices: Choice[];
}

export const EMPTY_QUESTION_FORM: QuestionFormData = {
  questionText: "",
  imageUrl: "",
  topicId: "",
  choices: [
    { choiceText: "", isCorrect: false },
    { choiceText: "", isCorrect: false },
    { choiceText: "", isCorrect: false },
    { choiceText: "", isCorrect: false },
  ],
};
