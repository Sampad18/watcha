# Watcha - AI-Powered Social Connection Platform

A modern, AI-powered platform that helps users discover events and connect with like-minded people based on their mood and interests. Built with Next.js and designed for Vercel deployment.

## 🌟 Features

- **Smart Event Discovery**: AI-powered event suggestions based on mood, interests, and location
- **Community Dashboard**: Connect with users who share similar interests and moods
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
│   │   └── suggest-events/
│   │       └── route.ts          # API endpoint for event suggestions
│   ├── dashboard/
│   │   └── page.tsx              # Community dashboard page
│   ├── events/
│   │   └── page.tsx              # Events discovery page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
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
- **Mock Data**: Modify user data in `app/dashboard/page.tsx`

## 🎨 Pages

### Landing Page (`/`)
- Hero section with product introduction
- Mood and interest selection
- Feature highlights
- Call-to-action to discover events

### Events Page (`/events`)
- Event discovery with filters
- Mood-based recommendations
- Interest-based matching
- Event cards with match scores

### Dashboard (`/dashboard`)
- User profile display
- Community users grid
- Mood filtering
- Interest-based connections

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🐛 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for the Watcha Hackathon
