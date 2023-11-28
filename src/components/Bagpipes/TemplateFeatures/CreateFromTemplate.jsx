import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore } from '../hooks';
import { v4 as uuidv4 } from 'uuid';
import { decompressString } from './compress';

const CreateFromTemplate = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const { addScenario, setActiveScenarioId } = useAppStore((state) => ({
    addScenario: state.addScenario,
    setActiveScenarioId: state.setActiveScenarioId,
}));
useEffect(() => {
  const fetchData = async () => {
    // Extract the query parameter with the diagramData
    const params = new URLSearchParams(location.search);
    const rawSearchString = location.search.replace(/^\?/, '');
    const diagramDataString = rawSearchString.replace(/^diagramData=/, '');

    if (diagramDataString) {
      try {
        const deco = await decompressString(diagramDataString);
        const decodedData = JSON.parse(deco);
        const newScenarioId = uuidv4();

        addScenario(newScenarioId, { diagramData: decodedData });
        setActiveScenarioId(newScenarioId);
        console.log(`set active scenario id`);
        navigate('/builder'); // Navigate to the builder with the new scenario
      } catch (error) {
        console.error('Error decoding or processing data:', error);
        // Handle error as needed
      }
    }
  };

  fetchData(); // Call the asynchronous function

}, [location.search, addScenario, setActiveScenarioId, navigate]);

  // UI to show loading or success message

  return (
    <div>
      Creating your scenario from the template...
    </div>
  );
};

export default CreateFromTemplate;