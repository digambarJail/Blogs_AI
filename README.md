# AI Blog Platform

A modern blog platform powered by Gemini AI, featuring role-based access control and intelligent content generation.

## 🚀 Project Setup

1. **Install dependencies**

```bash
# Backend
cd backend
npm install

# Frontend
cd ../ai-blog-frontend
npm install
```

2. **Set up environment variables**

### Frontend (frontend/.env)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend (backend/.env)
```
PORT=4000
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster_url
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
EMAIL_FROM=your_email@example.com
EMAIL_PASS=your_email_password
```

3. **Run the development servers**
```bash
# Backend
npm run dev

# Frontend (in a new terminal)
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:4000`

## 👥 User Roles

The platform supports two main user roles:

### Admin
- Full access to all features
- Manage user roles and permissions

### Editor
- Can create and edit their own posts
- Cannot modify other users' content

## 🤖 Gemini AI Integration

The platform leverages Google's Gemini AI model for:

1. **Content Generation**
- AI-powered blog post creation
- Smart suggestions for content improvement

The AI integration is implemented using Google's Gemini API, ensuring high-quality, context-aware responses while maintaining user privacy and data security.

## 🛠️ Technical Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Google Gemini API
- MongoDB
- Node+Express JS

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.