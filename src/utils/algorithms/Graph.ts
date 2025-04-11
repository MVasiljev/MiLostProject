/**
 * Graph Module for MiLost
 *
 * Provides a flexible graph data structure with WebAssembly acceleration
 * and JavaScript fallback capabilities.
 */
import { AppError, Result, Ok } from "../../core";
import { WasmModule, registerModule, getWasmModule } from "../../initWasm";
import { Str, Vec, f64 } from "../../types";
import { Option } from "../../index";

/**
 * Custom error for Graph operations
 */
export class GraphError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

/**
 * Interface for graph edges
 */
export interface GraphEdge {
  from: Str;
  to: Str;
  weight: f64;
}

/**
 * Interface for adjacency list entries
 */
export interface AdjacencyListEntry {
  vertex: Str;
  weight: f64;
}

/**
 * Module definition for Graph WASM implementation
 */
const graphModule: WasmModule = {
  name: "Graph",

  initialize(wasmModule: any) {
    console.log("Initializing Graph module with WASM...");

    if (typeof wasmModule.Graph === "function") {
      console.log("Found Graph constructor in WASM module");
      Graph._useWasm = true;

      const staticMethods = ["create", "new"];
      staticMethods.forEach((method) => {
        if (typeof wasmModule.Graph[method] === "function") {
          console.log(`Found static method: Graph.${method}`);
        } else {
          console.warn(`Missing static method: Graph.${method}`);
        }
      });

      const instanceMethods = [
        "addVertex",
        "addEdge",
        "getVertices",
        "getEdges",
        "breadthFirstSearch",
        "dijkstra",
        "toString",
      ];

      try {
        const sampleGraph = new wasmModule.Graph();
        instanceMethods.forEach((method) => {
          if (typeof sampleGraph[method] === "function") {
            console.log(`Found instance method: Graph.prototype.${method}`);
          } else {
            console.warn(`Missing instance method: Graph.prototype.${method}`);
          }
        });
      } catch (error) {
        console.warn("Couldn't create sample Graph instance:", error);
      }
    } else {
      throw new Error("Required WASM functions not found for Graph");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for Graph");
    Graph._useWasm = false;
  },
};

registerModule(graphModule);

/**
 * Graph class with WASM acceleration
 */
export class Graph {
  static readonly _type = "Graph";
  static _useWasm: boolean = false;

  private _inner: any;
  private _adjacencyList: Map<string, Array<{ to: string; weight: number }>>;

  /**
   * Private constructor to control instance creation
   */
  private constructor(existingWasmGraph?: any) {
    this._adjacencyList = new Map();

    if (existingWasmGraph) {
      this._inner = existingWasmGraph;
    } else if (Graph._useWasm) {
      try {
        const wasmModule = getWasmModule();
        this._inner = new wasmModule.Graph();
      } catch (error) {
        console.warn(
          `WASM Graph creation failed, falling back to JS implementation: ${error}`
        );
        this._inner = this.createJsGraph();
      }
    } else {
      this._inner = this.createJsGraph();
    }
  }

  /**
   * Create a JS fallback implementation of the graph
   */
  private createJsGraph(): any {
    const adjacencyList = new Map<
      string,
      Array<{ to: string; weight: number }>
    >();

    return {
      addVertex: (vertex: string) => {
        if (!adjacencyList.has(vertex)) {
          adjacencyList.set(vertex, []);
        }
      },

      addEdge: (from: string, to: string, weight: number = 1) => {
        if (!adjacencyList.has(from)) {
          adjacencyList.set(from, []);
        }
        if (!adjacencyList.has(to)) {
          adjacencyList.set(to, []);
        }
        adjacencyList.get(from)!.push({ to, weight });
      },

      getVertices: () => Array.from(adjacencyList.keys()),

      getEdges: () => {
        const edges: Array<[string, string, number]> = [];
        for (const [from, neighbors] of adjacencyList.entries()) {
          for (const { to, weight } of neighbors) {
            edges.push([from, to, weight]);
          }
        }
        return edges;
      },

      breadthFirstSearch: (start: string) => {
        if (!adjacencyList.has(start)) return [];

        const visited = new Set<string>();
        const queue: string[] = [start];
        const result: string[] = [];

        visited.add(start);

        while (queue.length > 0) {
          const current = queue.shift()!;
          result.push(current);

          const neighbors = adjacencyList.get(current) || [];
          for (const { to } of neighbors) {
            if (!visited.has(to)) {
              visited.add(to);
              queue.push(to);
            }
          }
        }

        return result;
      },

      dijkstra: (start: string, end?: string) => {
        if (!adjacencyList.has(start)) return null;
        if (end && !adjacencyList.has(end)) return null;

        const distances: { [key: string]: number } = {};
        const previous: { [key: string]: string | null } = {};
        const unvisited = new Set<string>();

        for (const vertex of adjacencyList.keys()) {
          distances[vertex] = vertex === start ? 0 : Infinity;
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

          if (minVertex === null || minDistance === Infinity) break;
          if (minVertex === end) break;

          unvisited.delete(minVertex);

          const neighbors = adjacencyList.get(minVertex) || [];
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

        return {
          distances,
          path: end ? reconstructPath(previous, start, end) : undefined,
        };
      },

      toString: () => `[Graph vertices=${adjacencyList.size}]`,
    };

    function reconstructPath(
      previous: { [key: string]: string | null },
      start: string,
      end: string
    ): string[] | null {
      const path: string[] = [];
      let current = end;

      while (current) {
        path.unshift(current);
        if (current === start) break;

        const prev = previous[current];
        if (!prev) return null;
        current = prev;
      }

      return path;
    }
  }

  /**
   * Create a new graph instance
   */
  static new(): Graph {
    return new Graph();
  }

  /**
   * Async graph creation method
   */
  static async create(): Promise<Graph> {
    if (!Graph._useWasm) {
      return new Graph();
    }

    const wasmModule = getWasmModule();
    if (typeof wasmModule.Graph?.create === "function") {
      try {
        const wasmGraph = await wasmModule.Graph.create();
        return new Graph(wasmGraph);
      } catch (error) {
        console.warn(`WASM creation failed, using JS fallback: ${error}`);
        return new Graph();
      }
    }

    return new Graph();
  }

  /**
   * Add a vertex to the graph
   */
  addVertex(vertex: Str): Result<void, GraphError> {
    const vertexStr = vertex.unwrap();

    if (Graph._useWasm) {
      try {
        this._inner.addVertex(vertexStr);
      } catch (error) {
        console.warn(`WASM addVertex failed, using JS fallback: ${error}`);
      }
    }

    this._inner.addVertex(vertexStr);
    return Ok(undefined);
  }

  /**
   * Add an edge to the graph
   * @param graph The graph instance
   * @param from Source vertex
   * @param to Destination vertex
   * @param weight Optional edge weight
   * @returns Result of the edge addition
   */
  addEdge(
    graph: any,
    from: Str,
    to: Str,
    weight?: f64
  ): Result<void, GraphError> {
    const fromStr = from.unwrap();
    const toStr = to.unwrap();
    const weightValue = weight ? Number(weight) : 1;

    try {
      const wasmModule = getWasmModule();
      if (wasmModule?.Graph?.prototype?.addEdge) {
        wasmModule.Graph.prototype.addEdge.call(
          graph._inner,
          fromStr,
          toStr,
          weightValue
        );
      }
    } catch (error) {
      console.warn(`WASM addEdge failed, using JS fallback: ${error}`);
    }

    graph._inner.addEdge(fromStr, toStr, weightValue);
    return Ok(undefined);
  }

  /**
   * Get all vertices in the graph
   * @param graph The graph instance
   * @returns A vector of vertices
   */
  getVertices(graph: any): Vec<Str> {
    let vertices: string[];

    try {
      const wasmModule = getWasmModule();
      if (wasmModule?.Graph?.prototype?.getVertices) {
        vertices = wasmModule.Graph.prototype.getVertices.call(graph._inner);
      } else {
        vertices = graph._inner.getVertices();
      }
    } catch (error) {
      console.warn(`WASM getVertices failed, using JS fallback: ${error}`);
      vertices = graph._inner.getVertices();
    }

    return Vec.from(vertices.map((v) => Str.fromRaw(v)));
  }

  /**
   * Get all edges in the graph
   * @param graph The graph instance
   * @returns A vector of graph edges
   */
  getEdges(graph: any): Vec<{ from: Str; to: Str; weight: f64 }> {
    let edges: [string, string, number][];

    try {
      const wasmModule = getWasmModule();
      if (wasmModule?.Graph?.prototype?.getEdges) {
        edges = wasmModule.Graph.prototype.getEdges.call(graph._inner);
      } else {
        edges = graph._inner.getEdges();
      }
    } catch (error) {
      console.warn(`WASM getEdges failed, using JS fallback: ${error}`);
      edges = graph._inner.getEdges();
    }

    return Vec.from(
      edges.map(([from, to, weight]) => ({
        from: Str.fromRaw(from),
        to: Str.fromRaw(to),
        weight: f64(weight),
      }))
    );
  }

  /**
   * Perform breadth-first search starting from a vertex
   * @param graph The graph instance
   * @param start Starting vertex
   * @returns A vector of visited vertices
   */
  breadthFirstSearch(graph: any, start: Str): Vec<Str> {
    const startStr = start.unwrap();
    let result: string[];

    try {
      const wasmModule = getWasmModule();
      if (wasmModule?.Graph?.prototype?.breadthFirstSearch) {
        result = wasmModule.Graph.prototype.breadthFirstSearch.call(
          graph._inner,
          startStr
        );
      } else {
        result = graph._inner.breadthFirstSearch(startStr);
      }
    } catch (error) {
      console.warn(
        `WASM breadthFirstSearch failed, using JS fallback: ${error}`
      );
      result = graph._inner.breadthFirstSearch(startStr);
    }

    return Vec.from(result.map((v) => Str.fromRaw(v)));
  }

  /**
   * Perform Dijkstra's shortest path algorithm
   * @param graph The graph instance
   * @param start Starting vertex
   * @param end Optional ending vertex
   * @returns Option of Result containing distances and optional path
   */
  dijkstra(
    graph: any,
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
    let result: {
      distances: { [key: string]: number };
      path?: string[] | null;
    } | null;

    try {
      const wasmModule = getWasmModule();
      if (wasmModule?.Graph?.prototype?.dijkstra) {
        result = wasmModule.Graph.prototype.dijkstra.call(
          graph._inner,
          startStr,
          endStr
        );
      } else {
        result = graph._inner.dijkstra(startStr, endStr);
      }
    } catch (error) {
      console.warn(`WASM dijkstra failed, using JS fallback: ${error}`);
      result = graph._inner.dijkstra(startStr, endStr);
    }

    if (!result) {
      return Option.None();
    }

    const distanceEntries: [Str, Option<f64>][] = Object.entries(
      result.distances
    ).map(([vertex, distance]) => [
      Str.fromRaw(vertex),
      isFinite(distance) ? Option.Some(f64(distance)) : Option.None(),
    ]);

    const path: Option<Vec<Str>> = result.path
      ? Option.Some(Vec.from(result.path.map((v) => Str.fromRaw(v))))
      : Option.None();

    return Option.Some(
      Ok({
        distances: Vec.from(distanceEntries),
        path,
      })
    );
  }

  /**
   * Convert graph to string representation
   * @param graph The graph instance
   * @returns String representation of the graph
   */
  toString(graph: any): Str {
    let strRepr: string;

    try {
      const wasmModule = getWasmModule();
      if (wasmModule?.Graph?.prototype?.toString) {
        strRepr = wasmModule.Graph.prototype.toString.call(graph._inner);
      } else {
        strRepr = graph._inner.toString();
      }
    } catch (error) {
      console.warn(`WASM toString failed, using JS fallback: ${error}`);
      strRepr = graph._inner.toString();
    }

    return Str.fromRaw(strRepr);
  }
}

/**
 * Convenience function to create a graph
 */
export async function createGraph(): Promise<Graph> {
  return Graph.create();
}
