import { Result, Ok, Err } from "../../core";
import {
  isWasmInitialized,
  getWasmModule,
  initWasm,
} from "../../initWasm/init";
import { callWasmStaticMethod } from "../../initWasm/lib";

export class ImageProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageProcessingError";
  }
}

export interface RotateResult {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export class ImageProcessing {
  private static _useWasm: boolean = true;

  private static get useWasm(): boolean {
    return ImageProcessing._useWasm && isWasmInitialized();
  }

  static async initialize(): Promise<void> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(`WASM initialization failed: ${error}`);
        ImageProcessing._useWasm = false;
      }
    }
  }

  static grayscale(imageData: Uint8ClampedArray): Uint8ClampedArray {
    if (imageData.length % 4 !== 0) {
      return new Uint8ClampedArray(0);
    }

    if (ImageProcessing.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.ImageProcessing?.grayscale === "function") {
          return wasmModule.ImageProcessing.grayscale(imageData);
        }
      } catch (error) {
        console.warn(`WASM grayscale failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod(
      "ImageProcessing",
      "grayscale",
      [imageData],
      () => {
        const result = new Uint8ClampedArray(imageData.length);

        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const a = imageData[i + 3];

          const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

          result[i] = gray;
          result[i + 1] = gray;
          result[i + 2] = gray;
          result[i + 3] = a;
        }

        return result;
      }
    );
  }

  static invert(imageData: Uint8ClampedArray): Uint8ClampedArray {
    if (imageData.length % 4 !== 0) {
      return new Uint8ClampedArray(0);
    }

    if (ImageProcessing.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.ImageProcessing?.invert === "function") {
          return wasmModule.ImageProcessing.invert(imageData);
        }
      } catch (error) {
        console.warn(`WASM invert failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod(
      "ImageProcessing",
      "invert",
      [imageData],
      () => {
        const result = new Uint8ClampedArray(imageData.length);

        for (let i = 0; i < imageData.length; i += 4) {
          result[i] = 255 - imageData[i];
          result[i + 1] = 255 - imageData[i + 1];
          result[i + 2] = 255 - imageData[i + 2];
          result[i + 3] = imageData[i + 3];
        }

        return result;
      }
    );
  }

  static brightness(
    imageData: Uint8ClampedArray,
    factor: number
  ): Uint8ClampedArray {
    if (imageData.length % 4 !== 0) {
      return new Uint8ClampedArray(0);
    }

    if (ImageProcessing.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.ImageProcessing?.brightness === "function") {
          return wasmModule.ImageProcessing.brightness(imageData, factor);
        }
      } catch (error) {
        console.warn(`WASM brightness failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod(
      "ImageProcessing",
      "brightness",
      [imageData, factor],
      () => {
        const result = new Uint8ClampedArray(imageData.length);

        for (let i = 0; i < imageData.length; i += 4) {
          result[i] = Math.min(
            255,
            Math.max(0, Math.round(imageData[i] * factor))
          );
          result[i + 1] = Math.min(
            255,
            Math.max(0, Math.round(imageData[i + 1] * factor))
          );
          result[i + 2] = Math.min(
            255,
            Math.max(0, Math.round(imageData[i + 2] * factor))
          );
          result[i + 3] = imageData[i + 3];
        }

        return result;
      }
    );
  }

  static blur(
    imageData: Uint8ClampedArray,
    width: number,
    height: number,
    radius: number
  ): Uint8ClampedArray {
    if (imageData.length % 4 !== 0 || imageData.length !== width * height * 4) {
      return new Uint8ClampedArray(0);
    }

    if (ImageProcessing.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.ImageProcessing?.blur === "function") {
          return wasmModule.ImageProcessing.blur(
            imageData,
            width,
            height,
            radius
          );
        }
      } catch (error) {
        console.warn(`WASM blur failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod(
      "ImageProcessing",
      "blur",
      [imageData, width, height, radius],
      () => {
        const result = new Uint8ClampedArray(imageData.length);
        const r = radius;

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            let rSum = 0,
              gSum = 0,
              bSum = 0;
            let count = 0;

            for (let dy = -r; dy <= r; dy++) {
              for (let dx = -r; dx <= r; dx++) {
                const nx = x + dx;
                const ny = y + dy;

                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                  const idx = (ny * width + nx) * 4;

                  rSum += imageData[idx];
                  gSum += imageData[idx + 1];
                  bSum += imageData[idx + 2];
                  count++;
                }
              }
            }

            const idx = (y * width + x) * 4;

            result[idx] = Math.round(rSum / count);
            result[idx + 1] = Math.round(gSum / count);
            result[idx + 2] = Math.round(bSum / count);
            result[idx + 3] = imageData[idx + 3];
          }
        }

        return result;
      }
    );
  }

  static edgeDetection(
    imageData: Uint8ClampedArray,
    width: number,
    height: number
  ): Uint8ClampedArray {
    if (imageData.length % 4 !== 0 || imageData.length !== width * height * 4) {
      return new Uint8ClampedArray(0);
    }

    if (ImageProcessing.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.ImageProcessing?.edgeDetection === "function") {
          return wasmModule.ImageProcessing.edgeDetection(
            imageData,
            width,
            height
          );
        }
      } catch (error) {
        console.warn(`WASM edgeDetection failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod(
      "ImageProcessing",
      "edgeDetection",
      [imageData, width, height],
      () => {
        const gray = ImageProcessing.grayscale(imageData);
        const result = new Uint8ClampedArray(imageData.length);

        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const idx = (y * width + x) * 4;

            const topLeft = gray[(y - 1) * width * 4 + (x - 1) * 4];
            const top = gray[(y - 1) * width * 4 + x * 4];
            const topRight = gray[(y - 1) * width * 4 + (x + 1) * 4];

            const left = gray[y * width * 4 + (x - 1) * 4];
            const right = gray[y * width * 4 + (x + 1) * 4];

            const bottomLeft = gray[(y + 1) * width * 4 + (x - 1) * 4];
            const bottom = gray[(y + 1) * width * 4 + x * 4];
            const bottomRight = gray[(y + 1) * width * 4 + (x + 1) * 4];

            const hGradient =
              -topLeft -
              2 * left -
              bottomLeft +
              topRight +
              2 * right +
              bottomRight;
            const vGradient =
              -topLeft -
              2 * top -
              topRight +
              bottomLeft +
              2 * bottom +
              bottomRight;

            const gradient = Math.min(
              255,
              Math.sqrt(hGradient * hGradient + vGradient * vGradient)
            );

            result[idx] = gradient;
            result[idx + 1] = gradient;
            result[idx + 2] = gradient;
            result[idx + 3] = gray[idx + 3];
          }
        }

        return result;
      }
    );
  }

  static resize(
    imageData: Uint8ClampedArray,
    sourceWidth: number,
    sourceHeight: number,
    targetWidth: number,
    targetHeight: number
  ): Uint8ClampedArray {
    if (
      imageData.length % 4 !== 0 ||
      imageData.length !== sourceWidth * sourceHeight * 4
    ) {
      return new Uint8ClampedArray(0);
    }

    if (ImageProcessing.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.ImageProcessing?.resize === "function") {
          return wasmModule.ImageProcessing.resize(
            imageData,
            sourceWidth,
            sourceHeight,
            targetWidth,
            targetHeight
          );
        }
      } catch (error) {
        console.warn(`WASM resize failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod(
      "ImageProcessing",
      "resize",
      [imageData, sourceWidth, sourceHeight, targetWidth, targetHeight],
      () => {
        const result = new Uint8ClampedArray(targetWidth * targetHeight * 4);

        const xRatio = sourceWidth / targetWidth;
        const yRatio = sourceHeight / targetHeight;

        for (let y = 0; y < targetHeight; y++) {
          for (let x = 0; x < targetWidth; x++) {
            const px = Math.floor(x * xRatio);
            const py = Math.floor(y * yRatio);

            const sourceIdx = (py * sourceWidth + px) * 4;
            const targetIdx = (y * targetWidth + x) * 4;

            result[targetIdx] = imageData[sourceIdx];
            result[targetIdx + 1] = imageData[sourceIdx + 1];
            result[targetIdx + 2] = imageData[sourceIdx + 2];
            result[targetIdx + 3] = imageData[sourceIdx + 3];
          }
        }

        return result;
      }
    );
  }

  static rotate(
    imageData: Uint8ClampedArray,
    width: number,
    height: number,
    angleDegrees: number
  ): Result<RotateResult, ImageProcessingError> {
    if (imageData.length % 4 !== 0 || imageData.length !== width * height * 4) {
      return Err(new ImageProcessingError("Invalid image data dimensions"));
    }

    if (ImageProcessing.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.ImageProcessing?.rotate === "function") {
          const result = wasmModule.ImageProcessing.rotate(
            imageData,
            width,
            height,
            angleDegrees
          );
          return Ok({
            data: result.data,
            width: result.width,
            height: result.height,
          });
        }
      } catch (error) {
        console.warn(`WASM rotate failed, using JS fallback: ${error}`);
      }
    }

    try {
      const result = callWasmStaticMethod(
        "ImageProcessing",
        "rotate",
        [imageData, width, height, angleDegrees],
        () => {
          const angleRadians = (angleDegrees * Math.PI) / 180;
          const sin = Math.sin(angleRadians);
          const cos = Math.cos(angleRadians);

          const centerX = width / 2;
          const centerY = height / 2;

          let minX = Number.MAX_VALUE;
          let minY = Number.MAX_VALUE;
          let maxX = Number.MIN_VALUE;
          let maxY = Number.MIN_VALUE;

          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const nx = (x - centerX) * cos - (y - centerY) * sin + centerX;
              const ny = (x - centerX) * sin + (y - centerY) * cos + centerY;

              minX = Math.min(minX, nx);
              minY = Math.min(minY, ny);
              maxX = Math.max(maxX, nx);
              maxY = Math.max(maxY, ny);
            }
          }

          const newWidth = Math.ceil(maxX - minX);
          const newHeight = Math.ceil(maxY - minY);

          const result = new Uint8ClampedArray(newWidth * newHeight * 4);

          for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
              const nx =
                (x + minX - centerX) * cos +
                (y + minY - centerY) * sin +
                centerX;
              const ny =
                -(x + minX - centerX) * sin +
                (y + minY - centerY) * cos +
                centerY;

              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const srcX = Math.floor(nx);
                const srcY = Math.floor(ny);

                const srcIdx = (srcY * width + srcX) * 4;
                const tgtIdx = (y * newWidth + x) * 4;

                result[tgtIdx] = imageData[srcIdx];
                result[tgtIdx + 1] = imageData[srcIdx + 1];
                result[tgtIdx + 2] = imageData[srcIdx + 2];
                result[tgtIdx + 3] = imageData[srcIdx + 3];
              }
            }
          }

          return {
            data: result,
            width: newWidth,
            height: newHeight,
          };
        }
      );

      return Ok(result);
    } catch (error) {
      return Err(
        new ImageProcessingError(
          error instanceof Error ? error.message : String(error)
        )
      );
    }
  }
}

export default ImageProcessing;
