# Setup: webCircuitUK waitlist (Vercel + Supabase)

## 1. Create the Supabase project
1. Go to supabase.com, sign in and click **New project**.
2. Pick a region close to your customers. For UK visitors, choose **London**.
3. Set a database password and wait for the project to finish setting up.

## 2. Create the table
1. In Supabase, open **SQL Editor** and click **New query**.
2. Paste in the whole of `supabase.sql` and click **Run**.
3. Open **Table Editor**. You should see a `waitlist` table with a "RLS enabled" badge.

## 3. Get your keys
1. **Project URL:** Project Settings > Data API (or the Connect button at the top).
   It looks like `https://abcdxyz.supabase.co`.
2. **Secret key:** Project Settings > **API Keys**. If you only see legacy keys, click
   **Create new API keys**, then copy the **Secret key** (`sb_secret_...`).
   Older projects can use the legacy `service_role` key in the same place instead.

Never put the secret key in front-end code or commit it to GitHub. It gives full access to your data.

## 4. Deploy to Vercel
1. Push this folder to a GitHub repo and import it in Vercel. It detects Vite automatically.
2. Before the first deploy, open **Environment Variables** and add:

   | Name | Value |
   |------|-------|
   | `ADMIN_PASSWORD` | a long password of your choice |
   | `SUPABASE_URL` | your project URL |
   | `SUPABASE_SECRET_KEY` | your `sb_secret_...` key |

3. Click **Deploy**. If you add or change variables later, redeploy so they apply.
4. Your site is live, and the admin page is at `/admin`.

## 5. Before you launch
- In `src/Legal.jsx`, set your business name and a real contact email.
- Submit a test signup, check it appears in `/admin`, then delete it.

## Run it locally
    npm install
    npm i -g vercel
    vercel link
    vercel env pull .env.local
    npm run dev

`npm run dev` runs the site and the API together through the Vercel CLI. Plain `vite` only
serves the front end, so the form and admin will not work with it.

## Backups
The admin page's **Export CSV** button downloads everyone on the list. Do it regularly.
