import type { Syllabus } from "./Syllabus";
import type { User } from "../user";
import type { ContestCycle } from "./contestCycle";
import type { StrapiFile } from "../global";
import type { ContestPhase } from "./contestPhase";

// Backend of an evaluation
export type ClassLesson = {
  id: number;
  documentId: string;
  date: string;
  teacher: User;
  syllabi: Array<Syllabus>;
  presentation: StrapiFile;
  classRecordingURL: string;
  description: string;
  meetingURL: string;
  contestCycle: ContestCycle;
  notesFromClass: Array<StrapiFile>;
  contestPhase: ContestPhase;
};

// Frontend view of a class lesson
export type ClassLessonView = {
  id: number;
  date: string;
  teacher: {
    id: number;
    documentId: string;
    fullname: string;
    avatarURL: string;
  };
  syllabi: Array<{
    id: number;
    documentId: string;
    title: string;
    description: string;
    category: SyllabusCategory;
  }>;
  contestPhase: string;
  presentationURL: string;
  classRecordingURL: string;
  meetingURL: string;
  contestCycle: string;
  notesURLs: Array<string>;
};
