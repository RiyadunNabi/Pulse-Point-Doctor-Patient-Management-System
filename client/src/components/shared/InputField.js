import React from 'react';

const InputField = ({ 
  icon: Icon, 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  required = false,
  options = null,
  placeholder = ''
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-slate-400" />
      </div>
      
      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-white text-slate-700"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          rows={3}
          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-white text-slate-700 resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-white text-slate-700"
        />
      )}
    </div>
  </div>
);

export default InputField;
