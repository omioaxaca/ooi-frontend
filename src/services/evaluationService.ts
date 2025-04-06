import axios from "axios";
import qs from "qs";
import * as localStorageUtils from "@/utils/localStorage";
import { User } from "@/types/user";
import type { Evaluation, EvaluationAttempt, NewEvaluationAttempt } from "@/types/dashboard/evaluations";

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
export const fetchUserEvaluations = async (): Promise<Evaluation[]> => {
  try {
    const query = qs.stringify(
      {
        fields: "*",
        populate: {
          questions: {
            fields: "*",
            populate: {
              answerOptions: {
                fields: "*",
              },
              photo: {
                fields: "name,url",
              },
            },
          },
          cover: {
            fields: "name,url",
          },
        },
      },
      {
        encodeValuesOnly: true, // prettify URL
      }
    );
    const response = await axios.get(
      `${API_URL}/api/evaluations?${query}`,
      getAuthHeaders()
    );
    return response.data.data
  } catch (error) {
    console.error("Error fetching evaluations:", error);
    throw error;
  }
};

// Fetch a single evaluation by ID with all its questions
export const fetchEvaluationById = async (id: string | number): Promise<Evaluation> => {
  try {
    const query = qs.stringify(
      {
        fields: "*",
        populate: {
          questions: {
            fields: "*",
            populate: {
              answerOptions: {
                fields: "*",
              },
              photo: {
                fields: "name,url",
              },
            },
          },
          cover: {
            fields: "name,url",
          },
        },
      },
      {
        encodeValuesOnly: true, // prettify URL
      }
    );
    const response = await axios.get(
      `${API_URL}/api/evaluations/${id}?${query}`, 
      getAuthHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching evaluation ${id}:`, error);
    throw error;
  }
};

// Fetch all evaluation attempts for the current user
export const fetchUserEvaluationAttempts = async (): Promise<EvaluationAttempt[]> => {
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
          answeredQuestions: {
            fields: "answerIdentifier, questionIdentifier"
          },
          contestCycle: {
            fields: "id"
          },
          evaluation: {
            fields: "id"
          }
        },
      },
      {
        encodeValuesOnly: true, // prettify URL
      }
    );
    const response = await axios.get(
      `${API_URL}/api/evaluation-attempts?${query}`,
      getAuthHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching evaluation attempts:", error);
    throw error;
  }
};

// Submit an evaluation attempt
export const submitEvaluationAttempt = async (NewEvaluationAttempt: NewEvaluationAttempt): Promise<EvaluationAttempt> => {
  try {
    const response = await axios.post(
      `${API_URL}/api/evaluation-attempts`,
      { data: NewEvaluationAttempt },
      getAuthHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error("Error submitting evaluation attempt:", error);
    throw error;
  }
};

// Helper function to get current user ID - aligned with auth-context
const getCurrentUserId = (): number => {
  const user = localStorageUtils.getItem<User>("user");
  // Convert the string ID to a number if needed
  return user ? user.id : 0;
}; 