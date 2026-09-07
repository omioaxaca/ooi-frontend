import { isAxiosError } from "axios";
import axiosInstance from "./authService.ts";

export class StudyRequestError extends Error {
  status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.name = "StudyRequestError";
    this.status = status;
  }
}

export async function fetchStudyData<T>(
  path: string,
  signal?: AbortSignal,
): Promise<T> {
  try {
    const response = await axiosInstance.get<{ data: T }>(
      `/api/study/${path}`,
      { baseURL: "", signal },
    );
    if (response.data?.data == null)
      throw new StudyRequestError(
        "El servidor devolvió una respuesta de contenido inválida.",
      );
    return response.data.data;
  } catch (error) {
    if (signal?.aborted) throw error;
    if (error instanceof StudyRequestError) throw error;
    if (isAxiosError(error)) {
      const message = error.response?.data?.error?.message;
      throw new StudyRequestError(
        typeof message === "string"
          ? message
          : "No se pudo cargar el contenido. Intenta de nuevo.",
        error.response?.status,
      );
    }
    throw new StudyRequestError(
      "No se pudo cargar el contenido. Intenta de nuevo.",
    );
  }
}
