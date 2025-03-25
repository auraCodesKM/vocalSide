/**
 * Test script for contract interactions
 * 
 * This script tests interaction with the blockchain contract
 * to diagnose issues with the Resource Hub.
 */

const ethers = require('ethers');
require('dotenv').config({ path: '../.env' });

// Color codes for console output
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

// Contract address - Updated
const CONTRACT_ADDRESS = "0x841ebB789aBf1d8BeF39b8811143Cd3A7D194Db1";

// Simplified ABI for resource-related functions - Updated for the new contract
const CONTRACT_ABI = [
  // Resource functions
  "function resources(uint256) view returns (tuple(uint256 id, address uploader, string ipfsHash, uint256 price, bool isListed, string title, string category, string description))",
  "function getResource(uint256 _resourceId) view returns (string)",
  "function resourceBuyers(uint256, address) view returns (bool)",
  
  // Payment token functions
  "function paymentToken() view returns (address)",
  "function platformFeePercentage() view returns (uint256)",
  "function platformWallet() view returns (address)",
  "function owner() view returns (address)"
];

// ERC20 Token ABI (minimal interface)
const ERC20_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function name() view returns (string)"
];

async function testContract() {
  try {
    console.log(`${BLUE}=== Testing Contract Interactions ===${RESET}`);
    console.log(`${YELLOW}Contract Address:${RESET} ${CONTRACT_ADDRESS}`);

    // List of RPC URLs to try
    const rpcUrls = [
      process.env.ETHEREUM_RPC_URL,
      "https://ethereum-sepolia.publicnode.com",
      "https://eth-sepolia.g.alchemy.com/v2/demo",
      "https://rpc.sepolia.org",
      "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161" // Public Infura key
    ];
    
    // Try to connect to any available RPC
    let provider = null;
    let connectedUrl = null;
    
    for (const url of rpcUrls) {
      if (!url) continue;
      
      try {
        console.log(`${YELLOW}Trying to connect to RPC:${RESET} ${url}`);
        provider = new ethers.JsonRpcProvider(url);
        // Test the connection
        await provider.getBlockNumber();
        connectedUrl = url;
        console.log(`${GREEN}Successfully connected to:${RESET} ${url}`);
        break;
      } catch (err) {
        console.log(`${RED}Failed to connect to:${RESET} ${url}`);
      }
    }
    
    if (!provider) {
      throw new Error("Could not connect to any Ethereum RPC endpoint. Please check your network connection.");
    }

    console.log(`${YELLOW}Connected to RPC URL:${RESET} ${connectedUrl}`);

    // Create a contract instance
    console.log(`${YELLOW}Creating contract instance...${RESET}`);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    // Test if we can get the contract address
    console.log(`${YELLOW}Testing basic contract connection...${RESET}`);
    const contractAddress = await contract.getAddress();
    console.log(`${GREEN}Contract deployed at:${RESET} ${contractAddress}`);

    // Get contract information
    console.log(`\n${BLUE}=== Getting Contract Information ===${RESET}`);
    
    try {
      const tokenAddress = await contract.paymentToken();
      console.log(`${GREEN}Payment Token Address:${RESET} ${tokenAddress}`);
      
      // Create token contract instance
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      
      try {
        const symbol = await tokenContract.symbol();
        console.log(`${GREEN}Token Symbol:${RESET} ${symbol}`);
      } catch (error) {
        console.log(`${RED}Failed to get token symbol:${RESET} ${error.message}`);
      }
      
      try {
        const name = await tokenContract.name();
        console.log(`${GREEN}Token Name:${RESET} ${name}`);
      } catch (error) {
        console.log(`${RED}Failed to get token name:${RESET} ${error.message}`);
      }
      
      try {
        const feePercentage = await contract.platformFeePercentage();
        console.log(`${GREEN}Platform Fee Percentage:${RESET} ${feePercentage}%`);
      } catch (error) {
        console.log(`${RED}Failed to get platform fee:${RESET} ${error.message}`);
      }
      
      try {
        const platformWallet = await contract.platformWallet();
        console.log(`${GREEN}Platform Wallet:${RESET} ${platformWallet}`);
      } catch (error) {
        console.log(`${RED}Failed to get platform wallet:${RESET} ${error.message}`);
      }
      
      try {
        const owner = await contract.owner();
        console.log(`${GREEN}Contract Owner:${RESET} ${owner}`);
      } catch (error) {
        console.log(`${RED}Failed to get contract owner:${RESET} ${error.message}`);
      }
    } catch (error) {
      console.log(`${RED}Failed to get contract information:${RESET} ${error.message}`);
    }
    
    // Try to get individual resources
    console.log(`\n${BLUE}=== Trying to Get Individual Resources ===${RESET}`);
    
    for (let i = 0; i < 10; i++) {
      try {
        console.log(`${YELLOW}Trying to get resource at index ${i}...${RESET}`);
        const resource = await contract.resources(i);
        
        if (resource && resource.ipfsHash && resource.ipfsHash !== "") {
          console.log(`${GREEN}Resource found at index ${i}:${RESET}`);
          console.log(` - ID: ${resource.id.toString()}`);
          console.log(` - Uploader: ${resource.uploader}`);
          console.log(` - Title: ${resource.title}`);
          console.log(` - IPFS Hash: ${resource.ipfsHash}`);
          console.log(` - Price: ${ethers.formatEther(resource.price)} tokens`);
          console.log(` - Listed: ${resource.isListed}`);
          console.log(` - Category: ${resource.category}`);
          
          // Try to get resource with getResource function
          try {
            const ipfsHash = await contract.getResource(i);
            console.log(`${GREEN}getResource(${i}) returned:${RESET} ${ipfsHash}`);
          } catch (error) {
            console.log(`${RED}Error calling getResource(${i}):${RESET} ${error.message}`);
          }
        } else {
          console.log(`${RED}No valid resource data at index ${i} or resource not listed${RESET}`);
        }
      } catch (error) {
        console.log(`${RED}Error getting resource at index ${i}:${RESET} ${error.message}`);
      }
    }
    
    console.log(`\n${BLUE}=== Contract Code Check ===${RESET}`);
    try {
      // Get the contract code to check if it actually exists
      const code = await provider.getCode(CONTRACT_ADDRESS);
      if (code === '0x') {
        console.log(`${RED}CONTRACT DOES NOT EXIST at this address!${RESET}`);
        console.log(`${YELLOW}The contract address ${CONTRACT_ADDRESS} contains no code.${RESET}`);
        console.log(`${YELLOW}This means either:${RESET}`);
        console.log(` - ${YELLOW}The contract was never deployed to this address${RESET}`);
        console.log(` - ${YELLOW}The contract was deployed to a different network${RESET}`);
        console.log(` - ${YELLOW}The contract was self-destructed${RESET}`);
      } else {
        console.log(`${GREEN}Contract code found at address. Length: ${code.length}${RESET}`);
      }
    } catch (error) {
      console.log(`${RED}Error checking contract code:${RESET} ${error.message}`);
    }
    
    console.log(`\n${GREEN}Contract test completed${RESET}`);
    
  } catch (error) {
    console.error(`${RED}Test failed:${RESET} ${error.message}`);
  }
}

// Run the test
testContract().catch(error => {
  console.error(`${RED}Unhandled error:${RESET}`, error);
}); 