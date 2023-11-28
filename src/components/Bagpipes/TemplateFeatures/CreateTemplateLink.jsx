import { useState, useEffect } from 'react';
import { useAppStore } from '../hooks';
import { compressString } from './compress';

const CreateTemplateLink = ({ scenarioId }) => {
  const { scenarios } = useAppStore((state) => ({
    scenarios: state.scenarios,
  }));    
  const [templateLink, setTemplateLink] = useState('');
 
  useEffect(() => {
    const fetchData = async () => {
      if (scenarioId && scenarios && scenarios[scenarioId]) {
        console.log(`Diagram data:`, scenarios[scenarioId].diagramData);

        try {
          const compressed_link = await compressString(JSON.stringify(scenarios[scenarioId].diagramData));
          console.log(`compressed:`, compressed_link);
          const link = createLink(compressed_link);
          console.log(`link:`, link);
          setTemplateLink(link);
        } catch (error) {
          console.error('Error compressing or processing data:', error);
          // Handle error as needed
        }
      } else {
        console.error('Scenarios not loaded or scenarioId is invalid.');
      }
    };

    fetchData(); // Call the asynchronous function

  }, [scenarioId, scenarios]);

  
  const createLink = (diagramData) => {
    const encodedData = encodeURI(diagramData);// encodeURI(diagramData);
    console.log(`creating link to: /#/create/?diagramData=`, encodedData);
    return `${window.location.origin}/#/create/?diagramData=${encodedData}`;
  };

  return (
    templateLink ? (
      <div className=''>
        {/* <input type="text" value={templateLink} readOnly /> */}
        <button 
          className='flex items-center dndnode bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' 
          onClick={() => navigator.clipboard.writeText(templateLink)}
        >
          Copy Link
        </button>
      </div>
    ) : null
  );
};

export default CreateTemplateLink;