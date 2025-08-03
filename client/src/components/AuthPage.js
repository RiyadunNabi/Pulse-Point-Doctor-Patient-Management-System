import React, { useState } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { Mail, Lock, User, Heart, Activity, ChevronLeft } from 'lucide-react';
import InputField from './InputField';
import PulsePointLogo from './WelcomePage/PulsePointLogo';
import { useNavigate } from 'react-router-dom';

const roles = ['patient', 'doctor'];

// const PulsePointLogo = ({ className = "w-12 h-12" }) => (
//   <div className={`${className} flex items-center justify-center`}>
//     <svg viewBox="0 0 100 100" className="w-full h-full">
//       <defs>
//         <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//           <stop offset="0%" stopColor="#0ea5e9" />
//           <stop offset="100%" stopColor="#0284c7" />
//         </linearGradient>
//       </defs>
//       <circle cx="50" cy="50" r="45" fill="url(#pulseGradient)" />
//       <path
//         d="M25 50 L35 50 L40 35 L45 65 L50 40 L55 60 L60 45 L65 50 L75 50"
//         stroke="white"
//         strokeWidth="3"
//         fill="none"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <circle cx="50" cy="50" r="4" fill="white" />
//     </svg>
//   </div>
// );

function AuthPage({ onLogin }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState('patient');
  const [view, setView] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const animationClass = "transition-all duration-500 ease-in-out";

  // Login Handler
  // In your AuthPage.js, update the handleLogin function:

async function handleLogin(e) {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: loginEmail,
      password: loginPassword
    });

    if (res.data.user.role !== mode) {
      setError(`This is a ${res.data.user.role} account. Please use the correct login mode.`);
      setLoading(false);
      return;
    }

    onLogin(res.data.token, res.data.user);
    
    // The redirect will happen automatically via the routing logic in App.js
    
  } catch (err) {
    setError('Invalid credentials. Please check your email and password.');
  }
  setLoading(false);
}


  // Register Handler
  async function handleRegister(e) {
    e.preventDefault();
    setError('');

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (regPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/users', {
        username: regName,
        email: regEmail,
        password: regPassword,
        role: mode
      });

      setLoginEmail(regEmail);
      setLoginPassword(regPassword);
      setView('login');
      setError('Registration successful! Please log in to continue.');
    } catch (err) {
      setError('Registration failed. This email may already be in use.');
    }
    setLoading(false);
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 via-blue-300 to-cyan-300 p-8 relative overflow-hidden">
  {/* Background shapes: visually interesting but not blocking gradient */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl"></div>
    <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-sky-400/20 to-blue-300/20 rounded-full blur-3xl"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-cyan-300/20 to-sky-300/20 rounded-full blur-3xl"></div>
  </div>

      {/* Main Container - Landscape Layout */}
      <div className="w-full max-w-6xl bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-white/50 relative z-10">
        <div className="flex min-h-[600px]">
          
          {/* Left Side - Logo & Branding */}
          <div className="flex-1 bg-gradient-to-br from-sky-500 via-blue-600 to-cyan-600 p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
              <div className="absolute bottom-20 right-10 w-24 h-24 border border-white/20 rounded-full"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-white/20 rounded-full"></div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-8">
                <PulsePointLogo className="w-28 h-28" />
              </div>
              <h1 className="text-5xl font-bold mb-4">PulsePoint</h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Advanced Doctor-Patient<br />Appointment Management System
              </p>
              <div className="space-y-3 text-blue-100">
                <div className="flex items-center justify-center space-x-3">
                  <Heart className="w-5 h-5" />
                  <span>Comprehensive Patient Care</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Activity className="w-5 h-5" />
                  <span>Professional Healthcare Management</span>
                </div>
              </div>

              {/* Back to Welcome button, placed right after the four branding lines */}
              <button
                type="button"
                onClick={() => navigate('/welcome')}
                className="text-white hover:text-cyan-200 font-medium mt-20 flex items-center justify-center relative left-10 "
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to WelcomePage
              </button>

            </div>
          </div>

          {/* Right Side - Authentication Forms */}
          <div className="flex-1 p-12 flex flex-col justify-center bg-gradient-to-br from-white/95 to-blue-50/30">
            
            {/* Role Selection */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                Welcome to Healthcare Portal
              </h2>
              <div className="flex space-x-2 bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-inner border border-blue-100">
                {roles.map(r => (
                  <button
                    key={r}
                    onClick={() => setMode(r)}
                    className={clsx(
                      "flex-1 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 transform",
                      mode === r
                        ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg scale-105 border border-sky-300"
                        : "text-slate-600 hover:text-slate-800 hover:bg-white/70 hover:scale-102 hover:shadow-md"
                    )}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {r === 'patient' ? <Heart className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                      <span>{r.charAt(0).toUpperCase() + r.slice(1)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200/50 mb-8 bg-white/50 rounded-t-lg">
              <button
                className={clsx(
                  "flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 relative rounded-t-lg",
                  view === 'login'
                    ? "text-sky-600 border-b-2 border-sky-600 bg-white/80"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
                )}
                onClick={() => setView('login')}
              >
                Sign In
                {view === 'login' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-500 to-blue-600 transform scale-x-100 transition-transform duration-300"></div>
                )}
              </button>
              <button
                className={clsx(
                  "flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 relative rounded-t-lg",
                  view === 'register'
                    ? "text-sky-600 border-b-2 border-sky-600 bg-white/80"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
                )}
                onClick={() => setView('register')}
              >
                Sign Up
                {view === 'register' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-500 to-blue-600 transform scale-x-100 transition-transform duration-300"></div>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-lg animate-pulse shadow-sm">
                <p className="text-red-700 text-sm text-center font-medium">{error}</p>
              </div>
            )}

            {/* Login Form */}
            {view === 'login' && (
              <form onSubmit={handleLogin} className={animationClass}>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <InputField
                      type="email"
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      icon={Mail}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Password
                    </label>
                    <InputField
                      type="password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      icon={Lock}
                      showPasswordToggle={true}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300 rounded transition-colors duration-200"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 font-medium">
                        Remember me
                      </label>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-sky-600 hover:text-sky-800 font-semibold transition-colors duration-200 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Signing in...
                      </div>
                    ) : (
                      `Sign in as ${mode}`
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Register Form */}
            {view === 'register' && (
              <form onSubmit={handleRegister} className={animationClass}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                     Username
                    </label>
                    <InputField
                      type="text"
                      placeholder="Enter your username"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      icon={User}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <InputField
                      type="email"
                      placeholder="Enter your email"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      icon={Mail}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Password
                    </label>
                    <InputField
                      type="password"
                      placeholder="Create a password"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      icon={Lock}
                      showPasswordToggle={true}
                    />
                    <p className="mt-1 text-xs text-slate-500 font-medium">
                      Must be at least 8 characters long
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Confirm Password
                    </label>
                    <InputField
                      type="password"
                      placeholder="Confirm your password"
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      icon={Lock}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      id="agree-terms"
                      name="agree-terms"
                      type="checkbox"
                      className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300 rounded transition-colors duration-200"
                      required
                    />
                    <label htmlFor="agree-terms" className="ml-2 block text-sm text-slate-700 font-medium">
                      I agree to the{' '}
                      <button type="button" className="text-sky-600 hover:text-sky-800 font-semibold transition-colors duration-200 hover:underline">
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button type="button" className="text-sky-600 hover:text-sky-800 font-semibold transition-colors duration-200 hover:underline">
                        Privacy Policy
                      </button>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Creating account...
                      </div>
                    ) : (
                      `Create ${mode} account`
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-slate-500 font-medium">
                © 2025 PulsePoint. All rights are Not Reserved -_-
              </p>
              <div className="mt-2 flex justify-center space-x-6 text-xs">
                <button className="text-slate-500 hover:text-sky-600 font-medium transition-colors duration-200">Help</button>
                <button className="text-slate-500 hover:text-sky-600 font-medium transition-colors duration-200">Contact</button>
                <button className="text-slate-500 hover:text-sky-600 font-medium transition-colors duration-200">Privacy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;