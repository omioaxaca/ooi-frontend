# Auditoria del temario

La fuente de verdad es [_config.json](_config.json): el orden de sus niveles, categorias y temas es el orden de lectura. Los IDs antiguos y las fechas no intervienen en esa ruta.

Las carpetas y URLs originales se conservan. Cada fila del temario tiene una guia principal; los articulos complementarios y las ampliaciones no asignadas aparecen una sola vez en MISC, despues de Verde. No se elimino ningun articulo original.

| Nivel | Temas | Guias existentes | Guias nuevas |
| --- | ---: | ---: | ---: |
| Azul | 34 | 25 | 9 |
| Amarillo | 38 | 19 | 19 |
| Verde | 42 | 11 | 31 |
| MISC | 16 | 16 | 0 |

## Decisiones editoriales

- Se conserva la secuencia solicitada: Azul, Amarillo, Verde y MISC. Se corrigieron nombres como STDOUT, LCM y Floyd-Warshall sin cambiar el tema.
- Las dos filas de LCA permanecen: binary lifting en Amarillo y Euler tour con RMQ en Verde.
- Las guias offline aclaran que conocer las consultas de antemano no equivale a un concurso de solo salida.
- Lazy propagation permanece en la categoria solicitada, aclarando que no implica persistencia. DSU persistente conserva y ramifica versiones; no se presenta rollback como equivalente.
- Los temas compuestos se cubren en su guia principal: operadores, ciclos, parametros, stack/queue, set/map, ordenamiento, clasicos de DP, A*, Tarjan, Euler tour y Dinic/HLPP.
- Los ejemplos nuevos indican supuestos, complejidad y casos borde. Pollard rho explica su dependencia de unsigned __int128 en GCC/Clang; los otros ejemplos marcados usan C++17 estandar.

## Mantenimiento y validacion

- Node 22.6 o posterior permite ejecutar los tests TypeScript con eliminacion de tipos; la validacion se desarrollo con Node 24.
- `npm run test:docs` comprueba navegacion, URLs, cobertura, compilacion MDX y enlaces internos.
- `npm run test:docs:cpp` compila y ejecuta bloques `cpp test` contra sus bloques `text input` y `text output`, y compara algoritmos de mayor riesgo con soluciones de referencia. Requiere `c++` o la variable CXX; usa archivos temporales y no inicia la aplicacion.
- Las regresiones cubren cortes exhaustivos frente a Dinic/HLPP, asignaciones frente a flujo de coste minimo, simulacion de Mo con cambios, LCA/HLD, DP sin optimizar, ramas de DSU persistente, NTT frente a multiplicacion directa y factorizacion de 64 bits.
- Los fragmentos didacticos sin la marca `test` no se consideran programas completos ni se compilan automaticamente. Una compilacion MDX no certifica correccion matematica.
- `npm run audit:docs` regenera este inventario a partir de la configuracion y el registro de URLs originales.
- `npm run audit:docs -- --sync-next` sincroniza las secciones existentes de Siguiente paso mediante el arbol Markdown, conservando frontmatter y el resto del contenido.
- Validacion manual pendiente: abrir /blog, cambiar entre los cuatro niveles, saltar a categorias, abrir una guia y comprobar Anterior/Siguiente al cruzar categoria y color. Repetir en movil y comprobar formulas, tablas y bloques largos de codigo. No se inicia ni se automatiza la app para esta validacion.

## Azul

### Introducción

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 1 | [Desarrollo de pensamiento lateral](fundamentos/pensamiento-lateral.mdx) | Existente |
| 2 | [Razonamiento inductivo y deductivo](fundamentos/razonamiento-inductivo-deductivo.mdx) | Nueva |
| 3 | [Concepto de algoritmos](fundamentos/concepto-algoritmos.mdx) | Existente |
| 4 | [Configuración de VS Code y computadora](introduccion/configuracion-entorno.mdx) | Existente |

### Programación en C++

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 5 | [Estructura de un programa en C++](cpp-basico/estructura-programa.mdx) | Existente |
| 6 | [Tipos de datos y variables](cpp-basico/tipos-de-datos.mdx) | Existente |
| 7 | [Entrada y salida de datos: STDIN y STDOUT](cpp-basico/entrada-salida.mdx) | Existente |
| 8 | [Jerarquía, operadores aritméticos, relacionales, lógicos y pre/post incremento](cpp-basico/operadores-aritmeticos.mdx) | Existente |
| 9 | [Control de flujo: if, else y else if](estructuras-de-control/if-else.mdx) | Existente |
| 10 | [Funciones: paso por valor, referencia y apuntadores](estructuras-de-control/funciones.mdx) | Existente |

