# Smart Discharge Summary Generator - Setup Guide

## Prerequisites
1. Node.js installed
2. MySQL installed and running

---

## Step 1: Set Up MySQL Database

### Option A: Using MySQL Workbench
1. Open MySQL Workbench
2. Create a new connection or use existing one
3. Click on "File" → "Open SQL Script"
4. Select `database/schema.sql`
5. Click "Execute" to run the script

### Option B: Using Command Line
1. Open MySQL command line client
2. Run the following commands:
```sql
CREATE DATABASE IF NOT EXISTS discharge_summary_db;
USE discharge_summary_db;
-- Then copy and paste the contents of database/schema.sql
```

### Option C: Using XAMPP/WAMP
1. Start Apache and MySQL in XAMPP/WAMP
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Create a database named `discharge_summary_db`
4. Click on "Import" and select `database/schema.sql`
5. Click "Go" to import

---

## Step 2: Configure Database Connection

Edit `backend/db.js` and update the database credentials:

```javascript
const dbConfig = {
    host: 'localhost',
    user: 'root',           // Your MySQL username
    password: 'your_password', // Your MySQL password
    database: 'discharge_summary_db',
    // ... rest of config
};
```

**Common configurations:**
- XAMPP default: user='root', password=''
- WAMP default: user='root', password=''
- Custom MySQL: use your credentials

---

## Step 3: Start the Backend Server

Open a terminal and run:
```bash
cd backend
npm start
```

You should see:
```
Server running on port 5000
API available at http://localhost:5000/api
Database connected successfully!
```

---

## Step 4: Start the Frontend

Open a **new** terminal and run:
```bash
cd frontend
npm start
```

This will open the application at http://localhost:3000

---

## Step 5: Login

Use these credentials:
- **Username:** admin
- **Password:** admin123

---

## Troubleshooting

### "Access denied for user 'root'@'localhost'"
- Check your MySQL password in `backend/db.js`
- Try setting password to '' (empty) for local development

### "Can't connect to MySQL server"
- Make sure MySQL service is running
- Check if MySQL is running on port 3306

### "Database 'discharge_summary_db' doesn't exist"
- Run the SQL script in `database/schema.sql` to create the database

### React Router Warning
These are just warnings and won't affect functionality. To suppress them, you can add future flags to your React Router setup, but they're optional.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/generate-summary | Generate discharge summary |
| POST | /api/patients | Save patient record |
| GET | /api/patients | Get all patients |
| GET | /api/patients/:id | Get patient by ID |
| GET | /health | Server health check |

---

**⚠️ Disclaimer:** This system is developed for academic demonstration purposes only and not for real clinical use.
