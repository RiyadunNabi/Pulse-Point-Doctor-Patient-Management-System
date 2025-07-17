-- USER TABLE
CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'doctor', 'patient')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DEPARTMENT
CREATE TABLE department (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100),
    description TEXT
);

-- DOCTOR
CREATE TABLE doctor (
    doctor_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(user_id) ON DELETE CASCADE,
    department_id INTEGER REFERENCES department(department_id),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    bio TEXT,
    consultation_fee NUMERIC(10, 2),
    license_no VARCHAR(100),
    phone_no VARCHAR(20),
    address TEXT,
    avg_rating NUMERIC(2,1),
    available_days_per_week INTEGER CHECK (available_days_per_week BETWEEN 0 AND 7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PATIENT
CREATE TABLE patient (
    patient_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(user_id) ON DELETE CASCADE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    date_of_birth DATE,
    phone_no VARCHAR(20),
    address TEXT,
    blood_group VARCHAR(5),
    health_condition TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BOOKMARKED_DOCTORS
CREATE TABLE bookmarked_doctors (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patient(patient_id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES doctor(doctor_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (patient_id, doctor_id)
);

--WEEKLY SCHEDULE
CREATE TABLE weekly_schedule (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctor(doctor_id) ON DELETE CASCADE,
    weekday INTEGER NOT NULL CHECK (weekday BETWEEN 0 AND 6), -- 0 = Friday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_per_hour INTEGER DEFAULT 1 CHECK (max_per_hour >= 1),
    location TEXT
);

CREATE TABLE doctor_schedule (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctor(doctor_id) ON DELETE CASCADE,

    schedule_type VARCHAR(10) NOT NULL CHECK (schedule_type IN ('recurring', 'specific')),

    weekday INTEGER CHECK (weekday BETWEEN 0 AND 6), -- 0 = Sunday, 6 = Saturday

    specific_date DATE,

    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_per_hour INTEGER DEFAULT 1 CHECK (max_per_hour >= 1),
    location TEXT,
 
    is_active BOOLEAN DEFAULT TRUE,
    start_date DATE,
    end_date DATE, 
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT check_recurring_weekday CHECK (
        (schedule_type = 'recurring' AND weekday IS NOT NULL AND specific_date IS NULL) OR
        (schedule_type = 'specific' AND specific_date IS NOT NULL AND weekday IS NULL)
    )
);

-- APPOINTMENT
-- CREATE TABLE appointment (
--     appointment_id SERIAL PRIMARY KEY,
--     patient_id INTEGER REFERENCES patient(patient_id),
--     doctor_id INTEGER REFERENCES doctor(doctor_id),
--     schedule_id INTEGER REFERENCES schedule(schedule_id),
--     appointment_date TIMESTAMP,
--     appointment_type VARCHAR(10) CHECK (appointment_type IN ('in-person', 'online')),
--     reason TEXT,
--     doctor_notes TEXT,
--     status VARCHAR(20),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

CREATE TABLE appointment (
    appointment_id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctor(doctor_id),
    patient_id INTEGER REFERENCES patient(patient_id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,  -- this will be calculated at booking time
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- REVIEWS
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointment(appointment_id),
    ratings INTEGER CHECK (ratings BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRESCRIPTION
CREATE TABLE prescription (
    prescription_id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointment(appointment_id),
    diagnosis TEXT,
    other_drugs TEXT,
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRESCRIPTION_FILE
CREATE TABLE prescription_file (
    file_id SERIAL PRIMARY KEY,
    prescription_id INTEGER REFERENCES prescription(prescription_id),
    file_type VARCHAR(20),
    file_name VARCHAR(100),
    filepath TEXT,
    uploaded_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Master list of investigations/tests
CREATE TABLE investigation (
    investigation_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- Join table: which investigation is prescribed in which prescription
CREATE TABLE prescription_investigation (
    prescription_id INTEGER REFERENCES prescription(prescription_id) ON DELETE CASCADE,
    investigation_id INTEGER REFERENCES investigation(investigation_id) ON DELETE CASCADE,
    notes TEXT,
    PRIMARY KEY (prescription_id, investigation_id)
);

-- Report files uploaded for each prescription + investigation pair
CREATE TABLE investigation_report (
    report_id SERIAL PRIMARY KEY,
    prescription_id INTEGER,
    investigation_id INTEGER,
    file_name VARCHAR(100),
    file_type VARCHAR(20),
    file_path TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,

    -- Composite foreign key points to the join table
    CONSTRAINT fk_presc_invest
        FOREIGN KEY (prescription_id, investigation_id)
        REFERENCES prescription_investigation(prescription_id, investigation_id)
        ON DELETE CASCADE
);




-- PAYMENTS
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointment(appointment_id),
    amount NUMERIC(10,2),
    payment_method VARCHAR(50), -- e.g., "card", "bkash", "nagad"
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'success', 'failed', 'canceled', 'refunded')),
    transaction_id VARCHAR(100),
    paid_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DRUG
CREATE TABLE drug (
    drug_id SERIAL PRIMARY KEY,
    drug_name VARCHAR(100),
    dosage_form VARCHAR(50),
    strength VARCHAR(20),
    additional_notes TEXT
);

-- PRESCRIPTION_DRUG
CREATE TABLE prescription_drug (
    prescription_id INTEGER REFERENCES prescription(prescription_id),
    drug_id INTEGER REFERENCES drug(drug_id),
    dosages VARCHAR(100),
    frequency_per_day INTEGER,
    duration VARCHAR(50),
    additional_notes TEXT,
    PRIMARY KEY (prescription_id, drug_id)
);

-- HEALTH_ARTICLE
CREATE TABLE health_article (
    article_id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctor(doctor_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    image_path TEXT,
    category VARCHAR(100),
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SPECIALIZATION
CREATE TABLE specialization (
    specialization_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT
);

-- DOCTOR_SPECIALIZATION
CREATE TABLE doctor_specialization (
    doctor_id INTEGER REFERENCES doctor(doctor_id) ON DELETE CASCADE,
    specialization_id INTEGER REFERENCES specialization(specialization_id) ON DELETE CASCADE,
    qualification VARCHAR(100),
    experience_years INTEGER,
    PRIMARY KEY (doctor_id, specialization_id)
);

-- HEALTH_LOGS
CREATE TABLE health_logs (
    log_id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patient(patient_id) ON DELETE CASCADE,
    weight NUMERIC(5,2),        -- 72.50 kg
    systolic INTEGER,           -- blood pressure top number
    diastolic INTEGER,          -- blood pressure bottom number
    heart_rate INTEGER,         -- beats per minute
    blood_sugar NUMERIC(5,2),   -- mg/dL
    sleep_hours NUMERIC(3,1),   -- 7.50
    notes TEXT,
    updated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MEDICAL_DOCUMENTS
CREATE TABLE medical_documents (
    document_id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patient(patient_id) ON DELETE CASCADE,
    file_name VARCHAR(100),
    file_path TEXT,
    description TEXT,
    last_checkup_date DATE,
    upload_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Link appointments to shared health logs
CREATE TABLE IF NOT EXISTS appointment_health_logs (
    appointment_id INTEGER REFERENCES appointment(appointment_id) ON DELETE CASCADE,
    health_log_id INTEGER REFERENCES health_logs(log_id) ON DELETE CASCADE,
    PRIMARY KEY (appointment_id, health_log_id)
);

-- Link appointments to shared medical documents
CREATE TABLE IF NOT EXISTS appointment_documents (
    appointment_id INTEGER REFERENCES appointment(appointment_id) ON DELETE CASCADE,
    document_id INTEGER REFERENCES medical_documents(document_id) ON DELETE CASCADE,
    PRIMARY KEY (appointment_id, document_id)
);








-- NOTIFICATIONS
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patient(patient_id) ON DELETE SET NULL,
    doctor_id INTEGER REFERENCES doctor(doctor_id) ON DELETE SET NULL,
    appointment_id INTEGER REFERENCES appointment(appointment_id) ON DELETE SET NULL,
    prescription_id INTEGER REFERENCES prescription(prescription_id) ON DELETE SET NULL,
    notification_type VARCHAR(20) CHECK (notification_type IN ('appointment', 'prescription')),
    title VARCHAR(255),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);












-- DISEASE
CREATE TABLE disease (
    disease_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT
);

-- SYMPTOM
CREATE TABLE symptom (
    symptom_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT
);

-- PATIENT_SYMPTOM_CHECK
CREATE TABLE patient_symptom_check (
    check_id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patient(patient_id) ON DELETE CASCADE,
    check_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    predicted_disease_id INTEGER REFERENCES disease(disease_id)
);

-- CHECK_SYMPTOM
CREATE TABLE check_symptom (
    check_id INTEGER REFERENCES patient_symptom_check(check_id) ON DELETE CASCADE,
    symptom_id INTEGER REFERENCES symptom(symptom_id) ON DELETE CASCADE,
    PRIMARY KEY (check_id, symptom_id)
);

-- DISEASES_SYMPTOM
CREATE TABLE diseases_symptom (
    disease_id INTEGER REFERENCES disease(disease_id) ON DELETE CASCADE,
    symptom_id INTEGER REFERENCES symptom(symptom_id) ON DELETE CASCADE,
    PRIMARY KEY (disease_id, symptom_id)
);