### Estructuras de datos

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 11 | [Ciclos: for, while y do while](estructuras-de-control/ciclo-for.mdx) | Existente |
| 12 | [Arreglos y STL vector](estructuras-de-datos/arreglos-y-vectores.mdx) | Existente |
| 13 | [Cadenas: string](estructuras-de-datos/strings.mdx) | Existente |
| 14 | [Matrices y arreglos de dos o más dimensiones](estructuras-de-datos/matrices.mdx) | Existente |
| 15 | [Complejidad de un algoritmo: Big O](introduccion/complejidad-algoritmica.mdx) | Existente |
| 16 | [Ordenamiento: burbuja y STL sort](algoritmos/ordenamiento.mdx) | Existente |

### Recursividad

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 17 | [Recursión: caso base, paso recursivo y funciones matemáticas](recursion/funciones-recursivas.mdx) | Existente |
| 18 | [Árbol de llamadas, diseño de estado y recursión sobre arreglos](recursion/visualizacion-estado.mdx) | Nueva |
| 19 | [Backtracking](recursion/backtracking.mdx) | Nueva |
| 20 | [Generación de subconjuntos y permutaciones](recursion/subconjuntos-permutaciones.mdx) | Nueva |
| 21 | [Poda (pruning) y complejidad exponencial](recursion/complejidad-recursiva.mdx) | Existente |
| 22 | [Memorización (memoization)](recursion/memorizacion.mdx) | Existente |

### Búsquedas

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 23 | [Estructuras y pares: struct, vector de structs y pair](estructuras-de-datos/struct.mdx) | Existente |
| 24 | [Pilas y colas: STL stack y queue](pilas-y-colas/pilas-concepto.mdx) | Existente |
| 25 | [Búsqueda en profundidad: DFS](busquedas/busqueda-profundidad.mdx) | Existente |
| 26 | [Búsqueda en amplitud: BFS](busquedas/busqueda-amplitud.mdx) | Existente |
| 27 | [Búsqueda binaria](busquedas/busqueda-binaria.mdx) | Existente |
| 28 | [Lower bound y upper bound](busquedas/lower-upper-bound.mdx) | Existente |

### Iteración inteligente

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 29 | [Sets y diccionarios: STL set y map](diccionarios-mapas/map-unordered-map.mdx) | Existente |
| 30 | [Iteración avanzada: frecuencias, condiciones, extremos, segmentos, picos y valles](iteracion-inteligente/recorridos-arreglos.mdx) | Nueva |
| 31 | [Sumas acumuladas: prefix sum](iteracion-inteligente/sumas-acumuladas.mdx) | Nueva |
| 32 | [Two pointers: sliding window, pares con suma y subarreglos](iteracion-inteligente/dos-punteros.mdx) | Nueva |
| 33 | [Custom sort con pairs y structs](iteracion-inteligente/ordenamiento-personalizado.mdx) | Nueva |
| 34 | [Técnicas de resolución: pasos, casos borde, simulación, límites y bloqueos](iteracion-inteligente/resolucion-problemas.mdx) | Nueva |


## Amarillo

### Matemáticas

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 1 | [Números primos y criba de Eratóstenes](matematicas/numeros-primos.mdx) | Existente |
| 2 | [Máximo común divisor y mínimo común múltiplo: GCD, LCM y Euclides](matematicas/gcd-lcm.mdx) | Existente |
| 3 | [Aritmética modular: exponenciación rápida e inverso modular](matematicas/aritmetica-modular.mdx) | Existente |
| 4 | [Divisores y factorización prima](matematicas/divisores-factorizacion.mdx) | Existente |
| 5 | [Combinaciones y permutaciones: fuerza bruta y prueba de primalidad](matematicas/combinaciones-permutaciones.mdx) | Existente |
| 6 | [Triángulo de Pascal](matematicas/triangulo-pascal.mdx) | Existente |
| 7 | [Manipulación de números en diferentes bases](matematicas/bases-numericas.mdx) | Nueva |
| 8 | [Números de Catalan](matematicas/numeros-catalan.mdx) | Nueva |

### Problemas de comunicación

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 9 | [Diseño de protocolos (designing protocols)](comunicacion/diseno-protocolos.mdx) | Nueva |
| 10 | [Minimización de bits (minimizing bits)](comunicacion/minimizar-bits.mdx) | Nueva |
| 11 | [Optimización de consultas (query optimization)](comunicacion/optimizacion-consultas.mdx) | Nueva |
| 12 | [Razonamiento de cotas inferiores (lower bounds reasoning)](comunicacion/cotas-inferiores.mdx) | Nueva |

