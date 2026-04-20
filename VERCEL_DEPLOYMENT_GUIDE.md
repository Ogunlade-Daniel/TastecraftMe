# Deployment Preparation Checklist for Vercel

## ✅ Files Created:
- `vercel.json` - Vercel deployment configuration
- `requirements.txt` - Python dependencies with gunicorn, whitenoise, python-dotenv
- `.env.example` - Environment variables template
- `.gitignore` - Git ignore rules for sensitive files
- `api/index.py` - Vercel serverless entry point
- `build.sh` - Build script for deployment

## 📋 Next Steps:

### 1. Environment Setup
- Copy `.env.example` to `.env` and fill in your credentials:
  ```bash
  copy .env.example .env
  ```
- Update these critical variables in your `.env`:
  - `SECRET_KEY`: Generate a new secret key
  - `DEBUG`: Set to `False` for production
  - `ALLOWED_HOSTS`: Add your Vercel domain
  - Database credentials (integrate with a cloud database service)
  - Email credentials

### 2. Database Setup
**⚠️ Important**: SQLite and local MySQL won't work on Vercel. Options:
- **Best**: Use a managed database service:
  - AWS RDS (MySQL)
  - PlanetScale (MySQL)
  - DigitalOcean Managed Database
  - Amazon Aurora Serverless
  
- Update `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` in `.env`

### 3. Static Files & Media
- Run locally: `python manage.py collectstatic`
- Media files should be stored on a cloud service (AWS S3, Cloudinary, etc.)
- Update `MEDIA_URL` and `MEDIA_ROOT` for cloud storage

### 4. Security Settings
Update in `.env`:
- `CSRF_TRUSTED_ORIGINS`: Your Vercel domain
- `ALLOWED_HOSTS`: Your Vercel domain and any custom domains

### 5. Deploy to Vercel
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Set Environment Variables in Vercel dashboard from `.env` file
6. Click Deploy

### 6. Post-Deployment
- Run migrations: Vercel dashboard → Deployments → Settings
- Check logs for errors
- Test all features thoroughly

## 🔧 Recommended Additional Services:

For uploaded files (media):
- AWS S3 + django-storages
- Cloudinary + cloudinary Python SDK
- Backblaze B2

For database monitoring:
- Install Sentry for error tracking

## 📝 Important Notes:
- Vercel functions have a 12-second timeout
- Use background tasks (Celery) for long operations
- Keep static files under 500MB
- Test locally with `DEBUG=False` before deploying
