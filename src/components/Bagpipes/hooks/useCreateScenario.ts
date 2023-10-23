import { useNavigate } from "react-router-dom"; // or whatever routing library you're using
import { v4 as uuidv4 } from 'uuid';
import useAppStore from "../../../store/useAppStore";
import toast from "react-hot-toast";

export const useCreateScenario = () => {
    const {  setActiveScenarioId, addScenario } = useAppStore(state => ({
        setActiveScenarioId: state.setActiveScenarioId,
        addScenario: state.addScenario,
      }));
  const navigate = useNavigate();


  const createScenario = () => {
    const initialData = {
      name: "Bagpipe XCM Flow", 
      timestamp: new Date().toISOString(),
      diagramData: {
        nodes: [], // Empty nodes
        edges: [], // Empty edges
      },
    };

    try {
        // Generate a unique ID for the new scenario
        const newScenarioId = uuidv4();

        if (newScenarioId) {
                    // Add the new scenario to the zustand store
                  addScenario(newScenarioId, initialData);
                  // Set the new scenario as the active one
                  setActiveScenarioId(newScenarioId);
                  console.log(`Scenario ${newScenarioId} created successfully`);
                
                  console.log("Navigating to /builder");
                
                  // Navigate to the /builder route
                  navigate('/builder');
                } else {
                  // Handle error, scenario not created
                  console.error("Scenario not created. Invalid ID:", newScenarioId);
                  toast.error("Failed to create a new scenario due to an invalid ID.");
                }
          
    } catch (error) {
        console.error(`Failed to create scenario`, error);
    }
  
  };

  return createScenario;
};