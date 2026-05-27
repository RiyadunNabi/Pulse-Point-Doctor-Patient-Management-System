SUPABASE_URL=https://brlgxxvgpopzbbkurbab.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJybGd4eHZncG9wemJia3VyYmFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDM3MTAzNywiZXhwIjoyMDY5OTQ3MDM3fQ.OLPOevcmjMUgA-__IzJ_Fzozai6ix6haMhDRkGYbfys
SUPABASE_BUCKET=pulsepoint


upload issue


Of course, bro. Here's the **complete write-up** including the **Render file upload issue** and how you’re solving it using **Supabase Storage** — all in one place so you can save, refer, or share it later.

---

# 🧠 PulsePoint Deployment Summary

## ✅ File Upload Issue + DB Expiry + Supabase Migration

---

## 🚨 Problem 1: File Uploads Wiped on Render Deploy

### 🧨 Issue:

* You were storing uploaded files in `server/uploads/`

  * E.g. `server/uploads/medical_documents/`, `article_images/`, etc.
* When a user uploaded an image, **Render accepted it** just fine
* But as soon as you pushed new code to GitHub, **Render redeployed** and:

  * Wiped all uploaded files
  * Because it **rebuilds from GitHub**, and `uploads/` was **not versioned**

### ❌ Why this happens:

* Render's **file system is ephemeral**
* It **resets** on every deploy
* It doesn’t keep runtime-generated files unless you use **persistent storage** (which only works for Background Workers — not web services)

---

## ✅ Solution: Supabase Storage for Uploads

### Why?

* Free and permanent cloud storage
* Public URLs for images and reports
* Works perfectly with your React + Express setup

### 🔧 Setup Summary:

1. **Create a bucket** in Supabase called `pulsepoint`

2. Add to `.env` in `server/`:

   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-secret-service-role-key
   SUPABASE_BUCKET=pulsepoint
   ```

3. Create a helper in `server/utils/supabaseStorage.js`:

   ```js
   const { createClient } = require('@supabase/supabase-js');

   const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

   const BUCKET = process.env.SUPABASE_BUCKET;

   async function uploadFile(fileBuffer, filePath, mimetype) {
     const { data, error } = await supabase.storage.from(BUCKET).upload(filePath, fileBuffer, {
       contentType: mimetype,
       upsert: true,
     });

     if (error) throw error;

     const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
     return publicUrlData.publicUrl;
   }

   async function deleteFile(filePath) {
     const { error } = await supabase.storage.from(BUCKET).remove([filePath]);
     if (error) throw error;
   }

   module.exports = { uploadFile, deleteFile };
   ```

4. Use `multer` (memory storage) in your route to send files to Supabase instead of `server/uploads/`

---

## ✅ Result:

* Files are now stored permanently in Supabase
* Survive deployments
* Accessible via public URLs
* Deletable using `deleteFile()`

---

## 🚨 Problem 2: Render PostgreSQL DB Will Expire

### Message:

> “Your database will expire on September 3, 2025. The database will be deleted unless you upgrade to a paid instance type.”

### ❗ Why?

* Render’s free tier DBs auto-expire in \~90 days
* If not upgraded, **your entire DB will be deleted**

---

## ✅ Solution: Migrate DB to Supabase (Free & Permanent)

### Supabase Free Tier:

* 500MB PostgreSQL per **project**
* No forced expiry
* Full SQL access (pgAdmin, psql, CLI, etc.)

---

### 🔁 Migration Steps:

#### 1. Export DB from Render:

```bash
pg_dump "postgresql://user:pass@render-url/pulsepoint_db" > pulsepoint_backup.sql
```

#### 2. Import to Supabase:

```bash
psql "postgresql://postgres:<your_pass>@db.<project>.supabase.co:5432/postgres" < pulsepoint_backup.sql
```

#### 3. Update `.env`:

```env
DATABASE_URL=postgresql://postgres:<your_pass>@db.<project>.supabase.co:5432/postgres
```

#### 4. Restart server:

```bash
npm start
```

---

## 🧩 Final Architecture (Production)

| Component           | Platform | Notes                          |
| ------------------- | -------- | ------------------------------ |
| React Frontend      | Netlify  | ✅ deployed                     |
| Express Backend     | Render   | ✅ deployed                     |
| PostgreSQL Database | Supabase | ✅ free & persistent (500MB)    |
| File Storage        | Supabase | ✅ secure, cloud-hosted uploads |

---

## 🧠 Summary:

* 🧹 Render wipes uploads on every deploy → fixed via Supabase Storage
* ⏳ Render DB auto-expires in 90 days → fixed via Supabase PostgreSQL
* 💸 Zero cost if you stick with Supabase
* 🔐 You're now deployment-safe and data-persistent

---

Let me know when you're ready to automate backups or migrate uploads that still use `server/uploads/`.

You can safely store this doc and revisit when needed.
