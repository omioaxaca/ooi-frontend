import type {
  StudyCategory,
  StudyLevelValue,
  TopicSummary,
  TopicContent,
} from "@/lib/study-content";

export type SyllabusCategory = StudyCategory;
export type SyllabusLevel = StudyLevelValue;
export type Syllabus = TopicSummary & { id?: number };
export type SyllabusView = TopicContent;
export type SyllabusByCategory = {
  category: StudyCategory | null;
  syllabi: TopicSummary[];
};
