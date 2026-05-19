export class ExamApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ExamApiError";
    this.status = status;
  }
}
