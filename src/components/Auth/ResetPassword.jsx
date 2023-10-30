import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import '../../index.css'

function ResetPassword() {
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(''); 
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);



  const { encodedResetToken } = useParams();

  // Managin the decoding of the reset token because the JWT in the browser has dots in it, which doesn't work in a URI.
  let resetToken = '';
  if (encodedResetToken) {
    console.log( 'encoded reset token', encodedResetToken);
      const safeEncodedToken = encodedResetToken.replace(/-/g, '+').replace(/_/g, '/');
      resetToken = atob(safeEncodedToken);
      console.log('decoded reset token', resetToken);
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault();

         // Reset error state before attempting login
         setEmailError(null);
         setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setMessage("Updating password...");

    try {
      // Reset error state before attempting password reset
      setError(null);

      // Attempt password reset with the provided reset token and new password
      const response = await AuthService.resetPassword(newPassword, resetToken);

      if (response.message) {
        console.log(response.message);
        setMessage("Password updated, you can now log in!")
        
} else {
        setError('An error occurred while trying to reset the password.');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // useEffect(() => {
  //   console.log(resetToken); 
  //   setToken(resetToken);
  // }, [resetToken]);

  return (
    <div className="container mx-auto main-font">
      <div className="max-w-md mx-auto my-10 bg-white p-5 rounded-md shadow-sm">
        <div className="text-center">
          <h1 className="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">Reset Password</h1>
          <p className="text-gray-600 dark:text-gray-400">Please enter your new password and confirm it.</p>
        </div>
        <div className="m-7">
          <form onSubmit={handlePasswordReset}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new-password">
                New Password
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                     id="new-password"
                     type="password"
                     value={newPassword}
                     onChange={(e) => setNewPassword(e.target.value)}
                     placeholder="******************" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
                Confirm New Password
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                     id="confirm-password"
                     type="password"
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     placeholder="******************" />
                  {error && <p className="text-red-500 text-xs mt-3 italic">{error}</p>}
                  {message && <p className="text-black-500 text-xs mt-3 italic">{message}</p>}

            </div>
            <div className="flex items-center justify-between">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Reset Password 
              </button>
              <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" to="/login">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
  
export default ResetPassword;
