# 🌿 Selam — AI-Powered Ethiopian Wellness Companion

> **Hackathon:** Wellness Hackathon 2026 — ALX Ethiopia × Kuriftu Resorts  
> **Theme:** Reimagining Wellness Through Technology — _Heal. Build. Thrive._  
> **Stack:** Next.js · MongoDB · Mistral AI · Tailwind CSS · shadcn/ui · Better Auth

---

## 📌 Project Overview

**Selam** is an AI-powered personal wellness companion web app designed specifically for Ethiopian users. It combines daily mood and wellness check-ins, culturally grounded AI coaching in both **Amharic and English**, and personalized lifestyle insights rooted in Ethiopian culture — coffee ceremony, communal living, fasting traditions, local nutrition, and more.

The name _Selam_ (ሰላም) means _peace_ in Amharic — the foundation of all wellness.

**Core user problem:** Ethiopians lack wellness tools built for them. Every existing mental health or wellness app speaks in Western cultural terms, uses unfamiliar food databases, and is English-only. Selam fixes all three.

---

## 🧱 Tech Stack

| Layer         | Technology                                                      |
| ------------- | --------------------------------------------------------------- |
| Framework     | Next.js 14+ (App Router)                                        |
| Language      | TypeScript                                                      |
| Auth          | Better Auth                                                     |
| Database      | MongoDB (via Mongoose)                                          |
| AI            | Mistral AI (`mistral-medium-latest`) via `@mistralai/mistralai` |
| Styling       | Tailwind CSS v3                                                 |
| UI Components | shadcn/ui                                                       |
| Icons         | Lucide React                                                    |
| Fonts         | Google Fonts (see Design System section)                        |
| Deployment    | Vercel                                                          |

---

## 🗂️ Project Structure

```
selam/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Sidebar + nav wrapper
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Main dashboard / home
│   │   ├── checkin/
│   │   │   └── page.tsx          # Daily wellness check-in form
│   │   ├── chat/
│   │   │   └── page.tsx          # AI wellness chat interface
│   │   ├── feed/
│   │   │   └── page.tsx          # Daily wellness tips feed
│   │   └── profile/
│   │       └── page.tsx          # User profile & settings
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...all]/
│   │   │       └── route.ts      # Better Auth catch-all handler
│   │   ├── checkin/
│   │   │   └── route.ts          # POST: save check-in, GET: history
│   │   ├── chat/
│   │   │   └── route.ts          # POST: send message to Mistral
│   │   └── tips/
│   │       └── route.ts          # GET: AI-generated daily wellness tips
│   ├── globals.css
│   ├── layout.tsx                # Root layout with font + providers
│   └── page.tsx                  # Public landing page
├── components/
│   ├── ui/                       # shadcn/ui generated components
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── LanguageToggle.tsx    # EN ↔ AM toggle (global state)
│   ├── checkin/
│   │   ├── MoodSlider.tsx
│   │   ├── CheckinForm.tsx
│   │   └── StreakBadge.tsx
│   ├── chat/
│   │   ├── ChatWindow.tsx
│   │   ├── ChatMessage.tsx
│   │   └── ChatInput.tsx
│   ├── dashboard/
│   │   ├── WellnessScoreCard.tsx
│   │   ├── MoodHistoryChart.tsx  # Recharts line chart
│   │   └── InsightCard.tsx
│   └── feed/
│       └── TipCard.tsx
├── lib/
│   ├── auth.ts                   # Better Auth config
│   ├── db.ts                     # MongoDB connection (Mongoose)
│   ├── mistral.ts                # Mistral client + prompt helpers
│   └── i18n.ts                   # Translation strings EN/AM
├── models/
│   ├── User.ts
│   ├── CheckIn.ts
│   └── ChatMessage.ts
├── hooks/
│   ├── useLanguage.ts            # Global language state (zustand or context)
│   └── useCheckinStreak.ts
├── types/
│   └── index.ts
└── .env.local
```

---

## 🔐 Authentication

Using **Better Auth** for session-based auth.

### Setup (`lib/auth.ts`)

```ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { mongoClient } from "./db";

export const auth = betterAuth({
  database: mongodbAdapter(mongoClient.db("selam")),
  emailAndPassword: { enabled: true },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
});
```

### Routes

- `POST /api/auth/sign-up/email`
- `POST /api/auth/sign-in/email`
- `POST /api/auth/sign-out`
- Session available via `auth.api.getSession()` in Server Components

### Auth Pages

- `/login` — Email + password sign-in form
- `/register` — Name, email, password registration form
- Both pages redirect to `/dashboard` on success
- Protect all `/dashboard/*` routes via middleware

### Middleware (`middleware.ts`)

```ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "./lib/auth-client";

export async function middleware(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  const isProtected =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/checkin") ||
    req.nextUrl.pathname.startsWith("/chat");
  if (!session && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
```

---

## 🗄️ Data Models

### `models/User.ts`

```ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  language: "en" | "am"; // preferred language
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  language: { type: String, enum: ["en", "am"], default: "en" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
```

---

### `models/CheckIn.ts`

```ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICheckIn extends Document {
  userId: string;
  date: Date;
  mood: number; // 1–10 scale
  energy: number; // 1–5 scale
  sleep: number; // hours slept (0–12)
  stress: number; // 1–5 scale
  note: string; // optional freetext note
  aiInsight: string; // AI-generated insight based on this check-in
  language: "en" | "am";
}

const CheckInSchema = new Schema<ICheckIn>({
  userId: { type: String, required: true, index: true },
  date: { type: Date, default: Date.now },
  mood: { type: Number, required: true, min: 1, max: 10 },
  energy: { type: Number, required: true, min: 1, max: 5 },
  sleep: { type: Number, required: true, min: 0, max: 12 },
  stress: { type: Number, required: true, min: 1, max: 5 },
  note: { type: String, default: "" },
  aiInsight: { type: String, default: "" },
  language: { type: String, enum: ["en", "am"], default: "en" },
});
```

---

### `models/ChatMessage.ts`

```ts
import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage extends Document {
  userId: string;
  sessionId: string; // group messages into sessions
  role: "user" | "assistant";
  content: string;
  language: "en" | "am";
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  userId: { type: String, required: true, index: true },
  sessionId: { type: String, required: true },
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  language: { type: String, enum: ["en", "am"], default: "en" },
  createdAt: { type: Date, default: Date.now },
});
```

---

## 🌐 API Routes

### `POST /api/checkin`

Save a daily check-in and get an AI-generated insight.

**Request body:**

```json
{
  "mood": 7,
  "energy": 3,
  "sleep": 6.5,
  "stress": 4,
  "note": "Had a long day at work",
  "language": "en"
}
```

**Server logic:**

1. Get session, verify user
2. Check if user already checked in today — if yes, return `409`
3. Build Mistral prompt using check-in data (see Prompts section)
4. Call Mistral, get `aiInsight`
5. Save check-in with insight to MongoDB
6. Return saved check-in

**Response:**

```json
{
  "success": true,
  "insight": "Your energy is low today — consider a short walk outside or a coffee ceremony break with family...",
  "streak": 5
}
```

---

### `GET /api/checkin?limit=30`

Fetch the authenticated user's check-in history.

**Response:**

```json
{
  "checkins": [
    { "date": "2026-06-05", "mood": 7, "energy": 3, "sleep": 6.5, "stress": 4, "aiInsight": "..." },
    ...
  ],
  "streak": 5,
  "averageMood": 6.8
}
```

---

### `POST /api/chat`

Send a message to the AI wellness companion.

**Request body:**

