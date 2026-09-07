import type {
  Syllabus,
  SyllabusLevel,
  SyllabusByCategory,
} from "@/types/dashboard/syllabus";
import { groupStudyTopics } from "@/lib/study-content";
import { fetchStudyData } from "./studyService";

export const fetchSyllabiByLevel = (
  level: SyllabusLevel,
): Promise<Syllabus[]> =>
  fetchStudyData(`curriculum?level=${encodeURIComponent(level)}`);

export const groupSyllabiByCategory = (
  syllabi: Syllabus[],
): SyllabusByCategory[] =>
  groupStudyTopics(syllabi).map((group) => ({
    category: group.category,
    syllabi: group.topics,
  }));

export const fetchSyllabiByLevelGrouped = async (
  level: SyllabusLevel,
): Promise<SyllabusByCategory[]> =>
  groupSyllabiByCategory(await fetchSyllabiByLevel(level));
