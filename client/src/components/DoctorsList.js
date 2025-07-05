import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DoctorsList({ token }) {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/doctors', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setDoctors(res.data))
      .catch(err => setError(err.message));
  }, [token]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Doctors</h2>
      {error && <p className="text-red-600">Error: {error}</p>}
      <ul className="space-y-2">
        {doctors.map(doc => (
          <li key={doc.doctor_id} className="p-4 rounded shadow bg-white flex items-center justify-between">
            <span>
              <span className="font-bold">{doc.first_name} {doc.last_name}</span>
              <span className="text-gray-500 ml-2">({doc.department_name})</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DoctorsList;
