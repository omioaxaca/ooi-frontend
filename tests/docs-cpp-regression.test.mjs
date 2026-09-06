import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import matter from "gray-matter";
import { createProcessor } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

function compileGuide(context, guide, blockIndex = 0, driver = "") {
  const { content } = matter(
    fs.readFileSync(`content/docs/${guide}.mdx`, "utf8"),
  );
  const blocks = [];
  const visit = (node) => {
    if (node.type === "code" && node.lang === "cpp" && node.meta === "test")
      blocks.push(node.value);
    for (const child of node.children ?? []) visit(child);
  };
  visit(
    createProcessor({ remarkPlugins: [remarkGfm, remarkMath] }).parse(content),
  );
  assert.ok(blocks[blockIndex], `Missing runnable block in ${guide}`);
  const source = driver
    ? `#define main guideExample\n${blocks[blockIndex]}\n#undef main\n${driver}`
    : blocks[blockIndex];
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "ooi-regression-"));
  context.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const executable = path.join(directory, "example");
  const compiled = spawnSync(
    process.env.CXX ?? "c++",
    ["-std=c++17", "-O1", "-x", "c++", "-", "-o", executable],
    {
      input: source,
      encoding: "utf8",
      timeout: 30000,
    },
  );
  assert.equal(compiled.status, 0, compiled.error?.message ?? compiled.stderr);
  return (input = "") => {
    const result = spawnSync(executable, {
      input: `${input}\n`,
      encoding: "utf8",
      timeout: 5000,
    });
    assert.equal(
      result.status,
      0,
      `${guide}: ${result.error?.message ?? result.stderr}`,
    );
    return result.stdout.trim();
  };
}

function randomNumbers(seed) {
  let state = seed;
  return (limit) => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state % limit;
  };
}

test("Dinic and HLPP match exhaustive cuts, including disconnected and parallel-edge networks", (context) => {
  const run = compileGuide(context, "grafos-avanzados/flujo-maximo");
  const random = randomNumbers(21);
  for (let sample = 0; sample < 40; sample++) {
    const vertices = 2 + random(5);
    const edges = Array.from({ length: random(vertices * vertices) }, () => [
      random(vertices),
      random(vertices),
      random(8),
    ]);
    let minimum = Infinity;
    for (let mask = 1; mask < 1 << vertices; mask++) {
      if (!(mask & 1) || mask & (1 << (vertices - 1))) continue;
      const cut = edges.reduce(
        (sum, [origin, destination, capacity]) =>
          sum +
          (mask & (1 << origin) && !(mask & (1 << destination)) ? capacity : 0),
        0,
      );
      minimum = Math.min(minimum, cut);
    }
    const input = [
      `${vertices} ${edges.length} 0 ${vertices - 1}`,
      ...edges.map((edge) => edge.join(" ")),
    ].join("\n");
    assert.equal(run(input), `${minimum} ${minimum}`, input);
  }
});

test("minimum-cost flow matches exhaustive small bipartite assignments", (context) => {
  const run = compileGuide(context, "grafos-avanzados/flujo-costo-minimo");
  const random = randomNumbers(82);
  for (let sample = 0; sample < 20; sample++) {
    const size = 1 + random(4);
    const costs = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => (random(4) === 0 ? null : random(10))),
    );
    let bestFlow = -1,
      bestCost = Infinity;
    function assign(student, used, flow, cost) {
      if (student === size) {
        if (flow > bestFlow || (flow === bestFlow && cost < bestCost)) {
          bestFlow = flow;
          bestCost = cost;
        }
        return;
      }
      assign(student + 1, used, flow, cost);
      for (let project = 0; project < size; project++) {
        if (!(used & (1 << project)) && costs[student][project] !== null) {
          assign(
            student + 1,
            used | (1 << project),
            flow + 1,
            cost + costs[student][project],
          );
        }
      }
    }
    assign(0, 0, 0, 0);
    const edges = [];
    for (let index = 0; index < size; index++) {
      edges.push([2 * size, index, 1, 0], [size + index, 2 * size + 1, 1, 0]);
      for (let project = 0; project < size; project++) {
        if (costs[index][project] !== null)
          edges.push([index, size + project, 1, costs[index][project]]);
      }
    }
    const input = [
      `${2 * size + 2} ${edges.length} ${2 * size} ${2 * size + 1}`,
      ...edges.map((edge) => edge.join(" ")),
    ].join("\n");
    assert.equal(run(input), `${bestFlow} ${bestCost}`, input);
  }
});

