import qs from "qs";
import type { ContestCycle } from "@/types/dashboard/contestCycle";
import axiosInstance from "./authService";

/**
 * Fetches all contest cycles from the backend
 * @returns Array of all contest cycles
 */
export const fetchAllContestCycles = async (): Promise<ContestCycle[]> => {
  try {
    const query = qs.stringify(
      {
        fields: "*",
        populate: {
          posterImage: {
            fields: "*",
          },
        },
        sort: ["createdAt:desc"],
        pagination: {
          pageSize: 1000,
        },
      },
      {
        encodeValuesOnly: true,
      }
    );

    const response = await axiosInstance.get(`/api/contest-cycles?${query}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching contest cycles:", error);
    throw error;
  }
};

/**
 * Fetches a single contest cycle by its document ID
 * @param documentId - The document ID of the contest cycle
 * @returns The contest cycle data
 */
export const fetchContestCycleById = async (documentId: string): Promise<ContestCycle> => {
  try {
    const query = qs.stringify(
      {
        fields: "*",
        populate: {
          posterImage: {
            fields: "*",
          },
        },
      },
      {
        encodeValuesOnly: true,
      }
    );

    const response = await axiosInstance.get(`/api/contest-cycles/${documentId}?${query}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching contest cycle:", error);
    throw error;
  }
};

/**
 * Fetches the most recent contest cycle (current cohort)
 * This is determined by the most recently created contest cycle in the database
 * @returns The current/most recent contest cycle
 */
export const fetchCurrentContestCycle = async (): Promise<ContestCycle | null> => {
  try {
    const query = qs.stringify(
      {
        fields: "*",
        populate: {
          posterImage: {
            fields: "*",
          },
        },
        sort: ["createdAt:desc"],
        pagination: {
          pageSize: 1,
          page: 1,
        },
      },
      {
        encodeValuesOnly: true,
      }
    );

    const response = await axiosInstance.get(`/api/contest-cycles?${query}`);
    const cycles = response.data.data;

    if (cycles && cycles.length > 0) {
      return cycles[0];
    }

    return null;
  } catch (error) {
    console.error("Error fetching current contest cycle:", error);
    throw error;
  }
};

/**
 * Checks if signup is still open for a contest cycle
 * @param contestCycle - The contest cycle to check
 * @returns Boolean indicating if signup is still open
 */
export const isSignupOpen = (contestCycle: ContestCycle): boolean => {
  if (!contestCycle.signupDeadline) {
    return true; // If no deadline is set, signup is always open
  }

  const deadline = new Date(contestCycle.signupDeadline);
  const now = new Date();

  return now <= deadline;
};

