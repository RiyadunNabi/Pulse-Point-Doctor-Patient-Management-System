---

# Pulse Point Doctor-Patient Management System

A full-stack **Doctor-Patient Management System** built with the **PERN** stack (PostgreSQL, Express, React, Node.js). This project is currently at the 50% backend milestone, focusing on database design, API development, and essential backend features.

---

## Table of Contents

* [Project Overview](#project-overview)
* [Features Implemented (Backend)](#features-implemented-backend)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Database Schema](#database-schema)
* [API Endpoints](#api-endpoints)
* [Setup Instructions](#setup-instructions)
* [Development Progress](#development-progress)
* [Next Steps](#next-steps)

---

## Project Overview

This system enables efficient management of doctors, patients, appointments, prescriptions, medical documents, payments, reviews, and more. The backend is designed for robust, secure data operations and will serve a future React frontend.

---

## Features Implemented (Backend)

* **Comprehensive PostgreSQL Schema**: Fully normalized, production-ready, and tested.
* **Database Connection**: Secure connection via Node.js and `pg` module.
* **Express Routing**: Modular API routes for all major entities.
* **Controllers**: Secure, parameterized SQL logic in controller files.
* **CRUD APIs**: Create, Read, Update, Delete for main entities.
* **Error Handling**: Consistent status codes and error responses.
* **Tested Endpoints**: All features tested using Postman.

---

## Tech Stack

* **Database**: PostgreSQL
* **Backend**: Node.js, Express.js
* **Frontend**: React.js (to be developed)
* **ORM/DB Layer**: `pg` module (raw SQL, no ORM)
* **Testing**: Postman

---

## Project Structure

```
Pulse-Point-Doctor-Patient-Management-System/
├── client/         # Frontend (to be developed)
├── database/
│   └── Main_Schema_final.sql  # Complete PostgreSQL schema
├── server/
│   ├── db/
│   │   └── connection.js      # PostgreSQL connection setup
│   ├── routes/                # All API route files (modular)
│   ├── controllers/           # Controllers: business & SQL logic
│   └── index.js               # Express server entry point
```

---

## Database Schema

The schema models all core healthcare concepts:

* **User, Doctor, Patient, Department**
* **Appointments & Weekly Schedules**
* **Prescriptions, Drugs, Investigations, Reports**
* **Payments & Payment Status Tracking**
* **Medical Documents, Health Logs, Reviews, Notifications**
* **Specializations, Symptoms, Diseases**

See [`database/Main_Schema_final.sql`](database/Main_Schema_final.sql) for full DDL.

---

## API Endpoints

| Feature                     | Endpoint                           | Methods                  |
| --------------------------- | ---------------------------------- | ------------------------ |
| Departments                 | `/api/departments`                 | GET, POST                |
| Users                       | `/api/users`                       | GET, POST                |
| Doctors                     | `/api/doctors`                     | GET, POST                |
| Patients                    | `/api/patients`                    | GET, POST                |
| Weekly Schedule             | `/api/schedule`                    | GET, POST                |
| Appointments                | `/api/appointments`                | GET, POST, PATCH         |
| Prescriptions               | `/api/prescriptions`               | GET, POST                |
| Drugs                       | `/api/drugs`                       | GET                      |
| Prescription Drugs          | `/api/prescription-drugs`          | GET, POST                |
| Investigations              | `/api/investigations`              | POST                     |
| Prescription Investigations | `/api/prescription-investigations` | GET, POST                |
| Investigation Reports       | `/api/investigation-reports`       | GET, POST                |
| Prescription Files          | `/api/prescription-files`          | GET, POST                |
| Bookmarked Doctors          | `/api/bookmarked-doctors`          | GET, POST, DELETE        |
| Payments                    | `/api/payments`                    | GET, POST, PATCH         |
| Reviews                     | `/api/reviews`                     | GET, POST                |
| Medical Documents           | `/api/medical-documents`           | GET, POST, PATCH, DELETE |
| Health Logs                 | `/api/health-logs`                 | GET, POST                |
| Notifications               | `/api/notifications`               | GET, POST                |
| Health Articles             | `/api/health-articles`             | GET, POST, PATCH, DELETE |

---

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/Pulse-Point-Doctor-Patient-Management-System.git
   cd Pulse-Point-Doctor-Patient-Management-System
   ```

2. **Setup PostgreSQL Database**

   * Create a database (e.g. `PulsePointDBProject`).
   * Run `database/Main_Schema_final.sql` to create all tables.

3. **Configure Backend**

   * Set your PostgreSQL credentials in `server/db/connection.js`.

4. **Install Dependencies**

   ```bash
   cd server
   npm install
   ```

5. **Start Backend Server**

   ```bash
   node index.js
   ```

   * Server will run on [http://localhost:5000](http://localhost:5000).

6. **Test API Endpoints**

   * Use [Postman](https://www.postman.com/) or similar tool.

---

## Development Progress

* **Database**: 100% complete (fully normalized, tested)
* **Backend APIs**: Core CRUD operations for all tables done
* **Routing & Controllers**: Modular structure, secure queries
* **Testing**: All endpoints tested, returning correct responses
* **Frontend**: To be developed

---

## Next Steps

* Implement advanced backend features (authentication, validation, file upload, etc.)
* Begin frontend development using React
* Integrate backend and frontend for full-stack functionality
* Deploy to cloud (optional)

---

## Contributing

Pull requests are not welcome. -\_-  For major changes, please open an issue first to discuss what you would like to change.

---

## License

This project is licensed for academic and non-commercial use.

---

> **Status**: Backend 50% milestone complete — ready for further development!

---
