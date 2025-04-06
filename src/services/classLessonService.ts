import axios from "axios";
import qs from "qs";
import * as localStorageUtils from "@/utils/localStorage";
import { User } from "@/types/user";
import type { ClassLesson, ClassLessonView } from "@/types/dashboard/classLessons";
const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

// Helper to get auth token - aligned with auth-context implementation
const getToken = (): string | null => {
  return localStorageUtils.getItem<string>("token") || null;
};

// Configure axios with authentication
const getAuthHeaders = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export const mapBackendClassLessonToFrontendClassLesson = (classLesson: ClassLesson): ClassLessonView => {
  console.log(classLesson);
  return {
    id: classLesson?.id || 0,
    date: classLesson?.date || new Date().toISOString(),
    teacher: {
      id: classLesson?.teacher?.id || 0,
      documentId: classLesson?.teacher?.documentId || '',
      fullname: classLesson?.teacher ? 
        `${classLesson.teacher.firstName || ''} ${classLesson.teacher.lastName || ''}`.trim() || 'Profesor no asignado' : 
        'Profesor no asignado',
      avatarURL: classLesson?.teacher?.avatar?.url || '',
    },
    syllabi: (classLesson?.syllabi || []).map((syllabus) => ({
      id: syllabus?.id || 0,
      documentId: syllabus?.documentId || '',
      title: syllabus?.title || 'Título no disponible',
      description: syllabus?.description || 'Sin descripción',
      category: syllabus?.category || 'general',
    })),
    contestPhase: classLesson?.contestPhase?.title || '',
    presentationURL: classLesson?.presentation?.url || '',
    classRecordingURL: classLesson?.classRecordingURL || '',
    meetingURL: classLesson?.meetingURL || '',
    contestCycle: classLesson?.contestCycle?.name || 'Ciclo actual',
    notesURLs: (classLesson?.notesFromClass || []).map((note) => note?.url || ''),
  };
};

// Fetch all class lessons for the current user
export const fetchUserClassLessons = async (): Promise<ClassLesson[]> => {
  try {
    const query = qs.stringify(
      {
        fields: "*",
        populate: {
          teacher: {
            fields: "*"
          },
          syllabi: {
            fields: "*"
          },
          presentation: {
            fields: "*"
          },
          contestCycle: {
            fields: "*"
          },
          notesFromClass: {
            fields: "*"
          },
          contestPhase: {
            fields: "*"
          },
        },
        pagination: {
          pageSize: 1000,
        },
      },
      {
        encodeValuesOnly: true, // prettify URL
      }
    );
    const response = await axios.get(
      `${API_URL}/api/class-lessons?${query}`,
      getAuthHeaders()
    );
    return response.data.data
  } catch (error) {
    console.error("Error fetching class lessons:", error);
    throw error;
  }
};


// Helper function to get current user ID - aligned with auth-context
const getCurrentUserId = (): number => {
  const user = localStorageUtils.getItem<User>("user");
  // Convert the string ID to a number if needed
  return user ? parseInt(String(user.id), 10) : 0;
}; 