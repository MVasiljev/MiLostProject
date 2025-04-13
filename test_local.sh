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
mv "$PACKAGE_NAME" ./example/

cd milost_showcase
echo "📥 Installing local milost package in example/"
npm install "./$PACKAGE_NAME"

echo "🧹 Cleaning up tarball"
rm "$PACKAGE_NAME"

echo "✅ Local install complete!"
