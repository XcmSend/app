// import axios from './AxiosService';
import useAppStore from '../store/useAppStore';
import toast from 'react-hot-toast';
import axios from 'axios';

class NodeExecutionService {
    constructor() {
        this.csrfToken = null;
    }

    initialize(token) {
        this.csrfToken = token;
    }

    async createScenario(initialData) {
        try {
            const response = await axios.post('/api/scenario/createScenario', { initialData, _csrf: this.csrfToken }, { withCredentials: true });
            if (response.status === 201) {
                const scenarioId = response.data._id; // Rename _id to scenarioId
                console.log(`[createScenario] scenario created successfully with scenarioId: ${scenarioId}`);
                return scenarioId;
            }
            return null; // Scenario not created
        } catch (error) {
            console.error("Error creating scenario:", error);
            throw error;
        }
    }

    static proxyUrl = `http://localhost:5005/api/http/executeHttpRequest`;

    async executeHttpRequest(parsedFormData) {
        console.log('executeHttpRequest Parsed form data:', parsedFormData);
        try {
            const response = await axios.post(NodeExecutionService.proxyUrl, parsedFormData);
            console.log('HTTP request successful:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error executing HTTP request through proxy:', error);
            throw error;
        }
    }
    
}

export default new NodeExecutionService();
