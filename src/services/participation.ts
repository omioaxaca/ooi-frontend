import qs from "qs";
import { jwtDecode } from "jwt-decode";
import * as localStorageUtils from "@/utils/localStorage";
import type {
  Participation,
  CreateParticipationData,
  ParticipationListItem
} from "@/types/dashboard/participation";
import axiosInstance from "./authService";

interface DecodedToken {
  id: number;
}

/**
 * Gets the current authenticated user's ID from the JWT token
 */
const getCurrentUserId = (): number | null => {
  const token = localStorageUtils.getItem<string>("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.id;
  } catch {
    return null;
  }
};

/**
 * Fetches all participations for the current user
 * @returns Array of user's participations across all contest cycles
 */
export const fetchUserParticipations = async (): Promise<ParticipationListItem[]> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error("No authenticated user found");
    }

    const query = qs.stringify(
      {
        fields: "*",
        populate: {
          contestCycle: {
            fields: "*",
            populate: {
              posterImage: {
                fields: "*",
              },
            },
          },
        },
        filters: {
          user: {
            id: {
              $eq: userId,
            },
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

    const response = await axiosInstance.get(`/api/participations?${query}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user participations:", error);
    throw error;
  }
};

/**
 * Fetches a single participation by its document ID
 * @param documentId - The document ID of the participation
 * @returns The participation data
 */
export const fetchParticipationById = async (documentId: string): Promise<Participation> => {
  try {
    const query = qs.stringify(
      {
        fields: "*",
        populate: {
          contestCycle: {
            fields: "*",
            populate: {
              posterImage: {
                fields: "*",
              },
            },
          },
          user: {
            fields: "*",
          },
        },
      },
      {
        encodeValuesOnly: true,
      }
    );

    const response = await axiosInstance.get(`/api/participations/${documentId}?${query}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching participation:", error);
    throw error;
  }
};

/**
 * Checks if the user has a participation in a specific contest cycle
 * @param contestCycleId - The ID of the contest cycle to check
 * @returns The participation if exists, null otherwise
 */
export const getUserParticipationForCycle = async (
  contestCycleId: number
): Promise<ParticipationListItem | null> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error("No authenticated user found");
    }

    const query = qs.stringify(
      {
        fields: "*",
        populate: {
          contestCycle: {
            fields: "*",
          },
        },
        filters: {
          user: {
            id: {
              $eq: userId,
            },
          },
          contestCycle: {
            id: {
              $eq: contestCycleId,
            },
          },
        },
        pagination: {
          pageSize: 1,
        },
      },
      {
        encodeValuesOnly: true,
      }
    );

    const response = await axiosInstance.get(`/api/participations?${query}`);
    const participations = response.data.data;

    if (participations && participations.length > 0) {
      return participations[0];
    }

    return null;
  } catch (error) {
    console.error("Error checking user participation for cycle:", error);
    throw error;
  }
};

/**
 * Checks if the user is registered in the current (most recent) contest cycle
 * @param currentCycleId - The ID of the current contest cycle
 * @returns Boolean indicating if user is registered in current cycle
 */
export const isUserRegisteredInCurrentCycle = async (
  currentCycleId: number
): Promise<boolean> => {
  const participation = await getUserParticipationForCycle(currentCycleId);
  return participation !== null;
};

/**
 * Creates a new participation for a user in a contest cycle
 * @param data - The participation data to create
 * @returns The created participation
 */
export const createParticipation = async (
  data: CreateParticipationData
): Promise<Participation> => {
  try {
    const response = await axiosInstance.post(`/api/participations`, {
      data: {
        ...data,
        signupDate: data.signupDate || new Date().toISOString(),
        diagnosticExamDone: data.diagnosticExamDone ?? false,
        isStateWinner: data.isStateWinner ?? false,
        isStateFinalist: data.isStateFinalist ?? false,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Error creating participation:", error);
    throw error;
  }
};

/**
 * Registers a user in the current contest cycle
 * This is a convenience method that fetches the current cycle and creates the participation
 * @param userId - The ID of the user to register
 * @param currentCycleId - The ID of the current contest cycle
 * @returns The created participation
 */
export const registerUserInCurrentCycle = async (
  userId: number,
  currentCycleId: number
): Promise<Participation> => {
  // Check if user is already registered
  const existingParticipation = await getUserParticipationForCycle(currentCycleId);

  if (existingParticipation) {
    throw new Error("User is already registered in this contest cycle");
  }

  return createParticipation({
    user: userId,
    contestCycle: currentCycleId,
    signupDate: new Date().toISOString(),
  });
};

/**
 * Gets the user's current participation (for the most recent contest cycle)
 * @param currentCycleId - The ID of the current contest cycle
 * @returns The user's participation in the current cycle, or null if not registered
 */
export const getCurrentParticipation = async (
  currentCycleId: number
): Promise<ParticipationListItem | null> => {
  return getUserParticipationForCycle(currentCycleId);
};
