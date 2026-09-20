# Clinic Staff Management System

A robust web application designed to streamline healthcare facility operations by managing clinic staff, doctor schedules, patient appointments, and administrative workflows with real-time overlap prevention.

**Live Demo:** [https://clinic-staff-five.vercel.app/](https://clinic-staff-five.vercel.app/)  
**Repository:** [https://github.com/mahmoudabdelaziz1993/clinic-staff](https://github.com/mahmoudabdelaziz1993/clinic-staff)

---

## Overview

The **Clinic Staff Management System** provides an intuitive platform for clinic administrators to manage staff, assign appointments, and track patient schedules seamlessly. 

### Key Features

* **Staff & Doctor Directory:** Track doctors, specialties, and staff roles.
* **Smart Appointment Scheduling:** Strict PostgreSQL-level constraints prevent double-booking doctors for overlapping time slots.
* **Appointment Lifecycle Tracking:** Monitor status transitions (`scheduled`, `confirmed`, `completed`, `cancelled`, `no_show`).
* **Optimized Database Queries:** Indexed by status and composite doctor-date filters for quick lookups.
* **Responsive Interface:** Designed for seamless access on desktop, tablet, and mobile devices.

---

## Database Architecture & Schema

The core database uses PostgreSQL with advanced constraints (`EXCLUDE USING gist`) to enforce valid schedule ranges at the database layer.

### Relational Schema (PostgreSQL)

```sql
-- 1. Doctors Table
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL
);

-- 2. Appointments Table
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,

  doctor_id INTEGER NOT NULL
    REFERENCES doctors(id)
    ON DELETE CASCADE,

  patient_name TEXT NOT NULL,
  patient_phone TEXT,

  appointment_date DATE NOT NULL,

  start_time TIME NOT NULL,
  end_time TIME NOT NULL,

  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT appointment_valid_time
    CHECK (end_time > start_time)
);

-- 3. Overlap Prevention Constraint (Requires btree_gist extension)
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE appointments
ADD CONSTRAINT no_doctor_appointment_overlap
EXCLUDE USING gist (
  doctor_id WITH =,
  tsrange(
    (appointment_date + start_time),
    (appointment_date + end_time),
    '[)'
  ) WITH &&
);

-- 4. Enum Type for Appointment Status
CREATE TYPE appointment_status AS ENUM (
    'scheduled',
    'confirmed',
    'completed',
    'cancelled',
    'no_show'
);

-- 5. Add Status Column to Appointments
ALTER TABLE appointments
ADD COLUMN status appointment_status NOT NULL DEFAULT 'scheduled';

-- 6. Indexes for Performance Optimization
CREATE INDEX idx_appointments_status ON appointments (status);

CREATE INDEX idx_appointments_doctor_status_date
ON appointments (doctor_id, status, appointment_date);

```

---

## Tech Stack

* **Frontend:** React.js / Next.js, Tailwind CSS
* **Database:** PostgreSQL (with `btree_gist` extension for exclusion constraints)
* **Hosting & Deployment:** Vercel

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your local environment:

* Node.js (v18.x or higher)
* PostgreSQL (v13+ recommended for GiST index support)
* npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone [https://github.com/mahmoudabdelaziz1993/clinic-staff.git](https://github.com/mahmoudabdelaziz1993/clinic-staff.git)
cd clinic-staff

```


2. **Install dependencies:**
```bash
npm install
# or
yarn install

```


3. **Set up the Database:**
* Create a local or cloud PostgreSQL database.
* Run the SQL queries provided in the Database Architecture & Schema section in your database client (e.g., `psql`, pgAdmin, or DBeaver).


4. **Environment Variables:**
Create a `.env.local` file in the root directory:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/clinic_db

```


5. **Run the development server:**
```bash
npm run dev
# or
yarn dev

```


6. **View the application:**
Open http://localhost:3000 in your browser.

---

## Usage Example

### Scheduling an Appointment

1. Select a **Doctor** from the directory.
2. Choose a date and enter the **Start Time** and **End Time**.
3. Input patient details and submit.
4. *Note:* If the selected timeframe conflicts with an existing appointment for the same doctor, the database will automatically reject the entry via the `no_doctor_appointment_overlap` exclusion constraint.

---

## License

Distributed under the **MIT License**. See `LICENSE` for details.

---

## Author

**Mahmoud Abdelaziz**

* GitHub: [@mahmoudabdelaziz1993](https://github.com/mahmoudabdelaziz1993?utm_source=gemini)
