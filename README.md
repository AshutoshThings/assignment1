# 🎙️ Audio Transcription App

A full-stack Next.js application that allows admins to upload audio files and automatically transcribe them using Google's Gemini AI.

## ✨ Features

- **Admin Authentication**: Secure login with username & password
- **Audio Upload**: Upload audio files (MP3, WAV, WebM, OGG, M4A - up to 1MB)
- **AI Transcription**: Automatic transcription using Gemini's free API
- **Transcript History**: View all transcribed audio files with timestamps
- **Secure Storage**: Only transcripts are stored, not audio files
- **Dark UI**: Modern, responsive dark theme with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 + React 19 + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **Authentication**: JWT with secure cookies
- **AI**: Google Gemini API (free tier)
- **Deployment**: Railway

## 📋 Prerequisites

- Node.js 18+ & npm
- PostgreSQL database
- Google Gemini API key (free)
- Railway account (for deployment)

## 🚀 Local Setup

### 1. Clone & Install

```bash
git clone <repository-url>
cd assignment1
npm install
```

### 2. Configure Environment

Create `.env.local` with:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/transcription_db"
NEXT_PUBLIC_GEMINI_API_KEY="your-gemini-api-key"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
AUTH_SECRET="your-secure-secret-key-min-32-chars"
```

### 3. Setup Database

```bash
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and login with:
- **Username**: `admin`
- **Password**: `admin123`

## 📱 Usage

1. **Login**: Enter admin credentials
2. **Upload**: Select an audio file (< 1MB)
3. **Transcribe**: Wait for automatic Gemini transcription
4. **View**: See all your transcripts with metadata
5. **Logout**: Click the logout button

## 🌐 Deployment to Railway

### 1. Create Railway Account

Visit [railway.app](https://railway.app) and sign up with GitHub

### 2. Deploy

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

### 3. Configure Environment on Railway

In Railway dashboard, set:
- `DATABASE_URL`: Railway PostgreSQL connection string
- `NEXT_PUBLIC_GEMINI_API_KEY`: Your Gemini API key
- `AUTH_SECRET`: Generate a random 32+ char string
- `ADMIN_USERNAME`: Your admin username
- `ADMIN_PASSWORD`: Your admin password

### 4. Deploy Database

```bash
railway run npx prisma db push
```

Visit your Railway deployment URL!

## 📂 Project Structure

```
assignment1/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   └── logout/route.ts
│   │   │   └── transcripts/
│   │   │       ├── upload/route.ts
│   │   │       └── list/route.ts
│   │   ├── dashboard/page.tsx
│   │   ├── login/page.tsx
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── AudioUpload.tsx
│   │   └── TranscriptList.tsx
│   └── lib/
│       ├── auth.ts
│       └── prisma.ts
├── prisma/
│   └── schema.prisma
├── .env.example
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication

**POST** `/api/auth/login`
- Request: `{ username, password }`
- Response: `{ token, user }`

**POST** `/api/auth/logout`
- Clears authentication cookie

### Transcripts

**POST** `/api/transcripts/upload`
- Requires: Auth token
- Body: FormData with `audio` file
- Response: `{ success, transcript }`

**GET** `/api/transcripts/list`
- Requires: Auth token
- Response: `{ transcripts }`

## 🔐 Security Notes

- Passwords are hashed with bcryptjs
- JWT tokens expire in 7 days
- Auth tokens stored in httpOnly cookies
- Audio files are not persisted to storage
- Admin credentials should be changed in production

## 🆓 Free Resources Used

- **Gemini API**: Free tier (60 requests/minute)
- **Railway**: Free $5/month trial
- **PostgreSQL**: Free on Railway

## 📝 License

MIT

## 🤝 Support

For issues or questions, please create a GitHub issue in the repository.

---

**Happy Transcribing! 🎉**
