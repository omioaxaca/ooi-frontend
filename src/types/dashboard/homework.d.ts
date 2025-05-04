import type { ClassLesson } from "./classLessons";
import type { ContestCycle } from "./contestCycle";
import type { StrapiFile } from "../common";

// Frontend view of an evaluation
export type HomeworkRowView = {
  id: number;
  name: string;
  status: string;
  deadline: string | null;
  submitDate: string | null;
  score: number | string | null;
  maxScore: number;
  feedback: string | null;
  description: string;
  url: string;
  classLesson: ClassLesson;
};


// Backend of an evaluation
export type Homework = {
  id: number;
  documentId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  deadlineDate: string;
  maxScore: number;
  files: Array<StrapiFile>;
  classLesson: ClassLesson;
  contestCycle: ContestCycle;
};

// Frontend New Object created in client to create an evaluation attempt in server
export type NewHomeworkAttempt = {
  homework: number;
  contestCycle: number;
  user: number;
  deliveredDate: string;
  userNotes: string;
};

// Backend of an evaluation attempt
export type HomeworkAttempt = {
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
  contestCycle: {
    id: number;
    documentId: string;
  };
  homework: {
    id: number;
    documentId: string;
  };
  deliveredFiles: Array<StrapiFile>;
  userNotes: string;
};
