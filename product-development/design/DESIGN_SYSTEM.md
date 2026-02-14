# Echoglot Design System & Visual Specification

> **Purpose**: This document is the single source of truth for Echoglot's visual identity. Any designer, developer, or AI design tool should be able to recreate the exact look and feel of Echoglot from this document alone.
>
> **Product**: Real-time voice & chat translation platform with AI voice cloning.
> **Deliverables**: Landing Website + Web App + Mobile App (Phase 2)

---

## Table of Contents

1. [Design Philosophy & Direction](#1-design-philosophy--direction)
2. [Reference Mood Board](#2-reference-mood-board)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Spacing & Grid System](#5-spacing--grid-system)
6. [Visual Effects & Treatments](#6-visual-effects--treatments)
7. [Iconography & Illustrations](#7-iconography--illustrations)
8. [Component Library](#8-component-library)
9. [Landing Website Specification](#9-landing-website-specification)
10. [App UI Specification](#10-app-ui-specification)
11. [Motion & Animation](#11-motion--animation)
12. [Responsive Breakpoints](#12-responsive-breakpoints)
13. [Accessibility](#13-accessibility)
14. [Do's and Don'ts](#14-dos-and-donts)

---

## 1. Design Philosophy & Direction

### Core Identity

Echoglot breaks language barriers in real-time while preserving the speaker's voice identity. The design must feel:

- **Futuristic but warm** — Technology that feels human, not cold
- **Premium but accessible** — High-end SaaS aesthetic without feeling exclusive
- **Dark and immersive** — Like stepping into a voice studio
- **Alive** — Waveforms, pulses, and micro-animations convey real-time activity

### Design DNA (Borrowed from References)

| Trait | Inspiration Source | How We Apply It |
|-------|-------------------|-----------------|
| Dark-first with high contrast | Resend, Mastra.ai | Pure black backgrounds (#000 / #050505) with crisp white text |
| Vibrant accent on dark canvas | Markopolo.ai (lime green #d8fe91) | Our signature accent color pops against dark backgrounds |
| Bold oversized type for hero | Cash App (Cash Sans, large type) | Display headings that command attention |
| Product-first storytelling | ElevenLabs, Resend | Show the product working, not stock photos |
| Glassmorphism for depth | Markopolo.ai (backdrop blur panels) | Frosted glass cards for chat bubbles, modals, voice panels |
| Scroll-driven animations | Cash App (GSAP + Parallax), Rocket.new | Sections reveal with motion as user scrolls |
| Developer-grade credibility | Mastra.ai (anti-grid, code blocks) | Technical sections feel trustworthy and precise |
| Playful color pops | Cash App (illustrations, green energy) | Voice waveforms and language indicators use vivid colors |

### Personality Keywords

`Voice Studio` · `Immersive` · `Real-time` · `Dark Cinema` · `Alive` · `Global` · `Premium`

---

## 2. Reference Mood Board

### Primary References (Study These First)

| Reference | URL | What to Take |
|-----------|-----|--------------|
| Resend | https://resend.com | Dark hero, glassmorphism buttons, texture overlays, Domaine + Inter typography pairing, thin white borders at low opacity |
| Markopolo.ai | https://markopolo.ai | Lime accent on black, glassmorphic cards (backdrop-blur), gradient overlays at angles, layered depth, badge styling |
| Mastra.ai | https://mastra.ai | Anti-grid layout with asymmetric card sizes, near-black (#050505) background, section structure, developer credibility |
| Cash App | https://cash.app | Bold custom type (Cash Sans), large type hero, GSAP scroll animations, parallax depth, colorful illustrations, playful energy |
| Rocket.new | https://rocket.new | Rotating text animation in hero, marquee logo scroller, glassmorphic badges, pink/magenta accent, clean section padding |
| Genie Studio | https://geniestudio.ai | Serif + sans-serif font pairing (Playfair Display + Source Sans Pro), charcoal dark (#161616), minimal flat design, subtle hover transitions |
| AI Audio Platform 2024 | https://dribbble.com/shots/25017107-Ai-Audio-Platform-Website-2024 | Audio waveform visuals, vibrant gradients on dark, SaaS audio product layout |

### Secondary References (For Specific Components)

| Reference | URL | What to Take |
|-----------|-----|--------------|
| ElevenLabs | https://elevenlabs.io | Voice gallery hero, product-first demo, dark/clean, restrained enterprise feel |
| Deepgram | https://deepgram.com | Real-time audio visualization, developer docs aesthetic |
| DeepL | https://deepl.com | Translation input/output pattern, language switcher component |
| Otter.ai | https://otter.ai | Live transcription UI, speaker identification bubbles |
| Riverside.fm | https://riverside.fm | Recording studio interface, waveform patterns |
| Voicify UI Kit | https://www.behance.net/gallery/186308789/Voicify-AI-Voice-Generator-App-UI-Kit | Full AI voice app design system, 240 screens |
| Lingify UI Kit | https://www.behance.net/gallery/197095061/Lingify-AI-Translator-App-UI-Kit | AI translator design system, dual themes |
| Lingua AI Translation | https://dribbble.com/shots/22901941-Lingua-AI-Realtime-Language-Translation-App | Real-time translation flow |

---

## 3. Color System

### 3.1 Core Palette

```
BACKGROUND SCALE (Dark → Darker)
├── bg-primary:     #000000  (Pure black — hero, main backgrounds)
├── bg-elevated:    #0A0A0A  (Slightly lifted — card backgrounds)
├── bg-surface:     #141414  (Surface level — panels, sidebars)
├── bg-muted:       #1A1A1A  (Muted surface — input fields, code blocks)
└── bg-subtle:      #202020  (Subtle elevation — hover states, dropdowns)

TEXT SCALE (Bright → Dim)
├── text-primary:   #FFFFFF  (Headlines, primary content)
├── text-secondary: #B0B0B0  (Body text, descriptions)
├── text-tertiary:  #6B6B6B  (Captions, timestamps, metadata)
├── text-muted:     #404040  (Disabled text, placeholders)
└── text-inverse:   #000000  (Text on light/accent backgrounds)

BORDER SCALE
├── border-default: rgba(255, 255, 255, 0.06)  (Subtle card borders)
├── border-hover:   rgba(255, 255, 255, 0.12)  (Hover state borders)
├── border-active:  rgba(255, 255, 255, 0.20)  (Active/focused borders)
└── border-accent:  rgba(99, 102, 241, 0.40)   (Accent-tinted borders)
```

### 3.2 Accent Colors

```
PRIMARY ACCENT (Voice/Action — used for CTAs, active states, waveforms)
├── accent-500:     #6366F1  (Indigo — primary accent)
├── accent-400:     #818CF8  (Lighter indigo — hover)
├── accent-600:     #4F46E5  (Deeper indigo — pressed)
├── accent-glow:    rgba(99, 102, 241, 0.25)  (Glow effect behind buttons/waveforms)

SECONDARY ACCENT (Energy/Live — used for live indicators, voice activity)
├── live-500:       #22D3EE  (Cyan — live/active states)
├── live-400:       #67E8F9  (Light cyan — pulse effect)
├── live-glow:      rgba(34, 211, 238, 0.20)  (Glow behind live indicators)

TERTIARY ACCENT (Success/Connected)
├── success-500:    #10B981  (Emerald — connected, translated)
├── success-glow:   rgba(16, 185, 129, 0.20)

WARNING/ACCENT POP (Inspired by Markopolo's lime)
├── pop-500:        #D4FF60  (Lime — special highlights, badges, notifications)
├── pop-400:        #E4FF8A  (Lighter lime)
├── pop-glow:       rgba(212, 255, 96, 0.15)
```

### 3.3 Semantic Colors

```
ERROR:    #EF4444 (Red — connection failed, translation error)
WARNING:  #F59E0B (Amber — poor connection, high latency)
INFO:     #3B82F6 (Blue — informational notices)
SUCCESS:  #10B981 (Emerald — connected, translation complete)
```

### 3.4 Language Indicator Colors

Each language gets a unique color for visual distinction in conversations:

```
English:    #6366F1 (Indigo)
Spanish:    #F59E0B (Amber)
French:     #3B82F6 (Blue)
German:     #EF4444 (Red)
Japanese:   #EC4899 (Pink)
Mandarin:   #F97316 (Orange)
Hindi:      #8B5CF6 (Violet)
Arabic:     #14B8A6 (Teal)
Portuguese: #22C55E (Green)
Korean:     #E879F9 (Fuchsia)
```

These appear as thin 2px left-border accents on chat messages and as colored ring indicators around user avatars during voice calls.

### 3.5 Gradient Definitions

```css
/* Primary hero gradient — subtle radial glow behind hero content */
--gradient-hero: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(99, 102, 241, 0.15) 0%, transparent 70%);

/* Card hover gradient — subtle top-left glow on card hover */
--gradient-card-hover: radial-gradient(ellipse at 20% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 60%);

/* Voice active gradient — pulsing behind active voice waveform */
--gradient-voice-active: radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.20) 0%, transparent 60%);

/* CTA button gradient */
--gradient-cta: linear-gradient(135deg, #6366F1 0%, #818CF8 50%, #6366F1 100%);

/* Accent border gradient (for premium cards) — inspired by Resend */
--gradient-border: linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(34, 211, 238, 0.4) 100%);

/* Background mesh gradient (landing page sections) — inspired by Markopolo */
--gradient-mesh:
  radial-gradient(ellipse at 20% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 20%, rgba(34, 211, 238, 0.04) 0%, transparent 50%);
```

---

## 4. Typography

### 4.1 Font Stack

```
DISPLAY (Hero headings, landing page titles)
  Font:    "Inter Display" or "Plus Jakarta Sans"
  Weight:  700 (Bold) / 800 (ExtraBold)
  Style:   Tight letter-spacing (-0.02em to -0.04em)
  Note:    Inspired by Markopolo's bold Inter Display usage

HEADING (Section headers, card titles, in-app headings)
  Font:    "Inter"
  Weight:  600 (SemiBold) / 700 (Bold)
  Style:   Normal letter-spacing

BODY (Paragraphs, descriptions, chat messages)
  Font:    "Inter"
  Weight:  400 (Regular) / 500 (Medium)
  Style:   Normal letter-spacing, 1.6 line height

MONO (Code snippets, technical info, API references)
  Font:    "JetBrains Mono" or "Commit Mono"
  Weight:  400 (Regular)
  Style:   Inspired by Resend's Commit Mono usage

ACCENT SERIF (Optional — for premium feel on select headings)
  Font:    "Playfair Display"
  Weight:  700 (Bold)
  Usage:   Taglines, testimonial quotes only
  Note:    Inspired by GenieStudio's serif/sans pairing
```

### 4.2 Type Scale

```
LANDING PAGE
├── display-xl:   72px / 76px line-height / -0.04em  (Hero headline)
├── display-lg:   56px / 62px line-height / -0.03em  (Section headlines)
├── display-md:   40px / 48px line-height / -0.02em  (Sub-section headlines)
├── heading-lg:   32px / 40px line-height / -0.01em  (Card titles)
├── heading-md:   24px / 32px line-height             (Feature titles)
├── heading-sm:   20px / 28px line-height             (Labels, small headings)
├── body-lg:      18px / 28px line-height             (Hero description)
├── body-md:      16px / 26px line-height             (Body text)
├── body-sm:      14px / 22px line-height             (Captions)
└── body-xs:      12px / 18px line-height             (Fine print, metadata)

APP UI
├── app-title:    24px / 32px / font-weight: 700      (Page titles)
├── app-heading:  18px / 26px / font-weight: 600      (Section headers)
├── app-body:     15px / 24px / font-weight: 400      (Primary content, messages)
├── app-caption:  13px / 20px / font-weight: 400      (Secondary info)
├── app-tiny:     11px / 16px / font-weight: 500      (Badges, timestamps)
└── app-mono:     14px / 22px / font-weight: 400      (Translation metadata)

MOBILE APP (Phase 2)
├── mobile-title:   22px / 28px
├── mobile-heading: 17px / 24px
├── mobile-body:    15px / 22px
├── mobile-caption: 13px / 18px
└── mobile-tiny:    11px / 16px
```

---

## 5. Spacing & Grid System

### 5.1 Spacing Scale (8px Base Unit)

```
--space-0:    0px
--space-1:    4px     (Tight gaps: icon-to-text, inline elements)
--space-2:    8px     (Small gaps: between badges, list items)
--space-3:    12px    (Input padding, small card padding)
--space-4:    16px    (Standard padding, button padding, card gaps)
--space-5:    20px    (Medium gaps between components)
--space-6:    24px    (Card internal padding, section sub-gaps)
--space-8:    32px    (Between card groups, form sections)
--space-10:   40px    (Between sections in app, major component gaps)
--space-12:   48px    (Landing page section inner padding)
--space-16:   64px    (Landing page between-section gaps)
--space-20:   80px    (Landing page section vertical padding)
--space-24:   96px    (Major landing page section breaks)
--space-32:   128px   (Hero top/bottom padding)
```

### 5.2 Grid System

```
LANDING PAGE
├── Max width:      1280px (content container) — inspired by Markopolo
├── Full bleed:     100vw  (backgrounds, gradients extend full width)
├── Columns:        12-column grid
├── Column gap:     24px (desktop) / 16px (tablet) / 12px (mobile)
├── Side padding:   40px (desktop) / 24px (tablet) / 16px (mobile)
├── Hero height:    min 100vh (or 108vh with overflow like Rocket.new)

APP UI
├── Max width:      100% fluid
├── Sidebar:        280px (collapsible to 72px icon-only)
├── Main content:   Fluid (fill remaining)
├── Chat area:      Max 720px centered within main
├── Right panel:    320px (voice controls, user info — collapsible)
├── Padding:        24px consistent on all panels
```

### 5.3 Anti-Grid Layout (Inspired by Mastra.ai)

For the landing page feature sections, use an asymmetric bento-grid layout:

```
Desktop (4 columns):
┌─────────────┬──────┬──────┐
│  Feature A   │  B   │  C   │
│  (spans 2)   │      │      │
├──────┬───────┴──────┤      │
│  D   │   Feature E   │      │
│      │  (spans 2)    ├──────┘
│      │               │  F   │
└──────┴───────────────┴──────┘

- Large cards: span 2 columns, 400px min height
- Small cards: span 1 column, 200px min height
- Card corner radius: 16px
- Card border: 1px solid rgba(255, 255, 255, 0.06)
- Card background: #0A0A0A
```

---

## 6. Visual Effects & Treatments

### 6.1 Glassmorphism (Inspired by Markopolo + Resend)

```css
/* Standard glassmorphic panel */
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
}

/* Elevated glassmorphic card (for modals, popups) */
.glass-elevated {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

/* Button glassmorphism (inspired by Markopolo CTA) */
.glass-button {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 43px;
  padding: 12px 24px;
}

/* Chat message bubble glassmorphism */
.glass-message {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px 16px 16px 4px; /* tail on bottom-left */
}
```

### 6.2 Glow Effects

```css
/* Accent glow behind primary buttons */
.glow-accent {
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.3),
              0 0 60px rgba(99, 102, 241, 0.1);
}

/* Live indicator glow (pulsing) */
.glow-live {
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.4);
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 12px rgba(34, 211, 238, 0.4); }
  50%      { box-shadow: 0 0 24px rgba(34, 211, 238, 0.6); }
}

/* Voice active waveform glow */
.glow-voice {
  filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.5));
}
```

### 6.3 Background Treatments

```css
/* Landing page hero background */
.hero-bg {
  background: #000000;
  position: relative;
}
.hero-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 50% 30%, rgba(99, 102, 241, 0.12) 0%, transparent 70%),
    radial-gradient(ellipse 60% 40% at 30% 70%, rgba(34, 211, 238, 0.06) 0%, transparent 60%);
  pointer-events: none;
}

/* Noise texture overlay (inspired by Resend's texture-btn.png) */
.noise-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/textures/noise-grain.png');
  opacity: 0.03;
  mix-blend-mode: overlay;
  pointer-events: none;
}

/* Grid dot pattern background (for technical sections) */
.grid-dots {
  background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 24px 24px;
}
```

### 6.4 Border Treatments

```css
/* Gradient border (for premium/featured cards) — inspired by Resend */
.gradient-border {
  position: relative;
  border-radius: 16px;
  background: #0A0A0A;
}
.gradient-border::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 17px;
  background: linear-gradient(135deg, rgba(99,102,241,0.3), rgba(34,211,238,0.3));
  z-index: -1;
}

/* Subtle divider lines */
.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent);
}
```

---

## 7. Iconography & Illustrations

### 7.1 Icon Style

```
System:     Lucide Icons (consistent with shadcn/ui)
Size:       20px default, 16px compact, 24px prominent
Stroke:     1.5px (matches Inter's visual weight)
Color:      text-secondary (#B0B0B0) default, text-primary on hover/active
Active:     Filled variant or accent color fill

Custom icons needed:
├── Voice waveform (3-bar equalizer, animated)
├── Translation arrows (bidirectional with language codes)
├── Voice clone DNA helix (brand icon)
├── Language globe (with pulse rings)
├── Speaker avatar with sound waves
└── Real-time indicator (concentric circles pulsing)
```

### 7.2 Voice Waveform Visualization

The signature visual element of Echoglot. Appears in:
- Hero section of landing page (large, animated)
- In-call voice activity indicator (compact)
- Voice profile onboarding (medium)
- Chat voice message playback (inline)

```
Style:      Smooth sine wave with rounded caps (NOT sharp bars)
Colors:     Gradient from accent-500 (#6366F1) to live-500 (#22D3EE)
Animation:  Continuous organic movement when voice is active
Idle:       Flat line with subtle breathing animation
Bars:       5-7 bars for compact view, 15-20 bars for expanded
Bar width:  3px compact, 4px expanded
Bar gap:    2px compact, 3px expanded
Bar radius: Full round caps (border-radius: 999px)
Height:     32px compact, 64px medium, 120px hero
Glow:       Soft drop-shadow matching gradient color
```

### 7.3 Illustration Style

```
Style:      Abstract geometric / line art (NOT cartoon, NOT 3D renders)
Colors:     Monochrome white with accent color highlights
Use:        Empty states, onboarding steps, error pages, landing features
Stroke:     1.5px consistent
Complexity: Simple — 10-15 elements max per illustration
Inspired by: Mastra.ai's clean SVG diagrams
```

---

## 8. Component Library

### 8.1 Buttons

```
PRIMARY CTA
├── Background:   Gradient (--gradient-cta) or solid accent-500
├── Text:         White, font-weight: 600, 15px
├── Padding:      12px 28px
├── Radius:       12px
├── Height:       48px
├── Shadow:       glow-accent on hover
├── Hover:        Brighten 10%, scale(1.02)
├── Active:       Scale(0.98), darken 5%
├── Transition:   all 200ms ease

SECONDARY
├── Background:   rgba(255,255,255,0.06)
├── Border:       1px solid rgba(255,255,255,0.10)
├── Text:         text-primary, font-weight: 500, 15px
├── Radius:       12px
├── Hover:        Background rgba(255,255,255,0.10), border rgba(255,255,255,0.15)

GHOST
├── Background:   transparent
├── Text:         text-secondary
├── Hover:        text-primary, background rgba(255,255,255,0.04)

GLASS (Inspired by Markopolo)
├── Background:   rgba(255,255,255,0.08)
├── Backdrop:     blur(5px)
├── Border:       1px solid rgba(255,255,255,0.28)
├── Radius:       43px (pill shape)
├── Hover:        Background rgba(255,255,255,0.14)

DANGER
├── Background:   rgba(239,68,68,0.12)
├── Border:       1px solid rgba(239,68,68,0.25)
├── Text:         #EF4444
├── Hover:        Background rgba(239,68,68,0.20)
```

### 8.2 Cards

```
STANDARD CARD
├── Background:   #0A0A0A
├── Border:       1px solid rgba(255,255,255,0.06)
├── Radius:       16px
├── Padding:      24px
├── Hover:        Border rgba(255,255,255,0.12), subtle gradient-card-hover
├── Transition:   border-color 200ms, background 200ms

FEATURED CARD (with gradient border)
├── Uses gradient-border treatment (see 6.4)
├── Padding:      28px
├── Radius:       20px
├── May include:  Subtle glow, gradient mesh background

GLASS CARD
├── Uses glass-panel treatment (see 6.1)
├── For:          Overlays, modals, floating panels
```

### 8.3 Input Fields

```
DEFAULT INPUT
├── Background:   #1A1A1A
├── Border:       1px solid rgba(255,255,255,0.08)
├── Radius:       10px
├── Height:       44px (compact) / 48px (standard)
├── Padding:      0 14px
├── Text:         15px, text-primary
├── Placeholder:  text-muted (#404040)
├── Focus:        Border accent-500, box-shadow 0 0 0 3px accent-glow
├── Transition:   border-color 150ms, box-shadow 150ms

LANGUAGE SELECTOR (Custom)
├── Background:   #141414
├── Border:       1px solid rgba(255,255,255,0.08)
├── Radius:       12px
├── Contains:     Flag icon (20px) + Language name + Chevron
├── Dropdown:     Glass-elevated panel with language list
├── Selected:     Left border 2px accent-500, background rgba(99,102,241,0.06)
```

### 8.4 Badges & Tags

```
LIVE BADGE
├── Background:   rgba(34,211,238,0.12)
├── Border:       1px solid rgba(34,211,238,0.25)
├── Text:         #22D3EE, 11px, font-weight: 600, uppercase
├── Padding:      4px 10px
├── Radius:       6px
├── Has:          Pulsing dot (6px circle, same color, glow-live animation)

LANGUAGE TAG
├── Background:   rgba(language-color, 0.10)
├── Border:       1px solid rgba(language-color, 0.20)
├── Text:         language-color, 12px, font-weight: 500
├── Padding:      3px 8px
├── Radius:       6px
├── Contains:     Flag emoji + language code (e.g., "🇫🇷 FR")

STATUS BADGE (Connected / Translating / Error)
├── Same structure as live badge
├── Colors:       success/warning/error semantic colors
├── Dot:          Left-aligned 6px dot

NOTIFICATION BADGE (Inspired by Markopolo's lime badges)
├── Background:   pop-500 (#D4FF60)
├── Text:         #000000, 11px, font-weight: 700
├── Radius:       999px (pill)
├── Padding:      2px 8px
├── Use:          New feature callouts, unread counts
```

### 8.5 Avatars

```
USER AVATAR
├── Size:         40px (standard) / 32px (compact) / 56px (profile)
├── Radius:       999px (circle)
├── Border:       2px solid transparent (default)
├── Speaking:     Border 2px solid language-color, glow-live animation
├── Fallback:     Initials on gradient background (accent-500 to live-500)
├── Online dot:   10px circle, bottom-right, success-500, white 2px border
```

### 8.6 Chat Message Bubble

```
INCOMING MESSAGE (Other user — left aligned)
├── Background:   rgba(255,255,255,0.04)
├── Border:       1px solid rgba(255,255,255,0.05)
├── Radius:       4px 16px 16px 16px (tail top-left)
├── Left accent:  2px solid language-color (source language)
├── Padding:      12px 16px
├── Max width:    70% of chat area
├── Contains:     Original text → Translation text (collapsible)

OUTGOING MESSAGE (Current user — right aligned)
├── Background:   rgba(99,102,241,0.10)
├── Border:       1px solid rgba(99,102,241,0.15)
├── Radius:       16px 4px 16px 16px (tail top-right)
├── Padding:      12px 16px
├── Max width:    70% of chat area

VOICE MESSAGE BUBBLE
├── Same as above but contains:
│   ├── Play/Pause button (20px, ghost)
│   ├── Waveform visualization (compact, 32px height)
│   ├── Duration text (app-tiny size)
│   └── "Translated" badge if translation available
```

### 8.7 Navigation Bar (App)

```
SIDEBAR NAV (Desktop)
├── Width:        280px expanded / 72px collapsed
├── Background:   #050505
├── Border right: 1px solid rgba(255,255,255,0.06)
├── Logo:         Top, 32px height, padding 24px
├── Nav items:    48px height, 14px left padding, 12px radius
├── Active item:  Background rgba(99,102,241,0.10), text-primary, left bar 2px accent
├── Hover:        Background rgba(255,255,255,0.04)
├── Section dividers: Subtle 1px lines with 16px vertical margin
├── Bottom:       User profile chip (avatar + name + settings gear)

TOP NAV (Landing page — inspired by Resend)
├── Height:       64px
├── Background:   rgba(0,0,0,0.80)
├── Backdrop:     blur(12px)
├── Border bottom: 1px solid rgba(255,255,255,0.06)
├── Position:     Fixed, z-index 50
├── Logo:         Left aligned
├── Links:        Center, text-secondary, hover text-primary, 14px medium
├── CTA:          Right aligned, primary button compact (40px height)
├── Mobile:       Hamburger icon → full screen overlay
```

---

## 9. Landing Website Specification

### 9.1 Page Structure & Sections

```
SECTION ORDER (Top to Bottom)
├── [1] Navigation (Fixed, glassmorphic)
├── [2] Hero Section
├── [3] Logo Marquee (Social proof)
├── [4] Problem Statement
├── [5] Feature Bento Grid
├── [6] Voice Cloning Showcase
├── [7] How It Works (3-step flow)
├── [8] Live Demo / Product Preview
├── [9] Use Cases
├── [10] Testimonials
├── [11] Pricing
├── [12] FAQ
├── [13] Final CTA
└── [14] Footer
```

### 9.2 Section Details

#### [2] HERO SECTION

```
Height:       min-height 100vh
Background:   #000000 with hero gradient overlay (see 6.3)
Layout:       Centered flex column, max-width 800px text block

CONTENT:
├── Badge:        Glass pill badge with lime accent (pop-500)
│                 Text: "Now in Beta — Try it free" + arrow icon
│                 Inspired by: Rocket.new's announcement badge
│
├── Headline:     display-xl (72px)
│                 Text: "Your Voice. Any Language."
│                 Color: text-primary (#FFFFFF)
│                 Weight: 800
│                 Letter-spacing: -0.04em
│                 Optional: Rotating text (like Rocket.new)
│                   "Your Voice. {Any Language / Every Emotion / Zero Barriers}."
│
├── Subheadline:  body-lg (18px)
│                 Text: "Real-time voice & chat translation that preserves
│                        your tone, emotion, and identity across 40+ languages."
│                 Color: text-secondary (#B0B0B0)
│                 Max-width: 560px, centered
│                 Margin-top: 24px
│
├── CTA Group:    Horizontal flex, gap 16px, margin-top 40px
│   ├── Primary:  "Start Speaking Free" → Glass CTA with accent glow
│   └── Secondary: "Watch Demo ▶" → Ghost button with play icon
│
├── Visual:       Animated voice waveform visualization below CTAs
│                 120px height, gradient colors, organic motion
│                 Represents the "voice alive" concept
│                 Margin-top: 64px
│
└── Scroll hint:  Subtle "↓" chevron with fade animation at very bottom
```

#### [3] LOGO MARQUEE (Inspired by Rocket.new)

```
Height:       80px
Background:   transparent (sits on black)
Layout:       Infinite horizontal scroll, both directions

Content:      "Trusted by teams at" + grayscale company logos
              Logos at 30% opacity, 32px height
              Infinite scroll animation, 30s duration
              Hover: pause animation, hovered logo goes 100% opacity
Dividers:     Top and bottom 1px gradient divider lines
```

#### [5] FEATURE BENTO GRID (Inspired by Mastra.ai anti-grid)

```
Layout:       Asymmetric 4-column bento grid (see 5.3)
Padding:      80px vertical

Features to showcase (6 cards):
├── CARD 1 (Large — spans 2 cols):
│   Title:    "Real-Time Voice Translation"
│   Visual:   Animated waveform → translation → waveform graphic
│   Desc:     "Speak naturally. Your listener hears you in their language, instantly."
│
├── CARD 2 (Small):
│   Title:    "Voice Cloning"
│   Visual:   DNA helix → speaker icon
│   Desc:     "Your translated voice sounds like you — same tone, same emotion."
│
├── CARD 3 (Small):
│   Title:    "40+ Languages"
│   Visual:   Animated language globe with flag orbits
│   Desc:     "From English to Japanese to Arabic — and everything between."
│
├── CARD 4 (Small):
│   Title:    "Chat Translation"
│   Visual:   Chat bubble with inline translation
│   Desc:     "Type in your language. They read in theirs."
│
├── CARD 5 (Large — spans 2 cols):
│   Title:    "Crystal Clear Calls"
│   Visual:   Minimal call UI screenshot with participants
│   Desc:     "Powered by LiveKit — enterprise-grade audio with sub-200ms latency."
│
└── CARD 6 (Small):
    Title:    "End-to-End Encrypted"
    Visual:   Lock/shield icon
    Desc:     "Your voice data never stored. Conversations stay private."

Card Treatment:
├── Background:   #0A0A0A
├── Border:       1px solid rgba(255,255,255,0.06)
├── Radius:       16px
├── Padding:      32px
├── Hover:        Gradient-card-hover background, border brightens
├── Large cards:  May include animated SVG or Lottie illustrations
```

#### [6] VOICE CLONING SHOWCASE

```
Layout:       Two-column (left: content, right: visual demo)
Height:       auto, padded 96px vertical
Background:   Subtle grid-dots pattern

Left Column:
├── Eyebrow:  "THE MAGIC" — app-tiny, uppercase, accent-500, letter-spacing 3px
├── Headline: display-md (40px) — "It Still Sounds Like You"
├── Body:     body-md — Explanation of voice cloning technology
├── Steps:    3 mini steps with icons
│   ├── 1. "Record a 30-second sample"
│   ├── 2. "AI learns your voice DNA"
│   └── 3. "Speak in any language as yourself"

Right Column:
├── Interactive demo card (glass-elevated treatment)
├── Shows: Avatar → waveform → language switch → new waveform
├── Play button to hear demo audio
├── Before/after language labels
```

#### [7] HOW IT WORKS

```
Layout:       Horizontal 3-step flow with connecting lines
Background:   #000000

Steps:
├── Step 1: "Speak"
│   Icon:   Microphone with sound waves
│   Desc:   "Talk naturally in your language"
│   Visual: Waveform animation
│
├── Arrow/line connector (gradient, animated dash)
│
├── Step 2: "Translate"
│   Icon:   Translation arrows with AI brain
│   Desc:   "AI translates in real-time"
│   Visual: Text morphing animation
│
├── Arrow/line connector
│
└── Step 3: "Listen"
    Icon:   Headphones with heart
    Desc:   "Hear it in your voice, their language"
    Visual: Waveform in different color

Each step card:
├── Background: glass-panel
├── Number:    accent-500, display-md font, 50% opacity
├── Icon:      48px, accent-500
├── Title:     heading-md, text-primary
├── Desc:      body-sm, text-secondary
```

#### [11] PRICING

```
Layout:       3 cards, center card elevated (recommended)
Background:   #000000 with subtle gradient-mesh

Cards:
├── Free:     Standard card, "For Trying It Out"
│   Price:    "$0 / month"
│   Features: 30 min voice/month, 5 languages, basic quality
│
├── Pro:      Featured card (gradient-border), "For Daily Use"
│   Price:    "$19 / month"
│   Badge:    pop-500 "POPULAR" pill badge
│   Features: 10 hrs voice/month, 40+ languages, HD voice clone, priority
│   Scale:    scale(1.05) — slightly larger than siblings
│
└── Team:     Standard card, "For Organizations"
    Price:    "$49 / user / month"
    Features: Unlimited, admin panel, SSO, custom models

CTA in each card: Full-width button matching card tier
Toggle: Monthly / Annual switch at top (annual shows 20% savings)
```

#### [14] FOOTER

```
Background:   #050505
Border-top:   1px gradient divider
Layout:       4-column grid + bottom bar
Padding:      64px top, 32px bottom

Columns:
├── Product: Features, Pricing, Changelog, Roadmap
├── Resources: Documentation, API Reference, Blog, Status
├── Company: About, Careers, Press, Contact
├── Legal: Privacy, Terms, Cookie Policy

Bottom bar:
├── Left:     "© 2026 Echoglot. All rights reserved."
├── Center:   Social icons (X, GitHub, Discord, LinkedIn)
├── Right:    Language selector for the website itself
```

---

## 10. App UI Specification

### 10.1 App Layout Structure

```
┌──────────────────────────────────────────────────────┐
│  TOP BAR (64px) — page title, search, notifications  │
├────────┬─────────────────────────────┬───────────────┤
│        │                             │               │
│  SIDE  │                             │   RIGHT       │
│  BAR   │       MAIN CONTENT          │   PANEL       │
│ 280px  │       (fluid)               │   320px       │
│        │                             │  (collapsible)│
│ - Chats│  [Chat / Call / Settings]   │  - Participants│
│ - Calls│                             │  - Voice ctrl │
│ - Voice│                             │  - User info  │
│ - Settings                           │               │
│        │                             │               │
├────────┴─────────────────────────────┴───────────────┤
│  (Optional) BOTTOM BAR for mobile — tab navigation   │
└──────────────────────────────────────────────────────┘
```

### 10.2 Chat Translation View

```
CHAT LIST (Sidebar)
├── Each item: 72px height
│   ├── Avatar (40px) with online dot
│   ├── Name (app-body, text-primary, font-weight 600)
│   ├── Last message preview (app-caption, text-tertiary, truncated)
│   ├── Timestamp (app-tiny, text-muted, right-aligned)
│   ├── Language tag (tiny flag + code badge, top-right of avatar)
│   └── Unread count (pop-500 badge, pill shape)
├── Active item: bg-subtle (#202020), left border 2px accent-500
├── Hover: bg-surface (#141414)
├── Search bar: Top of list, icon + input, bg-muted

CHAT AREA (Main)
├── Header: 64px, user name + language tags + voice call button
├── Messages: Scrollable area
│   ├── Incoming messages: Left aligned, glass-message style
│   │   ├── Original text (app-body, text-primary)
│   │   ├── Translation (app-caption, text-secondary, italic)
│   │   ├── Toggle: "Show original / Show translation"
│   │   ├── Language indicator: 2px left border in language color
│   │   └── Timestamp: app-tiny, text-muted
│   │
│   ├── Outgoing messages: Right aligned, accent-tinted
│   │   ├── Your text (app-body, text-primary)
│   │   ├── "Translated as: ..." (app-caption, text-tertiary)
│   │   └── Status: sent ✓ / delivered ✓✓ / read (blue ✓✓)
│   │
│   └── System messages: Centered, app-caption, text-muted
│       "Translation language changed to French"
│
├── Input area: Bottom, 64px min-height
│   ├── Language selector chip (compact)
│   ├── Text input (expandable, max 4 lines)
│   ├── Voice message button (microphone icon)
│   ├── Attach button (paperclip icon)
│   └── Send button (accent-500, arrow icon)
│
└── Translation indicator: Above input when typing
    "Translating to French..." with subtle loading dots
```

### 10.3 Voice Call View

```
CALL SCREEN (Replaces main content area during call)

Layout:       Centered flex column
Background:   #000000 with gradient-voice-active behind active speaker

PARTICIPANTS AREA (Center)
├── Active speaker:
│   ├── Large avatar: 120px with speaking animation (ring pulse)
│   ├── Name: heading-md, text-primary
│   ├── Language badge: Below name
│   ├── Voice waveform: 64px height, gradient colors, live-animated
│   └── "Speaking in Spanish → Translating to English" status
│
├── Other participants: Grid of smaller cards
│   ├── Avatar: 56px with speaking indicator
│   ├── Name: app-caption
│   ├── Language: tiny badge
│   ├── Muted icon overlay if muted
│   └── Subtle glow ring when speaking

CALL CONTROLS (Bottom, 80px)
├── Background:   glass-panel
├── Layout:       Horizontal center, gap 16px
├── Buttons (56px circles):
│   ├── Microphone (toggle mute) — ghost, red when muted
│   ├── Translation (toggle on/off) — accent when active
│   ├── Language Switch (change your output language) — ghost
│   ├── Voice Clone (toggle your cloned voice) — accent when active, DNA icon
│   └── End Call (red background, phone-down icon)
├── Each button: 56px circle, glass-panel background
├── Active state: accent-500 background
├── Hover: scale(1.05)

CALL INFO BAR (Top, 48px)
├── Call duration: "12:34" mono font
├── Quality indicator: Green/Yellow/Red dot + "Excellent"
├── Participant count: "3 participants"
├── Minimize button: Shrinks call to PiP overlay
```

### 10.4 Voice Profile / Clone Management

```
VOICE ONBOARDING (First-time setup)
├── Step 1: "Welcome" — Explain voice cloning
│   Visual:     DNA helix animation
│   CTA:        "Set Up My Voice"
│
├── Step 2: "Record Sample"
│   UI:         Large record button (80px, accent-500, pulsing glow)
│   Waveform:   Real-time waveform while recording
│   Progress:   "15 / 30 seconds" circular progress
│   Text:       Suggested reading passage displayed
│
├── Step 3: "Processing"
│   Visual:     AI processing animation (abstract nodes connecting)
│   Text:       "Creating your voice model..."
│   Duration:   Progress bar or time estimate
│
├── Step 4: "Preview & Confirm"
│   UI:         Side-by-side player
│               [Your original] [Your cloned voice in Spanish]
│   CTA:        "Sounds Like Me!" / "Re-record"

VOICE PROFILE PAGE (Settings)
├── Your voice models listed as cards
├── Each model: Language + sample player + quality score + delete
├── "Record New Sample" button
├── "Auto-clone for new languages" toggle
```

### 10.5 Settings & Profile

```
SETTINGS LAYOUT
├── Left: Settings navigation (vertical list)
│   ├── Profile
│   ├── Voice & Audio
│   ├── Translation Preferences
│   ├── Privacy & Security
│   ├── Notifications
│   ├── Billing
│   └── About
│
├── Right: Settings content area
│   ├── Section title + description
│   ├── Setting groups with dividers
│   ├── Each setting: Label + control (toggle/select/input)
│   └── Save button (bottom, primary CTA)

Treatment:
├── Navigation items: Same style as sidebar nav
├── Content: Max-width 640px for readability
├── Toggles: accent-500 when active, bg-muted when off
├── Selects: Same as language-selector component
```

---

## 11. Motion & Animation

### 11.1 Transition Defaults

```css
/* Global defaults */
--transition-fast:    150ms ease;        /* Hovers, focus states */
--transition-normal:  200ms ease;        /* Button presses, toggles */
--transition-smooth:  300ms ease-out;    /* Panel opens, page transitions */
--transition-slow:    500ms ease-in-out; /* Section reveals, hero animations */
```

### 11.2 Scroll Animations (Landing Page — Inspired by Cash App + Rocket.new)

```
Library:      GSAP (GreenSock) + ScrollTrigger
Approach:     Sections animate in as user scrolls

FADE-UP (default for all sections):
├── Start:    opacity: 0, translateY: 40px
├── End:      opacity: 1, translateY: 0
├── Duration: 600ms
├── Trigger:  When element enters 80% of viewport
├── Stagger:  100ms between sibling elements

PARALLAX (hero background elements):
├── Background gradient moves at 50% scroll speed
├── Waveform visualization moves at 70% scroll speed
├── Creates depth without being distracting

MARQUEE (logo section):
├── Continuous horizontal scroll
├── Speed: 40px/second
├── Pause on hover
├── Duplicated content for seamless loop

TEXT ROTATE (hero headline — inspired by Rocket.new):
├── Cycle through words: "Any Language" → "Every Emotion" → "Zero Barriers"
├── Animation: Slide up + fade (300ms per transition)
├── Interval: 3 seconds between changes
├── Wrapper: overflow-hidden with fixed height
```

### 11.3 Micro-interactions (App UI)

```
MESSAGE SEND:
├── Bubble slides up from input area (200ms ease-out)
├── Slight scale from 0.95 to 1.0

TRANSLATION ARRIVE:
├── Translation text fades in below original (300ms)
├── Subtle shimmer effect during processing

VOICE ACTIVITY:
├── Waveform bars animate with audio amplitude
├── Avatar ring pulses with glow-live animation
├── Participant card subtly brightens

LANGUAGE SWITCH:
├── Flag icon slides and rotates (200ms)
├── Text label crossfades

NOTIFICATION:
├── Slides in from top-right (300ms ease-out)
├── Pop-500 flash on badge count change

CALL CONNECT:
├── Rings pulse outward from call button
├── Participant avatars fly in from edges
├── Waveform appears with stagger animation
```

---

## 12. Responsive Breakpoints

```
MOBILE:     0 — 639px        (1 column, bottom tab nav, full-screen views)
TABLET:     640px — 1023px   (2 columns, collapsible sidebar, adapted grid)
DESKTOP:    1024px — 1279px  (Full layout, sidebar + main + right panel)
WIDE:       1280px+          (Max content width, increased spacing)

LANDING PAGE BEHAVIOR:
├── Mobile:  Stack everything vertically, hero headline 36px, single CTA
├── Tablet:  2-column bento grid, hero headline 48px
├── Desktop: Full 4-column bento grid, hero headline 72px
├── Wide:    Max-width 1280px content, centered

APP BEHAVIOR:
├── Mobile:  Bottom tab nav, full-screen chat/call views, swipe between panels
├── Tablet:  Sidebar collapsed (icon-only 72px) + main content, right panel hidden
├── Desktop: Full 3-panel layout (sidebar + main + right panel)
```

---

## 13. Accessibility

```
CONTRAST RATIOS (WCAG AA minimum)
├── text-primary on bg-primary:     21:1  (white on black) ✓
├── text-secondary on bg-primary:   9.5:1 ✓
├── text-tertiary on bg-primary:    5.1:1 ✓
├── accent-500 on bg-primary:       5.7:1 ✓
├── All interactive text:           Minimum 4.5:1 ratio

KEYBOARD NAVIGATION
├── All interactive elements focusable via Tab
├── Focus ring: 2px solid accent-500, 2px offset, rounded
├── Skip-to-content link on landing page
├── Arrow key navigation within menus and chat

SCREEN READER
├── All icons have aria-labels
├── Live regions for incoming messages and translation status
├── Voice call status announced on change
├── Language indicators have text alternatives

MOTION
├── prefers-reduced-motion: disable all animations, show static states
├── Waveforms become static bars
├── Scroll animations replaced with immediate display
├── Marquee paused
```

---

## 14. Do's and Don'ts

### DO

- Use dark backgrounds exclusively (#000 to #202020 range)
- Let accent colors pop against the dark canvas
- Use glassmorphism for floating/overlay elements
- Show the product working (screenshots, demos, waveforms)
- Use generous whitespace (inspired by Resend's breathing room)
- Animate waveforms to convey "alive" and "real-time"
- Use language-specific colors consistently across the entire app
- Keep text concise — short headlines, brief descriptions
- Use gradient borders on featured/premium elements
- Add subtle noise texture to backgrounds for depth

### DON'T

- Never use a light/white background as a primary theme
- Never use more than 2 accent colors in a single view
- Never make animations longer than 600ms (except hero reveal)
- Never use stock photos of people talking
- Never clutter a view — if it feels busy, remove elements
- Never use rounded-full (pill) radius on cards — reserve for badges/avatars only
- Never skip the language color indicator on messages
- Never show raw untranslated API errors to users
- Never use shadows on dark backgrounds (use glow effects instead)
- Never put text on gradients without ensuring contrast ratio meets AA

---

## Appendix A: Figma Setup Checklist

When setting up the design in Figma:

1. Install Inter and JetBrains Mono fonts
2. Create color styles matching Section 3 exactly
3. Create text styles matching Section 4.2
4. Set up spacing variables matching Section 5.1
5. Build base components (button, card, input, badge, avatar) first
6. Create glass-panel, glass-elevated, glass-button effect styles
7. Build the landing page top-to-bottom following Section 9
8. Build the app shell (sidebar + main + right panel) following Section 10
9. Design each app view: chat, call, voice profile, settings
10. Add prototype animations matching Section 11

## Appendix B: CSS Custom Properties Export

```css
:root {
  /* Backgrounds */
  --bg-primary: #000000;
  --bg-elevated: #0A0A0A;
  --bg-surface: #141414;
  --bg-muted: #1A1A1A;
  --bg-subtle: #202020;

  /* Text */
  --text-primary: #FFFFFF;
  --text-secondary: #B0B0B0;
  --text-tertiary: #6B6B6B;
  --text-muted: #404040;

  /* Accents */
  --accent-400: #818CF8;
  --accent-500: #6366F1;
  --accent-600: #4F46E5;
  --live-400: #67E8F9;
  --live-500: #22D3EE;
  --success-500: #10B981;
  --pop-500: #D4FF60;
  --error: #EF4444;
  --warning: #F59E0B;

  /* Borders */
  --border-default: rgba(255, 255, 255, 0.06);
  --border-hover: rgba(255, 255, 255, 0.12);
  --border-active: rgba(255, 255, 255, 0.20);

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 999px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-smooth: 300ms ease-out;
  --transition-slow: 500ms ease-in-out;

  /* Typography */
  --font-display: 'Inter Display', 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Commit Mono', monospace;
  --font-serif: 'Playfair Display', Georgia, serif;
}
```

## Appendix C: Tailwind Config Mapping

```js
// tailwind.config.ts — key extensions for Echoglot
{
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#000000',
          elevated: '#0A0A0A',
          surface: '#141414',
          muted: '#1A1A1A',
          subtle: '#202020',
        },
        accent: {
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
        },
        live: {
          400: '#67E8F9',
          500: '#22D3EE',
        },
        pop: {
          400: '#E4FF8A',
          500: '#D4FF60',
        },
      },
      fontFamily: {
        display: ['Inter Display', 'Plus Jakarta Sans', 'system-ui'],
        body: ['Inter', 'system-ui'],
        mono: ['JetBrains Mono', 'Commit Mono', 'monospace'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '20px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-up': 'fade-up 600ms ease-out',
        'marquee': 'marquee 40s linear infinite',
      },
    },
  },
}
```

---

> **This document version**: 1.0
> **Last updated**: 2026-02-12
> **Status**: Ready for design implementation
