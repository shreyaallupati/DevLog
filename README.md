# DevLog 🚀

A modern, full-stack platform for developers to publish, share, and manage their development logs. Built with the PERN stack (PostgreSQL, Express, React, Node.js) and styled with Tailwind CSS v4.


## ✨ Features

- **Secure Authentication:** Robust JWT-based user registration and login system.
- **Personalized Dashboards:** Dedicated user profiles to view and manage personal publications.
- **Protected API Routes:** Backend middleware ensures users can only delete or modify their own authenticated content.
- **Modern UI/UX:** Fully responsive, glassmorphism-inspired interface built with Tailwind CSS v4, featuring hover states, dynamic avatars, and smooth transitions.
- **Image Handling:** Seamless cover image uploads for rich, visual posts.
- **Relational Data Modeling:** Optimized PostgreSQL database ensuring data integrity between Users and Posts.

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS v4
- React Router DOM v6
- Context API (State Management)
- Axios

**Backend:**
- Node.js & Express
- PostgreSQL (pg)
- JSON Web Tokens (JWT) for Auth
- Multer (Image Uploads)
- bcryptjs (Password Hashing)

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL installed and running locally

### 1. Clone the repository
```bash
git clone [https://github.com/yourusername/devlog.git](https://github.com/yourusername/devlog.git)
cd devlog
```

2. Backend Setup
```bash
cd server
npm install
```
Create a .env file in the /server directory and add your variables:
```
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=devlog_db
JWT_SECRET=your_super_secret_jwt_key
Run the database setup script (assuming you have a database.sql file):
```
```Bash
psql -U postgres -d devlog_db -f database.sql
```
Start the backend server:

```Bash
npm run dev
```
3. Frontend Setup
Open a new terminal tab and navigate to the client folder:

```Bash
cd client
npm install
```
Create a .env file in the /client directory:

Code snippet
```
VITE_API_URL=http://localhost:5000/api
```
Start the Vite development server:
Bash
```npm run dev```
📁 Project Structure
```
devlog/
├── client/                # React Frontend
│   ├── src/
│   │   ├── api/           # Axios interceptors & config
│   │   ├── components/    # Reusable UI (Navbar, ProtectedRoute)
│   │   ├── context/       # Global Auth State
│   │   ├── pages/         # Home, Login, Register, Profile, CreatePost
│   │   └── index.css      # Tailwind v4 entry point
│   └── package.json
└── server/                # Node/Express Backend
    ├── src/
    │   ├── db/            # PostgreSQL pool connection
    │   ├── middleware/    # JWT authorization bouncer
    │   ├── routes/        # Auth and Posts controllers
    │   └── uploads/       # Static image storage
    └── package.json
```
## 🔮 Future Enhancements
[ ] Implement a rich-text editor for writing posts.

[ ] Add a "Like" and "Comment" system.

[ ] Paginate the home feed for better performance.

[ ] Migrate local image uploads to AWS S3.

### Built with ❤️ by Shreya
