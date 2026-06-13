import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputField = ({
  type,
  placeholder,
  value,
  onChange,
  icon: Icon,
  showPasswordToggle = false,
  required = true
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = showPasswordToggle
    ? (showPassword ? 'text' : 'password')
    : type;

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type={inputType}
        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      {showPasswordToggle && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          )}
        </button>
      )}
    </div>
  );
};

export default InputField;
