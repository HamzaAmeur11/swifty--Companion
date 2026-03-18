# Swifty 42 — Expo OAuth App

A React Native / Expo app that authenticates with the **42 Intranet** using the proper
**OAuth 2.0 Authorization Code flow**, then lets you search and view any 42 student's profile.

---

## OAuth Flow Explained

```
User taps "Login"
       │
       ▼
App opens browser → https://api.intra.42.fr/oauth/authorize
                         ?client_id=...
                         &redirect_uri=swifty42://oauth
                         &response_type=code
                         &scope=public
                         &state=<random>
       │
       ▼
User logs in on 42 intranet and approves access
       │
       ▼
42 redirects to → swifty42://oauth?code=ABC&state=<same_random>
       │
       ▼
App validates state (CSRF protection)
       │
       ▼
App POSTs to https://api.intra.42.fr/oauth/token
  { grant_type: "authorization_code", client_id, client_secret, code, redirect_uri }
       │
       ▼
App receives { access_token, expires_in }
Token stored securely via expo-secure-store
       │
       ▼
All API calls use: Authorization: Bearer <token>
```

---

## Setup

### 1. Create a 42 OAuth Application

Go to: **https://profile.intra.42.fr/oauth/applications**

- Click **New Application**
- Name: `Swifty 42`
- Redirect URI — add **both**:
  ```
  swifty42://oauth
  exp://YOUR_LAN_IP:8081
  ```
  Replace `YOUR_LAN_IP` with your machine's local IP (e.g. `192.168.1.42`).
  The login screen shows the exact URI once the app is running.

### 2. Configure environment variables

```bash
cp .env .env.local
```

Edit `.env` (or `.env.local`) and fill in:
```env
FT_CLIENT_ID=u-s4t2ud-xxxxxxxxxxxx
FT_CLIENT_SECRET=s-s4t2ud-xxxxxxxxxxxx
FT_REDIRECT_URI=swifty42://oauth
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run

```bash
# In Expo Go (LAN)
npm run start

# With tunnel (if on different network)
npm run start:tunnel
```

---

## Project Structure

```
swifty42/
├── app/
│   ├── _layout.tsx            # Root layout — auth guard & navigation
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   └── login.tsx          # Login screen with "Continue with 42" button
│   └── (tabs)/
│       ├── _layout.tsx        # Tab bar + logout button
│       ├── search.tsx         # Search screen
│       └── profile.tsx        # Profile screen
├── services/
│   ├── auth.ts                # ← OAuth logic lives here
│   └── api.ts                 # 42 API calls (getUserByLogin, getMe)
├── hooks/
│   └── useAuth.ts             # Auth state hook
├── app.config.js              # Expo config (scheme, extra env vars)
└── .env                       # Your credentials (never commit this!)
```

---

## Key Files

| File | Purpose |
|------|---------|
| `services/auth.ts` | All OAuth logic: `login()`, `getAccessToken()`, `logout()` |
| `services/api.ts` | API helpers: `getMe()`, `getUserByLogin(login)` |
| `hooks/useAuth.ts` | React hook for auth state |
| `app/(auth)/login.tsx` | Login screen — calls `signIn()` which triggers OAuth |
| `app/_layout.tsx` | Route guard: redirects unauthenticated users to login |

---

## Why Authorization Code Flow (not Client Credentials)?

| | Client Credentials | Authorization Code |
|---|---|---|
| Who authenticates | Your app | The **user** |
| Token tied to | App identity | User's 42 account |
| Can call `/me` | ❌ | ✅ |
| Safe for mobile | ⚠️ (secret in app) | ✅ |
| 42 subject requirement | ❌ | ✅ |

---

## Dependencies

- **expo-auth-session** — Handles browser-based OAuth redirect flow
- **expo-web-browser** — Opens/closes the 42 login page
- **expo-secure-store** — Stores the access token encrypted on device
- **axios** — HTTP client for token exchange and API calls
- **react-native-progress** — Progress bars for skill levels
