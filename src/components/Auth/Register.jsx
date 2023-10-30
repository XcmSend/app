import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../services/AuthService";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);  


  const handleRegister = async (e) => {
    e.preventDefault();

    setPasswordError(null);
    setEmailError(null);

    if (!email.trim()) {
      setError('Email cannot be empty.');
      return;
    }
    
    if (!password.trim()) {
      setError('Password cannot be empty.');
      return;
    }
    
    // Simple validation - password and confirmPassword should be the same
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setError(null);
      const response = await AuthService.register({email, password});
      console.log('Registration successful!', response);
      setIsRegistered(true); 

    } catch (err) {
      let errorMessage;
      if (err.response && err.response.data) {
        errorMessage = err.response.data;
      } else {
        errorMessage = 'An error occurred';
      }
    
      if (errorMessage.includes('email')) {
        setEmailError(errorMessage);
      } else if (errorMessage.includes('password')) {
        setPasswordError(errorMessage);
      } else {
        setError(errorMessage);
      }
      console.error(err);
    }
    
  
}

return (
  <div className="flex items-center justify-center h-screen main-font bg-gray-50">
      {!isRegistered ? (  
          <div className="w-full max-w-md bg-white p-8 m-4 rounded shadow-md">
              <div className="mb-4">
                  <h3 className="font-bold text-2xl">Register for an account</h3>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
              <form onSubmit={handleRegister}>
                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                      <input
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      {emailError && <p className="text-red-500 text-xs mt-3 italic">{emailError}</p>}
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                      <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                  </div>
                  <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                      <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      {passwordError && <p className="text-red-500 text-xs italic">{passwordError}</p>}
                  </div>
                  <div className="flex items-center justify-between">
                      <button className="px-4 py-2 rounded text-white inline-block shadow-lg bg-blue-500 hover:bg-blue-600 focus:bg-blue-700" type="submit">Register</button>
                      <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" to="/login">
                          Already have an account?
                      </Link>
                  </div>
              </form>
          </div>
      ) : (
          <div className="main-font w-full max-w-md bg-white p-8 m-4 rounded shadow-md">
              <h3 className="main-font font-bold text-2xl">You're almost there!</h3>
              <p>Please check your email to verify your account.</p>
          </div>
      )}
  </div>
);

}

export default Register;
