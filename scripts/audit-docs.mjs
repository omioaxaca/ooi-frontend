import fs from "node:fs";
import matter from "gray-matter";
import { createProcessor } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { getStudyNavigation } from "../src/lib/mdx.ts";

const original = new Set(
  JSON.parse(fs.readFileSync("tests/fixtures/docs-legacy-paths.json", "utf8")),
);
const levels = getStudyNavigation();
if (process.argv.includes("--sync-next")) {
  const ordered = levels.flatMap((level) =>
    level.categories.flatMap((category) => category.posts),
  );
  const parser = createProcessor({ remarkPlugins: [remarkGfm, remarkMath] });
  let updated = 0;
  for (const [index, post] of ordered.entries()) {
    const file = `content/docs/${post.category}/${post.slug}.mdx`;
    const source = fs.readFileSync(file, "utf8");
    const { content } = matter(source);
    const tree = parser.parse(content);
    const headingIndex = tree.children.findIndex(
      (node) =>
        node.type === "heading" &&
        node.depth === 2 &&
        node.children.map((child) => child.value ?? "").join("") ===
          "Siguiente paso",
    );
    if (headingIndex === -1) continue;
    const heading = tree.children[headingIndex];
    const nextHeading = tree.children
      .slice(headingIndex + 1)
      .find((node) => node.type === "heading" && node.depth <= 2);
    const start = heading.position.start.offset;
    const end = nextHeading?.position.start.offset ?? content.length;
    const next = ordered[index + 1];
    const replacement = next
      ? `## Siguiente paso\n\n[${next.title}](/blog/${next.category}/${next.slug}).\n\n`
      : "## Siguiente paso\n\n[Guía de estudio](/blog).\n\n";
    const updatedContent =
      `${content.slice(0, start)}${replacement}${content.slice(end)}`.trimEnd() +
      "\n";
    if (updatedContent !== content) {
      fs.writeFileSync(
        file,
        source.slice(0, source.length - content.length) + updatedContent,
      );
      updated++;
    }
  }
  console.log(
    `Synchronized ${updated} existing next-topic sections with syllabus navigation.`,
  );
}

const lines = [
  "# Auditoria del temario local de referencia",
  "",
  "Este inventario describe el material local de referencia de [_config.json](_config.json), no el contenido publicado en Strapi. El dashboard obtiene temas, relaciones, orden y cuerpos del backend; ni este inventario ni los IDs antiguos intervienen en las consultas de lectura.",
  "",
  "Las carpetas y URLs originales se conservan. Cada fila del temario tiene una guia principal; los articulos complementarios y las ampliaciones no asignadas aparecen una sola vez en MISC, despues de Verde. No se elimino ningun articulo original.",
  "",
  "| Nivel | Temas | Guias existentes | Guias nuevas |",
  "| --- | ---: | ---: | ---: |",
];

for (const level of levels) {
  const posts = level.categories.flatMap((category) => category.posts);
  const reused = posts.filter((post) =>
    original.has(`${post.category}/${post.slug}`),
  ).length;
  lines.push(
    `| ${level.name} | ${posts.length} | ${reused} | ${posts.length - reused} |`,
  );
}

lines.push(
  "",
  "## Decisiones editoriales",
  "",
  "- Se conserva la secuencia solicitada: Azul, Amarillo, Verde y MISC. Se corrigieron nombres como STDOUT, LCM y Floyd-Warshall sin cambiar el tema.",
  "- Las dos filas de LCA permanecen: binary lifting en Amarillo y Euler tour con RMQ en Verde.",
  "- Las guias offline aclaran que conocer las consultas de antemano no equivale a un concurso de solo salida.",
  "- Lazy propagation permanece en la categoria solicitada, aclarando que no implica persistencia. DSU persistente conserva y ramifica versiones; no se presenta rollback como equivalente.",
  "- Los temas compuestos se cubren en su guia principal: operadores, ciclos, parametros, stack/queue, set/map, ordenamiento, clasicos de DP, A*, Tarjan, Euler tour y Dinic/HLPP.",
  "- Los ejemplos nuevos indican supuestos, complejidad y casos borde. Pollard rho explica su dependencia de unsigned __int128 en GCC/Clang; los otros ejemplos marcados usan C++17 estandar.",
  "",
  "## Mantenimiento y validacion",
  "",
  "- Node 22.6 o posterior permite ejecutar los tests TypeScript con eliminacion de tipos; la validacion se desarrollo con Node 24.",
  "- `npm run test:docs` comprueba la navegacion y el contenido del archivo local de referencia. `npm run test:study` comprueba el contrato Strapi, paginacion, relaciones, URLs historicas y renderizado seguro que usa el dashboard.",
  "- `npm run test:docs:cpp` compila y ejecuta bloques `cpp test` contra sus bloques `text input` y `text output`, y compara algoritmos de mayor riesgo con soluciones de referencia. Requiere `c++` o la variable CXX; usa archivos temporales y no inicia la aplicacion.",
  "- Las regresiones cubren cortes exhaustivos frente a Dinic/HLPP, asignaciones frente a flujo de coste minimo, simulacion de Mo con cambios, LCA/HLD, DP sin optimizar, ramas de DSU persistente, NTT frente a multiplicacion directa y factorizacion de 64 bits.",
  "- Los fragmentos didacticos sin la marca `test` no se consideran programas completos ni se compilan automaticamente. Una compilacion MDX no certifica correccion matematica.",
  "- `npm run audit:docs` regenera este inventario a partir de la configuracion y el registro de URLs originales.",
  "- `npm run audit:docs -- --sync-next` sincroniza las secciones existentes de Siguiente paso mediante el arbol Markdown, conservando frontmatter y el resto del contenido.",
  "- Validacion manual pendiente: abrir /blog, cambiar entre los cuatro niveles, saltar a categorias, abrir una guia y comprobar Anterior/Siguiente al cruzar categoria y color. Repetir en movil y comprobar formulas, tablas y bloques largos de codigo. No se inicia ni se automatiza la app para esta validacion.",
);

for (const level of levels) {
  lines.push("", `## ${level.name}`, "");
  let order = 1;
  for (const category of level.categories) {
    lines.push(
      `### ${category.name}`,
      "",
      "| Orden | Tema y documento | Origen |",
      "| ---: | --- | --- |",
    );
    for (const post of category.posts) {
      const source = original.has(`${post.category}/${post.slug}`)
        ? "Existente"
        : "Nueva";
      lines.push(
        `| ${order++} | [${post.title.replaceAll("|", "\\|")}](${post.category}/${post.slug}.mdx) | ${source} |`,
      );
    }
    lines.push("");
  }
}

fs.writeFileSync(
  "content/docs/SYLLABUS_AUDIT.md",
  `${lines.join("\n").trimEnd()}\n`,
);
console.log(
  "Updated content/docs/SYLLABUS_AUDIT.md from the local reference syllabus.",
);
