// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { GenerateLinkIcon } from '../../Icons/icons.jsx';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import '../nodes.jsx';
import '../../../index.css';
import './Buttons.scss';
import { tippyDescriptions}  from './tippyDescriptions.jsx';
import { useAppStore } from '../hooks/index.js';
import { compressString } from '../TemplateFeatures/compress';


// import { tippyDescriptions }  from './tippyDescriptions';
import '../buttons/Buttons.scss';
import toast from 'react-hot-toast';

export const GenerateLinkButton = ({ scenarioId}) => {

    const { scenarios } = useAppStore((state) => ({
        scenarios: state.scenarios,
      }));    
      const [templateLink, setTemplateLink] = useState('');
      const [copied, setCopied] = useState(false);
    
    //   useEffect(() => {
    //     const fetchData = async () => {
    //       if (scenarioId && scenarios && scenarios[scenarioId]) {
    //         console.log(`TemplateLinkTopBarButton Diagram data:`, scenarios[scenarioId].diagramData);
    
    //         try {
    //           const compressed_link = await compressString(JSON.stringify(scenarios[scenarioId].diagramData));
    //           console.log(`compressed:`, compressed_link);
    //           const link = createLink(compressed_link);
    //           console.log(`link:`, link);
    //           setTemplateLink(link);
    //         } catch (error) {
    //           console.error('Error compressing or processing data:', error);
    //           // Handle error as needed
    //         }
    //       } else {
    //         console.error('Scenarios not loaded or scenarioId is invalid.');
    //       }
    //     };
    
    //     fetchData(); // Call the asynchronous function
    
    //   }, [scenarioId, scenarios]);
    
      
      const createLink = async () => {
        if (scenarioId && scenarios && scenarios[scenarioId]) {
            console.log(`TemplateLinkTopBarButton Diagram data:`, scenarios[scenarioId].diagramData);
            try {
                const compressed_link = await compressString(JSON.stringify(scenarios[scenarioId].diagramData));
                console.log(`compressed:`, compressed_link);
                const encodedData = encodeURI(compressed_link);
                console.log(`creating link to: /#/create/?diagramData=`, encodedData);
                return `${window.location.origin}/#/create/?diagramData=${encodedData}`;
            } catch (error) {
                console.error('Error compressing or processing data:', error);
                toast.error('Failed to generate link!');
                // Handle error as needed
            }
        } else {
            console.error('Scenarios not loaded or scenarioId is invalid.');
        }
        return '';
    };
    
    const handleCopyToClipboard = async (e) => {
        e.stopPropagation();
        const link = await createLink();
        if (link) {
            navigator.clipboard.writeText(link)
                .then(() => {
                    setCopied(true);
                    setTemplateLink(link); // Store the link in state only if successfully copied
                    setTimeout(() => setCopied(false), 2000);
                })
                .catch(err => {
                    toast.error('Failed to copy!');
                });
        }
    };
    
      useEffect(() => {
        if (copied) {
          toast.success(`Copied ${templateLink} to clipboard!}`);
        }
      }, [copied]);

      return (
        <Tippy theme='light' placement='bottom' interactive={true} content={tippyDescriptions.generateLink}>
            <button className="top-bar-buttons text-black" onClick={handleCopyToClipboard}>
                <GenerateLinkIcon className='h-5 w-5' fillColor='#007bff' />
            </button>
        </Tippy>
    );
};

export default GenerateLinkButton;

