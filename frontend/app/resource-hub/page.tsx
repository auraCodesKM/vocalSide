"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { ProtectedRoute } from "@/components/protected-route"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { AlertCircle, Download, FileText, Upload } from "lucide-react"
import { uploadFile, getFileUrl } from "@/lib/uploadUtils"
import { 
  getContract, 
  getResources, 
  purchaseResource, 
  uploadResource, 
  checkResourceOwnership,
  verifyContract
} from "@/lib/contractUtils"
import { useAuth } from "@/lib/auth-context"
import * as ethers from "ethers"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

// Add TypeScript declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function ResourceHubPage() {
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [walletConnected, setWalletConnected] = useState<boolean>(false)
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false)
  const { user } = useAuth()
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [contractError, setContractError] = useState<string | null>(null)
  const [ethBalance, setEthBalance] = useState<string>("0")
  
  // Form for resource upload
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "education",
      price: "0.005",
    }
  })
  
  useEffect(() => {
    const checkWalletConnection = async () => {
      console.log("Checking for wallet connection");
      if (window.ethereum) {
        console.log("MetaMask detected");
        try {
          // Check if we have access to the wallet
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          console.log("Current accounts:", accounts);
          if (accounts.length > 0) {
            console.log("Wallet already connected with:", accounts[0]);
            setWalletConnected(true);
            // Load resources
            await loadResources();
            // Check ETH balance
            await checkEthBalance();
          } else {
            console.log("No accounts connected yet");
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      } else {
        console.log("MetaMask not detected on page load");
      }
    };
    
    checkWalletConnection();
    
    // Set up event listeners for MetaMask
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        console.log('Accounts changed:', accounts);
        if (accounts.length > 0) {
          setWalletConnected(true);
          loadResources();
          checkEthBalance();
        } else {
          setWalletConnected(false);
          setResources([]);
        }
      };
      
      const handleChainChanged = (chainId) => {
        console.log('Chain changed:', chainId);
        // Reload the page when chain changes as recommended by MetaMask
        window.location.reload();
      };
      
      const handleConnect = (connectInfo) => {
        console.log('MetaMask connected:', connectInfo);
      };
      
      const handleDisconnect = (error) => {
        console.log('MetaMask disconnected:', error);
        setWalletConnected(false);
      };
      
      // Add listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('connect', handleConnect);
      window.ethereum.on('disconnect', handleDisconnect);
      
      // Cleanup listeners on component unmount
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('connect', handleConnect);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      };
    }
  }, []);
  
  const checkEthBalance = async () => {
    if (window.ethereum && walletConnected) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const balance = await provider.getBalance(accounts[0].address);
          setEthBalance(ethers.formatEther(balance));
        }
      } catch (error) {
        console.error("Error checking ETH balance:", error);
      }
    }
  };
  
  const connectWallet = async () => {
    console.log("Connect wallet button clicked");
    if (window.ethereum) {
      console.log("MetaMask available, attempting to connect");
      try {
        // Request account access
        console.log("Requesting accounts...");
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts',
          params: [] 
        });
        console.log("Connected accounts:", accounts);
        setWalletConnected(true);
        // Load resources after connecting
        await loadResources();
        // Check ETH balance
        await checkEthBalance();
        
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to your wallet",
        });
      } catch (error) {
        console.error('Error connecting to wallet:', error);
        toast({
          title: "Connection Failed",
          description: `Failed to connect: ${error.message || JSON.stringify(error)}`,
          variant: "destructive",
        });
      }
    } else {
      console.error("No ethereum object found");
      toast({
        title: "Wallet Not Found",
        description: "Please install a Web3 wallet like MetaMask",
        variant: "destructive",
      });
    }
  };
  
  const loadResources = async () => {
    try {
      console.log("Starting to load resources...");
      setLoading(true);
      setContractError(null);
      
      if (!window.ethereum) {
        console.error("No ethereum object found when trying to load resources");
        setContractError("No Web3 wallet detected. Please install MetaMask or another compatible wallet.");
        setLoading(false);
        return;
      }
      
      // Get provider and signer
      console.log("Creating provider and getting signer");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log("Signer address:", await signer.getAddress());
      
      // Verify the contract
      console.log("Verifying contract...");
      const verificationResult = await verifyContract(provider);
      
      if (!verificationResult.exists) {
        console.error("Contract verification failed:", verificationResult.error);
        setContractError(verificationResult.error);
        setLoading(false);
        return;
      }
      
      if (!verificationResult.functionsExist) {
        console.error("Contract functions not found:", verificationResult.error);
        setContractError(verificationResult.error);
        setLoading(false);
        return;
      }
      
      console.log("Contract verification passed");
      
      // Load resources from the contract
      console.log("Calling getResources function");
      try {
        const resourceData = await getResources(signer);
        console.log("Resources retrieved from contract:", resourceData);
        
        // If no resources were found, just set empty array and return
        if (!resourceData || resourceData.length === 0) {
          console.log("No resources found in contract");
          setResources([]);
          setLoading(false);
          return;
        }
        
        // Check ownership status for each resource
        console.log("Checking ownership for resources");
        const resourcesWithOwnership = await Promise.all(
          resourceData.map(async (resource: any, index: number) => {
            console.log(`Checking ownership for resource ${index}:`, resource);
            try {
              const isOwned = await checkResourceOwnership(signer, resource.id);
              console.log(`Resource ${index} ownership:`, isOwned);
              return { ...resource, isOwned };
            } catch (error) {
              console.error(`Error checking ownership for resource ${index}:`, error);
              return { ...resource, isOwned: false };
            }
          })
        );
        
        console.log("Resources with ownership info:", resourcesWithOwnership);
        setResources(resourcesWithOwnership);
      } catch (error) {
        console.error("Error retrieving resources:", error);
        setContractError(`Failed to retrieve resources from the contract. ${error.message || ""}`);
        setResources([]);
      }
    } catch (error) {
      console.error('Error loading resources:', error);
      setContractError(`Failed to connect to the contract. ${error.message || "Please check your wallet connection."}`);
      toast({
        title: "Error",
        description: "Failed to load resources: " + (error.message || "Unknown error"),
        variant: "destructive",
      });
      setResources([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      
      // Check if file is a PDF
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid File",
          description: "Please select a PDF file",
          variant: "destructive",
        })
        return
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        })
        return
      }
      
      setSelectedFile(file)
    }
  }
  
  const onSubmit = async (data: any) => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a PDF file to upload",
        variant: "destructive",
      })
      return
    }
    
    if (!window.ethereum) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask or another Web3 wallet",
        variant: "destructive",
      })
      return
    }
    
    if (!walletConnected) {
      try {
        // Try to connect to wallet first
        toast({
          title: "Connecting Wallet",
          description: "Please approve the connection request in your wallet",
        });
        
        await connectWallet();
      } catch (error) {
        toast({
          title: "Wallet Connection Failed",
          description: "Please connect your wallet to upload resources",
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      setUploading(true);
      setUploadProgress(10);
      
      toast({
        title: "Upload Started",
        description: "Uploading your file to IPFS...",
      });
      
      console.log("Starting file upload process with data:", data);
      
      // 1. Upload the file to IPFS via our API route
      const fileUploadResult = await uploadFile(selectedFile, {
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price
      });
      
      console.log("IPFS upload result:", fileUploadResult);
      setUploadProgress(50);
      
      if (!fileUploadResult.success) {
        throw new Error(fileUploadResult.error || "Failed to upload file to IPFS");
      }
      
      const { ipfsHash } = fileUploadResult.data;
      console.log("IPFS hash received:", ipfsHash);
      
      toast({
        title: "File Uploaded",
        description: "Your file is now on IPFS. Registering on blockchain...",
      });
      
      // 2. Upload the details to the blockchain
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log("Signer address for contract upload:", await signer.getAddress());
      
      // Convert price to wei (assuming price is in Ether)
      const priceInWei = ethers.parseEther(data.price || "0.005");
      console.log("Price in wei:", priceInWei.toString());
      
      setUploadProgress(75);
      
      // Upload to the contract
      console.log("Uploading to contract...");
      const contractResult = await uploadResource(
        signer,
        ipfsHash,
        priceInWei.toString(),
        data.title,
        data.category,
        data.description
      );
      
      console.log("Contract upload result:", contractResult);
      
      if (!contractResult.success) {
        console.error("Contract upload failed:", contractResult.error);
        throw new Error(contractResult.error || "Failed to upload to contract");
      }
      
      setUploadProgress(100);
      setUploadSuccess(true);
      
      // Reset form and state
      reset();
      setSelectedFile(null);
      
      // Explicitly refresh resources after a successful upload
      console.log("Upload successful, refreshing resources...");
      await refreshResources();
      
      // Switch to the browse tab to show the newly added resource
      const browseTab = document.querySelector('[value="browse"]') as HTMLElement;
      if (browseTab) {
        browseTab.click();
      }
      
      toast({
        title: "Upload Successful",
        description: "Your resource has been uploaded and listed",
      });
    } catch (error) {
      console.error('Error in upload process:', error);
      
      // Provide more specific error messages based on the error type
      let errorMessage = "Failed to upload resource";
      
      if (error instanceof Error) {
        if (error.message.includes('user rejected')) {
          errorMessage = "You rejected the transaction";
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = "You don't have enough ETH to complete this transaction";
        } else if (error.message.includes('IPFS')) {
          errorMessage = "Failed to upload to IPFS. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress(0);
        setUploadSuccess(false);
      }, 3000);
    }
  };
  
  const refreshResources = async () => {
    console.log("Manually refreshing resources");
    
    try {
      // Small delay to ensure the blockchain has time to update
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Force a refresh of resources
      await loadResources();
      // Update ETH balance
      await checkEthBalance();
      
      console.log("Resource refresh completed");
    } catch (error) {
      console.error("Error refreshing resources:", error);
    }
  };
  
  const handlePurchase = async (resourceId: string, price: string) => {
    if (!walletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to purchase resources",
        variant: "destructive",
      })
      return
    }
    
    try {
      setPurchasing(resourceId)
      
      toast({
        title: "Purchase Started",
        description: "Purchasing resource with ETH...",
      });
      
      // Get provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      // Purchase the resource, passing the price
      const result = await purchaseResource(signer, resourceId, price);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to purchase resource");
      }
      
      // Refresh the resource list and ETH balance
      await loadResources();
      await checkEthBalance();
      
      toast({
        title: "Purchase Successful",
        description: "You have successfully purchased the resource",
      })
    } catch (error) {
      console.error('Error purchasing resource:', error)
      
      // Check for common errors and provide user-friendly messages
      let errorMessage = "Failed to purchase the resource";
      
      if (error.message) {
        if (error.message.includes('insufficient funds')) {
          errorMessage = "You don't have enough ETH to make this purchase";
        } else if (error.message.includes('user rejected')) {
          errorMessage = "You cancelled the transaction";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      toast({
        title: "Purchase Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setPurchasing(null)
    }
  }
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">Resource Hub</h1>
          
          {!walletConnected && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Wallet not connected</AlertTitle>
              <AlertDescription>
                Connect your wallet to access all features of the Resource Hub.
                <Button 
                  variant="outline" 
                  className="mt-2" 
                  onClick={connectWallet}
                >
                  Connect Wallet
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          {contractError && (
            <Alert className="mb-6" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Contract Error</AlertTitle>
              <AlertDescription>
                {contractError}
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={loadResources}
                  >
                    Retry
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('/RESOURCE_HUB_TROUBLESHOOTING.md', '_blank')}
                  >
                    Troubleshooting Guide
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {walletConnected && (
            <Alert className="mb-6" variant="default">
              <div className="flex items-center justify-between w-full">
                <div>
                  <AlertTitle>ETH Balance</AlertTitle>
                  <AlertDescription>
                    You have <span className="font-semibold">{ethBalance} ETH</span> available for purchases
                  </AlertDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={checkEthBalance}
                >
                  Refresh Balance
                </Button>
              </div>
            </Alert>
          )}
          
          <Tabs defaultValue="browse" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="browse">Browse Resources</TabsTrigger>
              <TabsTrigger value="upload">Upload Resource</TabsTrigger>
            </TabsList>
            
            <TabsContent value="browse">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Available Resources</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={refreshResources}
                  disabled={loading}
                >
                  {loading ? "Refreshing..." : "Refresh Resources"}
                </Button>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-lg">Loading resources...</p>
                  </div>
                </div>
              ) : contractError ? (
                <div className="text-center p-12 border rounded-lg bg-muted/20">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                  <h3 className="text-lg font-medium">Unable to load resources</h3>
                  <p className="text-muted-foreground mt-2">
                    There was a problem connecting to the blockchain. Please check your wallet connection and try again.
                  </p>
                  <div className="mt-4">
                    <Button variant="outline" onClick={refreshResources}>
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : resources.length === 0 ? (
                <div className="text-center p-12 border rounded-lg bg-muted/20">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No resources available</h3>
                  <p className="text-muted-foreground mt-2">
                    Be the first to upload a resource or check back later.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resources.map((resource) => (
                    <Card key={resource.id} className="overflow-hidden">
                      <CardHeader className="bg-muted/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl truncate">{resource.title}</CardTitle>
                            <CardDescription className="text-xs uppercase mt-1">
                              {resource.category}
                            </CardDescription>
                          </div>
                          <FileText className="h-8 w-8 text-primary" />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm line-clamp-3 h-14">{resource.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {ethers.formatEther(resource.price)} ETH
                            </p>
                          </div>
                          {resource.isOwned ? (
                            <Button 
                              variant="default" 
                              className="w-full gap-2"
                              onClick={() => window.open(getFileUrl(resource.ipfsHash), '_blank')}
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => handlePurchase(resource.id, resource.price)}
                              disabled={purchasing === resource.id}
                              variant="secondary"
                            >
                              {purchasing === resource.id ? "Processing..." : "Purchase with ETH"}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle>Upload a New Resource</CardTitle>
                  <CardDescription>
                    Share your PDF documents with the community.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Resource title"
                        {...register("title", { required: "Title is required" })}
                      />
                      {errors.title && (
                        <p className="text-sm text-destructive">{errors.title.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your resource"
                        {...register("description", { required: "Description is required" })}
                      />
                      {errors.description && (
                        <p className="text-sm text-destructive">{errors.description.message}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select defaultValue="education" onValueChange={(value) => {
                          const target = { name: "category", value };
                          register("category").onChange({ target });
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="research">Research</SelectItem>
                            <SelectItem value="health">Health</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (ETH)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.001"
                          min="0.001"
                          placeholder="0.005"
                          {...register("price", { 
                            required: "Price is required",
                            min: { value: 0.001, message: "Price must be greater than zero" }
                          })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Set a price in Sepolia ETH for your resource.
                        </p>
                        {errors.price && (
                          <p className="text-sm text-destructive">{errors.price.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="file">PDF File</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                        <input
                          type="file"
                          id="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label htmlFor="file" className="cursor-pointer flex flex-col items-center">
                          <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                          {selectedFile ? (
                            <p>{selectedFile.name}</p>
                          ) : (
                            <>
                              <p className="text-sm">Drag and drop your PDF here, or click to browse</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PDF files only, max 10MB
                              </p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                    
                    {uploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Upload progress</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                      </div>
                    )}
                    
                    {uploadSuccess && (
                      <Alert variant="default" className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900 dark:text-green-400">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>
                          Your resource has been uploaded successfully.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={uploading || !walletConnected}
                    >
                      {uploading ? "Uploading..." : "Upload Resource"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  )
} 