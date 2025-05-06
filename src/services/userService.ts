import axios from "axios";
import qs from "qs";
import * as localStorageUtils from "@/utils/localStorage";
import type { User, NewUser, LoggedUser, UpdateUser } from "@/types/user";
import axiosInstance from "./authService";

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
    const response = await axiosInstance.post(`/api/auth/local/register`, newUser);
    
    if (!response.data) {
      throw new Error("Signup failed");
    }
    
    return response.data;
  } catch (error) {
    console.error("Signup failed:", error);
    throw error;
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