```json
{
  "message": "I've been feeling overwhelmed lately",
  "sessionId": "abc123",
  "language": "am",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Server logic:**

1. Verify session
2. Build full conversation history with system prompt prepended
3. Call Mistral with conversation history
4. Save both user message and assistant response to MongoDB
5. Stream or return response

**Response:**

```json
{
  "reply": "ደስ ይበልዎ...",
  "sessionId": "abc123"
}
```

---

### `GET /api/tips?language=en`

Get AI-generated daily wellness tips personalized to the user.

**Server logic:**

1. Fetch the user's last 7 check-ins from MongoDB
2. Build a prompt summarizing recent wellness trends
3. Ask Mistral to generate 3 tips relevant to their patterns and Ethiopian context
4. Return tips

**Response:**

```json
{
  "tips": [
    {
      "category": "Nutrition",
      "title": "Try fasting-friendly breakfast",
      "body": "On fasting days, start with a light misir wot...",
      "emoji": "🫘"
    },
    ...
  ]
}
```

---

## 🤖 AI — Mistral Prompts

### `lib/mistral.ts`

```ts
import { Mistral } from "@mistralai/mistralai";

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY! });
const model = process.env.MISTRAL_MODEL ?? "mistral-medium-latest";
```

---

### Check-in Insight Prompt

```ts
export function buildCheckInPrompt(data: CheckInData, language: "en" | "am") {
  const langInstruction =
    language === "am" ? "Respond ONLY in Amharic ( አማርኛ)." : "Respond in English.";

  return `
You are Selam, a warm and culturally aware Ethiopian wellness companion.
${langInstruction}

A user just completed their daily wellness check-in:
- Mood: ${data.mood}/10
- Energy: ${data.energy}/5
- Sleep: ${data.sleep} hours
- Stress level: ${data.stress}/5
- Their note: "${data.note || "None"}"

Generate a short (2-3 sentence), warm, and practical insight for this user.
- Be empathetic, not clinical
- Reference Ethiopian cultural context where relevant (coffee ceremony, communal support, local foods, fasting, nature)
- Give one specific, actionable suggestion for today
- Do NOT sound like a generic health app
`;
}
```

---

### Chat System Prompt

```ts
export function buildChatSystemPrompt(language: "en" | "am") {
  const langInstruction =
    language === "am"
      ? "Always respond in Amharic ( አማርኛ). You may use some English words where no Amharic equivalent exists."
      : "Respond in clear, warm English.";

  return `
You are Selam (ሰላም), an AI wellness companion built specifically for Ethiopian users.
${langInstruction}

Your personality:
- Warm, calm, and supportive — like a trusted elder or close friend
- Culturally grounded in Ethiopian values: community (ማህበረሰብ), resilience, spirituality, and balance
- You understand Ethiopian fasting traditions, coffee culture, local foods (injera, tibs, shiro, tej), family structures, and the pressures of modern urban Ethiopian life
- You do NOT use generic Western therapy speak — you speak in culturally familiar terms
- You are NOT a replacement for professional mental health care — gently encourage professional help for serious issues

Topics you support:
- Stress, burnout, and work-life balance
- Sleep and energy
- Nutrition and Ethiopian diet guidance
- Emotional wellness and relationships
- Motivation and purpose

What you avoid:
- Diagnosing any condition
- Giving medical advice
- Being preachy or lecture-y

Keep responses concise — 3-5 sentences max unless the user asks for more detail.
`;
}
```

---

### Daily Tips Prompt

```ts
export function buildTipsPrompt(recentCheckins: CheckInSummary[], language: "en" | "am") {
  const langInstruction = language === "am" ? "Respond in Amharic." : "Respond in English.";

  return `
You are Selam, an Ethiopian wellness companion. ${langInstruction}

Based on this user's recent wellness data:
${JSON.stringify(recentCheckins)}

Generate exactly 3 personalized wellness tips in valid JSON format with this structure:
[
  { "category": "string", "title": "string", "body": "string (1-2 sentences)", "emoji": "string" }
]

Categories to choose from: Nutrition, Movement, Mental Wellness, Sleep, Community, Mindfulness.
Ground tips in Ethiopian context — local foods, cultural practices, community habits.
Return ONLY the JSON array. No preamble, no backticks.
`;
}
```

---

## 🌍 Internationalization (i18n)

Language state is global — toggling EN ↔ AM affects all UI text and AI responses simultaneously.

### `lib/i18n.ts`

```ts
export const translations = {
  en: {
    nav: {
      dashboard: "Dashboard",
      checkin: "Daily Check-in",
      chat: "AI Companion",
      feed: "Wellness Feed",
      profile: "Profile",
    },
    dashboard: {
      greeting: "Good morning",
      score: "Wellness Score",
      streak: "Day Streak",
      checkinPrompt: "How are you feeling today?",
    },
    checkin: {
      title: "Daily Check-in",
      mood: "How's your mood?",
      energy: "Energy level",
      sleep: "Hours slept",
      stress: "Stress level",
      note: "Anything on your mind?",
      submit: "Submit Check-in",
    },
    chat: {
      placeholder: "Share what's on your mind...",
      send: "Send",
    },
  },
  am: {
    nav: {
      dashboard: "ዳሽቦርድ",
      checkin: "ዕለታዊ ሁኔታ",
      chat: "AI ጓደኛ",
      feed: "የጤና ምክሮች",
      profile: "መገለጫ",
    },
    dashboard: {
      greeting: "እንዴት አደሩ",
      score: "የጤና ነጥብ",
      streak: "ቀናት ተከታታይ",
      checkinPrompt: "ዛሬ ሁኔታዎ ምን ይመስላል?",
    },
    checkin: {
      title: "ዕለታዊ ሁኔታ ምዝገባ",
      mood: "ስሜትዎ ምን ይመስላል?",
      energy: "የጉልበት ደረጃ",
      sleep: "የተኙ ሰዓቶች",
      stress: "የጭንቀት ደረጃ",
      note: "ሌላ ነገር ማጋራት ይፈልጋሉ?",
      submit: "አስገባ",
    },
    chat: {
      placeholder: "ምን አለ?...",
      send: "ላክ",
    },
  },
};
```

### `hooks/useLanguage.ts`

```ts
// Use React Context or Zustand for global language state
// Toggle persisted to localStorage and user profile on backend
```

---

## 🎨 Design System

### Aesthetic Direction

**Organic luxury** — think warm earth tones, Ethiopian textile patterns as accents, clean whitespace. Not a generic health app. Not purple gradients. Think Kuriftu Resort meets modern SaaS.

### Color Palette (CSS Variables)

```css
:root {
  --background: #faf7f2; /* warm off-white */
  --foreground: #1a1208; /* deep espresso */
  --primary: #c8622a; /* Ethiopian coffee / terracotta */
  --primary-foreground: #faf7f2;
  --secondary: #4a7c59; /* Ethiopian green / eucalyptus */
  --secondary-foreground: #faf7f2;
  --accent: #e8b84b; /* tej gold / honey */
  --accent-foreground: #1a1208;
  --muted: #ede8e0; /* warm grey */
  --muted-foreground: #6b5e4c;
  --card: #ffffff;
  --border: #ddd5c8;
  --radius: 12px;
}
```

### Typography

```css
/* Heading font: Cormorant Garamond — elegant, editorial */
/* Body font: Plus Jakarta Sans — clean, modern, readable */
/* Amharic system fallback: Noto Sans Ethiopic */

