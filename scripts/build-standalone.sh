#!/bin/bash
# scripts/build-standalone.sh

# Set up colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Building MiLost standalone library...${NC}"

# Step 1: Build WASM component
echo -e "${GREEN}Building WASM module...${NC}"
cd crates/wasm
wasm-pack build --target web
cd ../..

# Step 2: Copy WASM files to pkg directory
echo -e "${GREEN}Copying WASM files to package directory...${NC}"
mkdir -p pkg
cp -r crates/wasm/pkg/* pkg/

# Step 3: Build TypeScript library
echo -e "${GREEN}Building TypeScript library...${NC}"
# Make sure TypeScript compiler is configured correctly
npx tsc

# Step 4: Fix module paths in compiled JS files (critical for linking)
echo -e "${GREEN}Fixing module paths...${NC}"
node scripts/fix-module-paths.js

echo -e "${GREEN}Build completed successfully!${NC}"
echo -e "${YELLOW}You can now link this library to other projects using:${NC}"
echo "  npm link"
echo "  cd /path/to/your/project"
echo "  npm link milost"