### Problemas interactivos

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 13 | [Diseño de estrategias (strategy design)](interactivos/diseno-estrategias.mdx) | Nueva |
| 14 | [Árboles de decisión binarios (binary decision trees)](interactivos/arboles-decision.mdx) | Nueva |
| 15 | [Fundamentos de teoría de la información](interactivos/teoria-informacion.mdx) | Nueva |
| 16 | [Razonamiento adversarial](interactivos/razonamiento-adversarial.mdx) | Nueva |

### Problemas solo salida (offline tricks)

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 17 | [CDQ divide and conquer](consultas-offline/cdq.mdx) | Nueva |
| 18 | [Parallel binary search](consultas-offline/busqueda-binaria-paralela.mdx) | Nueva |
| 19 | [Offline query reordering](consultas-offline/reordenamiento.mdx) | Nueva |

### Programación dinámica

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 20 | [Fundamentos: superposición de subproblemas y optimalidad](programacion-dinamica/introduccion-dp.mdx) | Existente |
| 21 | [Memorización top-down y tabulación bottom-up](programacion-dinamica/tecnicas-implementacion.mdx) | Nueva |
| 22 | [Problemas clásicos: mochila, coin change, LCS y Fibonacci](programacion-dinamica/patrones-dp.mdx) | Existente |

### Estructuras de datos avanzadas

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 23 | [Colas de prioridad](estructuras-avanzadas/colas-prioridad.mdx) | Nueva |
| 24 | [Listas ligadas](listas-enlazadas/introduccion-listas.mdx) | Existente |
| 25 | [Árboles binarios](arboles/representacion-arboles.mdx) | Existente |
| 26 | [Trie](estructuras-avanzadas/trie.mdx) | Existente |
| 27 | [Sparse table: RMQ y su relación con LCA](estructuras-avanzadas/rmq.mdx) | Existente |

### Árboles

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 28 | [Recorridos: preorden, inorden y postorden](arboles/recorridos-arboles.mdx) | Existente |
| 29 | [BFS y DFS en árboles](arboles/recorridos-bfs-dfs.mdx) | Nueva |
| 30 | [Binary search tree](arboles/arboles-busqueda-binaria.mdx) | Existente |
| 31 | [Heap](arboles/implementacion-heap.mdx) | Existente |
| 32 | [LCA y binary lifting](arboles/lca-binary-lifting.mdx) | Nueva |

### Grafos

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 33 | [Teoría de grafos sencillos](grafos/introduccion-grafos.mdx) | Existente |
| 34 | [Representación de grafos y recorrido](grafos/representacion-recorridos.mdx) | Nueva |
| 35 | [Detección de ciclos](grafos-avanzados/deteccion-ciclos.mdx) | Existente |
| 36 | [Graph coloring](grafos-avanzados/grafos-bipartitos.mdx) | Existente |
| 37 | [Disjoint set union](grafos-avanzados/union-find.mdx) | Existente |
| 38 | [Dijkstra](grafos/dijkstra.mdx) | Nueva |


## Verde

### Grafos intermedios

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 1 | [Floyd-Warshall, Bellman-Ford y A*](grafos-avanzados/caminos-cortos.mdx) | Existente |
| 2 | [Maximum bipartite matching](grafos-avanzados/emparejamiento-bipartito.mdx) | Nueva |
| 3 | [Topological sort](grafos-avanzados/ordenamiento-topologico.mdx) | Existente |
| 4 | [Lowest common ancestor: Euler tour y RMQ](arboles/lca-rmq.mdx) | Nueva |
| 5 | [Componentes conexas](grafos/componentes-conexas.mdx) | Existente |

### Strings avanzados

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 6 | [Hashing](strings-avanzados/hashing.mdx) | Nueva |
| 7 | [Rabin-Karp](strings-avanzados/rabin-karp.mdx) | Nueva |
| 8 | [KMP](strings-avanzados/kmp.mdx) | Nueva |
| 9 | [Z function](strings-avanzados/z-function.mdx) | Nueva |
| 10 | [Suffix array](strings-avanzados/suffix-array.mdx) | Nueva |
| 11 | [Aho-Corasick](strings-avanzados/aho-corasick.mdx) | Nueva |

### Árboles avanzados

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 12 | [Segment tree y Euler tour](estructuras-avanzadas/segment-tree.mdx) | Existente |
| 13 | [BIT: Fenwick tree](estructuras-avanzadas/fenwick-tree.mdx) | Existente |
| 14 | [Sqrt decomposition: Mo y Mo con modificaciones](arboles-avanzados/sqrt-mo.mdx) | Nueva |
| 15 | [Árboles balanceados: AVL, red-black trees y treaps](arboles-avanzados/arboles-balanceados.mdx) | Nueva |
| 16 | [Heavy-light decomposition](arboles-avanzados/heavy-light.mdx) | Nueva |
| 17 | [Centroid decomposition](arboles-avanzados/centroid-decomposition.mdx) | Nueva |

