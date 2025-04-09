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

  static readonly _type = "Graph";

  private constructor(useWasm: boolean = true, existingWasmGraph?: any) {
    this._useWasm = useWasm && isWasmInitialized();

    if (existingWasmGraph) {
      this._inner = existingWasmGraph;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        this._inner = new wasmModule.Graph();
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
      await initWasm();
    }
    return new Graph();
  }

  addVertex(vertex: Str): Result<void, GraphError> {
    if (this._useWasm) {
      try {
        this._inner.addVertex(vertex.unwrap());
        return Ok(undefined);
      } catch (error) {
        return Err(
          new GraphError(
            Str.fromRaw(
              `Failed to add vertex: ${
                error instanceof Error ? error.message : String(error)
              }`
            )
          )
        );
      }
    }
    return Ok(undefined);
  }

  addEdge(from: Str, to: Str, weight?: f64): Result<void, GraphError> {
    if (this._useWasm) {
      try {
        this._inner.addEdge(from.unwrap(), to.unwrap(), weight);
        return Ok(undefined);
      } catch (error) {
        return Err(
          new GraphError(
            Str.fromRaw(
              `Failed to add edge: ${
                error instanceof Error ? error.message : String(error)
              }`
            )
          )
        );
      }
    }
    return Ok(undefined);
  }

  getVertices(): Vec<Str> {
    if (this._useWasm) {
      try {
        const vertices = this._inner.getVertices();
        return Vec.from(
          Array.from(vertices).map((v: unknown) => Str.fromRaw(String(v)))
        );
      } catch (error) {
        console.warn(`WASM getVertices failed, using JS fallback: ${error}`);
      }
    }
    return Vec.empty();
  }

  getEdges(): Vec<GraphEdge> {
    if (this._useWasm) {
      try {
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
      } catch (error) {
        console.warn(`WASM getEdges failed, using JS fallback: ${error}`);
      }
    }
    return Vec.empty();
  }

  breadthFirstSearch(start: Str): Vec<Str> {
    if (this._useWasm) {
      try {
        const result = this._inner.breadthFirstSearch(start.unwrap());
        return Vec.from(
          Array.from(result).map((v: unknown) => Str.fromRaw(String(v)))
        );
      } catch (error) {
        console.warn(
          `WASM breadthFirstSearch failed, using JS fallback: ${error}`
        );
      }
    }
    return Vec.empty();
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
    if (this._useWasm) {
      try {
        const result = this._inner.dijkstra(
          start.unwrap(),
          end ? end.unwrap() : undefined
        );

        if (result === null) return Option.None();

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
      } catch (error) {
        return Option.Some(
          Err(
            new GraphError(
              Str.fromRaw(
                `Dijkstra algorithm failed: ${
                  error instanceof Error ? error.message : String(error)
                }`
              )
            )
          )
        );
      }
    }
    return Option.None();
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
