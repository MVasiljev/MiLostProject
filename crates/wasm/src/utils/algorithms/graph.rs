use wasm_bindgen::prelude::*;
use js_sys::{Array, Object, Map, Reflect};
use std::collections::{HashMap, HashSet, BinaryHeap};
use std::cmp::Ordering;

#[wasm_bindgen]
pub struct Graph {
    adjacency_list: HashMap<String, Vec<(String, f64)>>,
}

#[derive(Clone, Eq, PartialEq)]
struct Node {
    vertex: String,
    cost: i32,
}

impl Ord for Node {
    fn cmp(&self, other: &Self) -> Ordering {
        other.cost.cmp(&self.cost)
    }
}

impl PartialOrd for Node {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

#[wasm_bindgen]
impl Graph {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Graph {
            adjacency_list: HashMap::new(),
        }
    }

    #[wasm_bindgen(js_name = "addVertex")]
    pub fn add_vertex(&mut self, vertex: String) {
        if !self.adjacency_list.contains_key(&vertex) {
            self.adjacency_list.insert(vertex, Vec::new());
        }
    }

    #[wasm_bindgen(js_name = "addEdge")]
    pub fn add_edge(&mut self, from: String, to: String, weight: Option<f64>) {
        let weight_val = weight.unwrap_or(1.0);
        
        if !self.adjacency_list.contains_key(&from) {
            self.adjacency_list.insert(from.clone(), Vec::new());
        }
        if !self.adjacency_list.contains_key(&to) {
            self.adjacency_list.insert(to.clone(), Vec::new());
        }
        
        if let Some(edges) = self.adjacency_list.get_mut(&from) {
            let edge_exists = edges.iter().any(|(dest, _)| dest == &to);
            if !edge_exists {
                edges.push((to, weight_val));
            }
        }
    }

    #[wasm_bindgen(js_name = "removeVertex")]
    pub fn remove_vertex(&mut self, vertex: String) {
        for (_, edges) in self.adjacency_list.iter_mut() {
            edges.retain(|(dest, _)| dest != &vertex);
        }
        
        self.adjacency_list.remove(&vertex);
    }

    #[wasm_bindgen(js_name = "removeEdge")]
    pub fn remove_edge(&mut self, from: String, to: String) {
        if let Some(edges) = self.adjacency_list.get_mut(&from) {
            edges.retain(|(dest, _)| dest != &to);
        }
    }

    #[wasm_bindgen(js_name = "getVertices")]
    pub fn get_vertices(&self) -> Array {
        let result = Array::new();
        
        for vertex in self.adjacency_list.keys() {
            result.push(&JsValue::from_str(vertex));
        }
        
        result
    }

    #[wasm_bindgen(js_name = "getEdges")]
    pub fn get_edges(&self) -> Array {
        let result = Array::new();
        
        for (from, edges) in &self.adjacency_list {
            for (to, weight) in edges {
                let edge = Array::new();
                edge.push(&JsValue::from_str(from));
                edge.push(&JsValue::from_str(to));
                edge.push(&JsValue::from_f64(*weight));
                result.push(&edge);
            }
        }
        
        result
    }

    #[wasm_bindgen(js_name = "getAdjacencyList")]
    pub fn get_adjacency_list(&self) -> JsValue {
        let result = Object::new();
        
        for (vertex, edges) in &self.adjacency_list {
            let vertex_edges = Array::new();
            
            for (to, weight) in edges {
                let edge = Object::new();
                Reflect::set(&edge, &JsValue::from_str("vertex"), &JsValue::from_str(to)).unwrap();
                Reflect::set(&edge, &JsValue::from_str("weight"), &JsValue::from_f64(*weight)).unwrap();
                vertex_edges.push(&edge);
            }
            
            Reflect::set(&result, &JsValue::from_str(vertex), &vertex_edges).unwrap();
        }
        
        result.into()
    }

    #[wasm_bindgen(js_name = "dijkstra")]
    pub fn dijkstra(&self, start: String, end: Option<String>) -> JsValue {
        let mut distances: HashMap<String, f64> = HashMap::new();
        let mut previous: HashMap<String, Option<String>> = HashMap::new();
        let mut visited: HashSet<String> = HashSet::new();
        
        for vertex in self.adjacency_list.keys() {
            distances.insert(vertex.clone(), f64::INFINITY);
            previous.insert(vertex.clone(), None);
        }
        
        if let Some(start_dist) = distances.get_mut(&start) {
            *start_dist = 0.0;
        } else {
            return JsValue::NULL;
        }
        
        let mut current = start.clone();
        
        loop {
            visited.insert(current.clone());
            
            if let Some(target) = &end {
                if &current == target {
                    break;
                }
            }
            
            if let Some(edges) = self.adjacency_list.get(&current) {
                for (neighbor, weight) in edges {
                    if !visited.contains(neighbor) {
                        let current_dist = *distances.get(&current).unwrap_or(&f64::INFINITY);
                        let neighbor_dist = *distances.get(neighbor).unwrap_or(&f64::INFINITY);
                        let candidate_dist = current_dist + weight;
                        
                        if candidate_dist < neighbor_dist {
                            distances.insert(neighbor.clone(), candidate_dist);
                            previous.insert(neighbor.clone(), Some(current.clone()));
                        }
                    }
                }
            }
            
            let mut next_vertex: Option<String> = None;
            let mut min_distance = f64::INFINITY;
            
            for (vertex, &dist) in &distances {
                if !visited.contains(vertex) && dist < min_distance {
                    min_distance = dist;
                    next_vertex = Some(vertex.clone());
                }
            }
            
            if next_vertex.is_none() || min_distance == f64::INFINITY {
                break;
            }
            
            current = next_vertex.unwrap();
        }
        
        let result = Object::new();
        
        let distances_obj = Object::new();
        for (vertex, &dist) in &distances {
            if dist != f64::INFINITY {
                Reflect::set(&distances_obj, &JsValue::from_str(vertex), &JsValue::from_f64(dist)).unwrap();
            } else {
                Reflect::set(&distances_obj, &JsValue::from_str(vertex), &JsValue::NULL).unwrap();
            }
        }
        Reflect::set(&result, &JsValue::from_str("distances"), &distances_obj).unwrap();
        
        if let Some(target) = end {
            if let Some(&Some(ref _prev)) = previous.get(&target) {
                let mut path = Vec::new();
                let mut current = target.clone();
                
                while let Some(Some(prev)) = previous.get(&current) {
                    path.push(current.clone());
                    current = prev.clone();
                }
                path.push(start);
                path.reverse();
                
                let path_arr = Array::new();
                for vertex in path {
                    path_arr.push(&JsValue::from_str(&vertex));
                }
                
                Reflect::set(&result, &JsValue::from_str("path"), &path_arr).unwrap();
            }
        }
        
        result.into()
    }

