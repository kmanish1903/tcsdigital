
# Daily Growth Academy

A new dedicated page with AI-generated daily content across three domains, plus a save/bookmark system persisted in the database.

## What You Get

1. **New `/academy` page** with 3 tabs: Business Idea, Influence Training, Conversation & Attraction
2. Each tab shows AI-generated daily content following the exact structure you described (1000-1500 word business ideas, influence scenarios, conversation scripts)
3. **Save button** on each piece of content -- saved items go to a **Saved** tab on the same page
4. Content regenerates daily (date-seeded) with a manual "Regenerate" option
5. Nav link from the dashboard header

## Technical Plan

### 1. Database

- New `saved_academy_items` table: `id`, `user_id`, `section` (business/influence/conversation), `content` (jsonb), `title`, `created_at`
- RLS: users manage only their own rows

### 2. Edge Function: `academy-content`

- Uses `google/gemini-2.5-flash` via Lovable AI Gateway
- Accepts `{ section: "business" | "influence" | "conversation" }` 
- Each section has a tailored system prompt matching your exact structure requirements
- Returns structured content (parsed via tool-calling for consistent JSON)
- Handles 429/402 errors

### 3. Frontend Components

- **`src/pages/Academy.tsx`** -- main page with 4 tabs: Business | Influence | Conversation | Saved
- **`src/components/academy/BusinessIdeaCard.tsx`** -- renders the 13-point business idea structure
- **`src/components/academy/InfluenceCard.tsx`** -- renders the 10-point influence scenario
- **`src/components/academy/ConversationCard.tsx`** -- renders the conversation flow with dialogue format
- **`src/components/academy/SavedItemsList.tsx`** -- lists all saved items with section filters
- Each content card has a "Save Idea" / "Save Scenario" button that persists to the database

### 4. Routing & Navigation

- Add `/academy` route in `App.tsx` (protected)
- Add "Academy" nav link in the dashboard header
