# 🔥💰 Fire Price - ( ন্যায্যমূল্য ওয়েবসাইট )

A full-stack Todo management app Dozy built for task coordination. This application leverages modern technologies for optimal performance, scalability, and user experience.

## 🌐 Live Demo

- **Frontend:** [Vercel Deployment Link](#)

- **Dashboard:** [Vercel Deployment Link](#)
- **Backend:** [Render Deployment Link](#)

## 📱Website Screenshot

![App Screenshot](https://i.imgur.com/Q2GHTvT.png)

## ⚙️ Tech Stack

### 🧩 Frontend

| Tech                 | Purpose                             |
| -------------------- | ----------------------------------- |
| **React (Vite)**     | Fast and modern frontend framework  |
| **Tailwind CSS**     | Utility-first CSS framework         |
| **React Router DOM** | Client-side routing                 |
| **Axios**            | API requests                        |
| **Context API**      | State management (no Redux/Zustand) |
| **React Hot Toast**  | Notification & alerts               |
| **Lucide React**     | Icon set                            |
| **Framer Motion**    | Animations                          |

### 🛠️ Backend

| Tech                       | Purpose                           |
| -------------------------- | --------------------------------- |
| **Node.js**                | JavaScript runtime                |
| **Express.js**             | Backend framework                 |
| **MongoDB** + **Mongoose** | Database & ODM                    |
| **JWT + bcrypt**           | Authentication & password hashing |
| **Dotenv**                 | Environment variables             |
| **Multer.js**              | File upload                       |
| **Nodemailer**             | Email sending                     |
| **Cloudianry**             | Storage Engine                    |

---

## 🔐 Authentication

Authentication is implemented using **JWT (JSON Web Tokens)** and **bcrypt** for secure password hashing.

### Features:

- User registration with hashed passwords
- Secure login with JWT token generation
- Protected routes using token verification middleware
- Token stored in localStorage
- Role-based access control

---

## ✅ Todo App Features

- User Authentication (Register/Login)
- Create, Read, Update, Delete (CRUD) Todo items
- Assign tasks to team members
- Set due dates and priorities
- Mark tasks as completed
- Filter and sort todos by status, date, or priority
- Real-time UI feedback with React Hot Toast Notification
- File attachments to tasks (Multer)
- File Storget engine in (Cloudinary)
- Email notifications on task assignment (Nodemailer)
- Responsive and mobile-friendly design

---

## 🚀 Deployment

| Service    | Purpose          |
| ---------- | ---------------- |
| **Vercel** | Frontend Hosting |
| **Vercel** | Backend Hosting  |

---

## 🧪 Development Tools

| Tool        | Purpose                         |
| ----------- | ------------------------------- |
| **GitHub**  | Version Control                 |
| **Nodemon** | Auto-restart backend on changes |

---

## 📁 Project Structure

```text
root/
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layout/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js /
│
├── Dashboard/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── app.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── README.md
└── .gitignore
```

---

## 📤 File Upload & Email

- File uploads handled with **Multer.js**
- Email notifications using **Nodemailer**

---

## 📦 Scripts

### Start both frontend & Dashbaord & backend in development mode

npm run dev
