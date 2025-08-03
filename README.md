**PulsePoint – Doctor-Patient Appointment Management System & Healthcare Portal** based on your features and project structure:

---

```markdown
# PulsePoint – Doctor-Patient Appointment Management System & Healthcare Portal

![PulsePoint Logo](./client/src/logo.svg)

PulsePoint is a full-featured web-based healthcare management system designed to streamline interactions between patients and doctors. It facilitates appointment bookings, real-time health tracking, document sharing, revenue monitoring, and much more — all through an intuitive and animated interface built using the PERN Stack.

> 🎓 Academic Project for CSE 216 (Database Management Systems)  
> 📍 Department of CSE, BUET  
> 👨‍💻 Developed by Md. Riyadun Nabi (2205076) & Fardin Fuad (2205084)

---

## 🌐 Live Demo

**Coming soon...**

---

## 🚀 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Lucide Icons, CSS3 Animations
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Other Tools**: Axios, JWT Auth, REST APIs, File Uploads

---

## 📁 Project Structure

```

Pulse-Point-Doctor-Patient-Management-System/
├── client/             # React frontend (WelcomePage, AuthPage, Dashboards, Animations)
├── server/             # Express API server with route controllers
├── database/           # SQL schema and seed files
├── uploads/            # Stored user-uploaded files (reports, documents)

````

See full [structure here »](https://github.com/RiyadunNabi/Pulse-Point-Doctor-Patient-Management-System)

---

## 👤 Roles

### 🧑‍⚕️ Doctors
- Register/login, update their professional profile
- Define schedules (recurring or date-specific)
- Manage appointments (approve/cancel)
- View shared health logs and documents
- Issue prescriptions and investigations
- See uploaded reports and update prescription
- Track revenue over day/week/month/year
- Access patient stats (history, count, etc.)
- Write health articles for the community

### 🧑‍💼 Patients
- Register/login, update personal profile
- Daily/periodic health log tracking:
  - Weight, Heart Rate, Blood Sugar, BP (Sys/Dia), Sleep Hours
- View trend graphs of health stats
- Upload and store medical documents (reports, prescriptions)
- Explore departments and search doctors
- Book appointments with slot selection
- Share logs & files while booking
- View/manage appointment status
- Make payments and give doctor ratings
- Access doctor-published health articles

---

## 🎨 UI Highlights

- Beautifully **animated Welcome Page** with:
  - Floating shapes
  - Dashboard mockups
  - Tabbed features view (patient/doctor)
  - Hover effects and interactive stats
- Fully responsive design
- Color scheme: Light blue, cyan, sky gradients
- Professional login/registration experience with branding
- Seamless routing between welcome, auth, and dashboards

---

## 🔐 Authentication

- JWT-based secure login
- Role-based route protection (patient vs doctor)
- LocalStorage used to persist sessions

---

## 🧪 Health Log Graph

A powerful component within the Patient Dashboard visualizes:
- Weight, Heart Rate, Blood Sugar, Sleep patterns
- Using real-time graph tabs and trend lines

---

## 💳 Payment & Ratings

- Patients can pay for appointments securely
- Rate doctors post consultation
- All payment history and ratings managed in dashboard

---

## 📄 Document Handling

- Medical documents and investigation reports are uploaded securely
- Doctors can attach investigations
- Patients can upload post-investigation results

---

## 📈 Doctor Revenue Insights

Doctors can track:
- Total earnings by time range (day/week/month/year)
- Revenue growth trend charts
- Visual statistics for performance review

---

## 📚 Health Articles

- Doctors can write and publish articles
- Patients can explore articles by category
- Clean and readable design for better engagement

---

## 🧭 Navigation Flow

- `/welcome` → Animated homepage with overview
- `/auth` → Role-based login/register
- `/dashboard` → Patient panel
- `/doctordashboard` → Doctor panel

---

## 🛠️ Setup & Installation

### 1. Clone the repo

```bash
git clone https://github.com/RiyadunNabi/Pulse-Point-Doctor-Patient-Management-System.git
cd Pulse-Point-Doctor-Patient-Management-System
````

### 2. Setup Backend

```bash
cd server
npm install
npm run dev
```

### 3. Setup Frontend

```bash
cd ../client
npm install
npm start
```

### 4. Setup Database

* Import `Main_Schema_final.sql` from `/database` to your PostgreSQL server.
* Configure `.env` for DB credentials in `/server`.

---

## ⚙️ Environment Variables

Create a `.env` file inside `/server` and `/client` with:

```
# server/.env
PORT=5000
DB_URL=postgres://username:password@localhost:5432/pulsepoint
JWT_SECRET=yourSecretKey

# client/.env
REACT_APP_API_URL=http://localhost:5000
```

---

## 📢 Contributors

* **Md. Riyadun Nabi (Riyad)** – [GitHub »](https://github.com/RiyadunNabi)
* **Fardin Fuad**

---

## 📜 License

This project was built for academic purpose (CSE 216 @ BUET). All rights are not reserved.

---

## ⭐ Feedback & Improvements

---

```