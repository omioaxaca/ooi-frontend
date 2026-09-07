# Strapi Study Content

## Data Flow

The syllabus, guide, and problem views live below `/dashboard/syllabus`. They request the same-origin, read-only `/api/study/*` routes with the student's existing JWT through the existing Axios client. Those route handlers fetch Strapi and parse rich content on the server. No privileged API token is used, and no database connection or write endpoint is added.

Authentication currently stores tokens in browser storage, not server-readable cookies. The first page therefore renders the existing protected dashboard/loading state and requests content after the session is ready. This is server-side **backend access**, not authenticated SSR of the initial article. Introducing cookie-based SSR would require a separate authentication change. Login and session-expiry redirects retain a validated dashboard return URL, including the guide and hash.

Responses are private and `no-store`; JWTs remain per request rather than in shared Axios defaults or a global cache. The server does not try the browser's refresh flow. A server 401 reaches the browser client, which uses the existing refresh behavior.

## Backend Contract

- Uses flattened Strapi 5 `data` documents with `documentId`. It does not read `data.attributes` or historical numeric syllabus IDs.
- `/api/syllabi` lists only topic summaries, with explicit category population. Topics are ordered by level and `rank`, with `documentId` as a stable tie-breaker. Category groups follow their first topic in that sequence. Missing categories remain visible as “Sin categoría”.
- Opening a topic loads its body and resources. Guides are queried with `filters[syllabus][documentId][$eq]`; problems use `filters[syllabi][documentId][$eq]`. Both collections are exhausted according to backend pagination, even if Strapi caps the requested page size. The resulting lists provide actual counts; collapsed topics do not display guessed counts.
- Guide/problem lists request summary fields only. Full guide bodies and problem descriptions, constraints, and photos are requested only when opening details.
- A populated topic relation supplies an ordering hint, not proof of completeness. All related records are fetched independently. Records present in that hint retain its order; others follow deterministic collection order (guide date/documentId, problem documentId). **Problem `rank` is global and is not used as per-topic ordering.** The standard API does not expose a complete paginated per-topic relation order. Exact ordering beyond populated hints requires a backend contract that provides it; no such field is invented here.
- Shared problems are deduplicated within each topic by `documentId`, never across the curriculum. A problem detail fetch also exhausts the inverse syllabus query to show all associated topics.
- Missing relations/pagination and permission failures are errors, not empty arrays. An actual empty collection is displayed as empty; 404 has a distinct not-found state and every failed request can be retried.

## Routes and Compatibility

- `/dashboard/syllabus/beginner`, `/intermediate`, `/advanced`: Azul, Amarillo, Verde.
- `/dashboard/syllabus/topics/:documentId`: topic material, all associated guides, problems, videos, PDFs, and references.
- `/dashboard/syllabus/guides/:documentId`: full reading view with direct-entry curriculum context, sibling guides, outline, and previous/next links across topics and levels. Neighbor lookups fetch guide summaries only and skip topics without guides.
- `/dashboard/syllabus/problems/:documentId?tema=:topicDocumentId`: shared problem identity; the optional topic selects a valid return context, not another problem record.
- `/dashboard/syllabus/library`: unassigned guides (MISC). Optional `category` and `tag` filters support historical blog indexes.
- `/blog?nivel=...`, `/blog/:category`, and `/blog/tags/:tag` redirect to their dashboard equivalents.
- `/blog/:category/:slug` resolves through exact `study-guide-source:<relative-file-path>` tag values, accepting paths relative to the docs directory or prefixed by `content/docs/`. It then opens the canonical documentId route. No title matching or filesystem fallback occurs. Missing imports produce a 404; duplicate provenance produces a conflict instead of choosing arbitrarily.
- In-body `/blog/...` links still resolve. Old heading fragments are recognized by the reader alongside the sanitized `study-` heading IDs. Back links are deterministic, so direct entry works without browser history.

Local documents and their loader remain for reference tests and offline audit commands only. No page or UI component imports the filesystem loader. The local syllabus audit does not describe live backend coverage.

## Rich Content and Assets

Guide `body` is preserved as a Markdown/MDX string. The server parses it to an allowlisted document tree, sanitizes HTML and URLs, then generates math and syntax highlighting. React renders that tree using the existing component styles; there is no MDX compilation/evaluation, `eval`, or unsanitized HTML injection.

