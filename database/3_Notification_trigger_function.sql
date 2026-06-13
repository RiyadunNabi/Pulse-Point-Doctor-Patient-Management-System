-- Trigger for when doctor creates/updates prescription
CREATE OR REPLACE FUNCTION notify_prescription_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO notifications (
            patient_id, 
            appointment_id, 
            prescription_id, 
            notification_type, 
            title, 
            message
        )
        SELECT 
            a.patient_id,
            NEW.appointment_id,
            NEW.prescription_id,
            'prescription',
            'New Prescription Available',
            'Your doctor has created a new prescription for your appointment on ' || a.appointment_date::text
        FROM appointment a 
        WHERE a.appointment_id = NEW.appointment_id;
        
        RETURN NEW;
    END IF;

    IF TG_OP = 'UPDATE' THEN
        INSERT INTO notifications (
            patient_id, 
            appointment_id, 
            prescription_id, 
            notification_type, 
            title, 
            message
        )
        SELECT 
            a.patient_id,
            NEW.appointment_id,
            NEW.prescription_id,
            'prescription',
            'Prescription Updated',
            'Your prescription has been updated by your doctor'
        FROM appointment a 
        WHERE a.appointment_id = NEW.appointment_id;
        
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
--------------------------------------------------------------------
CREATE TRIGGER prescription_notification_trigger
    AFTER INSERT OR UPDATE ON prescription
    FOR EACH ROW
    EXECUTE FUNCTION notify_prescription_changes();

CREATE OR REPLACE FUNCTION notify_appointment_status_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO notifications (
            patient_id, 
            appointment_id, 
            notification_type, 
            title, 
            message
        )
        VALUES (
            NEW.patient_id,
            NEW.appointment_id,
            'appointment',
            'Appointment Status Updated',
            'Your appointment status has been changed to ' || NEW.status
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
---------------------------------------------------------
CREATE TRIGGER appointment_status_notification_trigger
    AFTER UPDATE ON appointment
    FOR EACH ROW
    EXECUTE FUNCTION notify_appointment_status_changes();

CREATE OR REPLACE FUNCTION notify_investigation_report_upload()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (
        doctor_id, 
        appointment_id, 
        prescription_id, 
        notification_type, 
        title, 
        message
    )
    SELECT 
        a.doctor_id,
        a.appointment_id,
        NEW.prescription_id,
        'appointment',
        'Investigation Report Uploaded',
        'Patient has uploaded investigation report for appointment on ' || a.appointment_date::text
    FROM appointment a 
    JOIN prescription p ON p.appointment_id = a.appointment_id
    WHERE p.prescription_id = NEW.prescription_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER investigation_report_notification_trigger
    AFTER INSERT ON investigation_report
    FOR EACH ROW
    EXECUTE FUNCTION notify_investigation_report_upload();

CREATE OR REPLACE FUNCTION notify_payment_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.payment_status = 'paid')
     OR (TG_OP = 'UPDATE'
         AND OLD.payment_status <> NEW.payment_status
         AND NEW.payment_status = 'paid') THEN

    INSERT INTO notifications (
      doctor_id,
      appointment_id,
      notification_type,
      title,
      message
    )
    SELECT
      a.doctor_id,
      NEW.appointment_id,
      'appointment',
      'Payment Received',
      'Payment received for appointment on ' || a.appointment_date::text
    FROM appointment a
    WHERE a.appointment_id = NEW.appointment_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payment_notification_trigger
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION notify_payment_changes();
