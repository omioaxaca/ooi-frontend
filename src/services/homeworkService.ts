import axios from "axios";
import qs from "qs";
import * as localStorageUtils from "@/utils/localStorage";
import { User } from "@/types/user";
import type { Homework, HomeworkAttempt, NewHomeworkAttempt } from "@/types/dashboard/homework";

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

// Fetch all evaluations for the current user
export const fetchUserHomeworks = async (): Promise<Homework[]> => {
  try {
    const query = qs.stringify(
      {
        fields: "*",
        populate: {
          classLesson: {
            fields: "*",
          },
          contestCycle: {
            fields: "*",
          },
          files: {
            fields: "name,url",
          },
        },
      },
      {
        encodeValuesOnly: true, // prettify URL
      }
    );
    const response = await axios.get(
      `${API_URL}/api/homeworks?${query}`,
      getAuthHeaders()
    );
    return response.data.data
  } catch (error) {
    console.error("Error fetching homeworks:", error);
    throw error;
  }
};

// Fetch a single homework by ID
export const fetchHomeworkById = async (id: string | number): Promise<Homework> => {
  try {
    const query = qs.stringify(
      {
        fields: "*",
        populate: {
          classLesson: {
            fields: "*",
          },
          contestCycle: {
            fields: "*",
          },
          files: {
            fields: "name,url",
          },
        },
      },
      {
        encodeValuesOnly: true, // prettify URL
      }
    );
    const response = await axios.get(
      `${API_URL}/api/homeworks/${id}?${query}`, 
      getAuthHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching homework ${id}:`, error);
    throw error;
  }
};

// Fetch all homework attempts for the current user
export const fetchUserHomeworkAttempts = async (): Promise<HomeworkAttempt[]> => {
  const userId = getCurrentUserId();
  try {
    const query = qs.stringify(
      {
        filters: {
          user: {
            $eq: userId
          }
        },
        fields: "*",
        populate: {
          user: {
            fields: "id"
          },
          deliveredFiles: {
            fields: "name,url"
          },
          contestCycle: {
            fields: "id"
          },
          homework: {
            fields: "id"
          }
        },
      },
      {
        encodeValuesOnly: true, // prettify URL
      }
    );
    const response = await axios.get(
      `${API_URL}/api/homework-attempts?${query}`,
      getAuthHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching homework attempts:", error);
    throw error;
  }
};

// Interface for Strapi file upload response
interface StrapiUploadFile {
  id: number;
  name: string;
  url: string;
  [key: string]: unknown;
}

// Submit an homework attempt
export const submitHomeworkAttempt = async (
  homeworkData: NewHomeworkAttempt, 
  files: File[]
): Promise<HomeworkAttempt> => {
  try {
    const authHeaders = getAuthHeaders();
    
    // Step 1: Upload the files first
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    // Upload files to Strapi's upload endpoint
    const uploadResponse = await axios.post<StrapiUploadFile[]>(
      `${API_URL}/api/upload`,
      formData,
      {
        headers: {
          ...authHeaders.headers,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    // Step 2: Get the file IDs from the response
    const fileIds = uploadResponse.data.map((file: StrapiUploadFile) => file.id);
    
    // Step 3: Create the homework attempt with the file IDs
    const response = await axios.post(
      `${API_URL}/api/homework-attempts`,
      { 
        data: {
          ...homeworkData,
          deliveredFiles: fileIds,
        } 
      },
      authHeaders
    );
    
    return response.data.data;
  } catch (error) {
    console.error("Error submitting homework attempt:", error);
    throw error;
  }
};

// Helper function to get current user ID - aligned with auth-context
const getCurrentUserId = (): number => {
  const user = localStorageUtils.getItem<User>("user");
  // Convert the string ID to a number if needed
  return user ? user.id : 0;
}; 