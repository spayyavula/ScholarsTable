# Scholars Table - Educational Gaming Platform

Welcome to **Scholars Table**, where education meets gaming! This is a comprehensive learning platform that gamifies education through interactive quizzes, coding challenges, and tournaments across multiple subjects including Mathematics, Physics, Chemistry, and Programming.

## 🎯 Features

### 🎮 Interactive Learning Games
- **Multi-subject Support**: Mathematics, Physics, Chemistry, HTML, CSS, JavaScript, Python, React, Angular, Vue, React Native, Node.js
- **Difficulty Levels**: Basic, Intermediate, and Advanced challenges
- **Real-time Coding Environment**: Interactive code editors with live preview
- **Framework-specific Challenges**: Specialized coding environments for different technologies

### 🏆 Gamification Elements
- **XP and Leveling System**: Earn experience points and level up
- **Virtual Currency**: Collect coins for achievements
- **Achievement System**: Unlock badges and milestones
- **Tournaments**: Compete with other learners in real-time
- **Leaderboards**: Track your progress against peers

### 🤖 AI Learning Assistant
- **Bob the Bot**: Your personal learning companion
- **Contextual Hints**: Get help when you're stuck
- **Encouragement System**: Motivational messages and tips
- **Progress Tracking**: Personalized learning insights

### 💻 Advanced Code Editors
- **Monaco Editor Integration**: VS Code-like editing experience
- **IntelliSense Support**: Auto-completion for different languages
- **Live Preview**: See your code in action immediately
- **Framework-specific Templates**: Pre-built templates for React, Angular, Vue, etc.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scholars-table
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to start learning!

## 🗄️ Database Integration with Supabase

This platform is designed to work seamlessly with **Supabase**, providing a complete backend solution for user management, progress tracking, and real-time features.

### Why Supabase?

Supabase is an open-source Firebase alternative that provides:
- **PostgreSQL Database**: Powerful relational database with ACID compliance
- **Real-time Subscriptions**: Live updates for tournaments and leaderboards
- **Built-in Authentication**: User management with multiple providers
- **Row Level Security (RLS)**: Fine-grained access control
- **Auto-generated APIs**: RESTful and GraphQL APIs
- **Edge Functions**: Serverless functions for custom logic

### Database Schema Overview

The platform uses the following core entities:

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  coins INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### User Stats Table
```sql
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  games_played INTEGER DEFAULT 0,
  questions_answered INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  streak_record INTEGER DEFAULT 0,
  tournaments_won INTEGER DEFAULT 0,
  total_xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Questions Table
```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('basic', 'intermediate', 'advanced')),
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  xp_reward INTEGER DEFAULT 50,
  coin_reward INTEGER DEFAULT 10,
  hint TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Game Sessions Table
```sql
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  questions_answered INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  coins_earned INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in seconds
  completed_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Achievements Table
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  criteria JSONB NOT NULL, -- conditions to unlock
  xp_reward INTEGER DEFAULT 0,
  coin_reward INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### User Achievements Table
```sql
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
```

#### Tournaments Table
```sql
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  prize_pool INTEGER NOT NULL,
  max_participants INTEGER,
  is_sponsored BOOLEAN DEFAULT FALSE,
  sponsor_name TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tournament Participants Table
```sql
CREATE TABLE tournament_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  questions_answered INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tournament_id, user_id)
);
```

### Setting Up Supabase

#### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Sign in to your account
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - **Name**: scholars-table
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
6. Click "Create new project"

#### 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard under Settings > API.

#### 3. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

#### 4. Initialize Supabase Client

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### 5. Set Up Database Schema

In your Supabase dashboard, go to the SQL Editor and run the schema creation scripts provided above.

#### 6. Configure Row Level Security (RLS)

