#!/bin/bash

if ! command -v wasm-pack &> /dev/null; then
    echo "wasm-pack not found. Installing..."
    cargo install wasm-pack
fi

echo "Building WASM package..."
wasm-pack build --target web

PROJECT_ROOT=$(cd ../.. && pwd)

mkdir -p "$PROJECT_ROOT/example/dist/pkg"

echo "Copying WASM files to dist..."
cp pkg/milost_wasm.js "$PROJECT_ROOT/example/dist/pkg/"
cp pkg/milost_wasm_bg.wasm "$PROJECT_ROOT/example/dist/pkg/"
cp pkg/milost_wasm.d.ts "$PROJECT_ROOT/example/dist/pkg/" 2>/dev/null

echo "WASM files copied to example/dist/pkg:"
ls -l "$PROJECT_ROOT/example/dist/pkg/"

echo "WASM build complete!"