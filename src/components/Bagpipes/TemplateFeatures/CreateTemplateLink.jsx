import { useState, useEffect } from 'react';
import { useAppStore } from '../hooks';
import { compressString } from './compress';
import { CopyIcon } from '../../Icons/icons'
import toast from 'react-hot-toast';
import '../../../index.scss'; 

const CreateTemplateLink = ({ scenarioId }) => {
  const { scenarios } = useAppStore((state) => ({
    scenarios: state.scenarios,
  }));    
  const [templateLink, setTemplateLink] = useState('');
  const [copied, setCopied] = useState(false);

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

  const handleCopyToClipboard = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(templateLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        // This function is called if there was an error copying
        toast.error('Failed to copy!');
      });
  };

  useEffect(() => {
    if (copied) {
      toast.success(`Copied ${templateLink} to clipboard!}`);
    }
  }, [copied]);

  return (
    templateLink ? (
      <div className=''>
        {/* <input type="text" value={templateLink} readOnly /> */}
        <button 
          className='lab-buttons flex items-center hover:bg-blue-700 text-white font-semibold rounded' 
          onClick={handleCopyToClipboard}
        >
          <CopyIcon className='h-4 w-4 mr-1' />
          Copy Link
        </button>
      </div>
    ) : null
  );
};

export default CreateTemplateLink;