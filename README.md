# Customer Requests Dashboard

A full-stack demo application for tracking and updating customer service requests.  
- **Frontend**: React + Vite + Tailwind CSS  
- **Backend**: FastAPI + Supabase  

---

## Features
- Create, view, and update customer requests
- Track request statuses: Pending → Acknowledged → Completed
- Dashboard with live counts of each status
- Clean UI powered by Tailwind CSS

---

## Prerequisites
- Node.js (>= 18) and npm
- Python 3.10+
- Supabase project (with a `requests` table)
- [Vite](https://vitejs.dev/) (installed automatically via npm)

---

## Frontend Setup (React + Vite + Tailwind)

1. **Install dependencies**
   ```sh
   npm install
   ```

2. **Initialize Tailwind (if not already done)**
   ```sh
   npx tailwindcss init -p
   ```

3. **Development server**
   ```sh
   npm run dev
   ```
   The app runs at [http://localhost:5173](http://localhost:5173).

4. **Build for production**
   ```sh
   npm run build
   ```

---

## Backend Setup (FastAPI + Supabase)

1. **Create `.env` in `backend/`** with:
   ```env
   SUPABASE_URL=your-supabase-url
   SUPABASE_KEY=your-supabase-key
   ```

2. **Install dependencies**
   ```sh
   pip install -r requirements.txt
   ```

3. **Run FastAPI server**
   ```sh
   python app.py
   ```
   Backend runs at [http://localhost:8000](http://localhost:8000).

---

## Database (Supabase)

Create a table `requests` with the following schema:

| Column        | Type      | Default             |
|---------------|-----------|---------------------|
| id            | bigint    | auto increment (PK) |
| customer_name | text      |                     |
| request_details | text    |                     |
| status        | text      | 'pending'           |
| created_at    | timestamptz | now()             |
| updated_at    | timestamptz | null              |

---

## Project Structure
```
.
├── App.jsx          # Main React component
├── main.jsx         # React entry point
├── index.css        # Tailwind CSS entry
├── index.html       # Vite HTML entry
├── app.py           # FastAPI backend
├── tailwind.config.js
├── postcss.config.js
```

---

## Development Notes
- Frontend expects backend API at `http://localhost:8000/api`.
- CORS is enabled in backend for `http://localhost:5173`.
- Update API URL in `App.jsx` to use `import.meta.env.VITE_API_URL` for production.

---

## Future Enhancements
- Authentication with Supabase Auth
- Real-time updates via Supabase