font-family: "Plus Jakarta Sans", "Noto Sans Ethiopic", sans-serif;
/* headings: */
font-family: "Cormorant Garamond", serif;
```

### Key Design Principles

- Cards with subtle `box-shadow` and `border-radius: 12px` — no harsh borders
- Generous whitespace — breathe
- Ethiopian textile-inspired subtle patterns as section dividers or backgrounds (SVG or CSS)
- Mood slider uses a warm gradient from red → amber → green
- Streak counter is visually prominent — gamification hook
- Language toggle is always visible in top-right corner

---

## 📄 Pages & Components — Detailed Spec

### `app/page.tsx` — Landing Page

**Sections:**

1. **Hero** — Full viewport. Headline: _"ሰላም — Your Ethiopian Wellness Companion"_ / _"Peace starts from within."_. CTA: "Get Started" → `/register`. Language toggle in nav.
2. **Problem Section** — 3 cards: "Built for Ethiopia", "AI in your language", "Rooted in your culture"
3. **Features Preview** — Screenshots or illustrated mockups of dashboard, chat, and check-in
4. **How it Works** — 3-step flow: Check-in daily → Get AI insights → Thrive
5. **Footer** — Hackathon credit: ALX Ethiopia × Kuriftu Resorts × WeVaSphere

---

### `app/(dashboard)/dashboard/page.tsx` — Main Dashboard

**Components:**

- `WellnessScoreCard` — Shows composite score (average of last 7 check-ins), streak count, and a "Check in today" CTA if not yet done
- `MoodHistoryChart` — Recharts `LineChart` of mood score over last 14 days. Animate on load.
- `InsightCard` — Shows the AI insight from the most recent check-in
- `TipCard` (×3) — Pulls from `/api/tips`, shows today's 3 tips in a horizontal scroll row

---

### `app/(dashboard)/checkin/page.tsx` — Daily Check-in

**Flow:**

1. Step 1: Mood slider (1–10) with emoji feedback at each level (😔 → 😐 → 😊 → 🌟)
2. Step 2: Quick sliders for energy (1–5), sleep (0–12h), stress (1–5)
3. Step 3: Optional text note with placeholder: _"Anything on your mind today?"_
4. Submit → Mistral generates insight → Show insight in a card with animation → Redirect to dashboard

**Rules:**

- If user already checked in today, show today's completed check-in instead of the form
- Streak badge updates immediately after submission

---

### `app/(dashboard)/chat/page.tsx` — AI Companion Chat

**Layout:**

- Full-height chat window, messages scroll from bottom
- User messages: right-aligned, primary color background
- Selam messages: left-aligned, card background, with a small "Selam 🌿" label
- Language toggle at the top of chat — switches AI response language in real time
- Input bar pinned to bottom with `Send` button
- New session starts on page load; history from MongoDB loads on mount for continuity

**Behavior:**

- On send: show user message instantly (optimistic), show typing indicator, then stream/display Mistral response
- Save both sides of conversation to MongoDB via `/api/chat`
- "Clear conversation" button to start a fresh session

---

### `app/(dashboard)/feed/page.tsx` — Wellness Feed

**Layout:**

- 3 tip cards from `/api/tips` at the top — personalized based on check-in history
- Static curated wellness content below (hardcoded or seeded):
  - Ethiopian superfoods spotlight (teff, berbere, moringa)
  - Mindfulness practices rooted in Ethiopian tradition
  - Movement routines that work for Ethiopian urban lifestyles
- Each card has category badge, emoji, title, body text
- Language toggle affects all AI-generated content

---

### `app/(dashboard)/profile/page.tsx` — Profile & Settings

**Fields:**

- Display name (editable)
- Email (read-only)
- Language preference toggle (EN / AM) — saves to user profile
- Check-in history summary: total check-ins, best streak, average mood
- "Sign out" button

---

## ⚙️ Environment Variables

```bash
# .env.local

