<div align="center">
  <img src="public/logo.png" alt="RapSora Outreach Logo" width="180" />
  
  # RAPSORA OUTREACH
  ### High-Fidelity Outreach Engine — Records Management — Intelligence Matrix
  
  *The ultimate transmission system for professional sales and intelligence operations.*

  <div style="display: flex; justify-content: center; gap: 10px; margin-top: 20px;">
    <img src="https://img.shields.io/badge/Status-Production--Ready-success?style=for-the-badge" alt="Status" />
    <img src="https://img.shields.io/badge/Security-Hardened-blue?style=for-the-badge" alt="Security" />
    <img src="https://img.shields.io/badge/Design-Liquid--Glass-black?style=for-the-badge" alt="Design" />
  </div>
</div>

---

## 🛰️ Overview
**RapSora Outreach** is a sophisticated, high-performance engine designed to streamline professional outreach and lead management. Built with a signature **"Liquid Glass"** aesthetic, it combines military-grade records management with a cinematic user experience.

## 🚀 Key Systems

### 1. Cold Outreach Engine
A precision-engineered transmission system for rapid message deployment.
- **Variable Injection**: Seamlessly swap `[Name]` and `[CompanyName]` tokens in real-time.
- **Telemetry Tracking**: Monitor delivery status, opens, and responses with granular accuracy.
- **Resend Integration**: Powered by industrial-grade mail servers for maximum deliverability.

### 2. High-Fidelity Blueprints
Advanced email template management with multi-device simulation.
- **Live Sandbox**: Edit HTML templates with instant side-by-side visual feedback.
- **Device Simulation**: Toggle between Desktop, Tablet, and Mobile views to ensure pixel-perfect delivery.
- **Logic-Driven Scripts**: Dynamic body content that adapts based on recipient metadata.

### 3. Intelligence Matrix (Leads)
Centralized target management for high-value sales operations.
- **Intel Collection**: Rapid entry and classification of names, emails, and entities.
- **Purge Protocols**: Secure database clearing for sensitive campaign data.
- **High-Speed Search**: Instant lookup across massive datasets using optimized indexing.

### 4. Shread Sync (Records)
A custom-engineered sheet system for collaborative data management.
- **Multi-Sheet Architecture**: Specialized catalogs for specific pipelines (e.g., "Enterprise", "Cold Call").
- **Auto-Logging**: Automatic high-resolution timestamps for every entry.
- **Core Dump (CSV)**: One-click export for external reporting and CRM synchronization.

### 5. Corporate Access Control
Hardened security using environment-level whitelisting.
- **Identity Verification**: Hardened integration with Google OAuth and NextAuth.
- **Gatekeeper Protocol**: Access is restricted to authorized entities via `ALLOWED_EMAILS` validation.
- **Security Intercept**: Professional-grade "Access Revoked" protocols for unauthorized attempts.

---

## ⚡ Tech Stack

- **Framework**: Next.js 15 (App Router / React 19)
- **Database**: MongoDB & Mongoose (High-concurrency pooling)
- **Authentication**: NextAuth.js (v5 Beta)
- **Email Engine**: Resend API
- **Motion Engine**: Framer Motion (Liquid UI Transitions)
- **Styling**: Tailwind CSS & CSS-in-JS (Liquid Glass Tokens)

---

## 📂 Project Architecture

```text
rapsora-outreach/
├── app/                        # Next.js 15 App Router
│   ├── api/                    # Serverless API Handlers
│   │   ├── auth/               # OAuth & Session Logic
│   │   ├── emails/             # Communication Telemetry
│   │   ├── leads/              # Intelligence Matrix Operations
│   │   ├── send-email/         # Transmission Engine
│   │   ├── sheets/             # Shread Sync Logic
│   │   └── templates/          # Blueprint Management
│   ├── globals.css             # Liquid Glass Design Tokens
│   ├── layout.tsx              # Root Layout & Context
│   └── page.tsx                # Secure Entry Gate & Landing
├── components/                 # Premium UI Modules
│   ├── ui/                     # Atomic UI Elements (Skeleton, etc.)
│   ├── Dashboard.tsx           # Performance Analytics
│   ├── Sheets.tsx              # Shread Sync Grid
│   ├── SendEmail.tsx           # Transmission Interface
│   ├── Inbox.tsx               # Response Monitoring
│   ├── Leads.tsx               # Intelligence Matrix View
│   └── Sidebar.tsx             # Navigation & Persistence
├── lib/                        # Core Infrastructure
│   ├── auth.ts                 # Whitelist & Adjudication
│   ├── mongodb.ts              # Database Connection Pooling
│   ├── templates.ts            # Variable Injection Logic
│   └── types.ts                # TypeScript Global Definitions
├── models/                     # Mongoose Data Models
│   ├── Lead.ts                 # Target Intelligence Schema
│   ├── Sheet.ts                # Custom Catalog Schema
│   ├── SheetRow.ts             # Dynamic Row Schema
│   └── Template.ts             # Blueprint Schema
└── public/                     # Brand Assets & Collateral
```

## 🛠️ Configuration

Configure the following environment variables in `.env.local`:

```env
MONGODB_URI=        # Database Connection String
GOOGLE_CLIENT_ID=   # OAuth Provider Client ID
GOOGLE_CLIENT_SECRET=
AUTH_SECRET=        # NextAuth Encryption Key
RESEND_API_KEY=     # Email Engine API Key
ALLOWED_EMAILS=     # Comma-separated access list
```

---

<div align="center">
  <p><b>RapSora Technologies — All Rights Reserved © 2026</b></p>
  <p><i>Building the future of professional communication.</i></p>
</div>