Supported static components include `Callout` (`info`, `warning`, `error`, `success`), `Steps`, `Step`, `Image`, details/summary, and ordinary document elements. Static string/number/boolean attributes are allowed where appropriate. Imports, unknown components, event handlers, spreads, and executable attribute expressions are rejected. Brace expressions in prose are displayed literally, preserving mathematical set notation without evaluating JavaScript. Code fences remain code. Markdown tables, math, inline links, images, and highlighting are supported. KaTeX trust is disabled; document size and macro expansion are bounded.

Visible tags omit `study-guide-import-v1`, `study-guide-source:*`, `omegaup-syllabus-import-v1`, and `omegaup-syllabus-link-v1:*`. Provenance is used for routing only.

Problem descriptions and legacy prose constraints render as sanitized Markdown. Imported constraints JSON is parsed defensively: supported time/memory/output limits are displayed, while settings and source metadata are not dumped into the page. Invalid JSON produces a notice. Asset references are resolved through uploaded photos, `statement_images` mappings, and valid `statement_sources` URLs. Relative `/uploads/` URLs use `NEXT_PUBLIC_STRAPI_URL`. Unsafe or unresolved images render a text placeholder. Asset availability still depends on the backend returning valid, browser-accessible URLs.

Original solve URLs are validated as HTTP(S). If absent, known unambiguous platform/alias formats can derive an OmegaUp, LeetCode, CSES, or Codeforces URL. USACO/UVA identifiers alone are not assumed to be web problem IDs. Missing/unsafe links are shown as unavailable rather than fabricated. `externalProblemId` remains a string.

## Permissions and Setup

Set `NEXT_PUBLIC_STRAPI_URL` to the Strapi base URL, as used by the existing login/API client. The server must be able to reach it. No new secret environment variable is needed.

The student's Strapi role needs `find` and `findOne` for syllabus, study-guide, and problem collections, including the fields and relations above. It also needs access to category data and uploaded media required by population. Components such as tags and link arrays must be included in responses. Media URLs must be usable by the student's browser; private storage needs backend-provided accessible URLs. No backend permissions are changed by this frontend work. Public collection permissions are not required by the new dashboard routes, which require the student's bearer token.

Backend availability, actual imported provenance, role permissions, and remote assets have not been exercised against a live server. Unit tests use mocked Strapi responses; a successful frontend build does not certify live data or permissions.

## Verification

With Node 22.6+ (Node 24 used locally):

```sh
npm run test:study
npm run test:docs
npx tsc --noEmit --incremental false
npm run build
```

The study tests cover Strapi 5 normalization, pagination, relation order/completeness, shared problems, explicit empty/error states, URL/provenance handling, constraints/assets, server auth isolation, and safe rendering. Local guides are used only as compatibility fixtures for the restricted renderer. The existing C++ reference tests remain available but are not necessary for this migration because guide bodies are not edited.

## Manual Checks

1. Sign in as a student. Open each syllabus level and verify category/topic order against backend `rank`. Open a topic with several guides/problems, one with none, and one with more records than the backend's page size. Verify counts and no duplicate rows.
2. Open a guide from a topic and directly by documentId. Check author/date/tags, Callout, Steps, code highlighting, equations, tables, details, images, and outline links. Follow previous/next across topic and color boundaries and return to the topic's practice section.
3. Open an old `/blog/:category/:slug#heading` URL while logged out, sign in, and confirm it resolves to the imported guide and correct heading. Follow an internal old article link. Check legacy category/tag links, MISC, a missing import, and a new guide without provenance.
4. Open a shared problem from two topics: confirm the same document/detail ID, correct return context, all topic links, actual difficulty/platform/language/seal status, Markdown statement, readable constraints, and referenced images. Follow “Resolver” and verify the original platform URL. Test an alias-valued external ID and a problem without an original URL.
5. Simulate a failed content request using browser developer tools or a student role without read permission. Verify retryable errors, not empty lists; restore access and retry. Check an expired session returns to the requested document after login.
6. Repeat topic expansion and guide/problem navigation on mobile and desktop. Check the collapsible curriculum navigation, long titles, code/table scrolling, math layout, and image loading.

No app server or browser automation is started by the automated verification above.
