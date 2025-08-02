-- ----------------------------------------------------------------------------------------------------
-- CREATE OR REPLACE VIEW available_appointment_slots AS
-- WITH RECURSIVE date_series AS (
--     SELECT CURRENT_DATE::DATE as slot_date
--     UNION ALL
--     SELECT (slot_date + INTERVAL '1 day')::DATE
--     FROM date_series
--     WHERE slot_date < (CURRENT_DATE + INTERVAL '3 months')::DATE
-- ),
-- recurring_slots AS (
--     SELECT 
--         ds.doctor_id,
--         d.slot_date,
--         ds.start_time,
--         ds.end_time,
--         ds.max_per_hour,
--         ds.location,
--         ds.id as schedule_id,
--         'recurring' as source_type
--     FROM doctor_schedule ds
--     CROSS JOIN date_series d
--     WHERE ds.schedule_type = 'recurring'
--         AND ds.is_active = TRUE
--         AND EXTRACT(DOW FROM d.slot_date) = ds.weekday
--         AND d.slot_date >= COALESCE(ds.start_date, CURRENT_DATE)
--         AND (ds.end_date IS NULL OR d.slot_date <= ds.end_date)
-- ),
-- specific_slots AS (
--     SELECT 
--         doctor_id,
--         specific_date as slot_date,
--         start_time,
--         end_time,
--         max_per_hour,
--         location,
--         id as schedule_id,
--         'specific' as source_type
--     FROM doctor_schedule
--     WHERE schedule_type = 'specific'
--         AND specific_date >= CURRENT_DATE
--         AND is_active = TRUE
-- )
-- SELECT * FROM recurring_slots
-- UNION ALL
-- SELECT * FROM specific_slots
-- ORDER BY slot_date, start_time;


CREATE OR REPLACE VIEW available_appointment_slots AS
WITH RECURSIVE
  date_series AS (
    SELECT CURRENT_DATE::DATE AS slot_date
    UNION ALL
    SELECT (slot_date + INTERVAL '1 day')::DATE
    FROM date_series
    WHERE slot_date < (CURRENT_DATE + INTERVAL '3 months')::DATE
  ),

  recurring_slots AS (
    SELECT 
      ds.doctor_id,
      d.slot_date,
      ds.start_time,
      ds.end_time,
      ds.max_per_hour,
      ds.location,
      ds.id AS schedule_id,
      'recurring' AS source_type
    FROM doctor_schedule ds
    CROSS JOIN date_series d
    WHERE ds.schedule_type = 'recurring'
      AND ds.is_active = TRUE
      AND EXTRACT(DOW FROM d.slot_date) = ds.weekday
      AND d.slot_date >= COALESCE(ds.start_date, CURRENT_DATE)
      AND (ds.end_date IS NULL OR d.slot_date <= ds.end_date)
  ),

  specific_slots AS (
    SELECT 
      doctor_id,
      specific_date AS slot_date,
      start_time,
      end_time,
      max_per_hour,
      location,
      id AS schedule_id,
      'specific' AS source_type
    FROM doctor_schedule
    WHERE schedule_type = 'specific'
      AND specific_date >= CURRENT_DATE
      AND is_active = TRUE
  ),

  all_slots AS (
    SELECT * FROM recurring_slots
    UNION ALL
    SELECT * FROM specific_slots
  ),

  booked AS (
    SELECT
      a.appointment_date,
      s.schedule_id,
      COUNT(*) AS booked_count
    FROM appointment a
    JOIN all_slots s
      ON a.doctor_id      = s.doctor_id
     AND a.appointment_date = s.slot_date
     AND a.appointment_time::time >= s.start_time
     AND a.appointment_time::time <  s.end_time
    WHERE a.status NOT IN ('cancelled')
    GROUP BY a.appointment_date, s.schedule_id
  )

SELECT
  s.doctor_id,
  s.slot_date,
  s.start_time,
  s.end_time,
  s.max_per_hour,
  s.location,
  s.schedule_id,
  s.source_type,


  FLOOR(EXTRACT(EPOCH FROM (s.end_time - s.start_time)) / 3600) * s.max_per_hour
    AS total_capacity,

  COALESCE(b.booked_count, 0) AS booked_count,

  -- remaining spots across the full block:
  GREATEST(
    FLOOR(EXTRACT(EPOCH FROM (s.end_time - s.start_time)) / 3600) * s.max_per_hour
      - COALESCE(b.booked_count, 0),
    0
  ) AS available_slots

FROM all_slots s
LEFT JOIN booked b
  ON b.appointment_date = s.slot_date
 AND b.schedule_id     = s.schedule_id

ORDER BY s.slot_date, s.start_time;




-----------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------
-- server/databas/Functions_Procedure_Trigger.sql

