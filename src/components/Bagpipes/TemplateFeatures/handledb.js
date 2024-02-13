import axios from 'axios';

const BASE_URL =  'https://api.bagpipes.io';//'http://127.0.0.1:8080';//'https://api.xcmsend.com'; // set API instance's URL

const saveUrl = async (longUrl) => {
  try {
    const response = await axios.post(`${BASE_URL}/saveUrl`, { url: longUrl });
    const shortUrl = response.data;
    console.log(`saveUrl:`, shortUrl.shortUrl);
    return shortUrl;
  } catch (error) {
    console.error('Error saving URL:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error to let the caller handle it
  }
};

const getUrl = async (shortUrl) => {
  try {
    const response = await axios.get(`${BASE_URL}/getUrl/${shortUrl}`);
    console.log(`got response data:`, response);
    const longUrl = response.data.longUrl;
    console.log(`geturl longurl: `,longUrl);
    return longUrl;
  } catch (error) {
    console.error('Error getting URL:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error to let the caller handle it
  }
};

export { saveUrl, getUrl };
