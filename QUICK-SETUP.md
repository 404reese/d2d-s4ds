# Quick AWS Deployment Setup

This guide will help you quickly deploy your application on AWS with environment variables properly configured.

## 🚀 Quick Start

### 1. Backend (EC2) Deployment

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Clone your repository
git clone <your-repo-url>
cd <your-repo-name>

# Run the deployment script
chmod +x flask-be/deploy.sh
./flask-be/deploy.sh
```

The script will:
- Install Python and dependencies
- Create a virtual environment
- Set up systemd service
- Create .env file from template

### 2. Frontend (Amplify) Deployment

#### Option A: Through Amplify Console
1. Go to AWS Amplify Console
2. Connect your GitHub repository
3. Select the `react-fe` folder as the app root
4. Set environment variables:
   - `VITE_API_URL`: `http://your-ec2-ip:5000`
   - `VITE_ADMIN_TOKEN`: Same value as backend `ADMIN_TOKEN`
   - `VITE_CONTACT_LAMBDA_URL`: Your Lambda function URL (optional)

#### Option B: Through CLI
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure

# Initialize in your react-fe directory
cd react-fe
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

### 3. Update URLs After Deployment

#### After EC2 deployment:
1. Note your EC2 public IP from deployment script output
2. Update Amplify environment variables:
   - `VITE_API_URL`: `http://YOUR_EC2_IP:5000`

#### After Amplify deployment:
1. Note your Amplify app URL
2. Update EC2 environment variables:
   ```bash
   # SSH into EC2
   nano ~/flask-blog/flask-be/.env
   # Set FRONTEND_URL=https://your-amplify-url.amplifyapp.com
   
   # Restart service
   sudo systemctl restart flask-blog
   ```

## 🔧 Configuration Variables Reference

### Backend (.env)
```bash
FRONTEND_URL=https://your-amplify-url.amplifyapp.com
BACKEND_URL=http://your-ec2-ip:5000
SECRET_KEY=your-secure-secret-key
ADMIN_TOKEN=your-secure-admin-token
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
S3_BUCKET_NAME=your-s3-bucket
```

### Frontend (Amplify Environment Variables)
```bash
VITE_API_URL=http://your-ec2-ip:5000
VITE_ADMIN_TOKEN=your-secure-admin-token
VITE_CONTACT_LAMBDA_URL=https://your-api-gateway-url.amazonaws.com/contact
```

## 🔍 Testing Your Deployment

### Backend Health Check
```bash
curl http://your-ec2-ip:5000/api/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2025-08-23T...",
  "frontend_url": "https://your-amplify-url.amplifyapp.com",
  "config_status": {
    "frontend_url_configured": true,
    "backend_url_configured": true,
    "s3_configured": true,
    "email_configured": true,
    "admin_token_configured": true,
    "environment": "production"
  }
}
```

### Frontend Configuration Check
```bash
cd react-fe
node check-config.js
```

### Test API Connection
```bash
# Test from your local machine
curl http://your-ec2-ip:5000/api/posts

# Test from browser console (on your Amplify site)
fetch('/api/health').then(r => r.json()).then(console.log)
```

## 🛡️ Security Checklist

- [ ] EC2 security group allows port 5000 from your IP/Amplify
- [ ] Strong SECRET_KEY and ADMIN_TOKEN generated
- [ ] S3 bucket has proper IAM policies
- [ ] Database is not exposed publicly
- [ ] Environment variables are not in git
- [ ] HTTPS enabled (consider ALB for production)

## 🚨 Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in backend exactly matches Amplify URL
- Check EC2 security group allows inbound traffic

### API Not Reachable
- Verify EC2 security group port 5000 is open
- Check service status: `sudo systemctl status flask-blog`
- View logs: `sudo journalctl -u flask-blog -f`

### Environment Variables Not Loading
- Backend: Check .env file exists and is in correct directory
- Frontend: Ensure variables start with `VITE_` prefix
- Amplify: Verify environment variables in console

Need help? Check the full deployment guide: `AWS-DEPLOYMENT.md`
