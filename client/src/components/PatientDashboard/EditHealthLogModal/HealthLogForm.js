import React from 'react';
import { Activity, Heart, Droplets, Moon, Scale, FileText } from 'lucide-react';
import InputField from '../../shared/InputField';

function HealthLogForm({ formData, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Weight */}
      <InputField
        icon={Scale}
        label="Weight (kg)"
        name="weight"
        type="number"
        step="0.1"
        value={formData.weight}
        onChange={onChange}
        placeholder="Enter your weight"
      />

      {/* Heart Rate */}
      <InputField
        icon={Heart}
        label="Heart Rate (bpm)"
        name="heart_rate"
        type="number"
        value={formData.heart_rate}
        onChange={onChange}
        placeholder="Enter heart rate"
      />

      {/* Systolic Blood Pressure */}
      <InputField
        icon={Activity}
        label="Systolic BP (mmHg)"
        name="systolic"
        type="number"
        value={formData.systolic}
        onChange={onChange}
        placeholder="Enter systolic pressure"
      />

      {/* Diastolic Blood Pressure */}
      <InputField
        icon={Activity}
        label="Diastolic BP (mmHg)"
        name="diastolic"
        type="number"
        value={formData.diastolic}
        onChange={onChange}
        placeholder="Enter diastolic pressure"
      />

      {/* Blood Sugar */}
      <InputField
        icon={Droplets}
        label="Blood Sugar (mg/dL)"
        name="blood_sugar"
        type="number"
        step="0.1"
        value={formData.blood_sugar}
        onChange={onChange}
        placeholder="Enter blood sugar level"
      />

      {/* Sleep Hours */}
      <InputField
        icon={Moon}
        label="Sleep Hours"
        name="sleep_hours"
        type="number"
        step="0.1"
        value={formData.sleep_hours}
        onChange={onChange}
        placeholder="Enter sleep hours"
      />

      {/* Notes - Full Width */}
      <div className="md:col-span-2">
        <InputField
          icon={FileText}
          label="Notes"
          name="notes"
          type="textarea"
          value={formData.notes}
          onChange={onChange}
          placeholder="Add any additional notes about your health today"
        />
      </div>
    </div>
  );
}

export default HealthLogForm;
