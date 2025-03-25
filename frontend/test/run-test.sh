#!/bin/bash

# Set colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=======================================${NC}"
echo -e "${GREEN}  Resource Hub Contract Test Runner    ${NC}"
echo -e "${GREEN}=======================================${NC}"

# Navigate to the frontend directory
cd "$(dirname "$0")/.."
FRONTEND_DIR=$(pwd)

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js to run this test.${NC}"
    exit 1
fi

# Check if necessary packages are installed
echo -e "${YELLOW}Checking for required packages...${NC}"
if ! node -e "try {require('ethers')} catch(e) {process.exit(1)}" &> /dev/null; then
    echo -e "${YELLOW}Installing ethers.js...${NC}"
    npm install --no-save ethers
fi

if ! node -e "try {require('dotenv')} catch(e) {process.exit(1)}" &> /dev/null; then
    echo -e "${YELLOW}Installing dotenv...${NC}"
    npm install --no-save dotenv
fi

echo -e "${GREEN}Dependencies installed. Running test...${NC}"

# Run the test script
node test/test-contract.js

# Check the exit code
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Test completed.${NC}"
    echo -e "${YELLOW}If you see contract errors, you may need to check:${NC}"
    echo -e " - ${YELLOW}Contract address is correct${NC}"
    echo -e " - ${YELLOW}Contract ABI matches the deployed contract${NC}"
    echo -e " - ${YELLOW}Contract exists on the specified network${NC}"
    echo -e " - ${YELLOW}Your frontend is connecting to the correct network${NC}"
else
    echo -e "${RED}Test failed. Please check the error messages above.${NC}"
fi 