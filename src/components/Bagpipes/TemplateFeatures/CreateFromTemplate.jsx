import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore } from '../hooks';
import { v4 as uuidv4 } from 'uuid';

const CreateFromTemplate = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const { addScenario, setActiveScenarioId } = useAppStore((state) => ({
    addScenario: state.addScenario,
    setActiveScenarioId: state.setActiveScenarioId,
}));

useEffect(() => {
  // Extract the query parameter with the diagramData
  const params = new URLSearchParams(location.search);
  const diagramDataString = params.get('diagramData');

  if (diagramDataString) {
    console.log('CreateFromTemplate diagramDataString', diagramDataString);
    const decodedData = JSON.parse(decodeURIComponent(diagramDataString));
    const newScenarioId = uuidv4();
    
    addScenario(newScenarioId, { diagramData: decodedData });
    
    setActiveScenarioId(newScenarioId);
    navigate('/builder'); // Navigate to the builder with the new scenario
  }
}, [location.search, addScenario, setActiveScenarioId, navigate]);


  // UI to show loading or success message

  return (
    <div>
      Creating your scenario from the template...
    </div>
  );
};

export default CreateFromTemplate;
