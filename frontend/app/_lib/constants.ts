export const roles = ["owner", "hr"];

export type ExamItem = {
  id: number;
  title: string;
  description: string;
  duration: string;
};

export const exams: ExamItem[] = [
  {
    id: 1,
    title: "JavaScript Basics",
    description: "Test your knowledge of JavaScript fundamentals.",
    duration: "30 minutes",
  },
    {  
    id: 2,
    title: "React Fundamentals",
    description: "Assess your understanding of React concepts and best practices.",
    duration: "45 minutes",
  },
    {
    id: 3,
    title: "Node.js Essentials",
    description: "Evaluate your skills in building server-side applications with Node.js.",
    duration: "40 minutes",
  },
]
