#!/bin/bash

# Clean and rebuild
npm run clean
npm run build

# Verify WASM files in dist
echo "WASM files in dist:"
find dist -name "*.wasm"

# Pack the project
npm pack

# List contents of the tarball
echo "Contents of tarball:"
tar -tvf milost-*.tgz | grep -E "\.wasm$"