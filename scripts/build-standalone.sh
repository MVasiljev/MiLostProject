#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Building MiLost standalone library...${NC}"

echo -e "${GREEN}Building WASM module...${NC}"
cd crates/wasm
wasm-pack build --target web
cd ../..

echo -e "${GREEN}Copying WASM files to package directory...${NC}"
mkdir -p pkg
cp -r crates/wasm/pkg/* pkg/

echo -e "${GREEN}Building TypeScript library...${NC}"
npx tsc

echo -e "${GREEN}Fixing module paths...${NC}"
node scripts/fix-module-paths.js

echo -e "${GREEN}Build completed successfully!${NC}"
echo -e "${YELLOW}You can now link this library to other projects using:${NC}"
echo "  npm link"
echo "  cd /path/to/your/project"
echo "  npm link milost"