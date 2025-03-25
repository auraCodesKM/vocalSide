import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';

const execPromise = promisify(exec);
const UPLOAD_DIR = path.join(process.cwd(), 'tmp/uploads');

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Get metadata from the form
    const title = formData.get('title') || '';
    const description = formData.get('description') || '';
    const category = formData.get('category') || '';
    const price = formData.get('price') || '';

    // Convert the file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create a unique filename
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    console.log(`Processing upload: ${filename}`);
    console.log(`Upload directory: ${UPLOAD_DIR}`);

    // Ensure the upload directory exists
    try {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      console.log('Upload directory created/verified');
    } catch (err) {
      console.error('Error creating upload directory:', err);
    }
    
    // Write the file to the server
    await writeFile(filepath, buffer);
    console.log(`File saved to: ${filepath}`);
    
    // Get the absolute path to the backend directory
    const rootDir = process.cwd();
    // Go up one directory (from frontend) and then to backend
    const backendDir = path.resolve(rootDir, '..', 'backend');
    
    console.log(`Backend directory path: ${backendDir}`);
    console.log(`File exists: ${await fs.stat(filepath).then(() => 'Yes', () => 'No')}`);
    
    // Escape potential special characters in file paths
    const safeFilepath = filepath.replace(/"/g, '\\"');
    const safeTitle = title.replace(/"/g, '\\"');
    const safeDescription = description.replace(/"/g, '\\"');
    const safeCategory = category.replace(/"/g, '\\"');
    
    // Call the Python script
    const uploadCommand = `cd "${backendDir}" && python upload.py --file "${safeFilepath}" --title "${safeTitle}" --description "${safeDescription}" --category "${safeCategory}" --price "${price}"`;
    
    console.log('Executing command:', uploadCommand);
    
    const { stdout, stderr } = await execPromise(uploadCommand);
    
    console.log('Command stdout:', stdout);
    if (stderr) {
      console.error('Command stderr:', stderr);
    }
    
    // Extract IPFS hash from the output
    const ipfsHashMatch = stdout.match(/IPFS_HASH:([a-zA-Z0-9]+)/);
    if (!ipfsHashMatch) {
      console.error('Could not find IPFS hash in output. Full output:', stdout);
      return NextResponse.json(
        { error: 'Could not get IPFS hash from upload script' },
        { status: 500 }
      );
    }
    
    const ipfsHash = ipfsHashMatch[1];
    console.log(`Extracted IPFS hash: ${ipfsHash}`);
    
    // Return the IPFS hash
    return NextResponse.json({ 
      success: true,
      ipfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      title,
      description,
      category,
      price
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: `Internal server error during upload: ${error.message}` },
      { status: 500 }
    );
  } finally {
    // Consider cleanup of temporary files here if needed
  }
} 