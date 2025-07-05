import React from 'react';
import { User, Mail, Phone, MapPin, Heart, FileText } from 'lucide-react';
import InputField from '../../shared/InputField';
// ✅ MOVE InputField OUTSIDE - This is the key fix!

function ProfileForm({ formData, onChange }) {
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['male', 'female', 'other'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* First Name */}
      <InputField
        icon={User}
        label="First Name"
        name="first_name"
        value={formData.first_name}
        onChange={onChange}
        required
        placeholder="Enter your first name"
      />

      {/* Last Name */}
      <InputField
        icon={User}
        label="Last Name"
        name="last_name"
        value={formData.last_name}
        onChange={onChange}
        required
        placeholder="Enter your last name"
      />

      {/* Gender */}
      <InputField
        icon={User}
        label="Gender"
        name="gender"
        value={formData.gender}
        onChange={onChange}
        required
        options={genders}
        placeholder="Select your gender"
      />

      {/* Date of Birth */}
      <InputField
        icon={User}
        label="Date of Birth"
        name="date_of_birth"
        type="date"
        value={formData.date_of_birth}
        onChange={onChange}
        required
      />

      {/* Phone Number */}
      <InputField
        icon={Phone}
        label="Phone Number"
        name="phone_no"
        type="tel"
        value={formData.phone_no}
        onChange={onChange}
        placeholder="Enter your phone number"
      />

      {/* Blood Group */}
      <InputField
        icon={Heart}
        label="Blood Group"
        name="blood_group"
        value={formData.blood_group}
        onChange={onChange}
        options={bloodGroups}
        placeholder="Select your blood group"
      />

      {/* Address - Full Width */}
      <div className="md:col-span-2">
        <InputField
          icon={MapPin}
          label="Address"
          name="address"
          value={formData.address}
          onChange={onChange}
          placeholder="Enter your full address"
        />
      </div>

      {/* Health Condition - Full Width */}
      <div className="md:col-span-2">
        <InputField
          icon={FileText}
          label="Health Condition"
          name="health_condition"
          type="textarea"
          value={formData.health_condition}
          onChange={onChange}
          placeholder="Describe any existing health conditions or allergies"
        />
      </div>
    </div>
  );
}

export default ProfileForm;
