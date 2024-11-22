import axios from 'axios';

import config from '../config';


const API_URL = 'http://localhost:5005'; 

class AuthService {
  constructor() {
    this.csrfToken = null;
  }

  initialize(token) {
    this.csrfToken = token;
  }

  async getInitialCsrfToken() {
    try {
      console.log('getting initial csrf token')
      const response = await axios.get(config.baseUrl + '/csrf-token', { withCredentials: true });
      console.log('got initial csrf token', response.data.csrfToken)
      return response.data.csrfToken;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      return null;
    }
  }

  async getCsrfToken() {
    try {
      console.log('calling server for csrf token')
      const response = await axios.get('/csrf-token');
      return response.data.csrfToken;
    } catch (error) {
      console.error("Error fetching CSRF token: ", error);
      return null;
    }
  }

  async login(user) {
    try {
      console.log('calling server for login: ', user);
      const response = await axios
      .post(config.baseUrl + '/api/user/login', {
        email: user.email,
        password: user.password, _csrf: user.newCsrfToken
      }, { withCredentials: true })
      .catch((error) => {
        console.log('Error while logging in:', error);
      });

      if (response && response.data && response.data.user_id) {
        // store the partner_id securely
      }
      return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // Handle email not found
            throw new Error('Email not found, try again.');
          } else if (error.response && error.response.status === 401) {
            // Handle incorrect password
            throw new Error('Incorrect password.');
          } else if (error.response && error.response.status === 403) {
            // Handle blocked user due to too many failed login attempts
            throw new Error('Too many failed login attempts. An email has been sent to your registered email address.');
          } else {
            // Handle other errors
            throw new Error('An error occurred while trying to log in.');
          }
      }
  }

  async makeAuthenticatedRequest(url, method, data) {
    let attempts = 0;  // Count of retry attempts
    
    while (attempts < 2) {  // Limit number of retry attempts to avoid infinite loop
      try {
        const token = await this.getAccessToken();
        const response = await axios({
          method,
          url: config.baseUrl + url,
          data,
          withCredentials: true, 
        });
        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 403) {
          attempts++; // Increment the retry counter
  
          // Refresh token
          const refreshed = await this.refreshAccessToken();
          if (!refreshed) {
            this.logout();
            window.location.reload();
            break;  // Exit loop if refresh fails
          }
        } else {
          console.error("Could not make authenticated request:", error);
          return null;  // or throw an error or return a specific object
        }
      }
    }
  }
  
  async refreshAccessToken() {
    try {
      // Make an API call to refresh the access token
      // The browser will automatically send the refresh token as an HttpOnly cookie
      const response = await axios.post(API_URL + '/api/user/token');
  
      // Check response validity
      if (response.status === 200) {
        return true; // Indicate that the refresh was successful
      }
      return false; // Indicate that the refresh failed
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      return false; // Indicate that the refresh failed
    }
  }
  
  
  
  async isAuthenticated(navigate) { 
    try {
      const response = await axios.get(API_URL + "/api/user/is-authenticated", { withCredentials: true });
      return response.data.isAuthenticated;
    } catch (error) {
      console.log('error.response', error.response);
      if (error.response === 400 && error.response.data.error === 'Invalid Token') {
        navigate('/login');  // Use `navigate` here
      }
      console.error("An error occurred while checking authentication:", error);
      return false;  // or throw an error or return a specific object
    }
  }

  async logout() {

    try {
   const response = await axios.post(API_URL + "/api/user/logout", {_csrf: this.csrfToken }, { withCredentials: true }) // This should clear the cookie on the server
   if (response.status === 200) {
    return response.data;
    }
    throw new Error('Failed to get current user');
      } catch (error) {
        console.error('Could not fetch current user:', error);
        throw error;
      }
  }

  async register(user) {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    try {
      const response = await axios.post(API_URL + '/api/user/register', {config, _csrf: this.csrfToken}, { withCredentials: true });
      // Removed the localStorage set operation here
      return response.data;
    } catch (error) {
      console.error('Registration Error:', error.response.data);
      throw error; // Throw the error to be caught and handled in the UI component
    }
  }

  async updateSettings(email, password) {

    const newSettings = JSON.stringify({ email, password })
    try {
      const response = await axios.put(API_URL, "/api/user/settings", { newSettings, _csrf: this.csrfToken}, { withCredentials: true });

      if (!response.ok) {
        throw new Error("Failed to update settings");
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async forgotPassword(user) {
    try {
      const response = await axios
        .post(API_URL + '/api/user/forgot-password', { email: user.email, _csrf: this.csrfToken }, { withCredentials: true});

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error('No user exists with this email.');
      } else {
        throw new Error('An error occurred while trying to send the reset password email.');
      }
    }
  }
  
  async resetPassword(newPassword) {
    try {
      console.log(API_URL + '/api/user/reset-password');  
      const response = await axios.post(API_URL + '/api/user/reset-password', { newPassword, _csrf: this.csrfToken }, { withCredentials: true });

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error('Invalid reset token.');
      } else {
        throw new Error('An error occurred while trying to reset the password.');
      }
    }
  }

  

  async confirmRegistration(encodedConfirmationToken) {
    try {
      const response = await axios.post(API_URL + '/api/user/confirmation', {
        encodedConfirmationToken, 
        _csrf: this.csrfToken
      }, { withCredentials: true });
  
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error('Invalid confirmation token.');
      } else {
        throw new Error('An error occurred while trying to confirm the account.');
      }
    }
  }

  async getCurrentUser() {
    try {
      const response = await axios.get(API_URL + '/api/user/currentUser', { withCredentials: true });
      if (response.status === 200) {
        return response.data;
      }
      throw new Error('Failed to get current user');
    } catch (error) {
      console.error('Could not fetch current user:', error);
      throw error;
    }
  }


}
export default new AuthService();
