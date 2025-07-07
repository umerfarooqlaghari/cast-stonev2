# Railway Deployment Guide for Cast Stone API

## 📋 Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **PostgreSQL Database**: Already configured on Railway ✅

## 🚀 Deployment Steps

### Step 1: Prepare Your Repository

1. Ensure all the following files are in your `Backend/Cast-Stone-api/` directory:
   - ✅ `Dockerfile`
   - ✅ `.dockerignore`
   - ✅ `railway.json`
   - ✅ `appsettings.Production.json`

### Step 2: Update Frontend URLs in CORS

Before deploying, update the CORS configuration in `Program.cs`:

```csharp
// Replace these with your actual frontend URLs
policy.WithOrigins(
    "https://your-frontend-domain.vercel.app",
    "https://your-frontend-domain.netlify.app", 
    "https://your-custom-domain.com"
)
```

### Step 3: Deploy to Railway

1. **Connect Repository**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Build Settings**:
   - Railway should automatically detect the Dockerfile
   - Set the **Root Directory** to: `Backend/Cast-Stone-api`
   - The build will use the Dockerfile automatically

3. **Environment Variables** (Set these in Railway dashboard):
   ```
   ASPNETCORE_ENVIRONMENT=Production
   PORT=8080
   ```

4. **Database Connection**:
   - Your PostgreSQL connection string is already configured
   - No additional setup needed for the database

### Step 4: Run Database Migrations

After deployment, you'll need to run migrations. You can do this by:

1. **Option A**: Use Railway's terminal feature
   ```bash
   dotnet ef database update
   ```

2. **Option B**: Create a migration endpoint (recommended for production)
   - Add a controller endpoint that runs migrations
   - Call it once after deployment
   - Remove or secure it after use

### Step 5: Verify Deployment

1. **Health Check**: Visit `https://your-app.railway.app/health`
2. **Swagger UI**: Visit `https://your-app.railway.app/` (root URL)
3. **API Endpoints**: Test your API endpoints

## 🔧 Configuration Details

### Docker Configuration
- **Base Image**: .NET 8 Runtime (mcr.microsoft.com/dotnet/aspnet:8.0)
- **Port**: 8080 (Railway standard)
- **Environment**: Production
- **Security**: Non-root user for container security

### Application Configuration
- **HTTPS**: Disabled (Railway handles SSL termination)
- **CORS**: Configured for production frontend URLs
- **Logging**: Optimized for production
- **Health Checks**: Enabled at `/health` endpoint

## 🔄 Local Development vs Production

### What's Changed for Production:
1. **Port Configuration**: Uses Railway's PORT environment variable
2. **CORS Origins**: Updated for production frontend URLs
3. **HTTPS Redirection**: Disabled (Railway handles SSL)
4. **Logging**: Optimized for production

### What's Preserved for Local Development:
All localhost configurations are commented out, not deleted:
- Local port settings
- Local CORS origins
- Local HTTPS redirection

To switch back to local development, simply uncomment the local settings and comment out the production settings.

## 🚨 Important Notes

1. **Database**: Your PostgreSQL database is already configured and running on Railway
2. **Migrations**: Remember to run database migrations after first deployment
3. **CORS**: Update the frontend URLs in Program.cs before deploying
4. **Environment**: The app runs in Production environment on Railway
5. **Logs**: Check Railway logs for any deployment issues

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails**: Check that all NuGet packages are properly referenced
2. **App Won't Start**: Verify PORT environment variable is set to 8080
3. **Database Connection**: Ensure connection string is correct in appsettings.Production.json
4. **CORS Errors**: Update frontend URLs in Program.cs CORS configuration

### Useful Railway Commands:
```bash
# View logs
railway logs

# Connect to database
railway connect

# Set environment variables
railway variables set ASPNETCORE_ENVIRONMENT=Production
```

## 📞 Support

If you encounter issues:
1. Check Railway logs in the dashboard
2. Verify all configuration files are present
3. Ensure database connection string is correct
4. Test locally with Production environment first

Your Cast Stone API is now ready for Railway deployment! 🚀
