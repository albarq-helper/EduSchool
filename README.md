# Helper Academy

A free learning website for schools and universities: every grade (KG to postgraduate) and every subject.

- **Teachers** create study sets (terms with pictures, audio, translations) and question banks (multiple choice, true/false), keep them private or publish them to the shared library, and assign them to their classes. They see each student's results and most-missed terms.
- **Students** join a class with a 6-letter code and practise with flashcards, exams, games, spelling and quizzes. Every result is saved.
- **Schools and universities** are picked (or added) at sign-up. The site admin can merge duplicates.
- **Curricula** (Saudi Ministry of Education, American, British, Cambridge, IB, French, Indian CBSE, UAE MOE, …): a school follows one or more; each student, class and study set follows one. Teachers can edit their own school's list; the admin can edit any school and add curricula.

Hosted on GitHub Pages; data and sign-in on Supabase.

## Database setup (Supabase → SQL Editor → New query → paste → Run), in this order

1. `supabase_setup.sql`: accounts, classes, results
2. `supabase_v2_global.sql`: schools, subjects, levels, study sets, questions, library, media uploads
3. `supabase_v2_seed_grade5.sql`: the first public set (Grade 5 ELA, 166 words)
4. `supabase_v3_curricula.sql`: curricula, and which curricula each school follows
5. Make yourself admin: run the last line of `supabase_v2_global.sql` with your email.

If you ever re-run step 2, run step 4 again afterwards (it updates the sign-up function).

All scripts are safe to run again. Access rules (Row Level Security) are tested: 32 + 64 checks.

## Site configuration

`js/config.js` holds the Supabase Project URL and the **publishable** key only. Never put a secret key or the database password in this site.

## Pages

| Page | Who | What |
|---|---|---|
| index.html | everyone | Sign in / create account (school, level, class code) |
| student.html | students | Assigned sets, progress, missed terms, results |
| teacher.html | teachers | Classes, students, assigned sets, results |
| library.html | everyone | Public study sets, filter by subject, level, school |
| set.html | everyone | One set: activities, contents, teacher tools |
| mysets.html, edit.html | teachers | Create and edit sets; paste from Excel / CSV |
| cards, exam, games, spelling, quiz .html | everyone | Activities for the chosen set (`?set=<id>`) |
| admin.html | site admin | Schools, subjects, public sets |
