# Mako Trading Lab — Production Deployment Guide

## 1. Overview
Mako Trading Lab is an institutional-grade SaaS platform offering:
- **Hugging Face / Model Hub Catalog:** 51 pre-compiled `.ex5` tools across 5 categories.
- **Mako AI Studio:** On-demand MQL5 code generator powered by Google Gemini 2.5 Flash.
- **LicenseGuard & MT5 Verification API:** Friction-free, zero-password license validation via MetaTrader 5 `WebRequest` with a 24-hour local offline cache.
- **Multi-Slot Account Manager:** 3 slots on Pro Pass (studio/owner up to 5), equipped with a 7-day cooldown anti-abuse mechanism.

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

## 3. How to Deploy to Vercel
1. Link this repository to [Vercel](https://vercel.com) with Root Directory = `web`.
2. Set Environment Variables (production + preview):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only; required for MT5 `/api/v1/verify`)
   - `GEMINI_API_KEY` (from [aistudio.google.com](https://aistudio.google.com/))
3. Pro Pass checkout is wired in-app via Lemon Squeezy (`src/lib/plans.ts`).

---

## 4. Supabase (already provisioned for Mako)
Live project: `https://njdbgtnffnuvrosokguy.supabase.co` (region `sa-east-1`).

Applied on the remote database:
1. Core schema (`profiles`, `mt5_accounts`, `products`, `validation_logs`, `ai_generations`) — Pro Pass only defaults.
2. RLS policies + `handle_new_user` trigger (new accounts start as `free` / 0 MT5 slots).
3. Product catalog seed: **533** rows, all `is_pro = true` (`database/seeds/products.sql`).

Local / fresh project apply order:
```bash
# SQL Editor or supabase db push
database/schema.sql
database/migrations/20261030_mako_rls_and_auth_trigger.sql
database/migrations/20261030_pro_pass_only.sql
database/seeds/products.sql
```

Auth checklist in the Supabase dashboard:
- **Site URL:** `https://makotradinglab.com`
- **Redirect URLs:** `https://makotradinglab.com/**`, `https://www.makotradinglab.com/**`, `http://localhost:43123/**` (or your local port)
- Enable **Leaked password protection** (Auth → Attack Protection)
- Paste **service_role** into Vercel as `SUPABASE_SERVICE_ROLE_KEY` (never expose it as `NEXT_PUBLIC_*`)

---

## 5. Local development
```bash
cd web
cp .env.example .env.local   # fill anon + service_role keys
npm install
npm run dev -- -p 43123 -H 0.0.0.0
```
- Homepage: `http://127.0.0.1:43123`
- AI Studio: `http://127.0.0.1:43123/ai-studio`
- Dashboard: `http://127.0.0.1:43123/dashboard`
- MT5 verify: `POST http://127.0.0.1:43123/api/v1/verify`


## 6. Sell-ready ops checklist
1. **Downloads** are blocked at `/downloads/*` — only `/api/v1/download` with a Pro Supabase session works.
2. **Auth** is pemail + password only (confirm email before sign-in). Google OAuth is not enabled.
3. **Lemon webhook** URL: `https://makotradinglab.com/api/webhooks/lemonsqueezy`
   - In Lemon Squeezy → Settings → Webhooks, create webhook with events: `subscription_*`, `order_created`
   - Signing secret must match Vercel env `LEMONSQUEZZY_WEBHOOK_SECRET`
4. **Gemini**: set a valid `GEMINI_API_KEY` on Vercel Production + optional `GEMINI_MODEL` (default `gemini-3.8-flash`)
5. Buyer email on Lemon checkout should match the email they use to Sign Up / Sign In.
