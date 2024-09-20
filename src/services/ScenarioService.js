

// import axios from './AxiosService';
import axios from 'axios';
import useAppStore from '../store/useAppStore';
import toast from 'react-hot-toast';
import threadbagInstance from './AxiosService'
import config from "../config";

class ScenarioService {
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
                return scenarioId; // Return the new MongoDB _id, but renamed as scenarioId
            }
            return null; // Scenario not created
        } catch (error) {
            console.error("Error creating scenario:", error);
            throw error;
        }
    }
    async saveScenarioToServer(diagramData, scenario, version) {
        try {
            const scenarioData = { diagramData, scenario, version };
            const response = await axios.post('/api/scenario/save', {scenarioData, _csrf: this.csrfToken}, { withCredentials: true });
            console.log(`[saveScenario] scenario saved successfully with scenarioId: ${scenario}`);
            return response.data;
        } catch (error) {
            console.error(`Error saving scenario ${scenario}:`, error);
            throw error;
        }
    }

    async loadScenarioFromServer(scenarioId) {
        try {
          const response = await axios.get(`/api/scenario/load/${scenarioId}`, { withCredentials: true });
          if (response.status !== 200) {
            throw new Error(`Failed to load scenario. HTTP ${response.status}`);
          }
          const jsonData = response.data;
          useAppStore.getState().loadScenario(scenarioId, jsonData);
          console.log(`Successfully loaded heavy data for scenario ${scenarioId}`);
        } catch (error) {
          if (error.name === 'CastError' || error.message.includes('not found')) {
            console.log(`[loadScenarioFromServer] Scenario ${scenarioId} not found in database. Removing from local state.`);
            useAppStore.getState().removeScenario(scenarioId);  // Assumes you have a method to remove a scenario
          } else {
            console.error(`[loadScenarioFromServer] Failed to load heavy data for scenario ${scenarioId}:`, error);
            throw error;
          }
        }
      }
      
      
    async deleteScenario(scenarioId) {
        let response;
        try {
            response = await axios.delete(`/api/scenario/${scenarioId}`, { withCredentials: true });
            console.log('deleteScenario response', response);
            
            // If the server successfully deletes the scenario or says the scenario is not found,
            // then remove it from the local state
            if (response.data && (response.data.message === 'Scenario deleted successfully' || response.data.message === 'Scenario not found')) {
                // Delete from Zustand state
                const scenario = useAppStore.getState().scenarios[scenarioId];
                const scenarioName = scenario?.name || 'Scenario' || scenarioId;
                console.log(`[deleteScenario] scenarioName`, scenarioName);
                // Delete from Zustand state
                useAppStore.getState().deleteScenario(scenarioId);

                toast.success(`${scenarioName} deleted successfully`);
            }
            
            return response.data;
            
        } catch (error) {
            console.error(`Error deleting scenario ${scenarioId}:`, error);
            
            // If the error from the server says the scenario is not found, remove it from the local state
            if (error.response && error.response.data && error.response.data.message === 'Scenario not found') {
                console.log(`[deleteScenario] scenario ${scenarioId} not found`);

                const scenario = useAppStore.getState().scenarios[scenarioId];
                const scenarioName = scenario?.name || 'Scenario' || scenarioId;
                console.log(`[deleteScenario] scenarioName`, scenarioName);
                // Delete from Zustand state
                useAppStore.getState().deleteScenario(scenarioId);

                toast.success(`${scenarioName} deleted successfully`);
                console.log(`[deleteScenario] scenario deleted successfully`);
            }
            
            throw error;
        }
    }
    
    
      
    async deleteExecution(executionId) {
        try {
            const response = await axios.delete(`/api/scenario/execution/${executionId}`, {  withCredentials: true });
            return response.data;
        } catch (error) {
            console.error(`Error deleting execution ${executionId}:`, error);
            throw error;
        }
    }

    async handleSaveScenario(scenarioData) {
        try {
            const { diagramData, scenario } = scenarioData; // destructuring for clarity

            const activeScenarioId = scenario;
            let version = useAppStore.getState().scenarios[activeScenarioId]?.version;
            console.log(`[handleSaveScenario] currentNonce`, version);
            // Initialize version nonce if it's null or undefined
            if (version == null) {
                version = 1; // Initialize at 1 if not exist
            } else {
                version += 1; // Otherwise, increment
            }

            // // Save to the database
            console.log(`[handleSaveScenario] attempting to save scenario to db ( ${activeScenarioId} ) with nonce: ${version}`);
            await this.saveScenarioToServer(diagramData, scenario, version);
            console.log(`[handleSaveScenario] scenario saved successfully with scenarioId: ${activeScenarioId}`)
    
            // On success, update Zustand store
            // useAppStore.getState().saveScenario(scenarioData, version);
    
        } catch (error) {
            console.error('Failed to save scenario:', error);
            // Optionally, you can return or throw the error to be handled upstream
        }
    }


    async runOnce(scenarioData) {
        try {
            console.log('this.csrfToken in execute', this.csrfToken)
            
            const response = await axios.post('/api/scenario/execute', {scenarioData, _csrf: this.csrfToken}, { withCredentials: true });
            if (response) {
                console.log('[runOnce]scenario succesfully executed', response)
            } else if (response.status === 500 ) {
                console.error(`[runOnce] response.status`, response.status);
                toast.error(`[runOnce] response.status`, response.status);

            }
            console.log(`[runOnce] response.data`, response.data);

            console.log(`[runOnce] about to send scenarioData to handleSaveScenario`, scenarioData);
            await this.handleSaveScenario(scenarioData); 
    
            // if (response.data.executionId) {
            //     const executionId = response.data.executionId; // Changed from _id to executionId
            //     const otherData = { ...response.data, executionId: undefined };
            //     return { executionId, ...otherData };
            // }

            return response.data;
    
        } catch (error) {
            console.error('Error during scenario execution:', error);
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
                if (error.response.status === 400) {
                    const errorMessage = error.response.data.message;
                    console.error(`[runOnce]: Error from server: ${errorMessage}`);
                    // Here you can show the message to the user
                }
            } else {
                console.error('No response object in error');
            }
        }
    }

    async runChainScenarioOnce(scenarioData) {
        try {
            console.log('this.csrfToken in execute', this.csrfToken)
            
            const response = await axios.post('/api/scenario/execute', {scenarioData, _csrf: this.csrfToken}, { withCredentials: true });
            if (response) {
                console.log('[runOnce]scenario succesfully executed', response)
            } else if (response.status === 500 ) {
                console.error(`[runOnce] response.status`, response.status);
                toast.error(`[runOnce] response.status`, response.status);

            }
            console.log(`[runOnce] response.data`, response.data);

            console.log(`[runOnce] about to send scenarioData to handleSaveScenario`, scenarioData);
            await this.handleSaveScenario(scenarioData); 
    
            // if (response.data.executionId) {
            //     const executionId = response.data.executionId; // Changed from _id to executionId
            //     const otherData = { ...response.data, executionId: undefined };
            //     return { executionId, ...otherData };
            // }

            return response.data;
    
        } catch (error) {
            console.error('Error during scenario execution:', error);
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
                if (error.response.status === 400) {
                    const errorMessage = error.response.data.message;
                    console.error(`[runOnce]: Error from server: ${errorMessage}`);
                    // Here you can show the message to the user
                }
            } else {
                console.error('No response object in error');
            }
        }
    }
    

    async startPersistScenario(scenarioId) {
        try {
            console.log('startPersistScenario', scenarioId);

            const response = await axios.post(`${config.threadbagUrl}/job/start`, {
                id: scenarioId
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });



           // const response = await threadbagInstance.post('/job/start', { id: scenarioId });
            console.log('Server response:', response.data);
            return response.data;
        } catch (error) {
            console.error(`Failed to persist scenario ${scenarioId}:`, error);
            throw error;
        }
    }

    async stopPersistScenario(scenarioId) {
        try {
            const response = await axios.post(`${config.threadbagUrl}/job/stop`, {
                id: scenarioId
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Server response:', response.data);
            return response.data;
        } catch (error) {
            console.error(`Failed to persist scenario ${scenarioId}:`, error);
            throw error;
        }
    }

    async fetchPersistedScenarioLogs(scenarioId) {
        try {
            const response = await threadbagInstance.post(
                `/scenario/worker/logs`, { id: scenarioId }, { withCredentials: true }
            );
            console.log('Server response:', response.data);
            return response.data;
        } catch (error) {
            console.error(`Failed to get logs for scenario ${scenarioId}:`, error);
            throw error;
        }
    }

    async fetchAllWorkers() {
        try {
            const response = await threadbagInstance.get('/scenario/all_workers', { withCredentials: true });
            console.log('Server response:', response.data);
            return response.data;
        } catch (error) {
            console.error(`Failed to get all workers:`, error);
            throw error;
        }
    }

    async fetchMissingData(executionId) {
        try {
            const response = await axios.get(`/api/scenario/executionData/${executionId}`, {  withCredentials: true });
            return response.data;
        } catch (error) {
            console.error(`Error fetching missing data for execution ${executionId}:`, error);
            throw error;
        }
    }

    async stopExecution(executionId) {
        try {
            const response = await axios.post('/api/scenario/stopExecution', { executionId, _csrf: this.csrfToken }, {  withCredentials: true });
            console.log(`[stopExecution] attempting to stop execution`, executionId);
            console.log(`[stopExecution] response`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error stopping execution ${executionId}:`, error);
            throw error;
        }
    }

    async getUserMetadata() {
        try {
          const response = await axios.get('/api/user/metadata', { withCredentials: true });
          console.log(`[getUserMetadata] response.data`, response.data);
          return response.data;
        } catch (error) {
          console.error('Error getting user metadata:', error);
          throw error;
        }
      }
}

export default new ScenarioService();



//     async runOnce(scenarioData) {
//         try {
//             // Execute the scenario
//             const response = await axios.post('/api/scenario/execute', scenarioData, { withCredentials: true });

//                   // Call a separate function to handle saving, or proceed with inline code
//         console.log(`[runOnce] attempting to save scenario to db ( ${scenarioData.scenario} )`);
        
//         ScenarioService.handleSaveScenario(scenarioData);
//         console.error('Failed to save scenario:', error);

//             if (response.data._id) {
//                 const executionId = response.data._id;
//                 const otherData = {...response.data, _id: undefined};
//                 return {executionId, ...otherData};
//             }

//             return response.data;

//         } catch (error) {
//             console.error('Error during scenario execution:', error);
//             // Optionally, you can return or throw the error to be handled upstream
//         }
  
//     }
    
 

//     async fetchMissingData(executionId) {
//         try {
//             const response = await axios.get(`/api/scenario/executionData/${executionId}`, {  withCredentials: true });
//             return response.data;
//         } catch (error) {
//             console.error(`Error fetching missing data for execution ${executionId}:`, error);
//             throw error;
//         }
//     }

//     async stopExecution(executionId) {
//         try {
//             const response = await axios.post('/api/scenario/stopExecution', { executionId }, {  withCredentials: true });
//             console.log(`[stopExecution] attempting to stop execution`, executionId);
//             console.log(`[stopExecution] response`, response);
//             return response.data;
//         } catch (error) {
//             console.error(`Error stopping execution ${executionId}:`, error);
//             throw error;
//         }
        
//     }
// }

// export default new ScenarioService();
