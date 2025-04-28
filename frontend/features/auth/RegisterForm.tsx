import axios from 'axios';
import router from 'next/router';
import React, { useState } from 'react';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post('http://localhost:4000/api/auth/register', { email, password });
      alert('Registration successful! Please log in.');
      router.push('/auth/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto p-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <button 
        type="submit" 
        className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Register
      </button>

      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Already have an account? 
          <span 
            onClick={() => router.push('/auth/login')} 
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Log in here
          </span>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
