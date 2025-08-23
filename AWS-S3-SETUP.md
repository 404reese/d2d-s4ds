# AWS S3 Bucket Setup and Integration Guide

## Overview
This guide will walk you through creating an AWS S3 bucket and connecting it to your Flask application for file storage (images, documents, etc.).

## Prerequisites
- AWS Account (free tier available)
- AWS CLI installed (optional but recommended)
- Your Flask application already has boto3 installed

## Step 1: Create an AWS S3 Bucket

### Using AWS Console (Web Interface)
1. **Login to AWS Console**
   - Go to https://aws.amazon.com/console/
   - Login with your AWS credentials

2. **Navigate to S3**
   - Search for "S3" in the services search bar
   - Click on "S3" service

3. **Create Bucket**
   - Click "Create bucket"
   - **Bucket name**: Choose a globally unique name (e.g., `your-app-name-bucket-2024`)
   - **AWS Region**: Choose closest to your users (e.g., `us-east-1`)
   - **Block Public Access settings**: 
     - For image hosting, you might want to uncheck "Block all public access"
     - Be careful with public access - only allow what you need
   - **Bucket Versioning**: Enable if you want file version history
   - **Tags**: Add any relevant tags
   - Click "Create bucket"

4. **Configure Bucket Policy (if hosting images publicly)**
   - Select your bucket
   - Go to "Permissions" tab
   - Click "Bucket policy"
   - Add policy for public read access:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        }
    ]
}
```

### Using AWS CLI
```bash
# Create bucket
aws s3 mb s3://your-bucket-name --region us-east-1

# Enable versioning (optional)
aws s3api put-bucket-versioning --bucket your-bucket-name --versioning-configuration Status=Enabled
```

## Step 2: Create IAM User for Programmatic Access

### Using AWS Console
1. **Navigate to IAM**
   - Search for "IAM" in the AWS console
   - Click on "IAM" service

2. **Create User**
   - Click "Users" → "Create user"
   - **User name**: `s3-flask-app-user`
   - **Access type**: Select "Programmatic access"
   - Click "Next: Permissions"

3. **Set Permissions**
   - Click "Attach existing policies directly"
   - Search for and select `AmazonS3FullAccess` (for full S3 access)
   - Or create custom policy for specific bucket access:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::YOUR-BUCKET-NAME",
                "arn:aws:s3:::YOUR-BUCKET-NAME/*"
            ]
        }
    ]
}
```

4. **Review and Create**
   - Review settings
   - Click "Create user"
   - **IMPORTANT**: Save the Access Key ID and Secret Access Key shown

## Step 3: Configure Your Flask Application

### 1. Create/Update .env File
Create a `.env` file in your `flask-be` directory (if it doesn't exist):

```bash
# Copy from example
cp .env.example .env
```

Update the following variables in your `.env` file:
```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-access-key-id-here
AWS_SECRET_ACCESS_KEY=your-secret-access-key-here
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name-here
```

### 2. Your Flask App Already Has S3 Integration!
Your `app.py` already includes:
- S3 client configuration
- File upload function (`upload_to_s3`)
- Integration with blog post creation

## Step 4: Test S3 Connection

### Method 1: Python Script Test
Create a test script to verify connection:

```python
# test_s3.py
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
import os

load_dotenv()

def test_s3_connection():
    try:
        s3_client = boto3.client(
            's3',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION', 'us-east-1')
        )
        
        bucket_name = os.getenv('S3_BUCKET_NAME')
        
        # Test connection by listing bucket contents
        response = s3_client.list_objects_v2(Bucket=bucket_name)
        print(f"✓ Successfully connected to S3 bucket: {bucket_name}")
        print(f"✓ Objects in bucket: {response.get('KeyCount', 0)}")
        
        return True
    except ClientError as e:
        print(f"✗ Error connecting to S3: {e}")
        return False
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    test_s3_connection()
```

### Method 2: Test Through Your Flask App
Your app already has endpoints that use S3. Test by:
1. Starting your Flask app
2. Using the blog post creation endpoint with an image
3. Check if the image is uploaded to S3

## Step 5: Environment-Specific Configuration

### Development Environment
- Use a separate S3 bucket for development (e.g., `your-app-dev-bucket`)
- Update your local `.env` file with development bucket name

### Production Environment
- Use the production bucket
- Set environment variables on your production server
- For AWS EC2, use IAM roles instead of access keys (more secure)

## Step 6: Security Best Practices

### 1. Use IAM Roles (Production)
Instead of access keys, use IAM roles when deploying to AWS EC2:

```python
# For EC2 with IAM role, no keys needed
s3_client = boto3.client('s3', region_name=os.getenv('AWS_REGION', 'us-east-1'))
```

### 2. Limit Bucket Access
- Only allow necessary permissions
- Use bucket policies to restrict access
- Enable MFA delete for critical buckets

### 3. Use HTTPS
Ensure your S3 URLs use HTTPS for secure file access.

### 4. File Validation
Your app should validate:
- File types (images, documents, etc.)
- File sizes
- File names (use `secure_filename`)

## Step 7: Common Issues and Solutions

### Issue: Access Denied
- Check AWS credentials are correct
- Verify IAM user has S3 permissions
- Check bucket policy allows required actions

### Issue: Public Access Blocked
- Review bucket public access settings
- Update bucket policy for public reads if needed

### Issue: Large File Uploads
- Increase Flask `MAX_CONTENT_LENGTH`
- Consider using S3 multipart uploads for large files
- Implement upload progress indicators

## Step 8: Monitoring and Costs

### CloudWatch Monitoring
- Monitor S3 usage through AWS CloudWatch
- Set up billing alerts for unexpected costs

### Cost Optimization
- Use S3 storage classes (Standard, IA, Glacier) based on access patterns
- Enable S3 lifecycle policies to automatically move old files to cheaper storage

## Your Current Implementation

Your Flask app already includes:
- ✅ S3 client configuration
- ✅ File upload function
- ✅ Integration with blog posts
- ✅ Error handling
- ✅ Content type setting

You just need to:
1. Create the S3 bucket
2. Set up IAM user
3. Configure your `.env` file
4. Test the connection

## Quick Setup Commands

```bash
# Navigate to flask backend
cd flask-be

# Create .env from example (if not exists)
cp .env.example .env

# Edit .env file with your AWS credentials
# (use your preferred text editor)
notepad .env

# Test your configuration
python test_s3.py
```

That's it! Your Flask application is already configured to work with S3. You just need to set up the AWS infrastructure and provide the credentials.
