import axios from "axios";
import qs from "qs";
import * as localStorageUtils from "@/utils/localStorage";
import type { User, NewUser, LoggedUser, UpdateUser } from "@/types/user";

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
        encodeValuesOnly: true, // prettify URL
      }
    );

    const userResponse = await axios.get(
      `${API_URL}/api/users/me?${query}`,
      getAuthHeaders()
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
    // Call Strapi API to authenticate user
    const serverUrl = process.env.NEXT_PUBLIC_STRAPI_URL
    const response = await fetch(`${serverUrl}/api/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        identifier: email,
        password: password
      })
    })

    if (!response.ok) {
      const data = await response.json()
      const errorMessage = data.error.message
      throw new Error(errorMessage)
    }
    
    // get token from response
    const loginData = await response.json()
    const token = loginData.jwt

    // save token in local storage to retrieve full user data
    localStorageUtils.setItem("token", token)

    const userData = await getUserFullData()

    // Merge the user data with the response
    const mergedData = {
      jwt: token,
      user: userData
    }
    
    return mergedData
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const signup = async (newUser: NewUser): Promise<LoggedUser> => {
  try {
    const serverUrl = process.env.NEXT_PUBLIC_STRAPI_URL
    const response = await fetch(`${serverUrl}/api/auth/local/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser)
    })

    if (!response.ok) {
      const data = await response.json()
      const errorMessage = data.error.message
      throw new Error(errorMessage)
    }
        
    return await response.json()
  } catch (error) {
    console.error("Signup failed:", error)
    throw error
  }
}

export const updateUser = async (userId: string, newUserData: UpdateUser): Promise<User> => {
  try {
    const serverUrl = process.env.NEXT_PUBLIC_STRAPI_URL
    const response = await fetch(`${serverUrl}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        ...getAuthHeaders().headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserData)
    })

    if (!response.ok) {
      const data = await response.json()
      const errorMessage = data.error.message
      throw new Error(errorMessage)
    }

    const userData = await getUserFullData()

    return userData
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

export const updateAvatar = async (userId: string, avatar: File): Promise<User> => {
  try {
    const serverUrl = process.env.NEXT_PUBLIC_STRAPI_URL
    const formData = new FormData()
    formData.append("files", avatar)
    formData.append("field", "avatar")
    formData.append("ref", "plugin::users-permissions.user")
    formData.append("refId", userId)

    // First upload the file
    const uploadResponse = await fetch(`${serverUrl}/api/upload`, {
      method: "POST", 
      headers: getAuthHeaders().headers,
      body: formData
    })

    if (!uploadResponse.ok) {
      const data = await uploadResponse.json()
      const errorMessage = data.error.message
      throw new Error(errorMessage)
    }

    const uploadResult = await uploadResponse.json()

    // Then update the user with the uploaded file ID
    const updateResponse = await fetch(`${serverUrl}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        ...getAuthHeaders().headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        avatar: uploadResult[0].id
      })
    })

    if (!updateResponse.ok) {
      const data = await updateResponse.json()
      const errorMessage = data.error.message 
      throw new Error(errorMessage)
    }

    const userData = await getUserFullData()


    return userData
  } catch (error) {
    console.error("Error updating avatar:", error)
    throw error
  }
}