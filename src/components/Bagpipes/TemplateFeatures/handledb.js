import axios from 'axios';
import config from '../../../config';  

const saveUrl = async (longUrl) => {
  try {
    const response = await axios.post(`${config.baseUrl}/api/template/saveUrl`, { url: longUrl });
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
    const response = await axios.get(`${config.baseUrl}/api/template/getUrl/${shortUrl}`);
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