CREATE OR REPLACE FUNCTION get_appointments_by_doctor_and_status(
  doctor_id_param INTEGER,
  status_param    TEXT
)
RETURNS TABLE(
  appointment_id      INTEGER,
  appointment_date    DATE,
  appointment_time    TIME,
  status              TEXT,
  reason              TEXT,
  created_at          TIMESTAMP,
  patient_id          INTEGER,
  patient_first_name  TEXT,
  patient_last_name   TEXT,
  patient_phone       TEXT,
  patient_email       TEXT,
  date_of_birth       DATE,
  patient_gender      TEXT,
  patient_address     TEXT
) AS $$
BEGIN
  RETURN QUERY
    SELECT 
      a.appointment_id,
      a.appointment_date,
      a.appointment_time,
      a.status   ::TEXT AS status,
      a.reason,
      a.created_at,
      p.patient_id,
      p.first_name   ::TEXT AS patient_first_name,
      p.last_name    ::TEXT AS patient_last_name,
      p.phone_no     ::TEXT AS patient_phone,
      u.email        ::TEXT AS patient_email,
      p.date_of_birth AS date_of_birth,
      p.gender       ::TEXT AS patient_gender,
      p.address      AS patient_address
    FROM appointment a
    JOIN patient p  ON a.patient_id = p.patient_id
    JOIN "user"   u ON p.user_id    = u.user_id
    WHERE a.doctor_id = doctor_id_param
      AND a.status    = status_param
    ORDER BY a.appointment_date ASC, a.appointment_time ASC;
END;
$$ LANGUAGE plpgsql;


