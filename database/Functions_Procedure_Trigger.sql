----------------------------------------------------------------------------------------------------
CREATE OR REPLACE VIEW available_appointment_slots AS
WITH RECURSIVE date_series AS (
    SELECT CURRENT_DATE::DATE as slot_date
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
        ds.id as schedule_id,
        'recurring' as source_type
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
        specific_date as slot_date,
        start_time,
        end_time,
        max_per_hour,
        location,
        id as schedule_id,
        'specific' as source_type
    FROM doctor_schedule
    WHERE schedule_type = 'specific'
        AND specific_date >= CURRENT_DATE
        AND is_active = TRUE
)
SELECT * FROM recurring_slots
UNION ALL
SELECT * FROM specific_slots
ORDER BY slot_date, start_time;

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
  patient_dob         DATE,
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
      p.date_of_birth AS patient_dob,
      p.gender       ::TEXT AS patient_gender,
      p.address      AS patient_address
    FROM appointment a
    JOIN patient p  ON a.patient_id = p.patient_id
    JOIN "user"   u ON p.user_id    = u.user_id
    WHERE a.doctor_id = doctor_id_param
      AND a.status    = status_param
    ORDER BY a.appointment_date DESC, a.appointment_time DESC;
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
