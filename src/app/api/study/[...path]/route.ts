import axiosInstance from "@/services/authService";
import { serveStudyRequest, studyErrorResponse } from "@/lib/study-api";
import { StudyContentError } from "@/lib/study-content";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const apiBase = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!apiBase)
    return studyErrorResponse(
      new StudyContentError(
        "El servidor de contenido no está configurado.",
        503,
      ),
    );
  const { path } = await params;
  return serveStudyRequest(
    request,
    path,
    (authorization, signal) => async (url) => {
      const response = await axiosInstance.get(url, {
        baseURL: apiBase,
        headers: { Authorization: authorization },
        signal,
        timeout: 15000,
        maxRedirects: 0,
      });
      return response.data;
    },
    apiBase,
  );
}
