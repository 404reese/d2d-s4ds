#!/usr/bin/env python3
"""
S3 Connection Test Script
This script tests your AWS S3 connection and bucket access.
"""

import boto3
from botocore.exceptions import ClientError, NoCredentialsError
from dotenv import load_dotenv
import os
import sys

def load_environment():
    """Load environment variables"""
    load_dotenv()
    
    config = {
        'aws_access_key_id': os.getenv('AWS_ACCESS_KEY_ID'),
        'aws_secret_access_key': os.getenv('AWS_SECRET_ACCESS_KEY'),
        'aws_region': os.getenv('AWS_REGION', 'us-east-1'),
        's3_bucket_name': os.getenv('S3_BUCKET_NAME')
    }
    
    return config

def validate_config(config):
    """Validate that all required configuration is present"""
    required_fields = ['aws_access_key_id', 'aws_secret_access_key', 's3_bucket_name']
    missing_fields = [field for field in required_fields if not config.get(field)]
    
    if missing_fields:
        print("❌ Missing required environment variables:")
        for field in missing_fields:
            print(f"   - {field.upper()}")
        print("\nPlease update your .env file with the missing variables.")
        return False
    
    return True

def test_s3_connection(config):
    """Test S3 connection and bucket access"""
    try:
        print("🔄 Testing AWS S3 connection...")
        
        # Create S3 client
        s3_client = boto3.client(
            's3',
            aws_access_key_id=config['aws_access_key_id'],
            aws_secret_access_key=config['aws_secret_access_key'],
            region_name=config['aws_region']
        )
        
        bucket_name = config['s3_bucket_name']
        
        # Test 1: List buckets (validates credentials)
        print("🔄 Validating AWS credentials...")
        try:
            response = s3_client.list_buckets()
            print("✅ AWS credentials are valid")
            
            # Check if our bucket exists
            bucket_exists = any(bucket['Name'] == bucket_name for bucket in response['Buckets'])
            if bucket_exists:
                print(f"✅ Bucket '{bucket_name}' exists")
            else:
                print(f"❌ Bucket '{bucket_name}' not found")
                print("   Available buckets:")
                for bucket in response['Buckets']:
                    print(f"   - {bucket['Name']}")
                return False
                
        except ClientError as e:
            error_code = e.response['Error']['Code']
            if error_code == 'InvalidAccessKeyId':
                print("❌ Invalid AWS Access Key ID")
            elif error_code == 'SignatureDoesNotMatch':
                print("❌ Invalid AWS Secret Access Key")
            else:
                print(f"❌ AWS credentials error: {error_code}")
            return False
        
        # Test 2: Test bucket permissions
        print("🔄 Testing bucket permissions...")
        try:
            # Try to list objects in the bucket
            response = s3_client.list_objects_v2(Bucket=bucket_name, MaxKeys=1)
            print("✅ Can list bucket contents")
            
            object_count = response.get('KeyCount', 0)
            print(f"📊 Current objects in bucket: {object_count}")
            
        except ClientError as e:
            error_code = e.response['Error']['Code']
            if error_code == 'AccessDenied':
                print("❌ Access denied to bucket - check IAM permissions")
            elif error_code == 'NoSuchBucket':
                print(f"❌ Bucket '{bucket_name}' does not exist")
            else:
                print(f"❌ Bucket access error: {error_code}")
            return False
        
        # Test 3: Test upload permissions (create a small test file)
        print("🔄 Testing upload permissions...")
        try:
            test_key = 'test-connection.txt'
            test_content = 'This is a test file created by the S3 connection test.'
            
            s3_client.put_object(
                Bucket=bucket_name,
                Key=test_key,
                Body=test_content.encode('utf-8'),
                ContentType='text/plain'
            )
            print("✅ Can upload files to bucket")
            
            # Clean up test file
            s3_client.delete_object(Bucket=bucket_name, Key=test_key)
            print("✅ Can delete files from bucket")
            
        except ClientError as e:
            error_code = e.response['Error']['Code']
            if error_code == 'AccessDenied':
                print("❌ No upload permissions - check IAM policy")
            else:
                print(f"❌ Upload test error: {error_code}")
            return False
        
        # Test 4: Check bucket region
        print("🔄 Checking bucket region...")
        try:
            response = s3_client.get_bucket_location(Bucket=bucket_name)
            bucket_region = response['LocationConstraint'] or 'us-east-1'
            
            if bucket_region == config['aws_region']:
                print(f"✅ Bucket region matches configuration: {bucket_region}")
            else:
                print(f"⚠️  Bucket region ({bucket_region}) differs from configuration ({config['aws_region']})")
                print("   This may cause slower performance but should still work")
                
        except ClientError as e:
            print(f"⚠️  Could not check bucket region: {e.response['Error']['Code']}")
        
        print("\n🎉 All S3 tests passed! Your bucket is ready to use.")
        return True
        
    except NoCredentialsError:
        print("❌ No AWS credentials found")
        print("   Make sure your .env file has AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return False

def print_configuration_help():
    """Print help for configuration"""
    print("\n📋 Configuration Help:")
    print("1. Create an S3 bucket in AWS Console")
    print("2. Create an IAM user with S3 permissions")
    print("3. Update your .env file with:")
    print("   AWS_ACCESS_KEY_ID=your-access-key")
    print("   AWS_SECRET_ACCESS_KEY=your-secret-key")
    print("   AWS_REGION=us-east-1")
    print("   S3_BUCKET_NAME=your-bucket-name")
    print("\nSee AWS-S3-SETUP.md for detailed instructions.")

def main():
    """Main function"""
    print("🚀 AWS S3 Connection Test")
    print("=" * 40)
    
    # Load configuration
    config = load_environment()
    
    # Validate configuration
    if not validate_config(config):
        print_configuration_help()
        sys.exit(1)
    
    # Test S3 connection
    success = test_s3_connection(config)
    
    if success:
        print("\n✅ S3 is configured correctly and ready to use!")
        sys.exit(0)
    else:
        print("\n❌ S3 configuration has issues. Please check the errors above.")
        print_configuration_help()
        sys.exit(1)

if __name__ == "__main__":
    main()
