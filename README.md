# 🚕 Taxi Martínez - Web Interface

Web interface for Taxi Martínez voice agent. Call and book a taxi using voice in Uruguayan Spanish!

## 🌐 Live Demo

Once deployed, you can access the app at your Netlify URL.

## 🚀 Deploy to Netlify

### Option 1: Netlify Dashboard (Recommended)

1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select `taxi-martinez-web`
4. Netlify will auto-detect settings from `netlify.toml`
5. Add environment variables:
   - `LIVEKIT_URL`: `wss://innovateam-2onbh9x3.livekit.cloud`
   - `LIVEKIT_API_KEY`: `[REDACTED-rotar]`
   - `LIVEKIT_API_SECRET`: `[REDACTED-rotar]`
6. Click "Deploy site"

### Option 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd taxi-martinez-web
netlify deploy --prod
```

When prompted for environment variables, use:
- `LIVEKIT_URL=wss://innovateam-2onbh9x3.livekit.cloud`
- `LIVEKIT_API_KEY=[REDACTED-rotar]`
- `LIVEKIT_API_SECRET=[REDACTED-rotar]`

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Then open http://localhost:8888

## 📱 How to Use

1. Open the web app
2. Click "📞 Llamar Ahora"
3. Allow microphone access
4. Speak naturally in Spanish (Uruguayan style!)
5. The agent will help you book a taxi

## 🎯 Features

- ✅ Voice call interface with LiveKit
- ✅ Uruguayan Spanish conversation
- ✅ Taxi booking functionality
- ✅ Beautiful responsive UI
- ✅ Real-time audio streaming
- ✅ Serverless token generation

## 🏗️ Architecture

```
Frontend (Netlify)
    ↓
Serverless Function (generates token)
    ↓
LiveKit Cloud
    ↓
Voice Agent (Railway)
```

## 📁 Project Structure

```
taxi-martinez-web/
├── index.html              # Main UI
├── netlify/
│   └── functions/
│       └── token.js        # Token generation function
├── netlify.toml            # Netlify config
├── package.json            # Dependencies
└── README.md              # This file
```

## 🔗 Related Projects

- [voice-taxi-martinez-agent](https://github.com/MrBlackSheep91/voice-taxi-martinez-agent) - Backend voice agent

## 📝 License

MIT
