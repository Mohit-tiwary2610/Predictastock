# 🔧 Troubleshooting Guide

## 🔴 Backend Issues

### Issue: "Failed to load resource: 404 (NOT FOUND)"

**Symptoms:**
- Frontend shows "Failed to load META: No data found for symbol 'META'"
- Console shows: `localhost:5000/api/stock/data/META?period=2y 404 (NOT FOUND)`

**Solutions:**

#### 1. Backend not running
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# If no response, start backend:
cd backend
python app.py
```

#### 2. Check Python dependencies
```bash
cd backend
python test_startup.py  # Run diagnostic script
```

**Expected output:**
```
✨ All checks passed! Ready to start the server.
```

**If missing packages:**
```bash
pip install -r requirements.txt
```

#### 3. Port conflict (5000 already in use)
```bash
# macOS: Check what's using port 5000
lsof -i :5000

# Linux:
netstat -tlnp | grep 5000

# Kill the process or change port in backend/.env:
PORT=5001
```

Then update `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5001
```

#### 4. CORS issues
If backend is running but requests fail:

```python
# backend/app.py - verify CORS is configured:
CORS(app, resources={r"/api/*": {"origins": "*"}})
```

#### 5. Import errors
```bash
cd backend
python -c "from routes.stock_routes import stock_bp; print('✅ Imports OK')"
```

If this fails, check:
- Python version: `python --version` (need 3.10+)
- Virtual environment activated
- All files in correct structure

---

### Issue: "yfinance returns empty DataFrame"

**Cause:** Market closed, ticker delisted, or rate-limited

**Solutions:**
1. **Try a different ticker:**
   - Use: AAPL, GOOGL, MSFT (always reliable)
   - Avoid: Delisted stocks, crypto symbols

2. **Check if market is open:**
   - NYSE/NASDAQ: Mon-Fri, 9:30 AM - 4:00 PM ET
   - After hours: Data may lag 15-20 minutes

3. **Rate limiting:**
   ```bash
   # Wait 60 seconds between requests
   # yfinance has rate limits of ~2000 requests/hour
   ```

4. **Test yfinance directly:**
   ```python
   import yfinance as yf
   ticker = yf.Ticker("AAPL")
   print(ticker.history(period="5d"))
   ```

---

### Issue: "Prediction takes 90+ seconds"

**Cause:** LSTM training on CPU is slow

**Solutions:**
1. **Expected behavior** - 30-90s is normal on CPU
2. **Speed up with GPU:**
   ```bash
   # NVIDIA GPU:
   pip install tensorflow[and-cuda]==2.15.0
   
   # Apple Silicon:
   pip install tensorflow-macos tensorflow-metal
   ```
3. **Reduce epochs** (in `backend/config.py`):
   ```python
   EPOCHS = 25  # Default: 50
   ```

---

### Issue: "ModuleNotFoundError: tensorflow"

**Cause:** TensorFlow not installed (optional)

**Solutions:**

**Option 1:** Install TensorFlow (recommended)
```bash
pip install tensorflow==2.15.0
```

**Option 2:** Use fallback mode (statistical simulation)
- Backend automatically uses geometric Brownian motion
- No installation needed
- Less accurate but functional

---

## 🔵 Frontend Issues

### Issue: "npm install fails"

**Solutions:**
1. **Check Node version:**
   ```bash
   node --version  # Need v18+
   ```

2. **Clear npm cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Use different package manager:**
   ```bash
   npm install -g yarn
   yarn install
   ```

---

### Issue: "Port 3000 already in use"

**Solutions:**
1. **Find and kill process:**
   ```bash
   # macOS/Linux:
   lsof -ti:3000 | xargs kill -9
   
   # Windows:
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. **Use different port:**
   ```bash
   PORT=3001 npm start
   ```

---

### Issue: "Blank screen / white screen"

**Solutions:**
1. **Check console for errors:**
   - Open DevTools (F12)
   - Look for red errors