    #[wasm_bindgen(js_name = "breadthFirstSearch")]
    pub fn bfs(&self, start: String) -> Array {
        let mut visited = HashSet::new();
        let mut queue = Vec::new();
        let result = Array::new();
        
        queue.push(start.clone());
        visited.insert(start.clone());
        
        while !queue.is_empty() {
            let vertex = queue.remove(0);
            result.push(&JsValue::from_str(&vertex));
            
            if let Some(neighbors) = self.adjacency_list.get(&vertex) {
                for (neighbor, _) in neighbors {
                    if !visited.contains(neighbor) {
                        visited.insert(neighbor.clone());
                        queue.push(neighbor.clone());
                    }
                }
            }
        }
        
        result
    }

    #[wasm_bindgen(js_name = "depthFirstSearch")]
    pub fn dfs(&self, start: String) -> Array {
        let mut visited = HashSet::new();
        let mut result = Vec::new();
        
        self.dfs_util(start, &mut visited, &mut result);
        
        let result_arr = Array::new();
        for vertex in result {
            result_arr.push(&JsValue::from_str(&vertex));
        }
        
        result_arr
    }
    
    fn dfs_util(&self, vertex: String, visited: &mut HashSet<String>, result: &mut Vec<String>) {
        visited.insert(vertex.clone());
        result.push(vertex.clone());
        
        if let Some(neighbors) = self.adjacency_list.get(&vertex) {
            for (neighbor, _) in neighbors {
                if !visited.contains(neighbor) {
                    self.dfs_util(neighbor.clone(), visited, result);
                }
            }
        }
    }

    #[wasm_bindgen(js_name = "kruskalMST")]
    pub fn kruskal_mst(&self) -> Array {
        let mut edges = Vec::new();
        
        for (from, neighbors) in &self.adjacency_list {
            for (to, weight) in neighbors {
                edges.push((from.clone(), to.clone(), *weight));
            }
        }
        
        edges.sort_by(|a, b| a.2.partial_cmp(&b.2).unwrap_or(Ordering::Equal));
        
        let mut result = Array::new();
        let mut parent: HashMap<String, String> = HashMap::new();
        let mut rank: HashMap<String, usize> = HashMap::new();
        
        for vertex in self.adjacency_list.keys() {
            parent.insert(vertex.clone(), vertex.clone());
            rank.insert(vertex.clone(), 0);
        }
        
        for (u, v, weight) in edges {
            let root_u = Self::find(&parent, &u);
            let root_v = Self::find(&parent, &v);
            
            if root_u != root_v {
                let edge = Array::new();
                edge.push(&JsValue::from_str(&u));
                edge.push(&JsValue::from_str(&v));
                edge.push(&JsValue::from_f64(weight));
                result.push(&edge);
                
                Self::union(&mut parent, &mut rank, &root_u, &root_v);
            }
        }
        
        result
    }
    
    fn find(parent: &HashMap<String, String>, vertex: &str) -> String {
        let mut v = vertex.to_string();
        while v != *parent.get(&v).unwrap_or(&v.clone()) {
            v = parent.get(&v).unwrap_or(&v.clone()).clone();
        }
        v
    }
    
    fn union(parent: &mut HashMap<String, String>, rank: &mut HashMap<String, usize>, x: &str, y: &str) {
        let root_x = Self::find(parent, x);
        let root_y = Self::find(parent, y);
        
        if root_x == root_y {
           return;
        }
        
        let rank_x = *rank.get(&root_x).unwrap_or(&0);
        let rank_y = *rank.get(&root_y).unwrap_or(&0);
        
        if rank_x < rank_y {
           parent.insert(root_x.clone(), root_y);
        } else if rank_x > rank_y {
           parent.insert(root_y.clone(), root_x);
        } else {
           parent.insert(root_y.clone(), root_x.clone());
           rank.insert(root_x, rank_x + 1);
        }
    }

    #[wasm_bindgen(js_name = "getShortestPath")]
    pub fn get_shortest_path(&self, start: String, end: String) -> Option<Array> {
        let result = self.dijkstra(start, Some(end));
        
        if result.is_null() {
            return None;
        }
        
        let obj = result.dyn_into::<Object>().ok()?;
        let path = Reflect::get(&obj, &JsValue::from_str("path")).ok()?;
        
        path.dyn_into::<Array>().ok()
    }
}