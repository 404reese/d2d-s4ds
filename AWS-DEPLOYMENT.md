# AWS Deployment Configuration

This document explains how to configure environment variables for AWS deployment with EC2 (backend) and Amplify (frontend).

## Backend (Flask - EC2)

### Environment Variables Setup

1. Copy the example environment file:
```bash
cp flask-be/.env.example flask-be/.env
```

2. Update the environment variables in `flask-be/.env`:

```bash
# URLs - Update these with your actual AWS resources
FRONTEND_URL=https://your-amplify-app-url.amplifyapp.com
BACKEND_URL=http://your-ec2-public-dns:5000

# Flask Configuration
SECRET_KEY=your-secure-random-secret-key
FLASK_ENV=production

# Database (for production, consider RDS)
DATABASE_URL=sqlite:///blog.db

# Admin Access
ADMIN_TOKEN=your-secure-admin-token

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=your-aws-region
S3_BUCKET_NAME=your-s3-bucket-name

# Email Configuration (for newsletter)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-email-app-password
```

### EC2 Deployment Notes

1. **Security Group**: Open port 5000 for your application
2. **CORS**: The app automatically uses `FRONTEND_URL` for CORS configuration
3. **Environment Variables**: You can set these in:
   - `.env` file (recommended for development)
   - EC2 instance environment variables
   - AWS Systems Manager Parameter Store (recommended for production)

## Frontend (React - Amplify)

### Environment Variables Setup

1. Copy the example environment file:
```bash
cp react-fe/.env.example react-fe/.env
```

2. Update the environment variables in `react-fe/.env`:

```bash
# Backend API URL (your EC2 instance)
VITE_API_URL=http://your-ec2-public-dns:5000

# Admin token (same as backend ADMIN_TOKEN)
VITE_ADMIN_TOKEN=your-secure-admin-token

# Contact form Lambda function URL (if using Lambda for contact form)
VITE_CONTACT_LAMBDA_URL=https://your-api-gateway-url.amazonaws.com/contact

# Optional: Frontend URL (for reference)
VITE_FRONTEND_URL=https://your-amplify-app-url.amplifyapp.com
```

### Amplify Deployment Notes

1. **Environment Variables**: Set these in Amplify Console:
   - Go to App Settings > Environment variables
   - Add all `VITE_*` variables
   
2. **Build Settings**: Amplify automatically detects Vite configuration

3. **Custom Build Commands** (if needed):
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Quick Setup Guide

### Step 1: Backend (EC2)
```bash
# SSH into your EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Clone your repository
git clone https://github.com/your-username/your-repo.git
cd your-repo/flask-be

# Set up environment
cp .env.example .env
nano .env  # Edit with your values

# Install dependencies and run
pip install -r requirements.txt
python app.py
```

### Step 2: Frontend (Amplify)
1. Connect your GitHub repository to Amplify
2. Set environment variables in Amplify Console
3. Deploy automatically triggers on git push

### Step 3: Update URLs
1. After EC2 deployment, update `VITE_API_URL` in Amplify environment variables
2. After Amplify deployment, update `FRONTEND_URL` in EC2 environment variables
3. Restart both services

## Security Best Practices

1. **Never commit .env files** - they're in .gitignore
2. **Use strong secrets** - generate random tokens for production
3. **HTTPS in production** - consider using Application Load Balancer with SSL for EC2
4. **Database security** - use RDS with proper security groups for production
5. **IAM roles** - use IAM roles instead of access keys when possible

## Troubleshooting

### CORS Issues
- Ensure `FRONTEND_URL` in backend matches your Amplify URL exactly
- Check that EC2 security group allows traffic from Amplify

### Environment Variables Not Loading
- Frontend: Ensure variables start with `VITE_`
- Backend: Ensure `.env` file is in the correct directory
- Amplify: Check environment variables in console match your .env file

### API Connection Issues
- Verify EC2 security group allows inbound traffic on port 5000
- Check that `VITE_API_URL` includes the correct protocol (http/https)
- Test API endpoint directly: `curl http://your-ec2-ip:5000/api/health`
