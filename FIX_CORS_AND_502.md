# Fixing CORS and 502 Bad Gateway Errors

## Understanding the Errors

### 1. CORS Error
```
Access to XMLHttpRequest at 'https://www.giandazielpon.online/api/upload/project-image' 
from origin 'https://giandazielpon.online' has been blocked by CORS policy
```

**Problem**: Your site is accessed via `giandazielpon.online` (no www), but the request is going to `www.giandazielpon.online` (with www). These are treated as different origins by browsers.

### 2. 502 Bad Gateway
```
POST https://www.giandazielpon.online/api/upload/project-image net::ERR_FAILED 502 (Bad Gateway)
```

**Problem**: Nginx can't reach your backend server. This usually means:
- Backend server crashed or stopped
- PM2 process is not running
- Port mismatch between nginx and backend
- Backend server is binding to wrong interface (127.0.0.1 vs 0.0.0.0)

## Solutions

### Step 1: Update Backend CORS Configuration ✅

The backend code has been updated to automatically handle both www and non-www versions. Make sure your `.env` file includes the correct FRONTEND_URL.

### Step 2: Update Backend .env File

On your EC2 server, edit the backend `.env` file:

```bash
cd ~/porfolio/backend
nano .env
```

Make sure it includes **both** www and non-www versions:

```env
FRONTEND_URL=https://giandazielpon.online,https://www.giandazielpon.online
```

Or if you prefer to use just one and let the code auto-handle variants:

```env
FRONTEND_URL=https://giandazielpon.online
```

The updated code will automatically allow both `https://giandazielpon.online` and `https://www.giandazielpon.online`.

### Step 3: Restart Backend Server

After updating `.env`, restart the backend:

```bash
cd ~/porfolio/backend
pm2 restart server
# Or if not using PM2:
pm2 stop server
pm2 start server.js --name server
```

Check if it's running:

```bash
pm2 status
pm2 logs server --lines 50
```

### Step 4: Fix 502 Bad Gateway

#### Check if Backend is Running

```bash
# Check PM2 processes
pm2 status

# Check if Node.js is listening on port 5000
sudo netstat -tlnp | grep :5000
# Or
sudo ss -tlnp | grep :5000
```

#### If Backend is NOT Running:

1. **Start the backend server**:
   ```bash
   cd ~/porfolio/backend
   pm2 start server.js --name server
   ```

2. **Make sure it starts on boot**:
   ```bash
   pm2 startup
   pm2 save
   ```

#### If Backend IS Running but Still Getting 502:

1. **Check Nginx Configuration**:

   ```bash
   sudo nano /etc/nginx/sites-available/giandazielpon.online
   ```

   Make sure the proxy_pass is correct:
   ```nginx
   location /api {
       proxy_pass http://localhost:5000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       proxy_cache_bypass $http_upgrade;
   }
   ```

2. **Test and Reload Nginx**:

   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

3. **Check Backend Server is Binding Correctly**:

   The backend should listen on `0.0.0.0` (all interfaces), not just `127.0.0.1`. Check `backend/server.js` - it should already be correct since it uses `PORT` from env.

4. **Check Backend Logs**:

   ```bash
   pm2 logs server --lines 100
   # Or if using systemd:
   journalctl -u your-backend-service -n 100
   ```

### Step 5: Standardize Subdomain (Recommended)

To avoid future CORS issues, it's best to redirect one subdomain to the other. Add to your nginx config:

```nginx
# Redirect non-www to www (or vice versa)
server {
    server_name giandazielpon.online;
    return 301 https://www.giandazielpon.online$request_uri;
}
```

Or redirect www to non-www:

```nginx
server {
    server_name www.giandazielpon.online;
    return 301 https://giandazielpon.online$request_uri;
}
```

### Step 6: Verify Everything Works

1. **Check backend health**:
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Check through nginx**:
   ```bash
   curl https://giandazielpon.online/api/health
   curl https://www.giandazielpon.online/api/health
   ```

3. **Test in browser**:
   - Open browser DevTools (F12)
   - Go to Network tab
   - Try uploading an image from admin dashboard
   - Check if CORS errors are gone

## Quick Checklist

- [ ] Backend `.env` has `FRONTEND_URL` with your domain(s)
- [ ] Backend server is running (check with `pm2 status`)
- [ ] Backend is listening on port 5000 (check with `netstat` or `ss`)
- [ ] Nginx config has correct `proxy_pass http://localhost:5000`
- [ ] Nginx is running (`sudo systemctl status nginx`)
- [ ] Test `/api/health` endpoint works
- [ ] Consider adding subdomain redirect to avoid future issues

## Common Issues

### Backend Keeps Crashing

Check logs:
```bash
pm2 logs server --err
```

Common causes:
- MongoDB connection failed
- Missing environment variables
- Port already in use
- Cloudinary credentials invalid

### CORS Still Not Working

1. Clear browser cache
2. Check browser console for exact error
3. Verify backend logs show the request (means CORS is the issue, not 502)
4. Make sure you're testing from the actual domain, not localhost

### Port Already in Use

If port 5000 is already in use:
```bash
sudo lsof -i :5000
# Kill the process or change PORT in .env
```

