import axios from 'axios';

const BASE_URL = 'https://api.xcmsend.com'; // set API instance's URL

const saveUrl = async (longUrl) => {
  try {
    const response = await axios.post(`${BASE_URL}/saveUrl`, { longUrl });
    const shortUrl = response.data.shortUrl;
    console.log(`saveUrl:`, shortUrl);
    return shortUrl;
  } catch (error) {
    console.error('Error saving URL:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error to let the caller handle it
  }
};

const getUrl = async (shortUrl) => {
  try {
    const response = await axios.get(`${BASE_URL}/getUrl/${shortUrl}`);
    const longUrl = response.data;
    return longUrl;
  } catch (error) {
    console.error('Error getting URL:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error to let the caller handle it
  }
};

export { saveUrl, getUrl };