test("Mo with modifications matches direct simulation, including time reversal and empty ranges", (context) => {
  const run = compileGuide(context, "arboles-avanzados/sqrt-mo");
  const random = randomNumbers(150);
  for (let sample = 0; sample < 12; sample++) {
    const size = 1 + random(16);
    const initial = Array.from({ length: size }, () => random(6));
    const current = [...initial],
      operations = [],
      expected = [];
    for (let index = 0; index < 45; index++) {
      if (random(3) === 0) {
        const position = random(size),
          value = random(6);
        operations.push(`U ${position} ${value}`);
        current[position] = value;
      } else {
        const first = random(size + 1),
          second = random(size + 1);
        const left = Math.min(first, second),
          right = Math.max(first, second);
        operations.push(`Q ${left} ${right}`);
        expected.push(new Set(current.slice(left, right)).size);
      }
    }
    assert.equal(
      run(
        [`${size} ${operations.length}`, initial.join(" "), ...operations].join(
          "\n",
        ),
      ),
      expected.join("\n"),
    );
  }
});

test("both LCA guides and HLD match direct parent paths across tree shapes", (context) => {
  const binary = compileGuide(context, "arboles/lca-binary-lifting");
  const euler = compileGuide(context, "arboles/lca-rmq");
  const heavyLight = compileGuide(context, "arboles-avanzados/heavy-light");
  const random = randomNumbers(221);
  for (let sample = 0; sample < 12; sample++) {
    const size = 1 + random(20);
    const parent = [-1],
      depth = [0],
      edges = [];
    for (let vertex = 1; vertex < size; vertex++) {
      parent[vertex] =
        sample % 3 === 0 ? vertex - 1 : sample % 3 === 1 ? 0 : random(vertex);
      depth[vertex] = depth[parent[vertex]] + 1;
      edges.push(`${parent[vertex]} ${vertex}`);
    }
    function treePath(first, second) {
      const left = [],
        right = [];
      while (first !== second) {
        if (depth[first] >= depth[second]) {
          left.push(first);
          first = parent[first];
        } else {
          right.push(second);
          second = parent[second];
        }
      }
      return { common: first, vertices: [...left, first, ...right.reverse()] };
    }
    const initial = Array.from({ length: size }, () => random(20) - 10),
      values = [...initial];
    const queries = [],
      operations = [],
      expectedLca = [],
      expectedBinary = [],
      expectedSum = [];
    for (let query = 0; query < 30; query++) {
      const first = random(size),
        second = random(size);
      const route = treePath(first, second);
      queries.push(`${first} ${second}`);
      expectedLca.push(route.common);
      expectedBinary.push(`${route.common} ${route.vertices.length - 1}`);
      if (query % 4 === 0) {
        values[first] = random(20) - 10;
        operations.push(`U ${first} ${values[first]}`);
      }
      operations.push(`Q ${first} ${second}`);
      expectedSum.push(
        route.vertices.reduce((sum, vertex) => sum + values[vertex], 0),
      );
    }
    const input = [`${size} ${queries.length}`, ...edges, ...queries].join(
      "\n",
    );
    assert.equal(binary(input), expectedBinary.join("\n"));
    assert.equal(euler(input), expectedLca.join("\n"));
    assert.equal(
      heavyLight(
        [
          `${size} ${operations.length}`,
          initial.join(" "),
          ...edges,
          ...operations,
        ].join("\n"),
      ),
      expectedSum.join("\n"),
    );
  }
});

