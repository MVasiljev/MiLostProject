#!/bin/bash

set -e

echo "🧠 Validating WASM binary..."
node ./scripts/build.js

echo "📦 Building milost..."
npm run build

echo "📦 Packing milost..."
PACKAGE_TGZ=$(npm pack)
PACKAGE_NAME=$(basename "$PACKAGE_TGZ")

echo "📁 Moving $PACKAGE_NAME into ./milost_showcase/"
mv "$PACKAGE_NAME" ./milost_showcase/

# Step 1: Install in milost_showcase (server)
cd milost_showcase
echo "📥 Installing local milost package in milost_showcase/"
npm install "./$PACKAGE_NAME"

# Step 2: Install in milost_showcase/client (Vite frontend)
cd client
echo "📥 Installing local milost package in milost_showcase/client/"
npm install "../$PACKAGE_NAME"

# Step 3: Clean up
cd ..
echo "🧹 Cleaning up tarball"
rm "$PACKAGE_NAME"

echo "✅ Local install complete in both server and client!"
