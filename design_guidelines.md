# Design Guidelines: Spending Habits Quiz

## Design Approach
**Reference-Based**: Drawing from successful personality quiz platforms (16 Personalities, Duolingo's gamification, BuzzFeed's engagement patterns) combined with modern minimalist principles.

## Typography
- **Primary Font**: Inter (Google Fonts) - clean, readable, modern
- **Hierarchy**: 
  - Headlines: 48px/Bold (desktop), 32px (mobile)
  - Quiz Questions: 28px/Semibold
  - Body/Answers: 18px/Regular
  - Timer/Progress Labels: 14px/Medium

## Layout System
**Spacing**: Strict adherence to 4, 8, 16, 24 units (p-1, p-2, p-4, p-6 in Tailwind)
**Containers**: max-w-3xl for quiz content (optimal reading/interaction width)

## Page Structure

### Landing Page (Hero-First)
**Hero Section** (70vh):
- Full-width background image showing diverse people making purchasing decisions (lifestyle photography, bright, optimistic tone)
- Centered content overlay with frosted glass effect backdrop
- Large headline: "Are You a Saver or Spender?"
- Subheadline explaining the 5-minute personality quiz
- Primary CTA button with blurred background, white text
- Small trust indicator: "Join 50,000+ people who've discovered their money personality"

**How It Works** (2-column on desktop):
- Left: Icon + "Quick 12 Questions" 
- Right: Icon + "Get Instant Results"
- Each with brief description, icons from Heroicons

**Preview Section**:
- Single sample question card to show quiz format
- "See what to expect" messaging

### Quiz Interface (Full Screen Experience)
**Fixed Header**:
- Progress bar (full width, 6px height, rounded ends)
- Numeric progress indicator: "Question 5 of 12"
- Timer component (circular progress ring, 30s countdown)

**Question Container** (centered, max-w-2xl):
- Question number badge (small, subtle)
- Large question text
- 3-4 answer cards in vertical stack:
  - Each card: p-6 spacing, rounded-lg, hover lift effect
  - Radio button left-aligned with answer text
  - Generous tap target (min 56px height)

**Navigation**:
- Fixed bottom bar with Previous/Next buttons
- Next button prominence (larger, bolder)

### Results Page
**Hero-Style Results** (60vh):
- Split personality visualization (Saver vs Spender meter/gauge)
- Large percentage display: "You're 68% Saver"
- Archetype badge/label

**Breakdown Section** (3-column grid on desktop):
- Spending patterns analysis
- Strengths card
- Growth areas card

**Detailed Insights** (2-column alternating):
- Category-by-category breakdown with small charts/icons
- Tips and recommendations

**Social Sharing**:
- Share result buttons (Twitter, LinkedIn, WhatsApp)
- "Retake Quiz" CTA

## Core Components

**Quiz Answer Cards**:
- Unselected: subtle border, light background
- Selected: prominent border, slight elevation
- Transition: 200ms ease

**Timer Widget**:
- Circular SVG progress ring
- Numbers countdown inside
- Gentle pulse at <10 seconds

**Progress Bar**:
- Gradient fill showing completion
- Smooth transition on each question

**CTA Buttons**:
- Primary: Large (px-8 py-4), rounded-full, bold text
- Secondary: Outlined variant
- All buttons: backdrop-blur when over images

## Images
1. **Landing Hero**: Lifestyle photo showing people shopping/budgeting - warm, inviting, diverse (1920x1080)
2. **Results Page**: Abstract financial growth imagery or celebratory illustration (optional background)

## Icons
**Heroicons (outline)**: For UI elements (clock, chart-bar, share, arrow navigation)

## Accessibility
- ARIA labels on progress indicators
- Keyboard navigation between answers (arrow keys)
- Focus states with 3px outline offset
- Timer audio cue option toggle