Enable RLS for all tables and create policies:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can read and insert their own stats
CREATE POLICY "Users can view own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Similar policies for other tables...
```

#### 7. Set Up Authentication

Configure authentication providers in Supabase dashboard:
1. Go to Authentication > Settings
2. Configure your site URL
3. Enable desired auth providers (Email, Google, GitHub, etc.)

### Database Best Practices for Beginners

#### 1. **Normalization**
- **First Normal Form (1NF)**: Each column contains atomic values
- **Second Normal Form (2NF)**: No partial dependencies
- **Third Normal Form (3NF)**: No transitive dependencies

Example of good normalization:
```sql
-- Instead of storing user data in every game session
-- BAD:
CREATE TABLE game_sessions_bad (
  id UUID PRIMARY KEY,
  user_name TEXT,
  user_email TEXT,
  user_level INTEGER,
  -- ... game data
);

-- GOOD: Reference user by ID
CREATE TABLE game_sessions_good (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  -- ... game data
);
```

#### 2. **Indexing for Performance**
```sql
-- Index frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_tournament_participants_tournament_id ON tournament_participants(tournament_id);
```

#### 3. **Data Types Selection**
- Use `UUID` for primary keys (better for distributed systems)
- Use `TIMESTAMPTZ` for timestamps (timezone aware)
- Use `JSONB` for flexible data structures
- Use appropriate constraints (`CHECK`, `NOT NULL`, `UNIQUE`)

#### 4. **Relationships and Foreign Keys**
```sql
-- Always define foreign key relationships
ALTER TABLE user_stats 
ADD CONSTRAINT fk_user_stats_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
```

#### 5. **Triggers for Automatic Updates**
```sql
-- Auto-update user level based on XP
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level = FLOOR(NEW.xp / 1000) + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_level
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_user_level();
```

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Code Editor**: Monaco Editor
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Build Tool**: Vite
- **Deployment**: Vercel/Netlify

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Bot/             # AI assistant components
│   ├── Casino/          # Game table components
│   ├── Dashboard/       # Statistics and progress
│   ├── Layout/          # Header, navigation
│   ├── Quiz/            # Quiz and coding interfaces
│   └── Tournament/      # Tournament components
├── data/                # Mock data and questions
├── lib/                 # Utility functions and configs
├── types/               # TypeScript type definitions
└── styles/              # Global styles
```

## 🎨 Design Philosophy

- **Gamification**: Make learning addictive through game mechanics
- **Progressive Difficulty**: Start easy, gradually increase complexity
- **Immediate Feedback**: Instant results and explanations
- **Visual Appeal**: Beautiful, modern interface
- **Accessibility**: Inclusive design for all learners

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Areas for Contribution

- **New Subjects**: Add more educational topics
- **Question Bank**: Expand the question database
- **UI/UX Improvements**: Enhance the user experience
- **Performance Optimization**: Make it faster and more efficient
- **Mobile Responsiveness**: Improve mobile experience
- **Accessibility**: Make it more inclusive

## 📚 Learning Resources

### Database Design
- [Database Design Basics](https://www.lucidchart.com/pages/database-diagram/database-design)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)

### React Development
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Best Practices
- [Clean Code Principles](https://github.com/ryanmcdermott/clean-code-javascript)
- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [Database Design Patterns](https://www.databasestar.com/database-design-patterns/)

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Verify Supabase client initialization
```

#### Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
npm run dev -- --force
```

#### TypeScript Errors
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Update type definitions
npm update @types/react @types/react-dom
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase Team** for the amazing backend platform
- **React Team** for the powerful frontend framework
- **Tailwind CSS** for the utility-first CSS framework
- **Monaco Editor** for the VS Code-like editing experience
- **Lucide** for the beautiful icon set

## 📞 Support

Need help? Here's how to get support:

1. **Documentation**: Check this README and inline code comments
2. **Issues**: Open an issue on GitHub
3. **Discussions**: Join our community discussions
4. **Email**: Contact us at support@scholarstable.com

---

**Happy Learning! 🎓✨**

*Transform your education journey with Scholars Table - where every question is an opportunity to grow!*