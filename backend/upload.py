import os
import sys
import argparse
import requests
import json
import logging
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('pinata-upload')

# Load environment variables from .env file
load_dotenv()

# Get Pinata credentials from .env
PINATA_API_KEY = os.getenv("PINATA_API_KEY")
PINATA_API_SECRET = os.getenv("PINATA_API_SECRET")

if not PINATA_API_KEY or not PINATA_API_SECRET:
    logger.error("❌ Pinata credentials not found! Check your .env file.")
    print("❌ Pinata credentials not found! Check your .env file.")
    exit(1)

# Pinata API endpoint
PINATA_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS"

def upload_file(file_path, title=None, description=None, category=None, price=None):
    """Uploads a file to Pinata."""
    if not os.path.exists(file_path):
        logger.error(f"❌ File not found at path: {file_path}")
        print(f"❌ File not found at path: {file_path}")
        return None
    
    try:
        logger.info(f"📤 Uploading file: {file_path}")
        
        # Check file size
        file_size = os.path.getsize(file_path)
        logger.info(f"File size: {file_size / 1024 / 1024:.2f} MB")
        
        headers = {
            "pinata_api_key": PINATA_API_KEY,
            "pinata_secret_api_key": PINATA_API_SECRET
        }
    
        # Prepare metadata
        metadata = {
            "name": title or os.path.basename(file_path),
        }
        
        keyvalues = {}
        if description:
            metadata["description"] = description
        if category:
            keyvalues["category"] = category
        if price:
            keyvalues["price"] = price
    
        # Use the proper pinataMetadata format
        pinata_metadata = {
            "name": metadata["name"]
        }
        
        if keyvalues:
            pinata_metadata["keyvalues"] = keyvalues
        
        if description:
            pinata_metadata["description"] = description
    
        # Format options as JSON string
        pinata_options = {
            "cidVersion": 0
        }
    
        with open(file_path, "rb") as file:
            files = {
                "file": file
            }
            
            # Convert metadata to proper format
            data = {
                "pinataMetadata": json.dumps(pinata_metadata),
                "pinataOptions": json.dumps(pinata_options)
            }
            
            logger.info(f"🌐 Sending request to Pinata ({PINATA_URL})")
            logger.debug(f"Headers: {headers}")
            logger.debug(f"Data: {data}")
            
            # Log connection attempt
            print(f"📡 Connecting to Pinata API...")
            
            # Make the request with a timeout
            response = requests.post(
                PINATA_URL, 
                headers=headers, 
                files=files,
                data=data,
                timeout=60  # Add a reasonable timeout
            )
    
        try:
            response_data = response.json()
            logger.info(f"📥 Pinata response status: {response.status_code}")
            logger.debug(f"Full response: {response_data}")
            
            if response.status_code >= 400:
                error_message = response_data.get('error', 'Unknown error')
                logger.error(f"❌ Pinata API error: {error_message}")
                print(f"❌ Pinata API error: {error_message}")
                return None
            
            if "IpfsHash" in response_data:
                logger.info(f"✅ Upload successful! IPFS CID: {response_data['IpfsHash']}")
                print(f"✅ Upload successful! IPFS CID: {response_data['IpfsHash']}")
                return response_data['IpfsHash']
            else:
                logger.error(f"❌ Error uploading file: {response_data}")
                print(f"❌ Error uploading file: {response_data}")
                return None
        except Exception as e:
            logger.error(f"❌ Failed to parse response: {e}")
            logger.error(f"Response text: {response.text}")
            print(f"❌ Failed to parse response: {e}")
            return None
    except requests.exceptions.RequestException as e:
        logger.error(f"❌ Network error: {e}")
        print(f"❌ Network error: {e}")
        return None
    except Exception as e:
        logger.error(f"❌ Unexpected error during upload: {e}")
        print(f"❌ Unexpected error during upload: {e}")
        return None

if __name__ == "__main__":
    # Set up argument parser
    parser = argparse.ArgumentParser(description='Upload a file to IPFS via Pinata.')
    parser.add_argument('--file', required=True, help='Path to the file to upload')
    parser.add_argument('--title', help='Title of the resource')
    parser.add_argument('--description', help='Description of the resource')
    parser.add_argument('--category', help='Category of the resource')
    parser.add_argument('--price', help='Price of the resource')
    parser.add_argument('--output', help='Output path for the file')
    parser.add_argument('--debug', action='store_true', help='Enable debug logging')
    
    args = parser.parse_args()
    
    # Set debug level if requested
    if args.debug:
        logger.setLevel(logging.DEBUG)
        logger.debug("Debug mode enabled")
    
    print(f"🔍 Uploading file: {args.file}")
    if args.title:
        print(f"📝 Title: {args.title}")
    if args.description:
        print(f"📋 Description: {args.description[:50]}...")
    if args.category:
        print(f"🏷️ Category: {args.category}")
    if args.price:
        print(f"💰 Price: {args.price}")
    
    ipfs_hash = upload_file(
        args.file, 
        title=args.title, 
        description=args.description, 
        category=args.category, 
        price=args.price
    )
    
    if ipfs_hash:
        # Print in a format that can be easily parsed by the calling script
        print(f"IPFS_HASH:{ipfs_hash}")
        
        # If output path is provided, save a copy of the file there
        if args.output and os.path.exists(args.file):
            try:
                os.makedirs(os.path.dirname(args.output), exist_ok=True)
                with open(args.file, 'rb') as src, open(args.output, 'wb') as dst:
                    dst.write(src.read())
                print(f"✅ File saved to {args.output}")
            except Exception as e:
                print(f"❌ Error saving file to {args.output}: {e}")
    else:
        print("❌ Upload failed! Please check logs for details.")
        sys.exit(1)