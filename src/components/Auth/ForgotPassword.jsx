import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import '../../index.css'

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [emailError, setEmailError] = useState(null);
    const [loading, setLoadingLocal] = useState(false);

    
    const handleForgotPassword = async (e) => {
      e.preventDefault();
      setLoadingLocal(true);

      setEmailError(null);

       setMessage('Loading...');
      try {
        // Attempt password reset with the provided email
        const response = await AuthService.forgotPassword({email});
  
        // TODO: Handle successful password reset request here, like redirecting to a different page or displaying a success message
        console.log('Password reset request sent!', response);
        // If the response contains a message, display it
      if (response.message) {
        setMessage(response.message);
        }
      } catch (error) {
        // Handle errors from the password reset request
        if (error.message.includes('Email')) {
          setEmailError(error.message);
        }
      }
    };
  
    return (
      <div className="container mx-auto main-font">
        <div className="max-w-md mx-auto my-10 bg-white p-5 rounded-md shadow-sm">
          <div className="text-center">
            <h1 className="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">Reset Password</h1>
            <p className="text-gray-600 dark:text-gray-400">Please enter the email address associated with your account. We will email you a password reset link.</p>
          </div>
          <div className="m-7">
          {/* {loading ? (
            <p>Loading...</p>
        ) : ( */}
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                       id="email" 
                       type="email" 
                       value={email} 
                       onChange={(e) => setEmail(e.target.value)} 
                       placeholder="Email" />
                  {emailError && <p className="text-red-500 text-xs mt-3 italic">{emailError}</p>}
                  {message && <p className="text-black-500 text-xs mt-3 italic">{message}</p>}

              </div>
              <div className="flex items-center justify-between">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                  Send Reset Email
                </button>
                <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" to="/login">
                  Back to Login
                </Link>
              </div>
            </form>
        {/* )} */}
          </div>
        </div>
      </div>
    );
  }
  
  export default ForgotPassword;
  