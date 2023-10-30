import AuthService from './AuthService';
import ScenarioService from './ScenarioService';
import useAppStore from '../store/useAppStore';

export default async function initializeApp(navigate) {
  const isAuthenticated = await AuthService.isAuthenticated(navigate);
  
  if (isAuthenticated) {
    try {

      // Fetch user's metadata from the server
      const userMetadata = await ScenarioService.getUserMetadata();
      console.log(`[initializeApp] userMetadata`, userMetadata);



      // Update Zustand store with fetched metadata
      useAppStore.getState().setUserMetadata(userMetadata);
      
      const localScenarios = useAppStore.getState().scenarios;
      console.log(`[initializeApp] bringing localScenarios in to the mix`, localScenarios);

      // Remove any bad entries
      delete localScenarios["[object Object]"];

      // Handle server-only scenarios (Case 3)
      for (const serverScenario of userMetadata.scenarios) {
        const actualScenarioId = serverScenario.scenario; // Extract the actual MongoDB ObjectId
        const localScenario = localScenarios[actualScenarioId];

        console.log(`[initializeApp] checking scenarioId`, actualScenarioId);
        
        if (!localScenario) {
          console.log(`[initializeApp] Downloading scenario from server`, actualScenarioId);
          // Download from the server
          await ScenarioService.loadScenarioFromServer(actualScenarioId);
        } else if (localScenario.version !== serverScenario.version) {
          console.log(`[initializeApp] We need to resolve version conflict for scenario ${actualScenarioId}`);
          // Resolve version conflict (Case 2)
          // Prompt user or implement conflict resolution logic
        }
      }

      // Handle local-only scenarios (Case 1)
      for (const [scenarioId, localScenario] of Object.entries(localScenarios)) {
        if (!userMetadata.scenarios.some(s => s.scenario === scenarioId)) {
          console.log(`[initializeApp] TODO: Upload to server or discard local scenario`, scenarioId);
          // Upload to server or discard local scenario
          // Prompt user for action
        }
      }

    } catch (error) {
      console.error("Failed to initialize app:", error);
    }
  } else {
    // User is not authenticated
    // Handle local scenarios or guide user to login
  }
}

