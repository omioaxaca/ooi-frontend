import qs from "qs";
import type {
  Syllabus,
  SyllabusLevel,
  SyllabusByCategory,
} from "@/types/dashboard/syllabus";
import axiosInstance from "./authService";

/**
 * Fetches all syllabi filtered by level from the backend
 * @param level - The syllabus level (Principiante, Intermedio, Avanzado)
 * @returns Array of syllabi for the given level
 */
export const fetchSyllabiByLevel = async (
  level: SyllabusLevel,
): Promise<Syllabus[]> => {
  try {
    const query = qs.stringify(
      {
        fields: "*",
        filters: {
          level: {
            $eq: level,
          },
        },
        populate: {
          category: {
            fields: "*",
          },
          youtubeLinks: {
            fields: "*",
          },
          pdfLinks: {
            fields: "*",
          },
        },
        sort: ["rank:asc", "title:asc"],
        pagination: {
          pageSize: 1000,
        },
      },
      {
        encodeValuesOnly: true,
      },
    );

    const response = await axiosInstance.get(`/api/syllabi?${query}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching syllabi for level ${level}:`, error);
    throw error;
  }
};

/**
 * Groups syllabi by their category
 * @param syllabi - Array of syllabi to group
 * @returns Array of SyllabusByCategory objects
 */
export const groupSyllabiByCategory = (
  syllabi: Syllabus[],
): SyllabusByCategory[] => {
  const categoryMap = new Map<string, SyllabusByCategory>();

  for (const syllabus of syllabi) {
    if (!syllabus.category) continue;

    const key = syllabus.category.documentId || String(syllabus.category.id);

    if (!categoryMap.has(key)) {
      categoryMap.set(key, {
        category: syllabus.category,
        syllabi: [],
      });
    }

    categoryMap.get(key)!.syllabi.push(syllabus);
  }

  return Array.from(categoryMap.values());
};

/**
 * Fetches syllabi by level and returns them grouped by category
 * @param level - The syllabus level
 * @returns Array of SyllabusByCategory objects
 */
export const fetchSyllabiByLevelGrouped = async (
  level: SyllabusLevel,
): Promise<SyllabusByCategory[]> => {
  const syllabi = await fetchSyllabiByLevel(level);
  return groupSyllabiByCategory(syllabi);
};