test("divide-and-conquer and Knuth optimization match their unoptimized recurrences", (context) => {
  const partition = compileGuide(context, "dp-avanzada/divide-conquer");
  const merge = compileGuide(context, "dp-avanzada/knuth");
  const random = randomNumbers(713);
  for (let sample = 0; sample < 24; sample++) {
    const size = 1 + random(10),
      groups = 1 + random(size);
    const values = Array.from({ length: size }, () => random(10));
    const prefix = [0];
    for (const value of values) prefix.push(prefix.at(-1) + value);
    let previous = Array(size + 1).fill(Infinity);
    previous[0] = 0;
    for (let group = 1; group <= groups; group++) {
      const current = Array(size + 1).fill(Infinity);
      for (let end = group; end <= size; end++) {
        for (let cut = group - 1; cut < end; cut++)
          current[end] = Math.min(
            current[end],
            previous[cut] + (prefix[end] - prefix[cut]) ** 2,
          );
      }
      previous = current;
    }
    assert.equal(
      partition(`${size} ${groups}\n${values.join(" ")}`),
      String(previous[size]),
    );
    const costs = Array.from({ length: size }, () => Array(size).fill(0));
    for (let length = 2; length <= size; length++) {
      for (let left = 0; left + length <= size; left++) {
        const right = left + length - 1;
        costs[left][right] = Infinity;
        for (let cut = left; cut < right; cut++)
          costs[left][right] = Math.min(
            costs[left][right],
            costs[left][cut] +
              costs[cut + 1][right] +
              prefix[right + 1] -
              prefix[left],
          );
      }
    }
    assert.equal(
      merge(`${size}\n${values.join(" ")}`),
      String(costs[0][size - 1]),
    );
  }
});

test("persistent DSU preserves randomly branched historical partitions", (context) => {
  const run = compileGuide(
    context,
    "estructuras-persistentes/dsu-persistente",
    0,
    `
#include <cassert>
#include <random>
int main() {
    const int cantidad = 12;
    DSUPersistente conjuntos(cantidad);
    vector<int> raices = {conjuntos.inicial};
    vector<vector<int>> versiones(1, vector<int>(cantidad));
    for (int indice = 0; indice < cantidad; indice++) versiones[0][indice] = indice;
    mt19937 azar(761);
    for (int paso = 0; paso < 150; paso++) {
        int anterior = azar() % raices.size();
        int primero = azar() % cantidad, segundo = azar() % cantidad;
        vector<int> copia = versiones[anterior];
        int reemplazar = copia[segundo], nuevo = copia[primero];
        for (int& grupo : copia) if (grupo == reemplazar) grupo = nuevo;
        raices.push_back(conjuntos.unir(raices[anterior], primero, segundo));
        versiones.push_back(copia);
        for (int prueba = 0; prueba < 25; prueba++) {
            int version = azar() % raices.size();
            int origen = azar() % cantidad, destino = azar() % cantidad;
            assert(conjuntos.conectados(raices[version], origen, destino) == (versiones[version][origen] == versiones[version][destino]));
        }
    }
    cout << "OK\\n";
}
`,
  );
  assert.equal(run(), "OK");
});

test("NTT convolution matches direct multiplication over multiple transform lengths", (context) => {
  const run = compileGuide(
    context,
    "matematicas-avanzadas/fft-ntt",
    1,
    `
#include <cassert>
#include <random>
int main() {
    mt19937 azar(941);
    for (int prueba = 0; prueba < 100; prueba++) {
        int cantidadA = 1 + azar() % 25, cantidadB = 1 + azar() % 25;
        int longitud = 1;
        while (longitud < cantidadA + cantidadB - 1) longitud *= 2;
        vector<long long> primero(longitud, 0), segundo(longitud, 0), esperado(longitud, 0);
        for (int indice = 0; indice < cantidadA; indice++) primero[indice] = azar() % MOD;
        for (int indice = 0; indice < cantidadB; indice++) segundo[indice] = azar() % MOD;
        for (int gradoA = 0; gradoA < cantidadA; gradoA++) {
            for (int gradoB = 0; gradoB < cantidadB; gradoB++) esperado[gradoA + gradoB] = (esperado[gradoA + gradoB] + primero[gradoA] * segundo[gradoB]) % MOD;
        }
        ntt(primero, false); ntt(segundo, false);
        for (int indice = 0; indice < longitud; indice++) primero[indice] = primero[indice] * segundo[indice] % MOD;
        ntt(primero, true);
        assert(primero == esperado);
    }
    cout << "OK\\n";
}
`,
  );
  assert.equal(run(), "OK");
});

test("Pollard rho covers prime powers, pseudoprimes, and the unsigned 64-bit boundary", (context) => {
  const run = compileGuide(context, "matematicas-avanzadas/pollard-rho");
  for (const [input, expected] of [
    ["1", ""],
    ["2", "2"],
    ["49", "7 7"],
    ["561", "3 11 17"],
    ["1000000016000000063", "1000000007 1000000009"],
    ["18446744073709551615", "3 5 17 257 641 65537 6700417"],
  ])
    assert.equal(run(input), expected, input);
});
