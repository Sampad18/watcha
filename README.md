# Watcha - AI-Powered Social Connection Platform

A modern, AI-powered platform that helps users discover events and connect with like-minded people based on their mood and interests. Built with Next.js and designed for Vercel deployment.

## 🌟 Features

- **Smart Event Discovery**: AI-powered event suggestions based on mood, interests, and location
- **DeepSeek AI Integration**: Social media scraping for real event recommendations
- **Link Validation**: Automatic verification of event URLs before display
- **Enhanced User Profiles**: Collect name, occupation, age, social status, and pincode
- **Community Dashboard**: Track all users with mood, interests, and demographics
- **User Registration**: Complete profile management with localStorage persistence
- **Beautiful Pink-Themed UI**: User-friendly interface with pink and light pink color scheme
- **Real-time Matching**: See match scores for events based on your preferences
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **AI Integration**: DeepSeek API (for event scraping and recommendations)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Watcha
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your DeepSeek API key:
   ```
   DEEPSEEK_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🌐 Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Add environment variable**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add `DEEPSEEK_API_KEY` with your API key

### Option 2: Deploy via Vercel Dashboard

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure environment variables**
   - During setup, add `DEEPSEEK_API_KEY` as an environment variable
   - Or add it later in project settings

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your app automatically

### Option 3: Deploy with Vercel CLI (One Command)

```bash
vercel --prod
```

## 📁 Project Structure

```
Watcha/
├── app/
│   ├── api/
│   │   ├── suggest-events/
│   │   │   └── route.ts          # Event suggestions with DeepSeek AI
│   │   └── register-user/
│   │       └── route.ts          # User registration API
│   ├── dashboard/
│   │   └── page.tsx              # Community dashboard with user tracking
│   ├── events/
│   │   └── page.tsx              # Events discovery page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page with user profile form
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── DEEPSEEK_INTEGRATION.md      # DeepSeek API documentation
├── FEATURES.md                   # Detailed features documentation
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
├── vercel.json                   # Vercel deployment config
└── README.md                     # This file
```

## 🔧 Configuration

### DeepSeek API Integration

The app uses DeepSeek API for intelligent event recommendations. To integrate:

1. Get your API key from [DeepSeek Platform](https://platform.deepseek.com/)
2. Add it to your environment variables
3. The API endpoint at `/api/suggest-events` will use it for event matching

### Customization

- **Colors**: Modify Tailwind classes in component files to change the color scheme
- **Events**: Update event templates in `app/api/suggest-events/route.ts`
- **Mock Data**: Modify user data in `app/api/register-user/route.ts`

### Link Validation

All event URLs are validated before being displayed to users:
- 5-second timeout for each validation
- Invalid links are filtered out
- Ensures users only receive actionable event recommendations

### User Data Storage

For demo purposes, user data is stored in:
- **Client-side**: localStorage (browser-based)
- **Server-side**: API routes ready for database integration

For production, replace localStorage with a proper database (PostgreSQL, MongoDB, etc.)

## 🎨 Pages

### Landing Page (`/`)
- Comprehensive user profile form
- Personal information (name, age, occupation, social status, pincode)
- Mood selection (Happy, Calm, Excited, Curious, Adventurous, Relaxed, Social, Creative)
- Interest selection with predefined categories and custom options
- Location input for event matching
- Feature highlights
- Form validation before submission

### Events Page (`/events`)
- Event discovery with filters
- Mood-based recommendations
- Interest-based matching
- Event cards with match scores
- DeepSeek AI integration for real events
- Link validation for all events
- Fallback to mock data if API unavailable

### Dashboard (`/dashboard`)
- User profile display with all demographic information
- Community users grid with enhanced details
- Mood filtering to find like-minded people
- Interest-based connections
- User tracking with join dates
- Real-time updates from API and localStorage
- Occupation, age, and social status display

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🐛 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for the Watcha Hackathon