2. **Common causes:**
   - Backend not running → Start backend first
   - Wrong API URL → Check `frontend/.env`
   - Build cache → `rm -rf build/ && npm start`

3. **Clear React cache:**
   ```bash
   rm -rf node_modules/.cache
   npm start
   ```

---

## 🐳 Docker Issues

### Issue: "docker-compose up fails"

**Solutions:**
1. **Check Docker is running:**
   ```bash
   docker --version
   docker-compose --version
   ```

2. **Rebuild containers:**
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up
   ```

3. **Check logs:**
   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   ```

4. **Port conflicts:**
   ```yaml
   # docker-compose.yml - change ports:
   services:
     backend:
       ports:
         - "5001:5000"  # External:Internal
     frontend:
       ports:
         - "3001:80"
   ```

---

## 📊 Data Issues

### Issue: "Charts not displaying"

**Solutions:**
1. **Check data is loaded:**
   - Open DevTools → Network tab
   - Look for `/api/stock/data/AAPL` request
   - Status should be `200 OK`

2. **Inspect response:**
   ```javascript
   // In browser console:
   fetch('http://localhost:5000/api/stock/data/AAPL?period=2y')
     .then(r => r.json())
     .then(d => console.log(d))
   ```

3. **Verify historical data:**
   - Response should have `historical: [{date, open, high, low, close, volume}]`
   - If empty: ticker may be invalid

---

## 🎨 Styling Issues

### Issue: "Mobile layout broken"

**Solutions:**
1. **Clear browser cache:** Ctrl+Shift+R (or Cmd+Shift+R)
2. **Check viewport:**
   ```html
   <!-- public/index.html should have: -->
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   ```
3. **Test responsive breakpoints:**
   - DevTools → Toggle Device Toolbar (Ctrl+Shift+M)
   - Test: 320px, 480px, 640px, 768px, 1024px

---

## 🧪 Testing Backend Manually

### Test API endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Root info
curl http://localhost:5000/

# Stock data
curl "http://localhost:5000/api/stock/data/AAPL?period=1mo"

# Popular stocks
curl http://localhost:5000/api/stock/popular

# Search
curl "http://localhost:5000/api/stock/search?q=AAPL"

# Test prediction (takes 30-90s)
curl -X POST http://localhost:5000/api/predict/AAPL \
  -H "Content-Type: application/json" \
  -d '{"prediction_days": 7}'
```

---

## 🐛 Debug Mode

### Enable verbose logging:

**Backend:**
```python
# backend/app.py
app.run(host=Config.HOST, port=Config.PORT, debug=True)
```

**Frontend:**
```bash
REACT_APP_DEBUG=true npm start
```

---

## 📞 Still Having Issues?

1. **Run diagnostic:**
   ```bash
   cd backend
   python test_startup.py
   ```

2. **Check GitHub issues:**
   - https://github.com/stockseer-ai/stockseer/issues

3. **Create new issue with:**
   - OS & Python version
   - Error message & stack trace
   - Output of `python test_startup.py`
   - Browser console logs (F12 → Console)

---

## ✅ Quick Checklist

Before asking for help, verify:

- [ ] Python 3.10+: `python --version`
- [ ] Node 18+: `node --version`
- [ ] Dependencies installed: `pip list` & `npm list`
- [ ] Backend running: `curl localhost:5000/api/health`
- [ ] Frontend running: Browser at `localhost:3000`
- [ ] No port conflicts: `lsof -i :5000` & `lsof -i :3000`
- [ ] Correct .env files in backend/ and frontend/
- [ ] No firewall blocking ports 3000/5000
- [ ] Internet connection (for yfinance API)

---

**Pro tip:** Most issues are solved by:
```bash
# Backend
cd backend && pip install -r requirements.txt && python test_startup.py

# Frontend  
cd frontend && rm -rf node_modules && npm install && npm start
```
