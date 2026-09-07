import { createStudyRepository, StudyContentError, studyLevels, type StudyGet, type TopicContent, type StudyGuide, type GuideNavigation, type StudyProblem } from "./study-content.ts";
import { renderRichContent, RichContentError, type RenderedContent } from "./safe-mdx.ts";
import { contentURL, parseProblemConstraints, safeWebURL, solveURL } from "./study-assets.ts";

export interface TopicPayload extends TopicContent {
  content: RenderedContent;
  descriptionContent: RenderedContent;
  referenceContent: RenderedContent;
}

export interface GuidePayload extends StudyGuide {
  content: RenderedContent;
  navigation: GuideNavigation;
}

export interface ProblemPayload extends StudyProblem {
  content: RenderedContent;
  constraintContent: RenderedContent;
  limits: { label: string; value: string }[];
  constraintNotice: string | null;
  solveUrl: string | null;
}

const responseHeaders = { "Cache-Control": "private, no-store", Vary: "Authorization" };

export function studyErrorResponse(error: unknown): Response {
  const failure = error as { response?: { status?: number }; status?: number };
  const upstreamStatus = failure?.response?.status ?? failure?.status;
  const status = upstreamStatus && [400, 401, 403, 404, 409, 422, 429, 503].includes(upstreamStatus) ? upstreamStatus : 502;
  let message = "No se pudo cargar el contenido. Intenta de nuevo.";
  if (status === 401) message = "Tu sesión expiró. Inicia sesión de nuevo.";
  else if (status === 403) message = "No tienes permiso para consultar este contenido. Solicita acceso al equipo de OOI.";
  else if (status === 404) message = "No se encontró este contenido en el servidor.";
  else if (error instanceof StudyContentError || error instanceof RichContentError) message = error.message;
  return Response.json({ error: { status, message } }, { status, headers: responseHeaders });
}

export async function serveStudyRequest(
  request: Request,
  segments: string[],
  getForRequest: (authorization: string, signal: AbortSignal) => StudyGet,
  apiBase?: string,
): Promise<Response> {
  try {
    const authorization = request.headers.get("authorization");
    if (!authorization || !/^Bearer [a-zA-Z0-9._~-]+$/.test(authorization)) throw new StudyContentError("Inicia sesión para estudiar.", 401);
    const repository = createStudyRepository(getForRequest(authorization, request.signal));
    const parameters = new URL(request.url).searchParams;
    const [resource, id] = segments;
    let data: unknown;
    if (segments.length === 1 && resource === "curriculum") {
      const selected = parameters.get("level");
      const level = studyLevels.find((entry) => entry.value === selected)?.value;
      if (selected && !level) throw new StudyContentError("Nivel no encontrado.", 404);
      data = await repository.curriculum(level);
    } else if (segments.length === 1 && resource === "directory") {
      data = await repository.directory({ category: parameters.get("category") ?? undefined, tag: parameters.get("tag") ?? undefined });
    } else if (segments.length === 2 && resource === "topics") {
      const topic = await repository.topic(id);
      const [content, descriptionContent, referenceContent] = await Promise.all([
        renderRichContent(topic.body, { format: "mdx", apiBase }),
        renderRichContent(topic.description, { format: "markdown", apiBase }),
        renderRichContent(topic.externalReferences, { format: "markdown", apiBase }),
      ]);
      data = {
        ...topic, content, descriptionContent, referenceContent,
        youtubeLinks: topic.youtubeLinks.map((url) => safeWebURL(url)).filter(Boolean),
        pdfLinks: topic.pdfLinks.map((url) => contentURL(url, false, { apiBase })).filter(Boolean),
      };
    } else if (segments.length === 2 && resource === "guides") {
      const guide = id === "legacy" ? await repository.legacyGuide(parameters.get("source") ?? "") : await repository.guide(id);
      const [content, navigation] = await Promise.all([
        renderRichContent(guide.body, { apiBase }), repository.guideNavigation(guide),
      ]);
      data = { ...guide, content, navigation };
    } else if (segments.length === 2 && resource === "problems") {
      const problem = await repository.problem(id);
      const constraints = parseProblemConstraints(problem.constraints, problem.photos, apiBase, problem.language);
      const [content, constraintContent] = await Promise.all([
        renderRichContent(problem.description, { ...constraints, format: "markdown" }),
        renderRichContent(constraints.prose, { ...constraints, format: "markdown" }),
      ]);
      data = {
        ...problem, content, constraintContent, limits: constraints.limits, constraintNotice: constraints.warning,
        solveUrl: solveURL(problem),
        photos: problem.photos.flatMap((photo) => {
          const url = contentURL(photo.url, true, constraints);
          return url ? [{ ...photo, url }] : [];
        }),
      };
    } else throw new StudyContentError("Contenido no encontrado.", 404);
    return Response.json({ data }, { headers: responseHeaders });
  } catch (error) {
    return studyErrorResponse(error);
  }
}