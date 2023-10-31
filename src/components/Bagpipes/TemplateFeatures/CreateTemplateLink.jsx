import { useState, useEffect } from 'react';
import { useAppStore } from '../hooks';

const CreateTemplateLink = ({ scenarioId }) => {
  const { scenarios } = useAppStore((state) => ({
    scenarios: state.scenarios,
  }));    
  const [templateLink, setTemplateLink] = useState('');
  
  useEffect(() => {
    if (scenarioId && scenarios && scenarios[scenarioId]) {
      const link = createLink(scenarios[scenarioId].diagramData);
      setTemplateLink(link);
    } else {
      console.error('Scenarios not loaded or scenarioId is invalid.');
    }
  }, [scenarioId, scenarios]);
  
  const createLink = (diagramData) => {
    const encodedData = encodeURIComponent(JSON.stringify(diagramData));
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
