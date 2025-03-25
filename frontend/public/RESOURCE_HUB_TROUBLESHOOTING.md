# Resource Hub Troubleshooting Guide

This guide addresses common issues with the Resource Hub functionality in the Vocal Well application.

## Table of Contents
- [Contract Connectivity Issues](#contract-connectivity-issues)
- [File Upload Issues](#file-upload-issues)
- [IPFS Storage Issues](#ipfs-storage-issues)
- [Payment Issues](#payment-issues)
- [Running the Diagnostic Tests](#running-the-diagnostic-tests)

## Contract Connectivity Issues

### "Execution Reverted" or "Missing Revert Data" Errors

This typically occurs when:
1. The contract ABI doesn't match the deployed contract
2. The contract address is incorrect
3. The contract's functions have changed or aren't available

**Solutions:**
- Run the diagnostic test to check contract connectivity: `frontend/test/run-test.sh`
- Verify the contract address in `frontend/lib/contractUtils.js`
- Ensure you're connected to the correct network in MetaMask
- Check if the contract has been redeployed with different functions

### "Resources Not Found" Error

If the contract is not returning any resources:

**Solutions:**
- Verify that resources exist in the contract
- Try manually adding a resource using the test script
- Check if the resources are marked as "isListed" in the contract
- Make sure your MetaMask account has permission to access these resources

## File Upload Issues

### Files Won't Upload to IPFS

If you're having trouble uploading files to IPFS:

**Solutions:**
- Check your Pinata API credentials in `backend/.env`
- Ensure the API key and secret are correct and not expired
- Verify the file size (max 10MB)
- Ensure the file is a valid PDF
- Check the Pinata service status at [status.pinata.cloud](https://status.pinata.cloud)

### Upload API Returns Errors

**Solutions:**
- Check the server logs for specific error messages
- Verify that the backend server is running
- Ensure there's enough disk space for temporary file storage
- Check network connectivity between frontend and backend

## IPFS Storage Issues

### Cannot Retrieve Files from IPFS

**Solutions:**
- Verify the IPFS hash is correct
- Try different IPFS gateways:
  - `https://gateway.pinata.cloud/ipfs/{hash}`
  - `https://ipfs.io/ipfs/{hash}`
  - `https://cloudflare-ipfs.com/ipfs/{hash}`
- Check Pinata dashboard to ensure files are still pinned

## Payment Issues

### "Insufficient ETH" Error

This occurs when attempting to purchase a resource without sufficient ETH.

**Solutions:**
- Check your ETH balance in the Resource Hub interface
- Obtain more Sepolia test ETH from a faucet:
  - [Sepolia Faucet](https://sepoliafaucet.com/)
  - [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
  - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- Choose a resource with a lower price

### "Transaction Underpriced" Error

This can happen when the gas price set is too low.

**Solutions:**
- Try again with a higher gas price in your MetaMask settings
- Wait for network congestion to decrease

### "Gas Estimation Failed" Error

**Solutions:**
- Increase the gas limit in your MetaMask transaction
- Simplify the transaction data
- Check contract for potential infinite loops or high gas operations

## Blockchain Transaction Issues

### "User Rejected Transaction" Error

This occurs when you reject a transaction in MetaMask.

**Solutions:**
- Approve the transaction in MetaMask
- Check that you're using the correct account

### "Insufficient Funds" Error

**Solutions:**
- Ensure your wallet has enough ETH for both the purchase price and gas fees
- Get more test ETH from a Sepolia faucet
- Choose a resource with a lower price

### "Wrong Network" Error

**Solutions:**
- Make sure you're connected to the Sepolia Test Network in MetaMask
- If needed, add the Sepolia network to MetaMask:
  - Network Name: Sepolia Test Network
  - RPC URL: https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
  - Chain ID: 11155111
  - Currency Symbol: ETH
  - Block Explorer URL: https://sepolia.etherscan.io

## Running the Diagnostic Tests

We've included a diagnostic tool to help troubleshoot contract issues:

1. Navigate to the project root directory
2. Run: `cd frontend && ./test/run-test.sh`
3. Review the output for any errors or warnings

This test will:
- Check if the contract is accessible
- Try different methods to retrieve resources
- Verify if individual resources can be accessed
- Report any errors encountered during testing

## Additional Help

If you're still experiencing issues:
1. Check the browser console for specific error messages
2. Review the backend logs for API errors
3. Verify your MetaMask is connected to the correct network
4. Try using a different browser or clearing your cache
5. Consider redeploying the contract if it appears to be corrupted 