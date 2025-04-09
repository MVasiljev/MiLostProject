import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";

export interface KMeansResult {
  labels: Uint32Array;
  centroids: Float64Array;
  n_clusters: number;
  n_features: number;
}

export interface DecisionTreeModel {
  root: any;
}

export interface LinearRegressionModel {
  coefficients: Float64Array;
  intercept: number;
}

export class MachineLearningUtils {
  static kMeans(
    data: Float64Array,
    nClusters: number,
    nFeatures: number,
    maxIterations?: number
  ): KMeansResult {
    return wasm.MachineLearning.kMeans(
      data,
      nClusters,
      nFeatures,
      maxIterations
    );
  }

  static decisionTreeClassifier(
    xTrain: Float64Array,
    yTrain: Uint32Array,
    nFeatures: number,
    maxDepth?: number,
    minSamplesSplit?: number
  ): DecisionTreeModel {
    return wasm.MachineLearning.decisionTreeClassifier(
      xTrain,
      yTrain,
      nFeatures,
      maxDepth,
      minSamplesSplit
    );
  }

  static predictDecisionTree(
    model: DecisionTreeModel,
    xTest: Float64Array,
    nFeatures: number
  ): Uint32Array {
    return wasm.MachineLearning.predictDecisionTree(model, xTest, nFeatures);
  }

  static linearRegression(
    xTrain: Float64Array,
    yTrain: Float64Array,
    nFeatures: number
  ): LinearRegressionModel {
    return wasm.MachineLearning.linearRegression(xTrain, yTrain, nFeatures);
  }

  static predictLinearRegression(
    model: LinearRegressionModel,
    xTest: Float64Array,
    nFeatures: number
  ): Float64Array {
    return wasm.MachineLearning.predictLinearRegression(
      model,
      xTest,
      nFeatures
    );
  }

  static arrayToFloat64Array(data: number[][]): {
    array: Float64Array;
    nSamples: number;
    nFeatures: number;
  } {
    const nSamples = data.length;
    const nFeatures = data[0].length;
    const array = new Float64Array(nSamples * nFeatures);

    for (let i = 0; i < nSamples; i++) {
      for (let j = 0; j < nFeatures; j++) {
        array[i * nFeatures + j] = data[i][j];
      }
    }

    return { array, nSamples, nFeatures };
  }

  static float64ArrayToMatrix(
    array: Float64Array,
    nSamples: number,
    nFeatures: number
  ): number[][] {
    const matrix: number[][] = [];

    for (let i = 0; i < nSamples; i++) {
      const row: number[] = [];
      for (let j = 0; j < nFeatures; j++) {
        row.push(array[i * nFeatures + j]);
      }
      matrix.push(row);
    }

    return matrix;
  }

  static arrayToUint32Array(data: number[]): Uint32Array {
    const array = new Uint32Array(data.length);
    for (let i = 0; i < data.length; i++) {
      array[i] = data[i];
    }
    return array;
  }
}