# MongoDB
MONGODB_URI=mongodb+srv://...

# Better Auth
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:3000

# Mistral AI
MISTRAL_API_KEY=your_mistral_api_key_here
MISTRAL_MODEL=mistral-medium-latest

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

For Vercel, set the URL values to the deployed origin, for example
`https://lomi-care.vercel.app`. `BETTER_AUTH_SECRET` must be a strong random
secret and should be configured in Vercel, not committed.

---

## 📦 Dependencies

```bash
# Core
npm install next react react-dom typescript

# Auth
npm install better-auth

# Database
npm install mongoose

# AI
npm install @mistralai/mistralai

# UI
npm install tailwindcss @tailwindcss/typography
npx shadcn@latest init
npx shadcn@latest add button card input label slider textarea badge avatar

# Charts
npm install recharts

# Icons
npm install lucide-react

# Utilities
npm install uuid
```

---

## 🏗️ Build Order

Build in this order to maintain a working app at every stage:

### Phase 1 — Foundation (Day 1 Morning)

1. `npx create-next-app@latest selam --typescript --tailwind --app`
2. Set up MongoDB connection (`lib/db.ts`)
3. Set up Better Auth (`lib/auth.ts`, `/api/auth/[...all]/route.ts`)
4. Create User model
5. Build `/login` and `/register` pages
6. Add middleware to protect dashboard routes
7. **Checkpoint:** Auth flow works end-to-end

