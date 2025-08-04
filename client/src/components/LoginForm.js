// import React, { useState } from 'react';
// import axios from 'axios';

// function LoginForm({ onLogin }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/login', {
//         email,
//         password
//       });
//       onLogin(res.data.token);
//     } catch (err) {
//       setError('Invalid credentials or server error');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-400">
//       <div className="bg-white shadow-xl rounded-2xl px-12 py-10 w-full max-w-md">
//         <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">PulsePoint Login</h2>
//         {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-gray-700 font-medium mb-1">Email</label>
//             <input
//               type="email"
//               className="w-full border border-gray-300 rounded-lg p-2 focus:outline-blue-400"
//               value={email}
//               onChange={e => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               required
//               autoFocus
//             />
//           </div>
//           <div>
//             <label className="block text-gray-700 font-medium mb-1">Password</label>
//             <input
//               type="password"
//               className="w-full border border-gray-300 rounded-lg p-2 focus:outline-blue-400"
//               value={password}
//               onChange={e => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
//           >
//             Log In
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default LoginForm;
