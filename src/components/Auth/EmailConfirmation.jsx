import React, { useState, useEffect} from 'react';
import { useParams, Link } from 'react-router-dom';
import AuthService from '../../services/AuthService';

function EmailConfirmation() {
  const { encodedConfirmationToken } = useParams();

  console.log('Encoded confirmation token:', encodedConfirmationToken);


  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleConfirmation = async () => {
    try {
      setError(null);
      setMessage('Confirming your account...');

      const response = await AuthService.confirmRegistration(encodedConfirmationToken);
      console.log(response);
      if (response.message && response.message.includes('verified')) {
        setMessage('Account confirmed! You can now, `${}log in.');
      } else {
        setError('An error occurred while trying to confirm the account.');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // call handleConfirmation immediately after component mounts
  useEffect(() => {
    handleConfirmation();
  }, []);

  return (
    <div className="main-font flex flex-col items-center justify-center h-screen bg-gray-100">
            {message && 
        <div className="m-4 p-2 bg-green-300 text-green-800 rounded shadow-lg">
          <p>
            Account confirmed! You can now <Link to="/login" className="underline text-blue-500">log in</Link>.
          </p>
        </div>
      }

      {error && 
        <div className="m-4 p-2 bg-red-300 text-red-800 rounded shadow-lg">
          <p>{error}</p>
        </div>
      }
    </div>
  );
}

export default EmailConfirmation;
