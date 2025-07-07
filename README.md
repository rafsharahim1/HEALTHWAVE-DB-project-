# 🏥 HealthWave – Smart Hospital Management System

HealthWave is a full-stack hospital management system designed to streamline operations, centralize data, and enhance the healthcare experience for patients, doctors, pharmacists, and administrators. The system is built using **React.js**, **Node.js**, and **MySQL**, with carefully designed procedures, functions, and triggers to ensure real-time performance and data integrity.

---

## 🚀 Features

### 🧑‍⚕️ Doctor Management
- Add/search doctors by specialization or name
- View doctor details and schedules

### 🧑‍💼 Patient Management
- Register patients and update contact info
- Maintain appointment and prescription history

### 📆 Appointment Scheduling
- Book, update, and cancel appointments
- Prevent double-bookings for both doctors and patients via database triggers

### 💊 Prescription & Pharmacy Management
- Doctors issue prescriptions post-consultation
- Pharmacists dispense medicines and update inventory
- Real-time medicine stock validation and deduction

### 📊 Admin Dashboard & Real-Time Insights
- Track appointments, doctor-patient ratios, prescription trends, and inventory
- Central hub with access to all modules

---

## 🛠️ Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js (Express)
- **Database**: MySQL
- **ERD Tool**: DBDesigner
- **API Communication**: Axios

---

## 📚 Database Highlights

### 🗄️ Key Entities:
- Hospital, Department, Doctor, Patient, Appointment, Prescription, Medicine, Pharmacy

### 🔐 Business Logic:
- Cascading updates for relational integrity
- Real-time analytics with stored functions
- Triggers to ensure accurate inventory, cost updates, and schedule conflict prevention

### 🧠 Smart Logic with SQL:
- Stored Procedures:
  - `ScheduleAppointment`
  - `CancelAppointment`
  - `AddNewPatient`
- Functions:
  - `Get_Medicines_In_Prescription`
  - `get_doctor_count`
- Triggers:
  - Prevent overlapping appointments
  - Update inventory and prescription cost automatically

---

## 💻 Application Flow

1. **Login** → Choose user role (Admin, Doctor, Patient)
2. **Dashboard** → Access relevant modules
3. **Book Appointment** → Select doctor & time
4. **Post-Appointment** → Prescription issued → Pharmacy notified
5. **Inventory & Analytics** → Auto-updated in real-time
