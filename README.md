# Albarq Education Center

Practice website for the Grade 5 ELA vocabulary (Units 1–15): exams, word games, spelling practice and act-it-out animations, with student and teacher accounts.

- Static site (HTML/CSS/JS) hosted on GitHub Pages.
- Accounts and saved results: Supabase (Postgres with Row Level Security; see `supabase_setup.sql`).
- `js/config.js` holds only the Supabase **publishable** key, which is safe to publish because every table is protected by Row Level Security.

Photos: Wikimedia Commons (credits in the Excel workbook). Icons and animations: made from OpenMoji (CC BY-SA 4.0) and Lucide (ISC). Audio: macOS Samantha voice.
