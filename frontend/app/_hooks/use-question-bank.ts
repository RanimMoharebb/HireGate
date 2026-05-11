"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  EMPTY_QUESTION_FORM,
  Question,
  QuestionFormData,
  Topic,
} from "@/app/_lib/question-bank.types";
import { questionBankService } from "@/app/_services/question-bank-service";

const PAGE_SIZE = 10;

const validateQuestionForm = (formData: QuestionFormData): string | null => {
  if (!formData.topicId) {
    return "Topic is required";
  }

  const correctCount = formData.choices.filter((choice) => choice.isCorrect).length;
  if (correctCount === 0) {
    return "Exactly one answer must be marked correct";
  }

  if (correctCount > 1) {
    return "Only one answer can be marked correct";
  }

  return null;
};

export const useQuestionBank = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [deleteQuestion, setDeleteQuestion] = useState<Question | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState<QuestionFormData>(EMPTY_QUESTION_FORM);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [topicName, setTopicName] = useState("");
  const [topicError, setTopicError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const loadQuestions = async (
    page: number,
    topic: string,
    search: string,
    showLoading = true
  ) => {
    if (showLoading) {
      setLoading(true);
    }
    setErrorMessage(null);

    try {
      const data = await questionBankService.getQuestions(page, PAGE_SIZE, topic, search);
      setQuestions(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An error occurred");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!successMessage) {
      setIsSuccessVisible(false);
      return;
    }

    setIsSuccessVisible(true);
    const hideTimer = window.setTimeout(() => setIsSuccessVisible(false), 3600);
    const removeTimer = window.setTimeout(() => setSuccessMessage(null), 4000);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
    };
  }, [successMessage]);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const data = await questionBankService.getTopics();
        setTopics(data);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
      }
    };

    loadTopics();
  }, []);

  useEffect(() => {
    loadQuestions(currentPage, selectedTopic, searchTerm);
  }, [currentPage, selectedTopic, searchTerm]);

  const resetForm = () => {
    setFormData(EMPTY_QUESTION_FORM);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setIsEditingMode(false);
    setSelectedQuestion(null);
    setFormError(null);
    resetForm();
  };

  const openAddQuestionModal = () => {
    setIsEditingMode(false);
    setSelectedQuestion(null);
    setErrorMessage(null);
    setFormError(null);
    resetForm();
    setIsFormModalOpen(true);
  };

  const openAddTopicModal = () => {
    setTopicName("");
    setTopicError(null);
    setErrorMessage(null);
    setIsTopicModalOpen(true);
  };

  const closeAddTopicModal = () => {
    setIsTopicModalOpen(false);
    setTopicName("");
    setTopicError(null);
  };

  const openEditQuestionModal = (question: Question) => {
    setSelectedQuestion(question);
    setIsEditingMode(true);
    setFormError(null);
    setErrorMessage(null);
    setFormData({
      questionText: question.questionText,
      imageUrl: question.questionImage || "",
      topicId: question.topicId?.toString() || "",
      choices: question.choices,
    });
    setIsFormModalOpen(true);
  };

  const submitQuestion = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setFormError(null);

    const validationError = validateQuestionForm(formData);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setLoading(true);
    try {
      await questionBankService.saveQuestion(formData, isEditingMode, selectedQuestion?.id);

      if (isEditingMode && selectedQuestion) {
        const updatedQuestion: Question = {
          ...selectedQuestion,
          questionText: formData.questionText,
          questionImage: formData.imageUrl || undefined,
          topicId: Number(formData.topicId),
          topicName:
            topics.find((topic) => topic.id === Number(formData.topicId))?.topicName ||
            selectedQuestion.topicName,
          choices: formData.choices,
        };

        setQuestions((prev) =>
          prev.map((question) => (question.id === selectedQuestion.id ? updatedQuestion : question))
        );
      }

      closeFormModal();

      if (currentPage === 1) {
        await loadQuestions(1, selectedTopic, searchTerm, false);
      } else {
        setCurrentPage(1);
      }

      setSuccessMessage(
        isEditingMode ? "Question updated successfully." : "Question added successfully."
      );
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteQuestion = async () => {
    if (!deleteQuestion) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      await questionBankService.deleteQuestion(deleteQuestion.id);
      setQuestions((prev) => prev.filter((question) => question.id !== deleteQuestion.id));
      setDeleteQuestion(null);
      setSuccessMessage("Question deleted successfully.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const submitTopic = async (event: FormEvent) => {
    event.preventDefault();
    const normalizedTopicName = topicName.trim();
    if (!normalizedTopicName) {
      setTopicError("Topic name is required.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setTopicError(null);
    try {
      const createdTopic = await questionBankService.addTopic(normalizedTopicName);
      setTopics((prev) => [...prev, createdTopic]);
      setCurrentPage(1);
      closeAddTopicModal();
      setSuccessMessage("Topic added successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      setTopicError(message);
    } finally {
      setLoading(false);
    }
  };

  const showQuestionDetails = useMemo(
    () => selectedQuestion && !isFormModalOpen,
    [selectedQuestion, isFormModalOpen]
  );

  return {
    questions,
    topics,
    selectedTopic,
    setSelectedTopic,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    loading,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,
    isSuccessVisible,
    formData,
    setFormData,
    formError,
    topicName,
    setTopicName,
    topicError,
    isTopicModalOpen,
    isFormModalOpen,
    isEditingMode,
    selectedQuestion,
    setSelectedQuestion,
    deleteQuestion,
    setDeleteQuestion,
    showQuestionDetails,
    openAddTopicModal,
    closeAddTopicModal,
    submitTopic,
    submitQuestion,
    openAddQuestionModal,
    openEditQuestionModal,
    closeFormModal,
    confirmDeleteQuestion,
  };
};
