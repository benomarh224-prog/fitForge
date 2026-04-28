# FitForge 🏋️‍♂️

A comprehensive fitness tracking and management application built with modern web technologies. Track workouts, manage nutrition, get AI-powered coaching, and monitor your fitness journey all in one place.

## 🚀 Features

### Core Functionality
- **Personal Dashboard**: Comprehensive fitness overview with progress tracking
- **Workout Management**: Browse exercises, create custom workouts, track performance
- **AI Coach**: Get personalized fitness advice with multimodal AI capabilities
- **Nutrition Planning**: Meal tracking and nutrition goal management
- **Profile Management**: Complete user profile with fitness goals and preferences
- **Progress Analytics**: Visual charts and statistics for fitness metrics

### Technical Features
- **Next.js 16**: Latest React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Modern, responsive styling with custom design system
- **Zustand**: Lightweight state management with persistence
- **Prisma**: Database ORM for data management
- **NextAuth.js**: Authentication and user management
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: Interactive data visualizations
- **WebSocket Support**: Real-time features and live updates

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **State Management**: Zustand with localStorage persistence
- **Database**: Prisma with SQLite/PostgreSQL support
- **Authentication**: NextAuth.js
- **AI Integration**: Z-AI Web Dev SDK for multimodal AI
- **Deployment**: Vercel-ready configuration

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/benomarh224-prog/fitForge.git
   cd fitForge
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   bun run db:push
   bun run db:generate
   ```

5. **Start the development server**
   ```bash
   bun run dev
   ```

## 🏃‍♂️ Usage

### Development
```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
```

### Database
```bash
bun run db:push      # Push schema changes
bun run db:generate  # Generate Prisma client
bun run db:migrate   # Run migrations
bun run db:reset     # Reset database
```

## 📁 Project Structure

```
fitForge/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── api/            # API routes
│   │   ├── globals.css     # Global styles
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   │   ├── layout/         # Layout components
│   │   ├── pages/          # Page components
│   │   └── ui/             # UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   │   ├── auth.ts         # Authentication config
│   │   ├── data.ts         # Mock data
│   │   ├── db.ts           # Database configuration
│   │   ├── store.ts        # Zustand store
│   │   ├── utils.ts        # Utility functions
│   │   └── validations.ts  # Zod schemas
│   └── middleware.ts       # Next.js middleware
├── prisma/                 # Database schema
├── public/                 # Static assets
├── examples/               # Example implementations
├── skills/                 # AI skill implementations
└── mini-services/          # Microservices
```

## 🎯 Key Components

### Dashboard
- Real-time fitness metrics
- Progress charts and analytics
- Weekly goal tracking
- BMI calculation and health insights

### AI Coach
- Multimodal AI conversations (text + images)
- Personalized workout recommendations
- Nutrition advice and meal planning
- Form correction and technique guidance

### Profile Management
- Comprehensive user profiles
- Fitness goal setting
- Avatar customization
- Progress history and achievements

### Workout System
- Extensive exercise database
- Custom workout creation
- Performance tracking
- Rest timer and workout logging

## 🤖 AI Integration

The application integrates with advanced AI models through the Z-AI Web Dev SDK, providing:

- **Vision Analysis**: Analyze workout form from images
- **Personalized Coaching**: AI-generated workout and nutrition plans
- **Progress Insights**: Data-driven recommendations
- **Multimodal Chat**: Text and image-based conversations

## 📱 Responsive Design

- **Mobile-first approach** with responsive breakpoints
- **Touch-friendly interactions** for mobile devices
- **Progressive Web App** capabilities
- **Dark/Light theme** support

## 🔒 Security

- **NextAuth.js** authentication
- **CSRF protection** middleware
- **Input sanitization** and validation
- **Secure API routes** with proper error handling

## 🚀 Deployment

The application is configured for easy deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push

### Environment Variables

```env
# Database
DATABASE_URL="your-database-url"

# NextAuth.js
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="your-app-url"

# AI Integration
ZAI_API_KEY="your-zai-api-key"

# Other configurations
NEXT_PUBLIC_APP_URL="your-app-url"
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email benomarh224-prog or create an issue in the GitHub repository.

---

**Built with ❤️ for fitness enthusiasts worldwide**