export const useKMeans = () => {
  const cluster = (
    data: number[][],
    k: number,
    options?: { maxIterations?: number }
  ): {
    clusters: number[];
    centroids: number[][];
  } => {
    const { array, nSamples, nFeatures } =
      MachineLearningUtils.arrayToFloat64Array(data);

    const result = MachineLearningUtils.kMeans(
      array,
      k,
      nFeatures,
      options?.maxIterations
    );

    const labels = Array.from(result.labels);
    const centroidMatrix = MachineLearningUtils.float64ArrayToMatrix(
      result.centroids,
      k,
      nFeatures
    );

    return {
      clusters: labels,
      centroids: centroidMatrix,
    };
  };

  const predictCluster = (point: number[], centroids: number[][]): number => {
    let minDist = Number.MAX_VALUE;
    let closestCluster = 0;

    for (let i = 0; i < centroids.length; i++) {
      const dist = euclideanDistance(point, centroids[i]);
      if (dist < minDist) {
        minDist = dist;
        closestCluster = i;
      }
    }

    return closestCluster;
  };

  const euclideanDistance = (a: number[], b: number[]): number => {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      const diff = a[i] - b[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  };

  return {
    cluster,
    predictCluster,
  };
};

export const useDecisionTree = () => {
  const train = (
    xTrain: number[][],
    yTrain: number[],
    options?: { maxDepth?: number; minSamplesSplit?: number }
  ): DecisionTreeModel => {
    const { array: xArray, nFeatures } =
      MachineLearningUtils.arrayToFloat64Array(xTrain);
    const yArray = MachineLearningUtils.arrayToUint32Array(yTrain);

    return MachineLearningUtils.decisionTreeClassifier(
      xArray,
      yArray,
      nFeatures,
      options?.maxDepth,
      options?.minSamplesSplit
    );
  };

  const predict = (model: DecisionTreeModel, xTest: number[][]): number[] => {
    const { array: xArray, nFeatures } =
      MachineLearningUtils.arrayToFloat64Array(xTest);

    const predictions = MachineLearningUtils.predictDecisionTree(
      model,
      xArray,
      nFeatures
    );
    return Array.from(predictions);
  };

  const getFeatureImportance = (
    model: DecisionTreeModel,
    nFeatures: number
  ): number[] => {
    const importance = new Array(nFeatures).fill(0);

    const calculateNodeImportance = (node: any, depth: number = 0) => {
      if (!node || node.prediction !== undefined) {
        return;
      }

      const featureIndex = node.featureIndex;
      importance[featureIndex] += 1 / (depth + 1);

      calculateNodeImportance(node.left, depth + 1);
      calculateNodeImportance(node.right, depth + 1);
    };

    calculateNodeImportance(model.root);

    const sum = importance.reduce((a, b) => a + b, 0);
    return importance.map((value) => value / sum);
  };

  return {
    train,
    predict,
    getFeatureImportance,
  };
};

export const useLinearRegression = () => {
  const train = (
    xTrain: number[][],
    yTrain: number[]
  ): LinearRegressionModel => {
    const { array: xArray, nFeatures } =
      MachineLearningUtils.arrayToFloat64Array(xTrain);
    const yArray = new Float64Array(yTrain);

    return MachineLearningUtils.linearRegression(xArray, yArray, nFeatures);
  };

  const predict = (
    model: LinearRegressionModel,
    xTest: number[][]
  ): number[] => {
    const { array: xArray, nFeatures } =
      MachineLearningUtils.arrayToFloat64Array(xTest);

    const predictions = MachineLearningUtils.predictLinearRegression(
      model,
      xArray,
      nFeatures
    );
    return Array.from(predictions);
  };

  const getCoefficients = (model: LinearRegressionModel): number[] => {
    const coeffs = Array.from(model.coefficients);
    return coeffs.slice(1); // Remove intercept
  };

  const getIntercept = (model: LinearRegressionModel): number => {
    return model.intercept;
  };

  const calculateRSquared = (yTrue: number[], yPred: number[]): number => {
    const mean = yTrue.reduce((a, b) => a + b, 0) / yTrue.length;

    const totalSumSquares = yTrue.reduce((sum, val) => {
      const diff = val - mean;
      return sum + diff * diff;
    }, 0);

    const residualSumSquares = yTrue.reduce((sum, val, i) => {
      const diff = val - yPred[i];
      return sum + diff * diff;
    }, 0);

    return 1 - residualSumSquares / totalSumSquares;
  };

  const calculateMeanSquaredError = (
    yTrue: number[],
    yPred: number[]
  ): number => {
    const sum = yTrue.reduce((acc, val, i) => {
      const diff = val - yPred[i];
      return acc + diff * diff;
    }, 0);

    return sum / yTrue.length;
  };

  return {
    train,
    predict,
    getCoefficients,
    getIntercept,
    calculateRSquared,
    calculateMeanSquaredError,
  };
};
