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
    -- join each appointment to the slot it falls into
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

  -- window’s total capacity in hours × rate:
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
-- Enhanced appointment creation function that returns predicted time
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
        CASE 
            WHEN p_sort_by = 'name' AND p_sort_order = 'asc' THEN d.first_name
            WHEN p_sort_by = 'name' AND p_sort_order = 'desc' THEN d.first_name
        END ASC,
        CASE 
            WHEN p_sort_by = 'name' AND p_sort_order = 'desc' THEN d.first_name
        END DESC,
        CASE 
            WHEN p_sort_by = 'rating' AND p_sort_order = 'asc' THEN d.avg_rating
            WHEN p_sort_by = 'rating' AND p_sort_order = 'desc' THEN d.avg_rating
        END ASC,
        CASE 
            WHEN p_sort_by = 'rating' AND p_sort_order = 'desc' THEN d.avg_rating
        END DESC,
        CASE 
            WHEN p_sort_by = 'fee' AND p_sort_order = 'asc' THEN d.consultation_fee
            WHEN p_sort_by = 'fee' AND p_sort_order = 'desc' THEN d.consultation_fee
        END ASC,
        CASE 
            WHEN p_sort_by = 'fee' AND p_sort_order = 'desc' THEN d.consultation_fee
        END DESC,
        CASE 
            WHEN p_sort_by = 'department' AND p_sort_order = 'asc' THEN dep.department_name
            WHEN p_sort_by = 'department' AND p_sort_order = 'desc' THEN dep.department_name
        END ASC,
        CASE 
            WHEN p_sort_by = 'department' AND p_sort_order = 'desc' THEN dep.department_name
        END DESC,
        CASE 
            WHEN p_sort_by = 'appointments' AND p_sort_order = 'asc' THEN COUNT(a.appointment_id)
            WHEN p_sort_by = 'appointments' AND p_sort_order = 'desc' THEN COUNT(a.appointment_id)
        END ASC,
        CASE 
            WHEN p_sort_by = 'appointments' AND p_sort_order = 'desc' THEN COUNT(a.appointment_id)
        END DESC,
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
