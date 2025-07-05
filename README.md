# 🔥💰 ন্যায্য মূল্য – Fair Price Web Application 🛒🇧🇩

**"ন্যায্য মূল্য"** 🛒 is a Full Stack web application 💻 designed to ensure price transparency 💰 and fair trade ⚖️ across markets in Bangladesh 🇧🇩.
The platform empowers general users 👤, shopkeepers 🛍️, and administrators 🛡️ to collaboratively monitor 👁️‍🗨️ and report 📝 product prices in a structured 📊 and accessible 🌐 way.

## 🌐 Live Demo

- **🖥️Frontend:** [Vercel Deployment Link](https://fire-price-frontend.vercel.app/)

- **📊Dashboard:** [Vercel Deployment Link](https://fire-price-dashbaord.vercel.app/)


## 🖼️ Website Screenshot

![App Screenshot](https://res.cloudinary.com/dntarupgf/image/upload/v1751745748/fire-price_pwmxl2.png)

## 🛠️ Tech Stack

### 🖥️ Frontend:

- ⚛️ React.js
- 💨 Tailwind CSS
- 🔁 Axios
- 📦 Lucide React (for icons)
- 🔔 React Hot Toast
- 🌐 Context API
- 🌍 React Router
- 📁 Dotenv

### 🖥️ Backend:

- 🟢 Node.js + Express.js
- 🛢️ MongoDB + Mongoose
- 🔐 JWT + Bcrypt (for secure auth)
- 📬 Nodemailer (for emails)
- ☁️ Cloudinary + Multer (for file uploads)
- 📁 Dotenv
- 🔁 CORS
- 🔧 Nodemon

---

### 👥 User Types & Roles

1. 👤 **General User**

   - 🔍 Can view **retail & wholesale prices** of all available products
   - 🛒 Can **search shops** by name or region
   - 📢 Can **submit complaints** regarding overpricing or misconduct

2. 🛍️ **Retail Shopkeeper**

   - 📝 Can register an account (**pending approval**)
   - 🔐 Can login after admin approval (using mobile, email & password)
   - 📤 Can submit complaints
   - 📩 Will receive all notifications via **email**

3. 🏬 **Wholesale Shopkeeper**

   - 📝 Can register an account (**pending approval**)
   - 🔐 Can login after approval
   - 📤 Can also file complaints
   - 📩 Will receive updates via **email**

4. 🛡️ **Government Admin**
   - ✅ Can **approve or reject** shopkeeper accounts
   - 🧾 Can **add, edit, or delete** product prices
   - 📬 Can **view complaints**, including the sender & region
   - 📈 Can monitor everything via **dashboard** using **charts & statistics**

---

### ✨ Key Features

- 📦 **Product Price Management**  
  Admin can manage product prices (retail & wholesale) for different regions (Division, District, Upazila)

- 🧾 **Complaint Submission System**  
  All users (except admin) can file complaints through a **multi-step form** with **email OTP verification** and **image evidence**

- 📊 **Admin Dashboard with Charts**  
  Admin can see:

  - 📍 Complaint heatmaps by location
  - 🧮 Total product counts, complaints, approved/rejected shops
  - 📊 Live Graphs & Pie Charts (built with **Recharts**)

- 🔐 **Authentication System**

  - JWT-based secure login
  - Role-based routing and access control
  - Passwords hashed using **bcrypt**

- 📩 **Email Notification System**

  - OTP verification
  - Account approval/rejection
  - Complaint submission confirmations  
    (via **Nodemailer**)

- 🖼️ **Image Uploads**

  - Users can upload evidence (images) via **Cloudinary + Multer**

- 📥 **Feedback via React Hot Toast**

  - Instant notifications on every user action (submission, success, error)

- 🧭 **Location-Based Filtering**

  - Region filtering: **Division**
  - Shows region-wise products, complaints, and shops

- 🌐 **Fully Responsive Frontend**
  - Mobile-first design using **Tailwind CSS**
  - Clear layout with smooth transitions

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

## 🔐 Environment Variables

To run this project, create a `.env` file in your **Backend** directory and add the following environment variables:

```env
# 📦 MongoDB Connection
DATABASE_CONNECTION_STRING=your_mongodb_connection_string

# 🚪 Server Port
PORT=8080

# 🔑 JWT Secret for Authentication
JWT_SECRET_KEY=your_jwt_secret_key

# ☁️ Cloudinary (for image uploads)
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

# 📧 SMTP Configuration (for email service)
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_email
SMTP_PASSWORD=your_smtp_email_password

```

---

## 📚 API Documentation

You can find the full API reference here:
🔗 [View Documentation](https://linktodocumentation)

---

## ⚙️ Installation Guide

Follow the steps below to get the project up and running locally:

---

### 🔁 Clone the Repository

```bash
  git clone https://github.com/Dev-Rohan1/Fair-Price.git
  cd Fair-Price
```

🖥️ Run Frontend (User App)

```bash
  cd frontend
  npm install
  npm run dev
```

📊 Run Dashboard (Admin Panel)

```bash
 cd Dashbaord
 npm install
 npm run dev
```

🛠️ Run Backend (API Server)

```bash
 cd bakend
 npm install
 npm run dev
```
