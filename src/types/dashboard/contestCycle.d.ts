import type { StrapiFile } from "../common";

export type ContestCycle = {
  id: number;
  documentId: string;
  name: string;
  description: string;
  maxStudentYears: number;
  signupDeadline: string;
  startClassesDate: string;
  introductionSessionDate: string;
  introductionSessionUrl: string;
  posterImage: StrapiFile | null;
  startClassUrl: string;
  createdAt: string;
  updatedAt: string;
};
