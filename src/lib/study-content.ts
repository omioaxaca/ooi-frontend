import qs from "qs";

export const studyLevels = [
  { value: "Principiante", slug: "beginner", color: "AZUL", name: "Azul" },
  { value: "Intermedio", slug: "intermediate", color: "AMARILLO", name: "Amarillo" },
  { value: "Avanzado", slug: "advanced", color: "VERDE", name: "Verde" },
] as const;

export type StudyLevelValue = (typeof studyLevels)[number]["value"];

export interface StudyCategory {
  documentId: string;
  name: string;
  description: string;
  color: string;
}

export interface TopicSummary {
  documentId: string;
  title: string;
  description: string;
  level: StudyLevelValue;
  rank: number;
  category: StudyCategory | null;
}

export interface GuideSummary {
  documentId: string;
  title: string;
  description: string;
  author: string;
  createdDate: string | null;
  tags: string[];
  sourcePaths: string[];
  syllabus: TopicSummary | null;
}

export interface StudyGuide extends GuideSummary {
  body: string;
}

export interface StudyPhoto {
  url: string;
  name: string;
  alternativeText: string;
}

export interface ProblemSummary {
  documentId: string;
  title: string;
  difficulty: "easy" | "medium" | "hard" | null;
  platform: "OMEGAUP" | "LEETCODE" | "CSES" | "CODEFORCES" | "USACO" | "UVA" | null;
  language: string;
  qualitySeal: boolean;
  externalProblemId: string;
  alias: string;
  sourceURL: string;
  tags: string[];
  syllabi: TopicSummary[];
}

export interface StudyProblem extends ProblemSummary {
  description: string;
  constraints: string;
  photos: StudyPhoto[];
}

export class StudyContentError extends Error {
  status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.name = "StudyContentError";
    this.status = status;
  }
}

type RecordValue = Record<string, unknown>;
export type StudyGet = (url: string) => Promise<unknown>;

function record(value: unknown): RecordValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new StudyContentError("Respuesta de contenido inválida.");
  }
  return value as RecordValue;
}

function text(value: unknown): string {
  if (value == null) return "";
  if (typeof value !== "string") throw new StudyContentError("Se esperaba contenido de texto.");
  return value;
}

function document(value: unknown): RecordValue & { documentId: string } {
  const data = record(value);
  if (typeof data.documentId !== "string" || !data.documentId || "attributes" in data) {
    throw new StudyContentError("Se esperaba un documento de Strapi 5 con documentId.");
  }
  return data as RecordValue & { documentId: string };
}

function relation(data: RecordValue, key: string): unknown {
  if (!(key in data)) {
    throw new StudyContentError(`No se recibió la relación ${key}. Revisa populate y los permisos de lectura.`);
  }
  return data[key];
}

function array(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw new StudyContentError("Se esperaba una relación o componente de tipo lista.");
  return value;
}

export function isMigrationTag(tag: string): boolean {
  return tag === "study-guide-import-v1" || tag.startsWith("study-guide-source:") ||
    tag === "omegaup-syllabus-import-v1" || tag.startsWith("omegaup-syllabus-link-v1:");
}

