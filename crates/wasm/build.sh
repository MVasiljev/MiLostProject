#!/bin/bash

set -e

echo "🔧 Building MiLost WASM package..."
cd "$(dirname "$0")"

# Build the WASM with wasm-pack
wasm-pack build --target web --release --out-dir ./pkg

# Check that the WASM binary exists and is valid
WASM_FILE="./pkg/milost_wasm_bg.wasm"

if [ ! -f "$WASM_FILE" ]; then
  echo "❌ Error: WASM file not found at $WASM_FILE"
  exit 1
fi

# Check magic number (should start with 00 61 73 6D = '\0asm')
MAGIC_BYTES=$(xxd -p -l 4 "$WASM_FILE")
if [[ "$MAGIC_BYTES" != "0061736d" ]]; then
  echo "❌ Invalid WASM binary. Magic bytes: $MAGIC_BYTES"
  exit 1
fi

echo "✅ Valid WASM binary confirmed"

# List files in pkg directory
echo "📦 WASM build produced the following files:"
ls -la ./pkg

# Prepare output directory
DIST_DIR="../../../dist/wasm"
mkdir -p "$DIST_DIR"

# Copy all files from pkg to dist/wasm
cp -r ./pkg/* "$DIST_DIR"

# Remove .gitignore from dist/wasm if it exists
if [ -f "$DIST_DIR/.gitignore" ]; then
  echo "🧹 Removing .gitignore from dist/wasm/"
  rm "$DIST_DIR/.gitignore"
fi

echo "✅ Copied WASM build artifacts to $DIST_DIR"
echo "📂 Final contents of dist/wasm:"
ls -la "$DIST_DIR"
