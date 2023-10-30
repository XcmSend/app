import React, { useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';
import AuthService from '../../services/AuthService';
import ScenarioService from '../../services/ScenarioService';

import { reconcileStateOnLogin } from '../../store/AsyncHelpers';
import successMessages from '../../utils/messages/successMessages';
import errorMessages from '../../utils/messages/errorMessages';
import toast, { Toaster } from 'react-hot-toast';
import '../../index.css'

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [message, setMessage] = useState('');
  const [passwordError, setPasswordError] = useState(null);

  // useEffect(() => {
    
  //   async function fetchCsrfToken() {
  //     const token = await AuthService.getInitialCsrfToken();
  //     if (token) {
  //       // Do something with the token, maybe update the Zustand store
  //       useAppStore.getState().setCsrfToken(token);
  //       console.log('CSRF token in zustand', token);
  //     }
  //   }
  //   fetchCsrfToken();
  // }, []);


  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Logging in with', email);

     // Reset error state before attempting login
     setEmailError(null);
     setPasswordError(null);
     setMessage('Loading...');


    try {
      console.log('trying login');

      // Fetch new CSRF token after successful login
      const newCsrfToken = await AuthService.getInitialCsrfToken();

      if (newCsrfToken) {


        // Do something with the token, maybe update the Zustand store
        useAppStore.getState().setCsrfToken(newCsrfToken);
        console.log('CSRF token in handle zustand', newCsrfToken);
      }

      // Attempt login with the provided email and password
      const response = await AuthService.login({ email, password, newCsrfToken });

      console.log("Initializing AuthService and ScenarioService with CSRF token:", newCsrfToken);
      AuthService.initialize(newCsrfToken);
      ScenarioService.initialize(newCsrfToken);
      console.log("Initialized AuthService and ScenarioService");

      // TODO: Handle successful login here, like redirecting to a different page
      console.log('Login successful!', response);



      // Reconcile Zustand state and local storage with server data
      // await reconcileStateOnLogin();

       // Redirect to a different page, replace '/dashboard' with your route
       console.log('About to navigate to /builder');
       if (response.message) {
        setMessage(response.message);
        }
        toast.success(successMessages.login);

       navigate('/builder');
    } catch (err) {
      
      if (err.message.includes('Email')) {
        console.log('Email error', err.message);
        setEmailError(err.message);
        toast.error(err.message);
      } else if (err.message.includes('password')) {
        setPasswordError(err.message);
        toast.error(err.message);
      } else {
        setMessage(err.message);
        toast.error(err.message, 'Check your email and password spelling, or perhaps you are not registered yet?');
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen main-font">
      <div className="w-full max-w-md">
        <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
                 

          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                   id="password" 
                   type="password" 
                   value={password} 
                   onChange={(e) => setPassword(e.target.value)} 
                   placeholder="******************" />
            {passwordError && <p className="text-red-500 text-xs italic">{passwordError}</p>}
            
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Login
            </button>
            <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" to="/register">
              Create an Account
            </Link>
            <br />
            <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" to="/forgot-password">
            Forgot Password?
            </Link>
            
          </div>
          {emailError && <p className="text-red-500 text-xs mt-3 italic">{emailError}</p>}
          {/* {message && <p className="text-black-500 text-xs mt-3 italic">{message}</p>} */}
        </form>
      </div>
    </div>
  );
}

export default Login;
