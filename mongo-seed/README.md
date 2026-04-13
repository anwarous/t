# MongoDB Seed Data

This directory contains JSON seed files for the **Learning++** MongoDB database.  
Import them with `mongoimport` to populate every collection from scratch.

---

## Collections

| File | Collection | Documents |
|---|---|---|
| `users.json` | `users` | 10 accounts (1 admin + 9 users) |
| `courses.json` | `courses` | 6 courses with full chapter/lesson trees |
| `exercises.json` | `exercises` | 16 coding exercises with solutions & test cases |
| `badges.json` | `badges` | 12 badge definitions |
| `submissions.json` | `submissions` | 10 sample code submissions |
| `user_progress.json` | `user_progress` | 18 user-course progress records |
| `user_badges.json` | `user_badges` | 16 earned badge records |

---

## Import commands

Replace `<DB>` with your database name (e.g. `learningplusplus`).

```bash
mongoimport --uri "mongodb://localhost:27017/<DB>" \
  --collection users         --file users.json         --jsonArray

mongoimport --uri "mongodb://localhost:27017/<DB>" \
  --collection courses       --file courses.json       --jsonArray

mongoimport --uri "mongodb://localhost:27017/<DB>" \
  --collection exercises     --file exercises.json     --jsonArray

mongoimport --uri "mongodb://localhost:27017/<DB>" \
  --collection badges        --file badges.json        --jsonArray

mongoimport --uri "mongodb://localhost:27017/<DB>" \
  --collection submissions   --file submissions.json   --jsonArray

mongoimport --uri "mongodb://localhost:27017/<DB>" \
  --collection user_progress --file user_progress.json --jsonArray

mongoimport --uri "mongodb://localhost:27017/<DB>" \
  --collection user_badges   --file user_badges.json   --jsonArray
```

All at once (bash loop):

```bash
DB=learningplusplus
for f in users courses exercises badges submissions user_progress user_badges; do
  mongoimport --uri "mongodb://localhost:27017/$DB" \
    --collection "$f" --file "${f}.json" --jsonArray
done
```

---

## Default password

Every seeded user has the **same bcrypt-hashed password** for demo purposes:

```
plaintext : Password123
bcrypt    : $2a$10$CET9MrVD2O1L6og/cAZ68.Lz/xa.B3hmRbtFsH027QMf9lXBEphhm
```

> **Change all passwords before deploying to production.**

---

## Relationships

```
users  ──(1:N)──  submissions   (userId → users._id)
users  ──(1:N)──  user_progress (userId → users._id)
users  ──(1:N)──  user_badges   (userId → users._id)
courses ──(1:N)── user_progress (courseId → courses._id)
exercises ─(1:N)─ submissions   (exerciseId → exercises._id)
badges ──(1:N)──  user_badges   (badgeId → badges._id)
```

---

## XP / Rank table

| XP range | Rank |
|---|---|
| 0 – 499 | Novice |
| 500 – 1 499 | Apprentice |
| 1 500 – 2 999 | Practitioner |
| 3 000 – 5 999 | Expert |
| 6 000 – 11 999 | Master |
| 12 000 – 24 999 | Grandmaster |
| 25 000+ | Legend |
