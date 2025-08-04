// File: client/src/components/DoctorDashboard/EditDoctorProfileModal/DoctorProfileForm.js

import React from 'react';
import { User, Phone, MapPin, FileText, DollarSign, Award, Building, Mail, AlertCircle } from 'lucide-react';
import InputField from '../../shared/InputField';

function DoctorProfileForm({ formData, onChange, departments, doctor }) {
    const genders = ['Male', 'Female'];

    // ✅ Filter out "Unassigned" department and create options
    const departmentOptions = departments
        .filter(dept => dept.department_name !== 'Unassigned')
        .map(dept => dept.department_name);

    // Create a mapping for department names to IDs (excluding Unassigned)
    const departmentNameToId = departments
        .filter(dept => dept.department_name !== 'Unassigned')
        .reduce((acc, dept) => {
            acc[dept.department_name] = dept.department_id;
            return acc;
        }, {});

    // Handle department change to convert name back to ID
    const handleDepartmentChange = (e) => {
        const { name, value } = e.target;
        if (name === 'department_id') {
            // Convert department name back to ID
            const departmentId = departmentNameToId[value];
            onChange({
                target: {
                    name: 'department_id',
                    value: departmentId
                }
            });
        } else {
            onChange(e);
        }
    };
    // Get current department name for display (handle Unassigned case)
    const currentDepartment = departments.find(
        dept => dept.department_id === parseInt(formData.department_id)
    );

    const currentDepartmentName = currentDepartment?.department_name === 'Unassigned'
        ? ''
        : currentDepartment?.department_name || '';

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

            {/* Department - Fixed */}
            <InputField
                icon={Building}
                label="Department"
                name="department_id"
                value={currentDepartmentName}
                onChange={handleDepartmentChange}
                required
                options={departmentOptions}
                placeholder="Select your department"
            />

            {/* License Number */}
            <InputField
                icon={Award}
                label="License Number"
                name="license_no"
                value={formData.license_no}
                onChange={onChange}
                required
                placeholder="Enter your medical license number"
            />

            {/* Consultation Fee */}
            <InputField
                icon={DollarSign}
                label="Consultation Fee ($)"
                name="consultation_fee"
                type="number"
                step="0.01"
                min="0"
                value={formData.consultation_fee}
                onChange={onChange}
                placeholder="Enter consultation fee"
            />

            {/* Phone Number */}
            <InputField
                icon={Phone}
                label="Phone Number"
                name="phone_no"
                type="tel"
                value={formData.phone_no}
                onChange={onChange}
                required
                placeholder="Enter your phone number"
            />

            {/* ✅ FIXED: Read-Only Email Field with Proper Alignment
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Email Address
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="email"
                        value={doctor?.email || 'Not available'}
                        disabled
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none focus:ring-0 focus:border-gray-300 sm:text-sm"
                    />
                </div>
                <div className="flex items-center text-xs text-amber-600">
                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span>Contact authority to change email address</span>
                </div>
            </div> */}
            {/* Email Field using InputField component */}
            <div className="space-y-2">
                <InputField
                    icon={Mail}
                    label="Email Address"
                    name="email"
                    type="email"
                    value={doctor?.email || 'Not available'}
                    disabled={true}
                    placeholder="Email address"
                    className="bg-gray-50 cursor-not-allowed"
                    readOnly={true}
                />
                <div className="flex items-center text-xs text-amber-600">
                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span>Contact authority to change email address</span>
                </div>
            </div>



            {/* Address - Full Width */}
            <div className="md:col-span-2">
                <InputField
                    icon={MapPin}
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={onChange}
                    placeholder="Enter your clinic/office address"
                />
            </div>

            {/* Bio - Full Width */}
            <div className="md:col-span-2">
                <InputField
                    icon={FileText}
                    label="Professional Bio"
                    name="bio"
                    type="textarea"
                    value={formData.bio}
                    onChange={onChange}
                    placeholder="Describe your medical background, specializations, experience, and approach to patient care"
                    rows={4}
                />
            </div>
        </div>
    );
}

export default DoctorProfileForm;



// import React from 'react';
// import { User, Phone, MapPin, FileText, DollarSign, Award, Building, Stethoscope } from 'lucide-react';
// import InputField from '../../shared/InputField';

// function DoctorProfileForm({ formData, onChange, departments }) {
//   const genders = ['male', 'female', 'other'];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       {/* First Name */}
//       <InputField
//         icon={User}
//         label="First Name"
//         name="first_name"
//         value={formData.first_name}
//         onChange={onChange}
//         required
//         placeholder="Enter your first name"
//       />

//       {/* Last Name */}
//       <InputField
//         icon={User}
//         label="Last Name"
//         name="last_name"
//         value={formData.last_name}
//         onChange={onChange}
//         required
//         placeholder="Enter your last name"
//       />

//       {/* Gender */}
//       <InputField
//         icon={User}
//         label="Gender"
//         name="gender"
//         value={formData.gender}
//         onChange={onChange}
//         required
//         options={genders}
//         placeholder="Select your gender"
//       />

//       {/* Department */}
//       <InputField
//         icon={Building}
//         label="Department"
//         name="department_id"
//         value={formData.department_id}
//         onChange={onChange}
//         required
//         options={departments.map(dept => ({
//           value: dept.department_id,
//           label: dept.department_name
//         }))}
//         placeholder="Select your department"
//       />

//       {/* License Number */}
//       <InputField
//         icon={Award}
//         label="License Number"
//         name="license_no"
//         value={formData.license_no}
//         onChange={onChange}
//         required
//         placeholder="Enter your medical license number"
//       />

//       {/* Consultation Fee */}
//       <InputField
//         icon={DollarSign}
//         label="Consultation Fee ($)"
//         name="consultation_fee"
//         type="number"
//         step="0.01"
//         min="0"
//         value={formData.consultation_fee}
//         onChange={onChange}
//         placeholder="Enter consultation fee"
//       />

//       {/* Phone Number */}
//       <InputField
//         icon={Phone}
//         label="Phone Number"
//         name="phone_no"
//         type="tel"
//         value={formData.phone_no}
//         onChange={onChange}
//         required
//         placeholder="Enter your phone number"
//       />

//       {/* Address - Full Width */}
//       <div className="md:col-span-2">
//         <InputField
//           icon={MapPin}
//           label="Address"
//           name="address"
//           value={formData.address}
//           onChange={onChange}
//           placeholder="Enter your clinic/office address"
//         />
//       </div>

//       {/* Bio - Full Width */}
//       <div className="md:col-span-2">
//         <InputField
//           icon={FileText}
//           label="Professional Bio"
//           name="bio"
//           type="textarea"
//           value={formData.bio}
//           onChange={onChange}
//           placeholder="Describe your medical background, specializations, experience, and approach to patient care"
//           rows={4}
//         />
//       </div>
//     </div>
//   );
// }

// export default DoctorProfileForm;