export function sourcePath(value: string): string | null {
  const relative = value.replace(/^content\/docs\//, "");
  if (!/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\.(mdx|md)$/.test(relative)) return null;
  return relative;
}

export function normalizeTags(value: unknown): { tags: string[]; sourcePaths: string[] } {
  const values = array(value).map((component) => text(record(component).value)).filter(Boolean);
  return {
    tags: [...new Set(values.filter((tag) => !isMigrationTag(tag)))],
    sourcePaths: [...new Set(values.filter((tag) => tag.startsWith("study-guide-source:"))
      .map((tag) => sourcePath(tag.slice("study-guide-source:".length)))
      .filter((tag): tag is string => tag !== null))],
  };
}

export function normalizeTopic(value: unknown): TopicSummary {
  const data = document(value);
  const level = studyLevels.find((entry) => entry.value === data.level)?.value;
  if (!level) throw new StudyContentError("El tema tiene un nivel desconocido.");
  const rawCategory = relation(data, "category");
  const category = rawCategory == null ? null : document(rawCategory);
  const color = category ? text(category.color) : "";
  return {
    documentId: data.documentId,
    title: text(data.title),
    description: text(data.description),
    level,
    rank: typeof data.rank === "number" ? data.rank : 0,
    category: category ? {
      documentId: category.documentId,
      name: text(category.name),
      description: text(category.description),
      color: /^#[0-9a-f]{6}$/i.test(color) ? color : "#64748b",
    } : null,
  };
}

export function normalizeGuide(value: unknown): GuideSummary {
  const data = document(value);
  const parent = relation(data, "syllabus");
  const date = text(data.createdDate);
  return {
    documentId: data.documentId,
    title: text(data.title),
    description: text(data.description),
    author: text(data.author),
    createdDate: date && Number.isFinite(Date.parse(date)) ? date : null,
    ...normalizeTags(relation(data, "tags")),
    syllabus: parent == null ? null : normalizeTopic(parent),
  };
}

export function normalizeGuideDetail(value: unknown): StudyGuide {
  return { ...normalizeGuide(value), body: text(record(value).body) };
}

export function uniqueDocuments<Document extends { documentId: string }>(values: Document[]): Document[] {
  return [...new Map(values.map((value) => [value.documentId, value])).values()];
}

export function normalizeProblem(value: unknown): ProblemSummary {
  const data = document(value);
  const difficulties = ["easy", "medium", "hard"] as const;
  const platforms = ["OMEGAUP", "LEETCODE", "CSES", "CODEFORCES", "USACO", "UVA"] as const;
  return {
    documentId: data.documentId,
    title: text(data.title),
    difficulty: difficulties.find((value) => value === data.difficulty) ?? null,
    platform: platforms.find((value) => value === data.platform) ?? null,
    language: text(data.language),
    qualitySeal: data.qualitySeal === true,
    externalProblemId: text(data.externalProblemId),
    alias: text(data.alias),
    sourceURL: text(data.sourceURL),
    tags: normalizeTags(relation(data, "tags")).tags,
    syllabi: uniqueDocuments(array(relation(data, "syllabi")).map(normalizeTopic)),
  };
}

export function normalizeProblemDetail(value: unknown): StudyProblem {
  const data = document(value);
  return {
    ...normalizeProblem(data),
    description: text(data.description),
    constraints: text(data.constraints),
    photos: array(relation(data, "photos")).map((value) => {
      const photo = record(value);
      return { url: text(photo.url), name: text(photo.name), alternativeText: text(photo.alternativeText) };
    }),
  };
}

export async function fetchStudyCollection<T extends { documentId: string }>(
  get: StudyGet, collection: string, query: RecordValue, normalize: (value: unknown) => T,
): Promise<T[]> {
  const values: T[] = [];
  for (let page = 1; ; page++) {
    const response = record(await get(`/api/${collection}?${qs.stringify({
      ...query, pagination: { page, pageSize: 100, withCount: true },
    }, { encodeValuesOnly: true })}`));
    const entries = array(response.data);
    const pagination = record(record(response.meta).pagination);
    const pageCount = pagination.pageCount;
    if (typeof pageCount !== "number" || !Number.isInteger(pageCount) || pageCount < 0 || pagination.page !== page) {
      throw new StudyContentError("No se pudo verificar la paginación del contenido.");
    }
    values.push(...entries.map(normalize));
    if (page >= pageCount) return uniqueDocuments(values);
    if (entries.length === 0) throw new StudyContentError("La paginación devolvió una página incompleta.");
  }
}

export function guideHref(guide: Pick<GuideSummary, "documentId">): string {
  return `/dashboard/syllabus/guides/${encodeURIComponent(guide.documentId)}`;
}

export function problemHref(problem: Pick<ProblemSummary, "documentId">, topic?: string): string {
  const href = `/dashboard/syllabus/problems/${encodeURIComponent(problem.documentId)}`;
  return topic ? `${href}?tema=${encodeURIComponent(topic)}` : href;
}

export function topicHref(topic: Pick<TopicSummary, "documentId">): string {
  return `/dashboard/syllabus/topics/${encodeURIComponent(topic.documentId)}`;
}

export function levelHref(level: StudyLevelValue): string {
  return `/dashboard/syllabus/${studyLevels.find((entry) => entry.value === level)!.slug}`;
}

export function legacyLevelDestination(color?: string): string {
  if (color?.toLowerCase() === "misc") return "/dashboard/syllabus/library";
  const level = studyLevels.find((entry) => entry.color.toLowerCase() === color?.toLowerCase()) ?? studyLevels[0];
  return levelHref(level.value);
}

export function legacyGuideDestination(category: string, slug: string): string | null {
  const source = sourcePath(`${category}/${slug}.mdx`);
  return source ? `/dashboard/syllabus/guides/legacy?source=${encodeURIComponent(source)}` : null;
}

export function orderRelated<T extends { documentId: string }>(values: T[], references: unknown): T[] {
  const order = array(references).map((value) => document(value).documentId);
  const byId = new Map(uniqueDocuments(values).map((value) => [value.documentId, value]));
  const ordered: T[] = [];
  for (const id of order) {
    const value = byId.get(id);
    if (value) { ordered.push(value); byId.delete(id); }
  }
  return [...ordered, ...byId.values()];
}

export function groupStudyTopics(topics: TopicSummary[]) {
  const groups = new Map<string, { category: StudyCategory | null; topics: TopicSummary[] }>();
  for (const topic of topics) {
    const key = topic.category?.documentId ?? "uncategorized";
    if (!groups.has(key)) groups.set(key, { category: topic.category, topics: [] });
    groups.get(key)!.topics.push(topic);
  }
  return [...groups.values()];
}

export interface TopicContent extends TopicSummary {
  body: string;
  externalReferences: string;
  youtubeLinks: string[];
  pdfLinks: string[];
  guides: GuideSummary[];
  problems: ProblemSummary[];
}

export interface GuideNavigation {
  curriculum: TopicSummary[];
  siblings: GuideSummary[];
  previous: GuideSummary | null;
  next: GuideSummary | null;
}

const topicFields = ["title", "description", "level", "rank"];
const categoryPopulate = { fields: ["name", "description", "color"] };
const parentPopulate = { fields: topicFields, populate: { category: categoryPopulate } };
const tagPopulate = { fields: ["value"] };
const guideFields = ["title", "description", "author", "createdDate"];
const guidePopulate = { tags: tagPopulate, syllabus: parentPopulate };
const problemFields = ["title", "difficulty", "platform", "language", "qualitySeal", "externalProblemId", "alias", "sourceURL"];
const problemPopulate = { tags: tagPopulate, syllabi: parentPopulate };

export function createStudyRepository(get: StudyGet) {
  const queryURL = (collection: string, query: RecordValue, id?: string) => {
    if (id !== undefined && !/^[a-zA-Z0-9_-]{1,200}$/.test(id)) throw new StudyContentError("Documento no encontrado.", 404);
    return `/api/${collection}${id ? `/${encodeURIComponent(id)}` : ""}?${qs.stringify(query, { encodeValuesOnly: true })}`;
  };
  const single = async (collection: string, id: string, query: RecordValue) => {
    const result = record(await get(queryURL(collection, query, id)));
    if (result.data === null) throw new StudyContentError("Documento no encontrado.", 404);
    return document(result.data);
  };
  const curriculum = async (level?: StudyLevelValue, filters: RecordValue = {}) => {
    const topics = await fetchStudyCollection(get, "syllabi", {
      fields: topicFields,
      populate: { category: categoryPopulate },
      filters: { ...filters, ...(level ? { level: { $eq: level } } : {}) },
      sort: ["rank:asc", "documentId:asc"],
    }, normalizeTopic);
    return topics.sort((first, second) =>
      studyLevels.findIndex((entry) => entry.value === first.level) - studyLevels.findIndex((entry) => entry.value === second.level) ||
      first.rank - second.rank || first.documentId.localeCompare(second.documentId));
  };
  const guides = (filters: RecordValue) => fetchStudyCollection(get, "study-guides", {
    fields: guideFields, populate: guidePopulate, filters, sort: ["createdDate:asc", "documentId:asc"],
  }, normalizeGuide);
  const topicRecord = (id: string, details: boolean) => single("syllabi", id, {
    fields: details ? [...topicFields, "body", "externalReferences"] : topicFields,
    populate: {
      category: categoryPopulate,
      studyGuides: { fields: ["documentId"] },
      ...(details ? { problems: { fields: ["documentId"] }, youtubeLinks: tagPopulate, pdfLinks: tagPopulate } : {}),
    },
  });
  const topicGuides = async (id: string) => {
    const [topic, related] = await Promise.all([
      topicRecord(id, false), guides({ syllabus: { documentId: { $eq: id } } }),
    ]);
    return orderRelated(related, relation(topic, "studyGuides"));
  };
  const guide = async (id: string) => normalizeGuideDetail(await single("study-guides", id, {
    fields: [...guideFields, "body"], populate: guidePopulate,
  }));

  return {
    curriculum,
    async topic(id: string): Promise<TopicContent> {
      const [data, relatedGuides, relatedProblems] = await Promise.all([
        topicRecord(id, true),
        guides({ syllabus: { documentId: { $eq: id } } }),
        fetchStudyCollection(get, "problems", {
          fields: problemFields, populate: problemPopulate,
          filters: { syllabi: { documentId: { $eq: id } } }, sort: ["documentId:asc"],
        }, normalizeProblem),
      ]);
      return {
        ...normalizeTopic(data), body: text(data.body), externalReferences: text(data.externalReferences),
        youtubeLinks: array(relation(data, "youtubeLinks")).map((value) => text(record(value).value)).filter(Boolean),
        pdfLinks: array(relation(data, "pdfLinks")).map((value) => text(record(value).value)).filter(Boolean),
        guides: orderRelated(relatedGuides, relation(data, "studyGuides")),
        problems: orderRelated(relatedProblems, relation(data, "problems")),
      };
    },
    guide,
    async legacyGuide(path: string): Promise<StudyGuide> {
      const source = sourcePath(path);
      if (!source) throw new StudyContentError("Guía no encontrada.", 404);
      const stem = source.replace(/\.(md|mdx)$/, "");
      const tags = ["mdx", "md"].flatMap((extension) => [
        `study-guide-source:${stem}.${extension}`, `study-guide-source:content/docs/${stem}.${extension}`,
      ]);
      const matches = await guides({ tags: { value: { $in: tags } } });
      if (!matches.length) throw new StudyContentError("Esta guía todavía no está disponible en el servidor.", 404);
      if (matches.length !== 1) throw new StudyContentError("Hay más de una guía asociada a esta URL. Revisa la importación.", 409);
      return guide(matches[0].documentId);
    },
    async directory(filter: { category?: string; tag?: string } = {}): Promise<GuideSummary[]> {
      if (filter.tag) {
        if (isMigrationTag(filter.tag)) throw new StudyContentError("Etiqueta no encontrada.", 404);
        return guides({ tags: { value: { $eq: filter.tag } } });
      }
      if (filter.category) {
        if (!/^[a-zA-Z0-9_-]+$/.test(filter.category)) throw new StudyContentError("Categoría no encontrada.", 404);
        return guides({ $or: [
          { tags: { value: { $startsWith: `study-guide-source:${filter.category}/` } } },
          { tags: { value: { $startsWith: `study-guide-source:content/docs/${filter.category}/` } } },
        ] });
      }
      return guides({ syllabus: { documentId: { $null: true } } });
    },
    async guideNavigation(current: StudyGuide): Promise<GuideNavigation> {
      const topics = await curriculum();
      const siblings = current.syllabus ? await topicGuides(current.syllabus.documentId)
        : await guides({ syllabus: { documentId: { $null: true } } });
      const index = siblings.findIndex((entry) => entry.documentId === current.documentId);
      if (index === -1) throw new StudyContentError("No se pudo verificar la relación de la guía con su tema.");
      let previous: GuideSummary | null = siblings[index - 1] ?? null;
      let next: GuideSummary | null = siblings[index + 1] ?? null;
      const position = topics.findIndex((topic) => topic.documentId === current.syllabus?.documentId);
      if (current.syllabus && position === -1) throw new StudyContentError("No se pudo cargar el tema de la guía.");
      if (current.syllabus) {
        for (let cursor = position - 1; cursor >= 0 && !previous; cursor--) {
          const related = await topicGuides(topics[cursor].documentId);
          previous = related.at(-1) ?? null;
        }
        for (let cursor = position + 1; cursor < topics.length && !next; cursor++) {
          const related = await topicGuides(topics[cursor].documentId);
          next = related[0] ?? null;
        }
        if (!next) next = (await guides({ syllabus: { documentId: { $null: true } } }))[0] ?? null;
      } else if (!previous) {
        for (let cursor = topics.length - 1; cursor >= 0 && !previous; cursor--) {
          previous = (await topicGuides(topics[cursor].documentId)).at(-1) ?? null;
        }
      }
      return { curriculum: topics, siblings, previous, next };
    },
    async problem(id: string): Promise<StudyProblem> {
      const [data, parents] = await Promise.all([
        single("problems", id, {
          fields: [...problemFields, "description", "constraints"],
          populate: { ...problemPopulate, photos: { fields: ["url", "name", "alternativeText"] } },
        }),
        curriculum(undefined, { problems: { documentId: { $eq: id } } }),
      ]);
      return { ...normalizeProblemDetail(data), syllabi: parents };
    },
  };
}