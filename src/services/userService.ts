import axios from "axios";
import qs from "qs";
import * as localStorageUtils from "@/utils/localStorage";
import type { User, NewUser, LoggedUser, UpdateUser } from "@/types/user";
import axiosInstance from "./authService";
import { fetchCurrentContestCycle } from "./contestCycle";
import { createParticipation, getUserParticipationForCycle } from "./participation";

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
      Authorization: token ? `Bearer ${token}` : ""
    },
  };
};

export const getUserFullData = async (): Promise<User> => {
  try {
    const query = qs.stringify(
      {
        fields: "*",
        populate: {
          avatar: {
            fields: "*"
          }
        }
      },
      {
        encodeValuesOnly: true,
      }
    );

    const userResponse = await axiosInstance.get(
      `/api/users/me?${query}`
    );

    if (userResponse.status !== 200) {
      const data = userResponse.data
      const errorMessage = data.error.message
      throw new Error(errorMessage)
    }

    const userData = userResponse.data
    return userData
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

// Fetch all notifications for the current user
export const login = async (email: string, password: string): Promise<LoggedUser> => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/local`, {
      identifier: email,
      password: password,
      refreshToken: true
    });

    if (!response.data) {
      throw new Error("Login failed");
    }

    const loginData = response.data;
    const token = loginData.jwt;
    const refreshToken = loginData.refreshToken;

    // Save both tokens
    localStorageUtils.setItem("token", token);
    localStorageUtils.setItem("refreshToken", refreshToken);

    const userData = await getUserFullData();

    return {
      jwt: token,
      refreshToken: refreshToken,
      user: userData
    };
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const signup = async (newUser: NewUser): Promise<LoggedUser> => {
  try {
    // First, try normal registration
    const response = await axiosInstance.post(`${API_URL}/api/auth/local/register`, newUser);

    if (!response.data) {
      throw new Error("Signup failed");
    }

    const signupData = response.data;
    const token = signupData.jwt;
    const refreshToken = signupData.refreshToken;

    // Save both tokens so authenticated requests can be made
    localStorageUtils.setItem("token", token);
    if (refreshToken) {
      localStorageUtils.setItem("refreshToken", refreshToken);
    }

    // Get the user's full data
    const userData = await getUserFullData();

    // Register user in current contest cycle (cohort)
    await registerUserInCurrentCycle(userData.id);

    return {
      jwt: token,
      refreshToken: refreshToken,
      user: userData,
    };
  } catch (error) {
    // Check if the error is due to user already existing (email already taken)
    const isUserExistsError = isEmailAlreadyTakenError(error);

    if (isUserExistsError) {
      // User already exists - try to login and update their info
      return handleExistingUserSignup(newUser);
    }

    console.error("Signup failed:", error);
    throw error;
  }
};

/**
 * Checks if the error is due to email already being registered
 */
const isEmailAlreadyTakenError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;
    // Strapi typically returns this error message for duplicate emails
    const errorMessage = responseData?.error?.message?.toLowerCase() || "";
    return (
      errorMessage.includes("email") &&
      (errorMessage.includes("already") || errorMessage.includes("taken") || errorMessage.includes("registered"))
    ) || errorMessage.includes("email or username are already taken");
  }
  return false;
};

/**
 * Handles the signup flow for users who already have an account.
 * Logs them in, updates their information, and registers them in the current cycle.
 */
const handleExistingUserSignup = async (newUser: NewUser): Promise<LoggedUser> => {
  try {
    // Login with the provided credentials
    const loginResult = await login(newUser.email, newUser.password);

    // Prepare update data from the signup form (excluding email, username, password)
    const updateData: UpdateUser = {
      phoneNumber: newUser.phoneNumber,
      birthDate: newUser.birthDate,
      schoolName: newUser.schoolName,
      schoolLevel: newUser.schoolLevel,
      schoolGrade: newUser.schoolGrade,
      omegaupUserId: newUser.omegaupUserId,
      discordUserId: newUser.discordUserId,
      aboutYou: newUser.aboutYou,
      hobbies: newUser.hobbies,
      pastExperience: newUser.pastExperience,
    };

    // Update user information with the new data
    const updatedUser = await updateUser(loginResult.user.documentId, updateData);

    // Register user in current contest cycle (if not already registered)
    await registerUserInCurrentCycle(updatedUser.id);

    return {
      jwt: loginResult.jwt,
      refreshToken: loginResult.refreshToken,
      user: updatedUser,
    };
  } catch (loginError) {
    // If login fails (wrong password), throw a more specific error
    console.error("Existing user signup failed:", loginError);
    throw new Error(
      "Ya existe una cuenta con este correo electrónico. Por favor usa la contraseña correcta o inicia sesión directamente."
    );
  }
};

/**
 * Registers a user in the current contest cycle if not already registered.
 * Silently succeeds if user is already registered or if no cycle exists.
 */
const registerUserInCurrentCycle = async (userId: number): Promise<void> => {
  try {
    const currentCycle = await fetchCurrentContestCycle();

    if (!currentCycle) {
      console.warn("No current contest cycle found. User not registered in any cohort.");
      return;
    }

    // Check if user is already registered in current cycle
    const existingParticipation = await getUserParticipationForCycle(currentCycle.id);

    if (existingParticipation) {
      // User is already registered in current cycle, nothing to do
      console.log("User already registered in current contest cycle.");
      return;
    }

    // Create new participation for current cycle
    await createParticipation({
      user: userId,
      contestCycle: currentCycle.id,
      signupDate: new Date().toISOString(),
    });
  } catch (participationError) {
    // Log the error but don't fail the signup
    // The user can be manually registered in the cohort later
    console.error("Error registering user in current cycle:", participationError);
  }
};

export const updateUser = async (userId: string, newUserData: UpdateUser): Promise<User> => {
  try {
    const response = await axiosInstance.put(`/api/users/${userId}`, newUserData);

    if (!response.data) {
      throw new Error("Failed to update user");
    }

    const userData = await getUserFullData();
    return userData;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const updateAvatar = async (userId: string, avatar: File): Promise<User> => {
  try {
    const formData = new FormData();
    formData.append("files", avatar);
    formData.append("field", "avatar");
    formData.append("ref", "plugin::users-permissions.user");
    formData.append("refId", userId);

    // First upload the file
    const uploadResponse = await axiosInstance.post(`/api/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!uploadResponse.data) {
      throw new Error("Failed to upload avatar");
    }

    const uploadResult = uploadResponse.data;

    // Then update the user with the uploaded file ID
    const updateResponse = await axiosInstance.put(`/api/users/${userId}`, {
      avatar: uploadResult[0].id
    });

    if (!updateResponse.data) {
      throw new Error("Failed to update user avatar");
    }

    const userData = await getUserFullData();
    return userData;
  } catch (error) {
    console.error("Error updating avatar:", error);
    throw error;
  }
};