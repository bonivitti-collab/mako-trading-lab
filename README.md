# Mako Trading Lab — Production Deployment Guide

## 1. Overview
Mako Trading Lab is an institutional-grade SaaS platform offering:
- **Hugging Face / Model Hub Catalog:** 51 pre-compiled `.ex5` tools across 5 categories.
- **Mako AI Studio:** On-demand MQL5 code generator powered by Google Gemini 2.5 Flash.
- **LicenseGuard & MT5 Verification API:** Friction-free, zero-password license validation via MetaTrader 5 `WebRequest` with a 24-hour local offline cache.
- **Multi-Slot Account Manager:** 1 slot on Free tier, 3 slots on Pro tier, equipped with a 7-day cooldown anti-abuse mechanism.

---

## 2. Project Structure
```
mako-trading-lab/
├── assets/
│   └── mako_logo.png              # High-resolution official brand logo
├── database/
│   └── schema.sql                 # Complete Supabase / PostgreSQL production schema
├── mql5/
│   ├── Include/
│   │   ├── LicenseGuard.mqh       # Core licensing & 24h cache engine
│   │   └── MakoUI.mqh             # Mako institutional dark navy UI design system
│   ├── Experts/                   # 16 compilable Expert Advisors (.mq5 + .ex5)
│   ├── Indicators/                # 34 compilable Indicators (.mq5 + .ex5)
│   └── Scripts/                   # 1 Panic / Emergency Script (.mq5 + .ex5)
├── web/
│   ├── public/
│   │   ├── mako_logo.png
│   │   └── downloads/             # 51 compiled .ex5 binaries ready for 1-click download
│   └── src/
│       ├── app/
│       │   ├── page.tsx           # Hugging Face-style Hub & Pricing
│       │   ├── dashboard/page.tsx # License & MT5 Account Slots Manager
│       │   ├── ai-studio/page.tsx # Prompt-to-MQL5 Studio with code viewer
│       │   └── api/
│       │       ├── v1/verify/     # MT5 WebRequest verification endpoint
│       │       └── ai-studio/     # Gemini API synthesis endpoint
```

---

## 3. How to Deploy to Vercel (100% Free Tier)
1. Push the `/web` folder to a GitHub repository.
2. Link the repository to [Vercel](https://vercel.com).
3. Set the following Environment Variables in Vercel:
   - `GEMINI_API_KEY`: Your Google Gemini API Key (obtainable free at [aistudio.google.com](https://aistudio.google.com/)).
   - `NEXT_PUBLIC_STRIPE_PAYMENT_LINK`: Your Stripe checkout link for the $10/mo pass.

---

## 4. How to Connect the Supabase Database
1. Create a free project on [Supabase](https://supabase.com).
2. Open the **SQL Editor** in Supabase and paste the contents of `database/schema.sql`.
3. Copy your Supabase URL & Anon Key into `.env.local` inside `/web`.

---

## 5. Live Local Testing
The web server is currently running locally:
- **Homepage & Catalog:** `http://localhost:3000`
- **Mako AI Studio:** `http://localhost:3000/ai-studio`
- **Account Slots Dashboard:** `http://localhost:3000/dashboard`
- **MT5 License Verification Endpoint:** `http://localhost:3000/api/v1/verify`
