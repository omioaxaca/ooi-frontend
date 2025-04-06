import axios from "axios";
import qs from "qs";
import * as localStorageUtils from "@/utils/localStorage";
import type { Notification, NotificationView } from "@/types/dashboard/notification";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

// Helper to get auth token - aligned with auth-context implementation
const getToken = (): string | null => {
  return localStorageUtils.getItem<string>("token") || null;
};

export const mapBackendNotificationToFrontendNotification = (notification: Notification): NotificationView => {
  return {
    id: notification.id,
    documentId: notification.documentId,
    title: notification.title,
    description: notification.description,
    initialDate: notification.initialDate,
    finalDate: notification.finalDate,
    pinned: notification.pinned,
    priority: notification.priority,
    contestCycle: notification.contestCycle.name,
    redirectionURL: notification.redirectionURL,
  };
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

// Fetch all notifications for the current user
export const fetchUserNotifications = async (): Promise<Notification[]> => {
  try {
    const query = qs.stringify(
      {
        fields: "*",
        populate: {
          contestCycle: {
            fields: "*",
          },
        },
        sort: ["createdAt:desc"],
        pagination: {
          pageSize: 1000,
        },
      },
      {
        encodeValuesOnly: true, // prettify URL
      }
    );
    const response = await axios.get(
      `${API_URL}/api/notifications?${query}`,
      getAuthHeaders()
    );
    return response.data.data
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};