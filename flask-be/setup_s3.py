#!/usr/bin/env python3
"""
Quick S3 Setup Helper
This script helps you set up your .env file for S3 integration.
"""

import os
import shutil
from pathlib import Path

def create_env_file():
    """Create .env file from template if it doesn't exist"""
    flask_dir = Path(__file__).parent
    env_file = flask_dir / '.env'
    env_example = flask_dir / '.env.example'
    
    if env_file.exists():
        print("✅ .env file already exists")
        return True
    
    if env_example.exists():
        shutil.copy2(env_example, env_file)
        print("✅ Created .env file from .env.example")
        print("📝 Please edit .env file with your AWS credentials")
        return True
    else:
        print("❌ .env.example file not found")
        return False

def check_env_variables():
    """Check if required environment variables are set"""
    from dotenv import load_dotenv
    load_dotenv()
    
    required_vars = [
        'AWS_ACCESS_KEY_ID',
        'AWS_SECRET_ACCESS_KEY', 
        'AWS_REGION',
        'S3_BUCKET_NAME'
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Missing environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\n📝 Please update your .env file with these values")
        return False
    else:
        print("✅ All required environment variables are set")
        return True

def print_setup_instructions():
    """Print setup instructions"""
    print("\n📋 AWS S3 Setup Instructions:")
    print("=" * 50)
    print("1. 🌐 Go to AWS Console (https://aws.amazon.com/console/)")
    print("2. 🪣 Create S3 Bucket:")
    print("   - Choose a unique bucket name")
    print("   - Select your preferred region")
    print("   - Configure permissions as needed")
    print("3. 👤 Create IAM User:")
    print("   - Go to IAM service")
    print("   - Create user with programmatic access")
    print("   - Attach S3 permissions policy")
    print("   - Save Access Key ID and Secret Key")
    print("4. ⚙️  Update .env file with your credentials")
    print("5. 🧪 Run: python test_s3.py")
    print("\n📖 See AWS-S3-SETUP.md for detailed guide")

def main():
    """Main setup function"""
    print("🚀 AWS S3 Quick Setup")
    print("=" * 30)
    
    # Step 1: Create .env file
    create_env_file()
    
    # Step 2: Check environment variables
    env_configured = check_env_variables()
    
    if not env_configured:
        print_setup_instructions()
        print("\n🔧 After configuring your .env file, run:")
        print("   python test_s3.py")
    else:
        print("\n✅ Environment configured! Testing S3 connection...")
        
        # Try to run the S3 test
        try:
            import subprocess
            result = subprocess.run(['python', 'test_s3.py'], cwd=Path(__file__).parent)
            if result.returncode == 0:
                print("\n🎉 S3 setup complete and working!")
            else:
                print("\n⚠️  S3 test failed. Check the error messages above.")
        except Exception as e:
            print(f"\n⚠️  Could not run S3 test: {e}")
            print("   You can run it manually: python test_s3.py")

if __name__ == "__main__":
    main()
