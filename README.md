# Customer Requests Dashboard

A modern, full-stack application for tracking and managing customer service requests, built with TypeScript and React.
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + Supabase
- **Type Safety**: Full TypeScript support

---

## Features
- 📊 Real-time request tracking with live status updates
- 🔒 Type-safe with TypeScript integration
- 📱 Responsive design for all devices
- ⚡ Fast development with Vite
- 🎨 Modern UI powered by Tailwind CSS
- 🚀 RESTful API with FastAPI
- 📈 Dashboard with live status counts
- 🔄 Workflow: Pending → Acknowledged → Completed

---

## Prerequisites
- Node.js (>= 18) and npm
- Python 3.10+
- Supabase project (with a `requests` table)
- [Vite](https://vitejs.dev/) (installed automatically via npm)
- [TypeScript](https://www.typescriptlang.org/) 5.0+

---

## Quick Start

1. **Clone the repository**
   ```sh
   git clone https://github.com/SnekHunter/Requests-Dashboard.git
   cd Requests-Dashboard
   ```

2. **Install dependencies**
   ```sh
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   pip install -r requirements.txt
   ```

3. **Start development servers**
   ```sh
   # Start frontend (Terminal 1)
   npm run dev

   # Start backend (Terminal 2)
   python app.py
   ```

   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend: [http://localhost:8000](http://localhost:8000)

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
Requests-Dashboard/
├── src/                # Frontend source files
│   ├── App.tsx         # Main React component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles and Tailwind
├── backend/            # Backend source files
│   └── .env           # Environment configuration
├── public/            # Static assets
├── app.py             # FastAPI application
├── requirements.txt   # Python dependencies
├── package.json      # Node.js dependencies
├── tsconfig.json    # TypeScript configuration
├── tailwind.config.js
└── postcss.config.js
```

## API Routes

### Requests
- `GET /api/requests` - List all requests
- `POST /api/requests` - Create a new request
- `PUT /api/requests/{id}` - Update request status

## TypeScript Types

### Request Interface
```typescript
interface Request {
  id: number;
  customer_name: string;
  request_details: string;
  status: 'pending' | 'acknowledged' | 'completed';
  created_at?: string;
  updated_at?: string;
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---

## Development Notes
- Frontend expects backend API at `http://localhost:8000/api`.
- CORS is enabled in backend for `http://localhost:5173`.
- Update API URL in `App.jsx` to use `import.meta.env.VITE_API_URL` for production.

---

## Future Enhancements
- Authentication with Supabase Auth
- Real-time updates via Supabase