### Phase 2 — Check-in Core (Day 1 Afternoon)

1. Create `CheckIn` model
2. Build `/api/checkin` POST and GET routes (without AI first — hardcode insight)
3. Build `CheckinForm` component with mood slider, energy/sleep/stress sliders, note field
4. Build `/checkin` page
5. Add streak calculation logic
6. **Checkpoint:** Users can check in and data saves to MongoDB

### Phase 3 — AI Integration (Day 1 Evening)

1. Set up Mistral client (`lib/mistral.ts`)
2. Add `buildCheckInPrompt` — integrate into `/api/checkin` POST
3. Build `/api/chat` POST route with system prompt + conversation history
4. Build `ChatWindow`, `ChatMessage`, `ChatInput` components
5. Build `/chat` page
6. Add `/api/tips` route
7. **Checkpoint:** AI responses working in check-in and chat

### Phase 4 — Dashboard & Feed (Day 2 Morning)

1. Build `WellnessScoreCard`, `MoodHistoryChart` (Recharts), `InsightCard`
2. Build `/dashboard` page
3. Build `TipCard` and `/feed` page
4. Build `/profile` page
5. **Checkpoint:** Full app flow complete

### Phase 5 — i18n & Language Toggle (Day 2 Midday)

1. Add translation strings (`lib/i18n.ts`)
2. Build `useLanguage` hook with context
3. Add `LanguageToggle` to TopBar
4. Wire language state to all UI text
5. Wire language param to all AI API calls
6. **Checkpoint:** EN ↔ AM toggle works across the full app

### Phase 6 — Polish & Demo Prep (Day 2 Afternoon)

1. Apply full design system (colors, fonts, CSS variables)
2. Add animations (page transitions, chart load, check-in success state)
3. Seed demo data for pitch (pre-filled check-in history, example chat)
4. Mobile responsive pass
5. Deploy to Vercel
6. **Checkpoint:** Demo-ready

---

## 💰 Revenue Model (for pitch)

| Tier                    | Price                    | Features                                                                                           |
| ----------------------- | ------------------------ | -------------------------------------------------------------------------------------------------- |
| **Free**                | $0                       | Daily check-in, basic AI insight, 7-day history                                                    |
| **Premium**             | ~150 ETB/mo (~$1.10 USD) | Unlimited AI chat, full history, personalized tips, language preference                            |
| **B2B / Corporate**     | Custom                   | Employee wellness dashboards, burnout analytics, HR reporting                                      |
| **Kuriftu Partnership** | Revenue share            | Guest wellness check-in QR at resort — Selam as the digital wellness arm of the retreat experience |

---

## 🎤 Pitch Narrative (for demo day)

> _"Every wellness app in the world was built for someone else. Not for the person who fasts on Wednesdays and Fridays. Not for the person who finds peace in a coffee ceremony. Not for the person who wants to talk about stress — but in Amharic._
>
> _Selam is built for them. It's a daily wellness companion that speaks your language — literally. Powered by AI, grounded in Ethiopian culture, and designed to help everyday Ethiopians heal, build resilience, and thrive."_

**Demo flow:** Land on homepage → Register → Complete check-in → Show AI insight in Amharic → Switch to chat → Ask "ዛሬ ጭንቀት ይሰማኛል" → Show culturally warm response → Show dashboard streak and mood chart.

---

## 🔮 Post-Hackathon Roadmap

- Voice input for check-ins (speak in Amharic, transcribed by Whisper API)
- Push notifications / PWA for daily check-in reminders
- Community circles — anonymous peer support groups
- Integration with Ethiopian tele health providers
- WhatsApp bot version for users without app access

---

_Built for the Wellness Hackathon 2026 — ALX Ethiopia × Kuriftu Resorts × WeVaSphere_  
_Heal. Build. Thrive. _
