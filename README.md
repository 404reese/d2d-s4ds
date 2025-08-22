# Full-Stack Blog Application

A modern full-stack application with a React frontend and Flask backend, featuring blog management, newsletter functionality, and admin panel.

## 🚀 Features

### Frontend (React + TypeScript + Vite)
- **Responsive Design**: Modern UI with Tailwind CSS
- **Blog Section**: Display posts with images fetched from backend
- **Newsletter Signup**: Email subscription with success/error handling
- **Admin Panel**: Complete admin interface for managing posts and newsletter
- **Error Handling**: Comprehensive error boundaries and loading states
- **Animations**: Smooth transitions and animations

### Backend (Flask + SQLAlchemy)
- **RESTful API**: Complete CRUD operations for posts
- **Newsletter System**: Email subscription and bulk sending
- **Image Upload**: AWS S3 integration for image storage
- **Admin Authentication**: Token-based admin access
- **CORS Support**: Configured for frontend integration
- **Database**: SQLite for development, easily configurable for production

## 📦 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8 or higher
- AWS S3 account (for image uploads)
- SMTP server credentials (for newsletter emails)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd flask-be
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**:
   ```bash
   # Copy example environment file
   cp .env.example .env
   ```
   
   Update `.env` with your configurations:
   ```bash
   # Database Configuration
   DATABASE_URL=sqlite:///blog.db

   # Flask Configuration
   SECRET_KEY=your-super-secret-key-here
   FLASK_ENV=development

   # Admin Authentication
   ADMIN_TOKEN=your-secure-admin-token

   # AWS S3 Configuration
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=your-s3-bucket-name

   # Email Configuration (for newsletter)
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SENDER_EMAIL=your-email@gmail.com
   SENDER_PASSWORD=your-email-app-password
   ```

5. **Initialize database**:
   ```bash
   python app.py
   ```
   The database will be created automatically on first run.

6. **Run the backend**:
   ```bash
   python run.py
   # or
   flask run
   ```
   Backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd react-fe
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   ```bash
   # Copy example environment file
   cp .env.example .env
   ```
   
   Update `.env` with your configurations:
   ```bash
   VITE_API_URL=http://localhost:5000
   VITE_ADMIN_TOKEN=your-secure-admin-token
   ```

4. **Run the frontend**:
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/posts` - Get all blog posts
- `GET /api/posts/<id>` - Get single post
- `POST /api/newsletter/signup` - Subscribe to newsletter
- `GET /api/health` - Health check

### Admin Endpoints (Require Authorization)
- `POST /api/posts` - Create new post
- `PUT /api/posts/<id>` - Update post
- `DELETE /api/posts/<id>` - Delete post
- `POST /api/upload` - Upload image
- `POST /api/newsletter/send` - Send newsletter
- `GET /api/newsletter/subscribers` - Get subscribers
- `DELETE /api/newsletter/unsubscribe/<id>` - Remove subscriber

## 👨‍💼 Admin Panel Usage

1. **Access Admin Panel**:
   Navigate to `http://localhost:5173/admin`

2. **Authentication**:
   Use the admin token configured in both backend and frontend `.env` files

3. **Managing Posts**:
   - Create new posts with title, content, and optional images
   - Edit existing posts
   - Delete posts
   - Upload images directly to S3

4. **Newsletter Management**:
   - View all subscribers
   - Send newsletters to all subscribers
   - Remove subscribers
   - Track newsletter statistics

## 🎨 Frontend Features

### Components
- **Header**: Navigation with smooth scrolling
- **About**: Personal information section
- **Blog**: Dynamic blog posts from backend
- **Projects**: Portfolio projects showcase
- **Contact**: Newsletter signup form
- **AdminPanel**: Complete admin interface
- **ErrorBoundary**: Error handling wrapper

### State Management
- React hooks for local state
- Error handling with try-catch blocks
- Loading states for all async operations
- Message display for user feedback

### Styling
- Tailwind CSS for utility-first styling
- Custom animations and transitions
- Responsive design for all screen sizes
- Dark/light theme ready

## 🛠️ Development

### Running in Development Mode

1. **Backend** (Terminal 1):
   ```bash
   cd flask-be
   python run.py
   ```

2. **Frontend** (Terminal 2):
   ```bash
   cd react-fe
   npm run dev
   ```

### Building for Production

1. **Frontend Build**:
   ```bash
   cd react-fe
   npm run build
   ```

2. **Backend Production**:
   Update environment variables for production:
   ```bash
   FLASK_ENV=production
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

## 🔐 Security Considerations

### Backend Security
- Admin token authentication
- CORS configuration
- SQL injection protection via SQLAlchemy ORM
- File upload validation
- Environment variable usage

### Frontend Security
- Input validation
- XSS prevention
- Secure token storage
- Error message sanitization

## 📱 API Integration Details

### Error Handling
The frontend implements comprehensive error handling:
- Network errors
- API response errors
- Authentication failures
- File upload errors
- Loading states

### HTTP Client Configuration
- Axios interceptors for request/response handling
- Automatic token injection for admin routes
- Base URL configuration via environment variables
- Timeout and retry logic

## 🚀 Deployment

### Backend Deployment (Example with Heroku)
1. Create `Procfile`:
   ```
   web: gunicorn run:app
   ```
2. Add `gunicorn` to requirements.txt
3. Set environment variables in hosting platform
4. Deploy using Git

### Frontend Deployment (Example with Vercel)
1. Build the project: `npm run build`
2. Deploy `dist` folder to static hosting
3. Configure environment variables
4. Set up custom domain if needed

## 📋 Environment Variables Reference

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `sqlite:///blog.db` |
| `SECRET_KEY` | Flask secret key | `your-secret-key` |
| `ADMIN_TOKEN` | Admin authentication token | `secure-token-123` |
| `AWS_ACCESS_KEY_ID` | AWS S3 access key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS S3 secret key | `abc123...` |
| `S3_BUCKET_NAME` | S3 bucket name | `my-blog-images` |
| `SMTP_SERVER` | Email server | `smtp.gmail.com` |
| `SMTP_PORT` | Email port | `587` |
| `SENDER_EMAIL` | Newsletter sender email | `newsletter@example.com` |
| `SENDER_PASSWORD` | Email app password | `app-password` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |
| `VITE_ADMIN_TOKEN` | Admin token for authentication | `secure-token-123` |

## 📚 Tech Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Flask** - Web framework
- **SQLAlchemy** - ORM
- **Flask-CORS** - CORS handling
- **Boto3** - AWS SDK
- **Python-dotenv** - Environment variables

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure Flask backend has correct CORS configuration
   - Check that frontend URL is in CORS origins

2. **Admin Authentication Fails**:
   - Verify admin token matches in both frontend and backend
   - Check token format (should not include "Bearer " prefix in env file)

3. **Image Upload Fails**:
   - Verify AWS S3 credentials and bucket permissions
   - Check file size limits (16MB max)
   - Ensure bucket has public read permissions

4. **Newsletter Not Sending**:
   - Verify SMTP server credentials
   - Check email app passwords for Gmail
   - Ensure sender email is configured correctly

5. **Database Errors**:
   - Delete database file and restart backend to recreate
   - Check database URL format
   - Ensure write permissions in database directory

### Support

For issues and questions:
1. Check the troubleshooting section above
2. Review environment variable configuration
3. Check console logs for detailed error messages
4. Open an issue in the repository with error details
