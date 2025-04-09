import { AppError, Result, Ok, Err } from "../../core";
import { Option } from "../../core/option";
import { Str, f64, Vec } from "../../types";
import { initWasm, getWasmModule, isWasmInitialized } from "../../wasm/init.js";

export class GraphError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

export interface GraphEdge {
  from: Str;
  to: Str;
  weight: f64;
}

export interface AdjacencyListEntry {
  vertex: Str;
  weight: f64;
}

export class Graph {
  private readonly _inner: any;
  private readonly _useWasm: boolean;
  private readonly _adjacencyList: Map<
    string,
    Array<{ to: string; weight: number }>
  >;

  static readonly _type = "Graph";

  private constructor(useWasm: boolean = true, existingWasmGraph?: any) {
    this._useWasm = useWasm && isWasmInitialized();
    this._adjacencyList = new Map();

    if (existingWasmGraph) {
      this._inner = existingWasmGraph;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.Graph === "function") {
          this._inner = new wasmModule.Graph();
        } else {
          console.warn(
            "WASM Graph constructor not found, using JS implementation"
          );
          this._useWasm = false;
        }
      } catch (error) {
        console.warn(
          `WASM Graph creation failed, falling back to JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  static new(): Graph {
    return new Graph();
  }

  static async create(): Promise<Graph> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(`WASM initialization failed: ${error}`);
      }
    }
    return new Graph();
  }

  addVertex(vertex: Str): Result<void, GraphError> {
    const vertexStr = vertex.unwrap();

    if (this._useWasm) {
      try {
        if (typeof this._inner.addVertex === "function") {
          this._inner.addVertex(vertexStr);
          this._adjacencyList.set(vertexStr, []);
          return Ok(undefined);
        } else {
          console.warn(
            "WASM addVertex method not found, using JS implementation"
          );
        }
      } catch (error) {
        console.warn(`WASM addVertex failed, using JS fallback: ${error}`);
      }
    }

    this._adjacencyList.set(vertexStr, []);
    return Ok(undefined);
  }

  addEdge(from: Str, to: Str, weight?: f64): Result<void, GraphError> {
    const fromStr = from.unwrap();
    const toStr = to.unwrap();
    const weightValue = weight ? Number(weight) : 1;

    if (this._useWasm) {
      try {
        if (typeof this._inner.addEdge === "function") {
          this._inner.addEdge(fromStr, toStr, weight);

          if (!this._adjacencyList.has(fromStr)) {
            this._adjacencyList.set(fromStr, []);
          }
          if (!this._adjacencyList.has(toStr)) {
            this._adjacencyList.set(toStr, []);
          }

          this._adjacencyList.get(fromStr)!.push({
            to: toStr,
            weight: weightValue,
          });

          return Ok(undefined);
        } else {
          console.warn(
            "WASM addEdge method not found, using JS implementation"
          );
        }
      } catch (error) {
        console.warn(`WASM addEdge failed, using JS fallback: ${error}`);
      }
    }

    if (!this._adjacencyList.has(fromStr)) {
      this._adjacencyList.set(fromStr, []);
    }
    if (!this._adjacencyList.has(toStr)) {
      this._adjacencyList.set(toStr, []);
    }

    this._adjacencyList.get(fromStr)!.push({
      to: toStr,
      weight: weightValue,
    });

    return Ok(undefined);
  }

  getVertices(): Vec<Str> {
    if (this._useWasm) {
      try {
        if (typeof this._inner.getVertices === "function") {
          const vertices = this._inner.getVertices();
          return Vec.from(
            Array.from(vertices).map((v: unknown) => Str.fromRaw(String(v)))
          );
        } else {
          console.warn(
            "WASM getVertices method not found, using JS implementation"
          );
        }
      } catch (error) {
        console.warn(`WASM getVertices failed, using JS fallback: ${error}`);
      }
    }

    return Vec.from(
      Array.from(this._adjacencyList.keys()).map((v) => Str.fromRaw(v))
    );
  }

  getEdges(): Vec<GraphEdge> {
    if (this._useWasm) {
      try {
        if (typeof this._inner.getEdges === "function") {
          const edges = this._inner.getEdges();
          return Vec.from(
            Array.from(edges).map((edge: unknown) => {
              const edgeArr = Array.isArray(edge) ? edge : [];
              return {
                from: Str.fromRaw(String(edgeArr[0] || "")),
                to: Str.fromRaw(String(edgeArr[1] || "")),
                weight: f64(Number(edgeArr[2] || 0)),
              };
            })
          );
        } else {
          console.warn(
            "WASM getEdges method not found, using JS implementation"
          );
        }
      } catch (error) {
        console.warn(`WASM getEdges failed, using JS fallback: ${error}`);
      }
    }

    const edges: GraphEdge[] = [];
    for (const [from, adjList] of this._adjacencyList.entries()) {
      for (const { to, weight } of adjList) {
        edges.push({
          from: Str.fromRaw(from),
          to: Str.fromRaw(to),
          weight: f64(weight),
        });
      }
    }
    return Vec.from(edges);
  }

  breadthFirstSearch(start: Str): Vec<Str> {
    const startStr = start.unwrap();

    if (this._useWasm) {
      try {
        if (typeof this._inner.breadthFirstSearch === "function") {
          const result = this._inner.breadthFirstSearch(startStr);
          return Vec.from(
            Array.from(result).map((v: unknown) => Str.fromRaw(String(v)))
          );
        } else {
          console.warn(
            "WASM breadthFirstSearch method not found, using JS implementation"
          );
        }
      } catch (error) {
        console.warn(
          `WASM breadthFirstSearch failed, using JS fallback: ${error}`
        );
      }
    }

    if (!this._adjacencyList.has(startStr)) {
      return Vec.empty();
    }

    const visited = new Set<string>();
    const queue: string[] = [startStr];
    const result: string[] = [];

    visited.add(startStr);

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      const neighbors = this._adjacencyList.get(current) || [];
      for (const { to } of neighbors) {
        if (!visited.has(to)) {
          visited.add(to);
          queue.push(to);
        }
      }
    }

    return Vec.from(result.map((v) => Str.fromRaw(v)));
  }

  dijkstra(
    start: Str,
    end?: Str
  ): Option<
    Result<
      {
        distances: Vec<[Str, Option<f64>]>;
        path?: Option<Vec<Str>>;
      },
      GraphError
    >
  > {
    const startStr = start.unwrap();
    const endStr = end ? end.unwrap() : undefined;

    if (this._useWasm) {
      try {
        if (typeof this._inner.dijkstra === "function") {
          const result = this._inner.dijkstra(startStr, endStr);

          if (result === null || result === undefined) return Option.None();

          return Option.Some(
            Ok({
              distances: Vec.from(
                Object.entries(result.distances).map(([vertex, distance]) => [
                  Str.fromRaw(vertex),
                  distance === null
                    ? Option.None()
                    : Option.Some(f64(Number(distance))),
                ])
              ),
              path: result.path
                ? Option.Some(
                    Vec.from(
                      Array.from(result.path).map((v: unknown) =>
                        Str.fromRaw(String(v))
                      )
                    )
                  )
                : Option.None(),
            })
          );
        } else {
          console.warn(
            "WASM dijkstra method not found, using JS implementation"
          );
        }
      } catch (error) {
        console.warn(`WASM dijkstra failed, using JS fallback: ${error}`);
      }
    }

    if (!this._adjacencyList.has(startStr)) {
      return Option.Some(
        Err(new GraphError(Str.fromRaw(`Start vertex ${startStr} not found`)))
      );
    }

    if (endStr && !this._adjacencyList.has(endStr)) {
      return Option.Some(
        Err(new GraphError(Str.fromRaw(`End vertex ${endStr} not found`)))
      );
    }

    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    const unvisited = new Set<string>();

    for (const vertex of this._adjacencyList.keys()) {
      distances[vertex] = vertex === startStr ? 0 : Infinity;
      previous[vertex] = null;
      unvisited.add(vertex);
    }

    while (unvisited.size > 0) {
      let minVertex: string | null = null;
      let minDistance = Infinity;

      for (const vertex of unvisited) {
        if (distances[vertex] < minDistance) {
          minVertex = vertex;
          minDistance = distances[vertex];
        }
      }

      if (minVertex === null || minDistance === Infinity) {
        break;
      }

      if (minVertex === endStr) {
        break;
      }

      unvisited.delete(minVertex);

      const neighbors = this._adjacencyList.get(minVertex) || [];
      for (const { to, weight } of neighbors) {
        if (unvisited.has(to)) {
          const alt = distances[minVertex] + weight;
          if (alt < distances[to]) {
            distances[to] = alt;
            previous[to] = minVertex;
          }
        }
      }
    }

    const distanceEntries: [Str, Option<f64>][] = Object.entries(distances).map(
      ([vertex, distance]) => [
        Str.fromRaw(vertex),
        isFinite(distance) ? Option.Some(f64(distance)) : Option.None(),
      ]
    );

    let path: Option<Vec<Str>> = Option.None();
    if (endStr && isFinite(distances[endStr])) {
      const pathArray: string[] = [];
      let current = endStr;

      while (current) {
        pathArray.unshift(current);
        if (current === startStr) break;

        const prev = previous[current];
        if (!prev) break;
        current = prev;
      }

      path = Option.Some(Vec.from(pathArray.map((v) => Str.fromRaw(v))));
    }

    return Option.Some(
      Ok({
        distances: Vec.from(distanceEntries),
        path,
      })
    );
  }

  toString(): Str {
    return Str.fromRaw(`[Graph vertices=${this.getVertices().len()}]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Graph._type);
  }
}

export async function createGraph(): Promise<Graph> {
  return Graph.create();
}
