# RapSora Outreach Platform

RapSora is a high-fidelity outreach engine and records management system designed for professional sales and intelligence operations. Built with a "Liquid Glass" aesthetic, it combines powerful core functionality with a premium, responsive user interface.

## 🚀 Key Systems

### 1. Cold Outreach Engine
A high-conversion transmission system that allows for rapid deployment of personalized messages.
- **Variable Injection**: Automatically replace `[Name]` and `[CompanyName]` tokens.
- **Real-time Status tracking**: Monitor delivery, opens, and responses.
- **Secure Integration**: Powered by Resend API and custom SMTP protocols.

### 2. High-Fidelity Blueprints
Advanced email template management with multi-device simulation.
- **Live Sandbox**: Build and edit HTML templates with instant side-by-side preview.
- **Responsive Simulation**: Toggle between Desktop, Tablet, and Mobile views to ensure visual integrity.
- **Blueprint Logic**: Dynamic subject lines and body scripts that adapt to recipient metadata.

### 3. Intelligence Matrix (Leads)
Centralized target management for high-value outreach.
- **Intel Collection**: Rapid entry of Names, Emails, and Entities.
- **Purge Protocols**: Secure database purging for sensitive lead data.
- **Search & Filter**: High-speed lookup across massive outreach datasets.

### 4. Shread Sync (Records)
A sophisticated custom-sheet system for collaborative data management.
- **Multi-Sheet Architecture**: Create specialized catalogs for different campaigns (e.g., "Cold Call", "Enterprise Pipeline").
- **Automatic Logging**: Every entry captures a high-resolution timestamp (`DD MMM YYYY | HH:mm`) automatically.
- **Core Dump (CSV)**: One-click export of data catalogs for external synchronization and reporting.

### 5. Corporate Access Control
Hardened security using environment-based whitelisting.
- **Identity Verification**: Integrated with NextAuth and Google OAuth.
- **Secure Gatekeeper**: Only authorized email addresses (managed via `ALLOWED_EMAILS`) can bypass the security intercept.
- **Security Intercept Page**: High-fidelity "Access Revoked" view for unauthorized attempts.

---

## 📂 Architecture Overview

### `/app` (Routing & Layout)
- **`app/page.tsx`**: The main entry point featuring the Auth Gatekeeper and Landing UI.
- **`app/api/`**: Serverless route handlers for database transactions and email logic.

### `/components` (UI Modules)
- **`Dashboard.tsx`**: Performance matrix and high-level statistics.
- **`Sheets.tsx`**: The core of the Shread Sync records system.
- **`Skeleton.tsx`**: Liquid shimmer loading states for premium perceived performance.
- **`Sidebar.tsx`**: Navigation control with active state persistence.

### `/models` (Data Layer)
- **`Lead.ts`**: Schema for the Intelligence Matrix.
- **`Sheet.ts` & `SheetRow.ts`**: Dynamic data models supporting custom column structures.
- **`SentEmail.ts`**: Telemetry and status tracking for outgoing communications.

### `/lib` (Core Infrastructure)
- **`auth.ts`**: Authentication logic and whitelist adjudication.
- **`mongodb.ts`**: High-performance database connection pooling.
- **`templates.ts`**: Engine for variable injection and blueprint defaults.

---

## 🛠️ Configuration

The platform requires the following environmental variables in `.env.local`:

```
MONGODB_URI=        # Database Connection
GOOGLE_CLIENT_ID=   # OAuth Provider
GOOGLE_CLIENT_SECRET=
AUTH_SECRET=        # NextAuth Encryption
RESEND_API_KEY=     # Email Engine
ALLOWED_EMAILS=     # Comma-separated whitelist (e.g. info@rapsora.com,...)
```

---

## ⚡ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS & Vanilla CSS (Liquid Glass System)
- **Motion**: Framer Motion
- **Icons**: Lucide React
- **Authentication**: NextAuth.js
