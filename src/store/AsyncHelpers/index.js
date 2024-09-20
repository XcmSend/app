import React from "react";
import ScenarioService from "../../services/ScenarioService";
import useAppStore from "../useAppStore";


// Async helper function for creating a new scenario
export const createScenarioAsync = async (initialData) => {
    try {
        // const scenarioId = await ScenarioService.createScenario(initialData);  // Note that I used scenarioId here
        if (scenarioId) {
            console.log(`Scenario ${scenarioId} created successfully`);
            useAppStore.getState().addScenario(scenarioId, initialData);  // Using scenarioId here as well
            return scenarioId; 
        }
        return null; // Not successfully created
    } catch (error) {
        console.error(`Failed to create scenario`, error);
        return false;
    }
};


// Async helper function for loading an entire scenario
export const loadScenarioAsync = async (scenarioId) => {
    const { scenarios, addScenario } = useAppStore.getState();
    
    // 1. Check Zustand state first
    let scenario = scenarios[scenarioId];
    if (scenario) {
      console.log(`Found scenario ${scenarioId} in Zustand state`);
      return true;  // Indicate success
    }
  
    // 2. Check local storage next
    scenario = localStorage.getItem(`scenario-${scenarioId}`);
    if (scenario) {
      scenario = JSON.parse(scenario); // Deserialize
      addScenario(scenarioId, scenario); // Add to Zustand state
      console.log(`Found scenario ${scenarioId} in local storage`);
      return true;  // Indicate success
    }
  
    // 3. Fetch from MongoDB as a last resort
    try {
      scenario = await ScenarioService.loadScenarioFromServer(scenarioId);
      console.log(`Successfully loaded scenario for ${scenarioId} from MongoDB`);
      
      // Update Zustand and local storage
      addScenario(scenarioId, scenario);
      localStorage.setItem(`scenario-${scenarioId}`, JSON.stringify(scenario)); // Serialize
      return true;  // Indicate success
    } catch (error) {
      console.error(`Failed to load scenario for ${scenarioId}:`, error);
      return false;  // Indicate failure
    }
  };
  
  

//   // Async helper function for evicting old scenarios
//   export const evictOldScenario = async () => {
//     const { scenarios } = useAppStore.getState();
  
//     if (!scenarios || Object.keys(scenarios).length <= 3) return;
  
//     // Identify the third oldest scenario
//     const sortedScenarios = Object.entries(scenarios)
//       .sort(([,a], [,b]) => new Date(a.updatedAt) - new Date(b.updatedAt));
    
//     const thirdOldestScenario = sortedScenarios[2];
  
//     if (!thirdOldestScenario) return;
  
//     const [thirdOldestScenarioId, thirdOldestScenarioData] = thirdOldestScenario;
  
//     // Save to the database
//     try {
//       await ScenarioService.saveScenarioToServer(thirdOldestScenarioId, thirdOldestScenarioData);
//       console.log(`Scenario ${thirdOldestScenarioId} saved to DB and will be evicted from local state.`);
      
//       // Remove from Zustand store
//       useAppStore.getState().removeScenario(thirdOldestScenarioId);  // Assuming you have a removeScenario action
//     } catch (error) {
//       console.error(`Failed to evict and save old scenario ${thirdOldestScenarioId}:`, error);
//     }
//   };


export const startPersistScenarioAsync = async (scenarioId, persist) => {
  try {
    console.log('startPersistScenarioAsync', scenarioId, persist);
      const success = await ScenarioService.startPersistScenario(scenarioId);
      console.log('Server response:', success);
      if (success) {
          useAppStore.getState().persistScenario(scenarioId, persist);
          return true;
      }
  } catch (error) {
      console.error(`Failed to start persisting scenario ${scenarioId}:`, error);
      return false;
  }
};

export const stopPersistScenarioAsync = async (scenarioId, persist) => {
  try {
      const success = await ScenarioService.stopPersistScenario(scenarioId);
      console.log('Server response:', success);
      if (success) {
          useAppStore.getState().persistScenario(scenarioId, persist);
          return true;
      }
  } catch (error) {
      console.error(`Failed to stop persisting scenario ${scenarioId}:`, error);
      return false;
  }
};

export const fetchPersistedScenarioLogs = async (scenarioId) => {
  try {
      const logs = await ScenarioService.fetchPersistedScenarioLogs(scenarioId);
      console.log('Server response:', logs);
      return logs;
  } catch (error) {
      console.error(`Failed to fetch persisted scenario logs:`, error);
      return [];
  }
};

export const fetchAllWorkers = async () => {
  try {
      const workers = await ScenarioService.fetchAllWorkers();  
      console.log('Server response:', workers);
      return workers;
  } catch (error) {
      console.error(`Failed to fetch all workers:`, error);
      return [];
  }
};



  export const deleteScenarioAsync = async (_id) => {
    try {
      // const success = await ScenarioService.deleteScenario(_id);
      // console.log('Server response:', success);
      // if (success) {
        // Remove scenario from Zustand state
        useAppStore.getState().deleteScenario(_id);

        // Remove scenario from local user metadata
        // useAppStore.getState().setUserMetadata(metadata => {
        //   const updatedScenarios = metadata.scenarios.filter(sc => sc.scenario !== scenarioId);
        //   return { ...metadata, scenarios: updatedScenarios };
        // });
      // }

    } catch (error) {
      console.error(`Failed to delete scenario ${_id}:`, error);
    }
  };
  
  export const deleteExecutionAsync = async (scenarioId, executionId) => {
    try {
      await ScenarioService.deleteExecution(executionId);
      useAppStore.getState().deleteExecution(scenarioId, executionId);
    } catch (error) {
      console.error(`Failed to delete execution ${executionId}:`, error);
    }
  };
  
  export const reconcileStateOnLogin = async () => {
    // Fetch all scenarios and executions from the server
    const serverScenarios = await fetchScenariosFromServer();
    const serverExecutions = await fetchExecutionsFromServer(); // This should be a nested object, with each scenario having its related executions
  
    // Get all scenarios and executions from Zustand state
    const { scenarios } = get(); // Assume 'scenarios' includes 'executions' nested inside each scenario
  
    // Reconcile Zustand state with server data
  
    // 1. Remove scenarios and executions not present on the server
    for (const scenarioId in scenarios) {
      if (!(scenarioId in serverScenarios)) {
        // Remove this scenario from Zustand state
        removeScenarioFromState(scenarioId);
      } else {
        // Check executions for this scenario
        for (const executionId in scenarios[scenarioId].executions) {
          if (!(executionId in serverScenarios[scenarioId].executions)) {
            // Remove this execution from Zustand state
            removeExecutionFromState(scenarioId, executionId);
          }
        }
      }
    }
  
    // 2. Add scenarios and executions missing in Zustand state
    for (const scenarioId in serverScenarios) {
      if (!(scenarioId in scenarios)) {
        // Add this scenario to Zustand state
        addScenarioToState(serverScenarios[scenarioId]);
      } else {
        // Check executions for this scenario
        for (const executionId in serverScenarios[scenarioId].executions) {
          if (!(executionId in scenarios[scenarioId].executions)) {
            // Add this execution to Zustand state
            addExecutionToState(scenarioId, serverScenarios[scenarioId].executions[executionId]);
          }
        }
      }
    }



  
    // Optionally, you can also compare and update other fields for each scenario and execution
    // ...
  
    // Update local storage to match Zustand state (or you can do this at each step above)
    // updateLocalStorage();
  }
  