-- Function to get appointment statistics for a doctor
CREATE OR REPLACE FUNCTION get_doctor_appointment_stats(doctor_id_param INTEGER)
RETURNS TABLE(
    pending_count BIGINT,
    completed_count BIGINT,
    cancelled_count BIGINT,
    total_patients BIGINT,
    today_appointments BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_count,
        COUNT(DISTINCT patient_id) as total_patients,
        COUNT(*) FILTER (WHERE appointment_date = CURRENT_DATE) as today_appointments
    FROM appointment 
    WHERE doctor_id = doctor_id_param;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update appointment status automatically
CREATE OR REPLACE FUNCTION update_appointment_status_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-complete appointments that are past their time by 2 hours
    IF NEW.status = 'pending' AND 
       NEW.appointment_date < CURRENT_DATE OR 
       (NEW.appointment_date = CURRENT_DATE AND NEW.appointment_time < CURRENT_TIME - INTERVAL '2 hours') THEN
        NEW.status = 'completed';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER appointment_status_update
    BEFORE UPDATE ON appointment
    FOR EACH ROW
    EXECUTE FUNCTION update_appointment_status_trigger();
--------------------------------------------------------------------------------------------------------------------


-- Function to get patient's latest health log and medical documents
CREATE OR REPLACE FUNCTION get_patient_health_data(patient_id_param INTEGER)
RETURNS TABLE(
    latest_health_log_id INTEGER,
    weight            DECIMAL,
    systolic          INTEGER,
    diastolic         INTEGER,
    heart_rate        INTEGER,
    blood_sugar       DECIMAL,
    sleep_hours       DECIMAL,
    health_notes      TEXT,
    health_log_date   TIMESTAMP,
    medical_documents JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    hl.log_id,
    hl.weight,
    hl.systolic,
    hl.diastolic,
    hl.heart_rate,
    hl.blood_sugar,
    hl.sleep_hours,
    hl.notes       AS health_notes,
    hl.created_at  AS health_log_date,
    COALESCE(
      (
        SELECT json_agg(
          json_build_object(
            'document_id',     md.document_id,
            'file_name',       md.file_name,
            'description',     md.description,
            'upload_date',     md.upload_date,
            'last_checkup_date', md.last_checkup_date
          )
          ORDER BY md.upload_date DESC
        )
        FROM medical_documents md
        WHERE md.patient_id = patient_id_param
      ),
      '[]'::json
    ) AS medical_documents
  FROM health_logs hl
  WHERE hl.patient_id = patient_id_param
  ORDER BY hl.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION create_appointment_with_prediction(
    p_doctor_id INTEGER,
    p_patient_id INTEGER,
    p_appointment_date DATE,
    p_start_time TIME,
    p_end_time TIME,
    p_max_per_hour INTEGER,
    p_reason TEXT,
    p_shared_health_log_id INTEGER DEFAULT NULL,
    p_shared_document_ids INTEGER[] DEFAULT NULL
)
RETURNS TABLE(
    appointment_id INTEGER,
    predicted_time TIME,
    slot_window_start TIME,
    slot_window_end TIME,
    appointment_date DATE,
    status TEXT,
    reason TEXT
) AS $$
DECLARE
    v_appointment_id INTEGER;
    v_predicted_time TIME;
    v_slot_duration_minutes INTEGER;
    v_last_appointment_time TIME;
    v_next_slot_minutes INTEGER;
    v_next_hour INTEGER;
    v_next_minute INTEGER;
BEGIN
    -- Calculate slot duration
    v_slot_duration_minutes := 60 / p_max_per_hour;
    
    -- Get last appointment time in this slot
    SELECT MAX(appointment_time) INTO v_last_appointment_time
    FROM appointment a
    WHERE a.doctor_id = p_doctor_id 
      AND a.appointment_date = p_appointment_date 
      AND a.appointment_time >= p_start_time 
      AND a.appointment_time < p_end_time 
      AND a.status <> 'cancelled';
    
    -- Calculate predicted time
    IF v_last_appointment_time IS NULL THEN
        v_predicted_time := p_start_time;
    ELSE
        v_next_slot_minutes := EXTRACT(HOUR FROM v_last_appointment_time) * 60 + 
                              EXTRACT(MINUTE FROM v_last_appointment_time) + 
                              v_slot_duration_minutes;
        v_next_hour := v_next_slot_minutes / 60;
        v_next_minute := v_next_slot_minutes % 60;
        v_predicted_time := make_time(v_next_hour, v_next_minute, 0);
    END IF;
    
    -- Create appointment
    INSERT INTO appointment (doctor_id, patient_id, appointment_date, appointment_time, reason)
    VALUES (p_doctor_id, p_patient_id, p_appointment_date, v_predicted_time, p_reason)
    RETURNING appointment.appointment_id INTO v_appointment_id;
    
    -- Link shared health log if provided
    IF p_shared_health_log_id IS NOT NULL THEN
        INSERT INTO appointment_health_logs (appointment_id, health_log_id)
        VALUES (v_appointment_id, p_shared_health_log_id);
    END IF;
    
    -- Link shared documents if provided
    IF p_shared_document_ids IS NOT NULL THEN
        INSERT INTO appointment_documents (appointment_id, document_id)
        SELECT v_appointment_id, unnest(p_shared_document_ids);
    END IF;
    
    RETURN QUERY
    SELECT 
        v_appointment_id              AS appointment_id,
    v_predicted_time              AS predicted_time,
    p_start_time                  AS slot_window_start,
    p_end_time                    AS slot_window_end,
    p_appointment_date            AS appointment_date,
    'pending'::TEXT               AS status,
    p_reason                      AS reason;
END;
$$ LANGUAGE plpgsql;



---------------------------------




-- Function to get all doctors with advanced filtering and search
CREATE OR REPLACE FUNCTION get_doctors_with_filters(
    p_search TEXT DEFAULT NULL,
    p_department INTEGER DEFAULT NULL,
    p_min_fee DECIMAL DEFAULT NULL,
    p_max_fee DECIMAL DEFAULT NULL,
    p_min_rating DECIMAL DEFAULT NULL,
    p_gender TEXT DEFAULT NULL,
    p_sort_by TEXT DEFAULT 'name',
    p_sort_order TEXT DEFAULT 'asc',
    p_page INTEGER DEFAULT 1,
    p_limit INTEGER DEFAULT 12
)
RETURNS TABLE(
    doctor_id INTEGER,
    first_name VARCHAR,
    last_name VARCHAR,
    gender VARCHAR,
    bio TEXT,
    consultation_fee DECIMAL,
    license_no VARCHAR,
    phone_no VARCHAR,
    address TEXT,
    avg_rating DECIMAL,
    department_name VARCHAR,
    department_id INTEGER,
    email VARCHAR,
    is_active BOOLEAN,
    total_appointments BIGINT,
    total_records BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.doctor_id,
        d.first_name,
        d.last_name,
        d.gender,
        d.bio,
        d.consultation_fee,
        d.license_no,
        d.phone_no,
        d.address,
        d.avg_rating,
        dep.department_name,
        dep.department_id,
        u.email,
        u.is_active,
        COUNT(a.appointment_id) as total_appointments,
        COUNT(*) OVER() as total_records
    FROM doctor d
    JOIN "user" u ON d.user_id = u.user_id
    JOIN department dep ON d.department_id = dep.department_id
    LEFT JOIN appointment a ON d.doctor_id = a.doctor_id
    WHERE u.is_active = true
    AND dep.department_name != 'Unassigned'
    AND (
        p_search IS NULL OR 
        LOWER(d.first_name || ' ' || d.last_name) LIKE LOWER('%' || p_search || '%')
        OR LOWER(d.first_name) LIKE LOWER('%' || p_search || '%')
        OR LOWER(d.last_name) LIKE LOWER('%' || p_search || '%')
        OR LOWER(u.email) LIKE LOWER('%' || p_search || '%')
        OR LOWER(dep.department_name) LIKE LOWER('%' || p_search || '%')
        OR LOWER(d.bio) LIKE LOWER('%' || p_search || '%')
    )
    AND (p_department IS NULL OR dep.department_id = p_department)
    AND (p_min_fee IS NULL OR d.consultation_fee >= p_min_fee)
    AND (p_max_fee IS NULL OR d.consultation_fee <= p_max_fee)
    AND (p_min_rating IS NULL OR d.avg_rating >= p_min_rating)
    AND (p_gender IS NULL OR d.gender = p_gender)
    GROUP BY d.doctor_id, d.first_name, d.last_name, d.gender, d.bio, 
             d.consultation_fee, d.license_no, d.phone_no, d.address, d.avg_rating,
             dep.department_name, dep.department_id, u.email, u.is_active
    ORDER BY
    -- NAME
      CASE 
        WHEN p_sort_by = 'name' AND p_sort_order = 'asc' 
          THEN d.first_name 
      END ASC,
      CASE 
        WHEN p_sort_by = 'name' AND p_sort_order = 'desc' 
          THEN d.first_name 
      END DESC,

      -- RATING
      CASE 
        WHEN p_sort_by = 'rating' AND p_sort_order = 'asc' 
          THEN d.avg_rating 
      END ASC,
      CASE 
        WHEN p_sort_by = 'rating' AND p_sort_order = 'desc' 
          THEN d.avg_rating 
      END DESC,

      -- FEE
      CASE 
        WHEN p_sort_by = 'fee' AND p_sort_order = 'asc' 
          THEN d.consultation_fee 
      END ASC,
      CASE 
        WHEN p_sort_by = 'fee' AND p_sort_order = 'desc' 
          THEN d.consultation_fee 
      END DESC,

      -- DEPARTMENT
      CASE 
        WHEN p_sort_by = 'department' AND p_sort_order = 'asc' 
          THEN dep.department_name 
      END ASC,
      CASE 
        WHEN p_sort_by = 'department' AND p_sort_order = 'desc' 
          THEN dep.department_name 
      END DESC,

      -- APPOINTMENTS
      CASE 
        WHEN p_sort_by = 'appointments' AND p_sort_order = 'asc' 
          THEN COUNT(a.appointment_id) 
      END ASC,
      CASE 
        WHEN p_sort_by = 'appointments' AND p_sort_order = 'desc' 
          THEN COUNT(a.appointment_id) 
      END DESC,

      -- finally, tie‐breaker
      d.doctor_id ASC
    LIMIT p_limit OFFSET ((p_page - 1) * p_limit);
END;
$$ LANGUAGE plpgsql;

-- Function to get departments with statistics
CREATE OR REPLACE FUNCTION get_departments_with_stats()
RETURNS TABLE(
    department_id INTEGER,
    department_name VARCHAR,
    description TEXT,
    doctor_count BIGINT,
    avg_department_rating DECIMAL,
    avg_consultation_fee DECIMAL,
    min_consultation_fee DECIMAL,
    max_consultation_fee DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dep.department_id,
        dep.department_name,
        dep.description,
        COUNT(d.doctor_id) as doctor_count,
        AVG(d.avg_rating) as avg_department_rating,
        AVG(d.consultation_fee) as avg_consultation_fee,
        MIN(d.consultation_fee) as min_consultation_fee,
        MAX(d.consultation_fee) as max_consultation_fee
    FROM department dep
    LEFT JOIN doctor d ON dep.department_id = d.department_id
    LEFT JOIN "user" u ON d.user_id = u.user_id AND u.is_active = true
    WHERE dep.department_name != 'Unassigned'
    GROUP BY dep.department_id, dep.department_name, dep.description
    HAVING COUNT(d.doctor_id) > 0
    ORDER BY COUNT(d.doctor_id) DESC, dep.department_name ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get doctor by ID with complete information
CREATE OR REPLACE FUNCTION get_doctor_by_id(p_doctor_id INTEGER)
RETURNS TABLE(
    doctor_id INTEGER,
    first_name VARCHAR,
    last_name VARCHAR,
    gender VARCHAR,
    bio TEXT,
    consultation_fee DECIMAL,
    license_no VARCHAR,
    phone_no VARCHAR,
    address TEXT,
    avg_rating DECIMAL,
    department_name VARCHAR,
    department_id INTEGER,
    email VARCHAR,
    is_active BOOLEAN,
    total_appointments BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.doctor_id,
        d.first_name,
        d.last_name,
        d.gender,
        d.bio,
        d.consultation_fee,
        d.license_no,
        d.phone_no,
        d.address,
        d.avg_rating,
        dep.department_name,
        dep.department_id,
        u.email,
        u.is_active,
        COUNT(a.appointment_id) as total_appointments
    FROM doctor d
    JOIN "user" u ON d.user_id = u.user_id
    JOIN department dep ON d.department_id = dep.department_id
    LEFT JOIN appointment a ON d.doctor_id = a.doctor_id
    WHERE d.doctor_id = p_doctor_id
    GROUP BY d.doctor_id, d.first_name, d.last_name, d.gender, d.bio, 
             d.consultation_fee, d.license_no, d.phone_no, d.address, d.avg_rating,
             dep.department_name, dep.department_id, u.email, u.is_active;
END;
$$ LANGUAGE plpgsql;

-- Function to get basic doctors list (for backward compatibility)
CREATE OR REPLACE FUNCTION get_all_doctors_basic()
RETURNS TABLE(
    doctor_id INTEGER,
    first_name VARCHAR,
    last_name VARCHAR,
    avg_rating DECIMAL,
    department_name VARCHAR,
    email VARCHAR,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.doctor_id,
        d.first_name,
        d.last_name,
        d.avg_rating,
        dep.department_name,
        u.email,
        u.is_active
    FROM doctor d
    JOIN "user" u ON d.user_id = u.user_id
    JOIN department dep ON d.department_id = dep.department_id
    WHERE u.is_active = true
    AND dep.department_name != 'Unassigned'
    ORDER BY d.doctor_id ASC;
END;
$$ LANGUAGE plpgsql;










-----------------------------------------------
-- server/databas/Functions_Procedure_Trigger.sql

CREATE OR REPLACE FUNCTION get_appointment_stats_by_doctor(pid INTEGER)
  RETURNS TABLE(
    pending_count               BIGINT,
    completed_count             BIGINT,
    cancelled_count             BIGINT,
    paid_count                  BIGINT,
    unpaid_count                BIGINT,
    investigation_reports_count BIGINT
  )
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE a.status = 'pending')                                   AS pending_count,
    COUNT(*) FILTER (WHERE a.status = 'completed')                                 AS completed_count,
    COUNT(*) FILTER (WHERE a.status = 'cancelled')                                 AS cancelled_count,
    COUNT(*) FILTER (WHERE COALESCE(pay.payment_status,'unpaid') = 'paid')         AS paid_count,
    COUNT(*) FILTER (WHERE COALESCE(pay.payment_status,'unpaid') <> 'paid')        AS unpaid_count,
    (
      SELECT COUNT(DISTINCT a2.appointment_id)
      FROM appointment a2
      JOIN prescription p2
        ON p2.appointment_id = a2.appointment_id
      JOIN investigation_report ir
        ON ir.prescription_id = p2.prescription_id
      WHERE a2.doctor_id = pid
        AND a2.status = 'completed'
    )                                                                              AS investigation_reports_count
  FROM appointment a
  LEFT JOIN payments pay
    ON pay.appointment_id = a.appointment_id
  WHERE a.doctor_id = pid;
END;
$$ LANGUAGE plpgsql;
-----------------------------------------------------------

--STATISTICS--
-- Function to get patients list for a specific doctor with appointment statistics
-- Drop the existing function first
DROP FUNCTION IF EXISTS get_doctor_patients_with_stats(integer,text,text,date,date,text,text,integer,integer);

-- Create the corrected function
CREATE OR REPLACE FUNCTION get_doctor_patients_with_stats(
    p_doctor_id INTEGER,
    p_search TEXT DEFAULT NULL,
    p_gender TEXT DEFAULT NULL,
    p_from_date DATE DEFAULT NULL,
    p_to_date DATE DEFAULT NULL,
    p_sort_by TEXT DEFAULT 'last_appointment',
    p_sort_order TEXT DEFAULT 'desc',
    p_page INTEGER DEFAULT 1,
    p_limit INTEGER DEFAULT 12
)
RETURNS TABLE(
    patient_id INTEGER,
    first_name VARCHAR,
    last_name VARCHAR,
    gender VARCHAR,
    date_of_birth DATE,
    phone_no VARCHAR,
    address TEXT,
    email VARCHAR,
    blood_group VARCHAR,
    health_condition TEXT,
    total_appointments BIGINT,
    completed_appointments BIGINT,
    cancelled_appointments BIGINT,
    pending_appointments BIGINT,
    last_appointment_date DATE,
    last_appointment_time TIME,
    last_appointment_status VARCHAR,
    first_appointment_date DATE,
    patient_created_at TIMESTAMP,
    patient_updated_at TIMESTAMP,
    age INTEGER,
    total_records BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.patient_id,
        p.first_name,
        p.last_name,
        p.gender,
        p.date_of_birth,
        p.phone_no,
        p.address,
        u.email,
        p.blood_group,
        p.health_condition,
        COUNT(a.appointment_id) as total_appointments,
        COUNT(a.appointment_id) FILTER (WHERE a.status = 'completed') as completed_appointments,
        COUNT(a.appointment_id) FILTER (WHERE a.status = 'cancelled') as cancelled_appointments,
        COUNT(a.appointment_id) FILTER (WHERE a.status = 'pending') as pending_appointments,
        MAX(a.appointment_date) as last_appointment_date,
        -- Fixed: Fully qualify column references in subqueries
        (SELECT a2.appointment_time FROM appointment a2
         WHERE a2.patient_id = p.patient_id AND a2.doctor_id = p_doctor_id 
         ORDER BY a2.appointment_date DESC, a2.appointment_time DESC LIMIT 1) as last_appointment_time,
        (SELECT a3.status FROM appointment a3
         WHERE a3.patient_id = p.patient_id AND a3.doctor_id = p_doctor_id 
         ORDER BY a3.appointment_date DESC, a3.appointment_time DESC LIMIT 1) as last_appointment_status,
        MIN(a.appointment_date) as first_appointment_date,
        p.created_at as patient_created_at,
        p.updated_at as patient_updated_at,
        CASE 
            WHEN p.date_of_birth IS NOT NULL THEN 
                EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.date_of_birth))::INTEGER
            ELSE NULL
        END as age,
        COUNT(*) OVER() as total_records
    FROM patient p
    JOIN "user" u ON p.user_id = u.user_id
    JOIN appointment a ON p.patient_id = a.patient_id
    WHERE a.doctor_id = p_doctor_id
    AND u.is_active = true
    AND (
        p_search IS NULL OR 
        LOWER(p.first_name || ' ' || p.last_name) LIKE LOWER('%' || p_search || '%') OR
        LOWER(p.first_name) LIKE LOWER('%' || p_search || '%') OR
        LOWER(p.last_name) LIKE LOWER('%' || p_search || '%') OR
        LOWER(u.email) LIKE LOWER('%' || p_search || '%') OR
        LOWER(p.phone_no) LIKE LOWER('%' || p_search || '%')
    )
    AND (p_gender IS NULL OR p.gender = p_gender)
    AND (p_from_date IS NULL OR MAX(a.appointment_date) >= p_from_date)
    AND (p_to_date IS NULL OR MIN(a.appointment_date) <= p_to_date)
    GROUP BY p.patient_id, p.first_name, p.last_name, p.gender, p.date_of_birth, 
             p.phone_no, p.address, u.email, p.blood_group, p.health_condition,
             p.created_at, p.updated_at
    ORDER BY
        CASE 
            WHEN p_sort_by = 'last_appointment' AND p_sort_order = 'desc' THEN 
                COALESCE(MAX(a.appointment_date), p.created_at::date)
            WHEN p_sort_by = 'last_appointment' AND p_sort_order = 'asc' THEN 
                COALESCE(MAX(a.appointment_date), p.created_at::date)
        END DESC,
        CASE 
            WHEN p_sort_by = 'last_appointment' AND p_sort_order = 'asc' THEN 
                COALESCE(MAX(a.appointment_date), p.created_at::date)
        END ASC,
        CASE 
            WHEN p_sort_by = 'name' AND p_sort_order = 'asc' THEN p.first_name
            WHEN p_sort_by = 'name' AND p_sort_order = 'desc' THEN p.first_name
        END ASC,
        CASE 
            WHEN p_sort_by = 'name' AND p_sort_order = 'desc' THEN p.first_name
        END DESC,
        CASE 
            WHEN p_sort_by = 'total_appointments' AND p_sort_order = 'asc' THEN COUNT(a.appointment_id)
            WHEN p_sort_by = 'total_appointments' AND p_sort_order = 'desc' THEN COUNT(a.appointment_id)
        END ASC,
        CASE 
            WHEN p_sort_by = 'total_appointments' AND p_sort_order = 'desc' THEN COUNT(a.appointment_id)
        END DESC,
        p.patient_id ASC
    LIMIT p_limit OFFSET ((p_page - 1) * p_limit);
END;
$$ LANGUAGE plpgsql;


-- Function to get daily appointment counts for analytics (last 7 days)
CREATE OR REPLACE FUNCTION get_doctor_daily_appointment_analytics(
    p_doctor_id INTEGER,
    p_days INTEGER DEFAULT 7
)
RETURNS TABLE(
    appointment_date DATE,
    appointment_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH date_series AS (
        SELECT generate_series(
            CURRENT_DATE - INTERVAL '1 day' * (p_days - 1),
            CURRENT_DATE,
            '1 day'::interval
        )::date AS series_date
    )
    SELECT 
        ds.series_date as appointment_date,
        COALESCE(COUNT(a.appointment_id), 0) as appointment_count
    FROM date_series ds
    LEFT JOIN appointment a ON a.appointment_date = ds.series_date 
                            AND a.doctor_id = p_doctor_id
    GROUP BY ds.series_date
    ORDER BY ds.series_date;
END;
$$ LANGUAGE plpgsql;

-- Function to get monthly appointment counts for analytics (last 12 months)
CREATE OR REPLACE FUNCTION get_doctor_monthly_appointment_analytics(
    p_doctor_id INTEGER,
    p_months INTEGER DEFAULT 12
)
RETURNS TABLE(
    appointment_month DATE,
    appointment_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH month_series AS (
        SELECT generate_series(
            date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' * (p_months - 1),
            date_trunc('month', CURRENT_DATE),
            '1 month'::interval
        )::date AS series_month
    )
    SELECT 
        ms.series_month as appointment_month,
        COALESCE(COUNT(a.appointment_id), 0) as appointment_count
    FROM month_series ms
    LEFT JOIN appointment a ON date_trunc('month', a.appointment_date) = ms.series_month 
                            AND a.doctor_id = p_doctor_id
    GROUP BY ms.series_month
    ORDER BY ms.series_month;
END;
$$ LANGUAGE plpgsql;



-----------------------------------------------------------
-- Function to check if patient has pending appointment with specific doctor
CREATE OR REPLACE FUNCTION check_existing_appointment(
    p_patient_id INTEGER,
    p_doctor_id INTEGER
)
RETURNS TABLE(
    has_pending BOOLEAN,
    appointment_id INTEGER,
    appointment_date DATE,
    appointment_time TIME,
    reason TEXT,
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END as has_pending,
        MAX(a.appointment_id) as appointment_id,
        MAX(a.appointment_date) as appointment_date,
        MAX(a.appointment_time) as appointment_time,
        MAX(a.reason) as reason,
        MAX(a.created_at) as created_at
    FROM appointment a
    WHERE a.patient_id = p_patient_id 
    AND a.doctor_id = p_doctor_id 
    AND a.status = 'pending'
    GROUP BY a.patient_id, a.doctor_id;
    
    -- If no pending appointment found, return false with nulls
    IF NOT FOUND THEN
        RETURN QUERY
        SELECT FALSE as has_pending, NULL::INTEGER, NULL::DATE, NULL::TIME, NULL::TEXT, NULL::TIMESTAMP;
    END IF;
END;
$$ LANGUAGE plpgsql;
------------------------------------------------------------

--------------------------------------------------------------


---------------------------------------------------------------------------------------------

---------------------------------------------------------------------------------------------
------
CREATE OR REPLACE FUNCTION get_doctor_static_revenue_stats(
    p_doctor_id INTEGER
)
RETURNS TABLE (
    today DECIMAL(10,2),
    this_week DECIMAL(10,2),
    this_month DECIMAL(10,2),
    this_year DECIMAL(10,2),
    total DECIMAL(10,2) -- Added a total column for lifetime earnings
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- This function now correctly calculates each period's sum independently
    -- from the full set of the doctor's payments.
    RETURN QUERY
    SELECT 
        -- Today's Revenue
        COALESCE(SUM(pay.amount) FILTER (WHERE DATE(pay.paid_time) = CURRENT_DATE), 0),
        -- This Week's Revenue (last 7 days)
        COALESCE(SUM(pay.amount) FILTER (WHERE pay.paid_time >= CURRENT_DATE - INTERVAL '6 days' AND pay.paid_time < CURRENT_DATE + INTERVAL '1 day'), 0),
        -- This Month's Revenue
        COALESCE(SUM(pay.amount) FILTER (WHERE DATE_TRUNC('month', pay.paid_time) = DATE_TRUNC('month', CURRENT_DATE)), 0),
        -- This Year's Revenue
        COALESCE(SUM(pay.amount) FILTER (WHERE DATE_TRUNC('year', pay.paid_time) = DATE_TRUNC('year', CURRENT_DATE)), 0),
        -- Total Lifetime Revenue
        COALESCE(SUM(pay.amount), 0)
    FROM appointment a
    JOIN payments pay ON a.appointment_id = pay.appointment_id
    WHERE a.doctor_id = p_doctor_id 
    AND a.status = 'completed'
    AND pay.payment_status = 'paid';
END;
$$;


--------------------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS get_doctor_ranged_based_revenue(INTEGER, VARCHAR(20), DATE, DATE);

--------------------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS get_doctor_ranged_based_revenue(INTEGER, VARCHAR(20), DATE, DATE);
CREATE OR REPLACE FUNCTION get_doctor_range_based_revenue(
    p_doctor_id   INTEGER,
    p_range       VARCHAR(20) DEFAULT 'month',
    p_start_date  DATE        DEFAULT NULL,
    p_end_date    DATE        DEFAULT NULL
)
RETURNS TABLE (
    period        TEXT,
    revenue       DECIMAL(10,2),
    total_revenue DECIMAL(10,2)
)
LANGUAGE plpgsql
AS $$
DECLARE
    total_sum DECIMAL(10,2);
BEGIN
    CREATE TEMP TABLE IF NOT EXISTS temp_chart_data (
      sort_key DATE,
      period   TEXT,
      revenue  DECIMAL(10,2)
    ) ON COMMIT PRESERVE ROWS;
    DELETE FROM temp_chart_data;

    -- --- LOGIC FOR EACH DATE RANGE (WITH THE FINAL FIX) ---

    -- TODAY'S VIEW (group by hour)
    IF p_range = 'today' THEN
        INSERT INTO temp_chart_data
        SELECT
          (CURRENT_DATE + (EXTRACT(HOUR FROM pay.paid_time) * INTERVAL '1 hour'))::DATE AS sort_key,
          -- FIX IS HERE: We build the label from the grouped value, not the raw column
          LPAD(EXTRACT(HOUR FROM pay.paid_time)::TEXT, 2, '0') || ':00' AS period,
          COALESCE(SUM(pay.amount), 0) AS revenue
        FROM appointment a
        JOIN payments pay ON a.appointment_id = pay.appointment_id
        WHERE a.doctor_id = p_doctor_id
          AND DATE(pay.paid_time) = CURRENT_DATE
          AND pay.payment_status = 'paid' AND a.status = 'completed'
        GROUP BY EXTRACT(HOUR FROM pay.paid_time);

    -- WEEKLY VIEW (group by day)
    ELSIF p_range = 'week' THEN
        INSERT INTO temp_chart_data
        SELECT
          DATE(pay.paid_time) AS sort_key,
          TO_CHAR(DATE(pay.paid_time), 'Dy, Mon DD') AS period,
          COALESCE(SUM(pay.amount), 0) AS revenue
        FROM appointment a
        JOIN payments pay ON a.appointment_id = pay.appointment_id
        WHERE a.doctor_id = p_doctor_id
          AND pay.paid_time >= (CURRENT_DATE - INTERVAL '6 days') AND pay.paid_time < (CURRENT_DATE + INTERVAL '1 day')
          AND pay.payment_status = 'paid' AND a.status = 'completed'
        GROUP BY DATE(pay.paid_time);

    -- MONTHLY VIEW (group by day)
    ELSIF p_range = 'month' THEN
        INSERT INTO temp_chart_data
        SELECT
          DATE(pay.paid_time) AS sort_key,
          TO_CHAR(DATE(pay.paid_time), 'DD-Mon') AS period,
          COALESCE(SUM(pay.amount), 0) AS revenue
        FROM appointment a
        JOIN payments pay ON a.appointment_id = pay.appointment_id
        WHERE a.doctor_id = p_doctor_id
          AND DATE_TRUNC('month', pay.paid_time) = DATE_TRUNC('month', CURRENT_DATE)
          AND pay.payment_status = 'paid' AND a.status = 'completed'
        GROUP BY DATE(pay.paid_time);

    -- YEARLY VIEW (group by month)
    ELSIF p_range = 'year' THEN
        INSERT INTO temp_chart_data
        SELECT
          DATE_TRUNC('month', pay.paid_time)::DATE AS sort_key,
          TO_CHAR(DATE_TRUNC('month', pay.paid_time), 'Mon') AS period,
          COALESCE(SUM(pay.amount), 0) AS revenue
        FROM appointment a
        JOIN payments pay ON a.appointment_id = pay.appointment_id
        WHERE a.doctor_id = p_doctor_id
          AND DATE_TRUNC('year', pay.paid_time) = DATE_TRUNC('year', CURRENT_DATE)
          AND pay.payment_status = 'paid' AND a.status = 'completed'
        GROUP BY DATE_TRUNC('month', pay.paid_time);
        
    -- LAST 5 YEARS VIEW (group by year)
    ELSIF p_range = 'last_5_years' THEN
        INSERT INTO temp_chart_data
        SELECT
          DATE_TRUNC('year', pay.paid_time)::DATE AS sort_key,
          TO_CHAR(DATE_TRUNC('year', pay.paid_time), 'YYYY') AS period,
          COALESCE(SUM(pay.amount), 0) AS revenue
        FROM appointment a
        JOIN payments pay ON a.appointment_id = pay.appointment_id
        WHERE a.doctor_id = p_doctor_id
          AND pay.paid_time >= DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '4 years'
          AND pay.payment_status = 'paid' AND a.status = 'completed'
        GROUP BY DATE_TRUNC('year', pay.paid_time);
    
    -- CUSTOM RANGE VIEW (group by day)
    ELSIF p_range = 'custom' AND p_start_date IS NOT NULL AND p_end_date IS NOT NULL THEN
        INSERT INTO temp_chart_data
        SELECT
          DATE(pay.paid_time) AS sort_key,
          TO_CHAR(DATE(pay.paid_time), 'YYYY-MM-DD') AS period,
          COALESCE(SUM(pay.amount), 0) AS revenue
        FROM appointment a
        JOIN payments pay ON a.appointment_id = pay.appointment_id
        WHERE a.doctor_id = p_doctor_id
          AND DATE(pay.paid_time) BETWEEN p_start_date AND p_end_date
          AND pay.payment_status = 'paid' AND a.status = 'completed'
        GROUP BY DATE(pay.paid_time);
    END IF;

    -- Compute the total
    SELECT COALESCE(SUM(t.revenue), 0)
      INTO total_sum
      FROM temp_chart_data AS t;

    -- Return the final data, correctly sorted
    RETURN QUERY
      SELECT t.period, t.revenue, total_sum AS total_revenue
      FROM temp_chart_data AS t
      ORDER BY t.sort_key;

EXCEPTION
    WHEN OTHERS THEN
      DROP TABLE IF EXISTS temp_chart_data;
      RAISE;
END;
$$;
