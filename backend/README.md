# Threat Intelligence Backend (Express + MongoDB)

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
MONGODB_URI=mongodb://localhost:27017/threat-intel
PORT=5000
ABUSEIPDB_API_KEY=your_key_here
VIRUSTOTAL_API_KEY=your_key_here
ALIENVAULT_API_KEY=your_key_here
FRONTEND_URL=https://your-lovable-app.lovable.app
```

### 3. Start MongoDB
Make sure MongoDB is running locally or use MongoDB Atlas.

### 4. Run the Server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### IOC Lookup
- **POST** `/api/ioc/lookup`
  - Body: `{ "value": "8.8.8.8", "type": "ip" }`
  - Returns: Full IOC analysis result

### Recent Lookups
- **GET** `/api/ioc/recent?limit=10`
  - Returns: Array of recent IOC results

### Get IOC by ID
- **GET** `/api/ioc/:id`
  - Returns: Single IOC result

### Stats
- **GET** `/api/stats`
  - Returns: Lookup statistics

### Health Check
- **GET** `/api/health`
  - Returns: Server status

## Deployment Options

1. **Heroku**: Add MongoDB Atlas addon
2. **Railway**: Built-in MongoDB support
3. **Render**: Free tier available
4. **DigitalOcean App Platform**: Easy scaling
5. **AWS EC2**: Full control

## Getting API Keys

1. **AbuseIPDB**: https://www.abuseipdb.com/api
2. **VirusTotal**: https://www.virustotal.com/gui/join-us
3. **AlienVault OTX**: https://otx.alienvault.com/api (optional, works without key)
