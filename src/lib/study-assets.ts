import type { ProblemSummary, StudyPhoto } from "./study-content";

export interface AssetContext {
  apiBase?: string;
  statementBase?: string;
  assets?: Record<string, string>;
}

export function safeWebURL(value: string, base?: string): string | null {
  if (!value || /[\u0000-\u0020\u007f\\]/.test(value)) return null;
  try {
    const url = base ? new URL(value, base) : new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function contentURL(value: string, image = false, context: AssetContext = {}): string | null {
  if (/[\u0000-\u0020\u007f\\]/.test(value)) return null;
  if (!image && value.startsWith("#")) return value;
  const mapped = context.assets && Object.hasOwn(context.assets, value) ? context.assets[value] : undefined;
  if (mapped) return safeWebURL(mapped, context.apiBase);
  if (value.startsWith("/uploads/")) return safeWebURL(value, context.apiBase);
  if (value.startsWith("/") && !value.startsWith("//")) {
    if (!image || value.startsWith("/images/")) return value;
  }
  if (/^https?:\/\//i.test(value)) return safeWebURL(value);
  if (context.statementBase && !value.startsWith("//")) return safeWebURL(value, context.statementBase);
  return null;
}

export function solveURL(problem: Pick<ProblemSummary, "platform" | "sourceURL" | "alias" | "externalProblemId">): string | null {
  if (problem.sourceURL) return safeWebURL(problem.sourceURL);
  const identifier = problem.alias || problem.externalProblemId;
  if (!identifier || !/^[a-zA-Z0-9_-]+$/.test(identifier)) return null;
  if (problem.platform === "OMEGAUP") return `https://omegaup.com/arena/problem/${encodeURIComponent(identifier)}/`;
  if (problem.platform === "LEETCODE") return `https://leetcode.com/problems/${encodeURIComponent(identifier)}/`;
  if (problem.platform === "CSES" && /^\d+$/.test(identifier)) return `https://cses.fi/problemset/task/${identifier}/`;
  const codeforces = /^(\d+)([A-Za-z]\d*)$/.exec(identifier);
  if (problem.platform === "CODEFORCES" && codeforces) return `https://codeforces.com/problemset/problem/${codeforces[1]}/${codeforces[2].toUpperCase()}`;
  return null;
}

export function dashboardReturnPath(value: string | null): string {
  if (!value || !/^\/dashboard(?:\/|\?|#|$)/.test(value) || /[\u0000-\u0020\u007f\\]/.test(value)) return "/dashboard";
  try {
    const parsed = new URL(value, "https://return.invalid");
    return parsed.origin === "https://return.invalid" ? `${parsed.pathname}${parsed.search}${parsed.hash}` : "/dashboard";
  } catch {
    return "/dashboard";
  }
}

export interface ProblemConstraints extends AssetContext {
  limits: { label: string; value: string }[];
  prose: string;
  warning: string | null;
}

function object(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

export function parseProblemConstraints(source: string, photos: StudyPhoto[] = [], apiBase?: string, language = ""): ProblemConstraints {
  const assets: Record<string, string> = Object.create(null);
  const result: ProblemConstraints = { limits: [], prose: "", warning: null, assets, apiBase };
  const addAsset = (name: string, value: string) => {
    const url = safeWebURL(value, apiBase);
    if (!url || !name || name === "__proto__" || name === "constructor") return;
    assets[name] = url;
    assets[name.replace(/^\.\//, "")] = url;
    const basename = name.split("/").at(-1);
    if (basename && !Object.hasOwn(assets, basename)) assets[basename] = url;
  };
  for (const photo of photos) {
    addAsset(photo.name, photo.url);
    addAsset(photo.url, photo.url);
  }
  const trimmed = source.trim();
  if (!trimmed) return result;
  if (!/^[{[]/.test(trimmed)) return { ...result, prose: source };
  let imported: Record<string, unknown> | null;
  try {
    imported = object(JSON.parse(trimmed));
  } catch {
    return { ...result, warning: "No se pudieron interpretar los límites importados." };
  }
  if (!imported) return { ...result, warning: "El formato de los límites no es compatible." };
  const settings = object(imported.settings);
  const limits = object(imported.limits) ?? object(settings?.limits) ?? {};
  const knownLimits: [string[], string, "ms" | "bytes" | "raw"][] = [
    [["TimeLimit", "time_limit_ms", "timeLimit"], "Tiempo", "ms"],
    [["OverallWallTimeLimit", "wall_time_limit_ms"], "Tiempo total", "ms"],
    [["MemoryLimit", "memory_limit_bytes", "memoryLimit"], "Memoria", "bytes"],
    [["OutputLimit", "output_limit_bytes"], "Salida máxima", "bytes"],
    [["time_limit", "tiempo"], "Tiempo", "raw"],
    [["memory_limit", "memoria"], "Memoria", "raw"],
  ];
  for (const [keys, label, unit] of knownLimits) {
    const value = keys.map((key) => limits[key]).find((value) => typeof value === "string" || typeof value === "number");
    if (value === undefined || result.limits.some((limit) => limit.label === label)) continue;
    if (typeof value === "number" && (!Number.isFinite(value) || value < 0)) continue;
    let formatted = String(value).slice(0, 120);
    if (typeof value === "number" && unit === "ms") formatted = `${value} ms`;
    if (typeof value === "number" && unit === "bytes") formatted = value >= 1048576 ? `${Math.round(value / 1048576 * 100) / 100} MiB` : `${value} bytes`;
    result.limits.push({ label, value: formatted });
  }
  const sources: { url: string; language: string }[] = [];
  const collectSources = (value: unknown, key = "", depth = 0) => {
    if (depth > 5) return;
    if (typeof value === "string") {
      const url = safeWebURL(value);
      if (url) sources.push({ url, language: key });
    } else if (Array.isArray(value)) value.forEach((entry) => collectSources(entry, key, depth + 1));
    else {
      const data = object(value);
      if (!data) return;
      if (typeof data.url === "string") collectSources(data.url, typeof data.language === "string" ? data.language : key, depth + 1);
      else for (const [name, entry] of Object.entries(data)) collectSources(entry, name, depth + 1);
    }
  };
  collectSources(imported.statement_sources);
  result.statementBase = sources.find((source) => source.language === language)?.url ?? sources[0]?.url;
  const collectImages = (value: unknown, key = "", depth = 0) => {
    if (depth > 5) return;
    if (typeof value === "string") {
      const resolved = contentURL(value, true, result);
      if (resolved) addAsset(key || value, resolved);
    } else if (Array.isArray(value)) value.forEach((entry) => collectImages(entry, key, depth + 1));
    else {
      const data = object(value);
      if (!data) return;
      const reference = [data.path, data.filename, data.name, key].find((entry) => typeof entry === "string" && entry);
      const target = [data.url, data.src, data.source, data.path].find((entry) => typeof entry === "string" && entry);
      if (typeof reference === "string" && typeof target === "string") {
        const resolved = contentURL(target, true, result);
        if (resolved) addAsset(reference, resolved);
      } else for (const [name, entry] of Object.entries(data)) collectImages(entry, name, depth + 1);
    }
  };
  collectImages(imported.statement_images);
  return result;
}