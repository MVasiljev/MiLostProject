import { AppError } from "../../../core";
import { Str, f64, u32 } from "../../../types";
import { Graph } from "../../../utils/algorithms/Graph";
import { Result } from "../../../core/result";

describe("Graph", () => {
  let graph: Graph;

  beforeEach(async () => {
    graph = await Graph.create();
  });

  it("should create a new graph instance", () => {
    expect(graph).toBeInstanceOf(Graph);
  });

  it("should add vertices", () => {
    const vertex1 = Str.fromRaw("A");
    const vertex2 = Str.fromRaw("B");

    const result1 = graph.addVertex(vertex1);
    const result2 = graph.addVertex(vertex2);

    expect(result1.isOk()).toBe(true);
    expect(result2.isOk()).toBe(true);

    const vertices = graph.getVertices();
    expect(vertices.len()).toBe(2);
    expect(vertices.get(u32(0)).unwrap().unwrap()).toBe("A");
    expect(vertices.get(u32(1)).unwrap().unwrap()).toBe("B");
  });

  it("should add edges", () => {
    const vertex1 = Str.fromRaw("A");
    const vertex2 = Str.fromRaw("B");
    const weight = f64(5.0);

    graph.addVertex(vertex1);
    graph.addVertex(vertex2);
    const result = graph.addEdge(vertex1, vertex2, weight);

    expect(result.isOk()).toBe(true);

    const edges = graph.getEdges();
    expect(edges.len()).toBe(1);
    expect(edges.get(u32(0)).unwrap().from.unwrap()).toBe("A");
    expect(edges.get(u32(0)).unwrap().to.unwrap()).toBe("B");
    expect(edges.get(u32(0)).unwrap().weight).toBe(5.0);
  });

  it("should perform breadth-first search", () => {
    const vertices = [
      Str.fromRaw("A"),
      Str.fromRaw("B"),
      Str.fromRaw("C"),
      Str.fromRaw("D"),
    ];

    vertices.forEach((v) => graph.addVertex(v));
    graph.addEdge(vertices[0], vertices[1]);
    graph.addEdge(vertices[0], vertices[2]);
    graph.addEdge(vertices[1], vertices[3]);

    const bfsResult = graph.breadthFirstSearch(vertices[0]);

    expect(bfsResult.len()).toBeGreaterThan(0);
    expect(bfsResult.get(u32(0)).unwrap().unwrap()).toBe("A");
  });

  it("should find shortest path using Dijkstra", () => {
    const vertices = [
      Str.fromRaw("A"),
      Str.fromRaw("B"),
      Str.fromRaw("C"),
      Str.fromRaw("D"),
    ];

    vertices.forEach((v) => graph.addVertex(v));
    graph.addEdge(vertices[0], vertices[1], f64(4.0));
    graph.addEdge(vertices[0], vertices[2], f64(2.0));
    graph.addEdge(vertices[1], vertices[3], f64(3.0));
    graph.addEdge(vertices[2], vertices[3], f64(1.0));

    const dijkstraResult = graph.dijkstra(vertices[0], vertices[3]);

    expect(dijkstraResult.isSome()).toBe(true);

    dijkstraResult.match(
      (
        result: Result<
          {
            distances: any;
            path?: any;
          },
          AppError
        >
      ) => {
        expect(result.isOk()).toBe(true);
        result.match(
          (success: { distances: any; path?: any }) => {
            expect(success.path.isSome()).toBe(true);
            const path = success.path.unwrap();
            expect(path.len()).toBeGreaterThan(1);
          },
          (error: AppError) => {
            fail(`Unexpected error: ${error}`);
          }
        );
      },
      () => fail("Dijkstra result is None")
    );
  });

  it("should handle multiple edges and vertices", () => {
    const vertices = [
      Str.fromRaw("A"),
      Str.fromRaw("B"),
      Str.fromRaw("C"),
      Str.fromRaw("D"),
      Str.fromRaw("E"),
    ];

    vertices.forEach((v) => graph.addVertex(v));

    const edgeOperations = [
      { from: vertices[0], to: vertices[1], weight: f64(5.0) },
      { from: vertices[0], to: vertices[2], weight: f64(2.0) },
      { from: vertices[1], to: vertices[3], weight: f64(4.0) },
      { from: vertices[2], to: vertices[4], weight: f64(7.0) },
    ];

    edgeOperations.forEach((edge) =>
      graph.addEdge(edge.from, edge.to, edge.weight)
    );

    const verticesResult = graph.getVertices();
    const edgesResult = graph.getEdges();

    expect(verticesResult.len()).toBe(5);
    expect(edgesResult.len()).toBe(4);
  });

  it("should convert to string representation", () => {
    const vertices = [Str.fromRaw("A"), Str.fromRaw("B"), Str.fromRaw("C")];

    vertices.forEach((v) => graph.addVertex(v));

    const stringRep = graph.toString();
    expect(stringRep.unwrap()).toMatch(/\[Graph vertices=3\]/);
  });
});