### Grafos avanzados

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 18 | [2-SAT](grafos-avanzados/dos-sat.mdx) | Nueva |
| 19 | [Bridge tree](grafos-avanzados/bridge-tree.mdx) | Nueva |
| 20 | [Puntos de articulación](grafos-avanzados/puntos-articulacion-puentes.mdx) | Existente |
| 21 | [Componentes fuertemente conexas: Kosaraju y Tarjan](grafos-avanzados/scc.mdx) | Existente |
| 22 | [Maximum flow: Dinic y HLPP](grafos-avanzados/flujo-maximo.mdx) | Nueva |
| 23 | [Min-cost max flow](grafos-avanzados/flujo-costo-minimo.mdx) | Nueva |
| 24 | [Minimum spanning tree](grafos-avanzados/mst.mdx) | Existente |

### Estructuras persistentes

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 25 | [Persistent segment tree](estructuras-persistentes/estructuras-persistentes.mdx) | Existente |
| 26 | [Segment tree con lazy propagation](estructuras-persistentes/lazy-propagation.mdx) | Nueva |
| 27 | [Persistent disjoint set union](estructuras-persistentes/dsu-persistente.mdx) | Nueva |

### Teoría de juegos

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 28 | [Nim](teoria-juegos/nim.mdx) | Nueva |
| 29 | [Grundy numbers](teoria-juegos/grundy.mdx) | Nueva |
| 30 | [Teorema de Sprague-Grundy](teoria-juegos/teoria-juegos.mdx) | Existente |
| 31 | [Minimax](teoria-juegos/minimax.mdx) | Existente |
| 32 | [Game graphs](teoria-juegos/grafos-juego.mdx) | Nueva |

### Programación dinámica avanzada

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 33 | [Divide and conquer DP](dp-avanzada/divide-conquer.mdx) | Nueva |
| 34 | [Knuth optimization](dp-avanzada/knuth.mdx) | Nueva |
| 35 | [Convex hull trick (CHT)](dp-avanzada/convex-hull-trick.mdx) | Nueva |
| 36 | [Programación dinámica en árboles](dp-avanzada/arboles.mdx) | Nueva |
| 37 | [Programación dinámica en grafos: DAG](dp-avanzada/dag.mdx) | Nueva |

### Matemáticas avanzadas

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 38 | [Extended Euclid](matematicas-avanzadas/euclides-extendido.mdx) | Nueva |
| 39 | [Pollard rho](matematicas-avanzadas/pollard-rho.mdx) | Nueva |
| 40 | [Fast Fourier transform y number theoretic transform](matematicas-avanzadas/fft-ntt.mdx) | Nueva |
| 41 | [Walsh-Hadamard transform](matematicas-avanzadas/walsh-hadamard.mdx) | Nueva |
| 42 | [Multiplicación de polinomios](matematicas-avanzadas/multiplicacion-polinomios.mdx) | Nueva |


## MISC

### MISC

| Orden | Tema y documento | Origen |
| ---: | --- | --- |
| 1 | [Aplicaciones Prácticas](diccionarios-mapas/aplicaciones-practicas.mdx) | Existente |
| 2 | [BFS en Grafos](grafos/bfs.mdx) | Existente |
| 3 | [Bienvenida a la OOI](introduccion/bienvenida.mdx) | Existente |
| 4 | [Char y ASCII](cpp-basico/char-ascii.mdx) | Existente |
| 5 | [Ciclo While](estructuras-de-control/ciclo-while.mdx) | Existente |
| 6 | [Colas (Queues)](pilas-y-colas/colas-concepto.mdx) | Existente |
| 7 | [DFS en Grafos](grafos/dfs.mdx) | Existente |
| 8 | [Diagramas de Flujo](fundamentos/diagramas-de-flujo.mdx) | Existente |
| 9 | [Factoriales](matematicas/factoriales.mdx) | Existente |
| 10 | [Invertir una Lista Enlazada](listas-enlazadas/invertir-lista.mdx) | Existente |
| 11 | [Operadores Lógicos y de Comparación](estructuras-de-control/operadores-logicos.mdx) | Existente |
| 12 | [Ordenamiento Burbuja (Bubble Sort)](algoritmos/ordenamiento-burbuja.mdx) | Existente |
| 13 | [Ordenamiento por Cubeta (Counting Sort)](algoritmos/ordenamiento-cubeta.mdx) | Existente |
| 14 | [Problemas con Pilas y Colas](pilas-y-colas/problemas-pilas-colas.mdx) | Existente |
| 15 | [Punteros, Heap y Stack](punteros-memoria/punteros-heap-stack.mdx) | Existente |
| 16 | [Set y Multiset](diccionarios-mapas/set-multiset.mdx) | Existente |
