import React, { useState, useRef, useEffect } from 'react';
import useAppStore from '../../../../../store/useAppStore';
import CollapsibleField from '../../fields/CollapsibleField';
import FormHeader from '../../FormHeader';
import { getOrderedList, findUpstreamNodes } from '../../../hooks/utils/scenarioExecutionUtils';
import { useTippy } from '../../../../../contexts/tooltips/TippyContext';
import { getSavedFormState, setSavedFormState } from '../../../utils/storageUtils';
import { useDrag, useDrop } from 'react-dnd';
import CustomInput from '../../fields/CustomInput';
import toast from 'react-hot-toast';
import { nodeTypeColorMapping } from './nodeColorMapping';
import { extractEventDataFromNodes } from './Pills/pillUtils';
import '../Popup.scss';
import '../../Forms.scss';
import '../../../../../index.css';
// import { PanelIcon } from '../../../../Icons/icons';


const PanelForm = ({ nodeId, onClose }) => {
  const dropPositionRef = useRef(null);    
  const { scenarios, activeScenarioId, saveNodeFormData, savePanel, panels, setSelectedPanelInNode } = useAppStore(state => ({ 
        scenarios: state.scenarios,
        activeScenarioId: state.activeScenarioId,
        // saveNodeFormData: state.saveNodeFormData,
    
    }));
    const [pills, setPills ]  = useState([]);

    const currentScenario = scenarios[activeScenarioId];
    const node = currentScenario.diagramData.nodes.find(node => node.id === nodeId);
    const savedState = getSavedFormState(nodeId) ?? { inputNodes: node?.data?.inputNodes || [] };
    const [inputNodes, setInputNodes] = useState(node?.data?.inputNodes || []);
 
    const handleCancel = () => {
    
      onClose(); // Invoke the onClose function passed from the parent component
  };

    // Function to remove a pill
    const removePill = (pillId) => {
      setPills(currentPills => currentPills.filter(pill => pill.id !== pillId));
      // Additional logic if needed, like updating the combined value or other states
    };

    useEffect(() => {
     
      const allNodes = currentScenario.diagramData.nodes;
      const orderedList = getOrderedList(currentScenario.diagramData.edges);
      console.log('orderedList', orderedList);
      const upstreamNodes = findUpstreamNodes(orderedList, nodeId);

      if (orderedList) {
        const newPills = extractEventDataFromNodes(upstreamNodes, allNodes, orderedList);
        setPills(newPills);
      } else {
        console.error('orderedList is undefined');
      }
  
    }, [currentScenario.diagramData.edges, nodeId, currentScenario.diagramData.nodes]);
  

    
    const DraggablePill = ({ pill, depth, onRemovePill, onToggleExpand }) => {
      const pillColor = nodeTypeColorMapping[pill.nodeType] || nodeTypeColorMapping.defaultColor;
      console.log(`Node type draggable: ${pill.nodeType}, Color: ${pillColor}`);

      const [isExpanded, setIsExpanded] = useState(false);
      const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: 'PILL',
        item: { id: pill.id, label: pill.label, nodeIndex: pill.nodeIndex, nodeType: pill.nodeType },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
        }),
      }));
    
      const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        if (onToggleExpand) {
          onToggleExpand(pill.id, !isExpanded);
        }
      };

    
      return (
        <div className='flex m-2'>
          <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, marginLeft: `${depth * 20}px`}}>
          {pill.children.length > 0 && (
            <span className='p-1 m-1 cursor-pointer' onClick={toggleExpand}>{isExpanded ? '-' : '+'}</span>
          )}
          <span style={{backgroundColor: pillColor}} className={`w-full text-white mt-2 p-1 border-green-500 rounded cursor-pointer`}>
          {/* {pill.nodeIndex}. {pill.label} */}
          {pill.label}
            
          </span> 
          {isExpanded && pill.children.map(child => (
            <DraggablePill key={child.id} pill={child} depth={depth + 1} onRemovePill={onRemovePill} />
          ))}
        </div>
        <span  className='ml-2 text-gray-500'>{pill.value}</span>
        </div>
      );
    };
    
    
    const DraggableNode = ({ nodeId, type, label }) => {
      const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: 'NODE',
        label: 'test',
        item: { id: nodeId, type, label },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
        }),
      }));

      // useEffect(() => {
      //   if (preview) {
      //     const dragPreview = document.createElement('div');
      //     dragPreview.innerHTML = `➕<span class="bg-green-500 w-full text-white mt-1 p-1 border-green-500 rounded">${type}</span>`; 
      //     dragPreview.style.position = "absolute";
      //     dragPreview.style.top = "-1000px";
      //     document.body.appendChild(dragPreview);
      //     preview(dragPreview);
      //   }
      // }, [preview]);
    
      return (
        <div ref={drag} className='mt-3 mb-2'style={{ opacity: isDragging ? 0.5 : 1 }}>
          {/* Content of your draggable element */}
          <span className="bg-green-500 w-full text-white mt-1 p-1 border-green-500 rounded cursor-pointer">{type}</span>
        </div>
      );
    };





  return (
    <div className="form-container" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <FormHeader onClose={handleCancel}  title='Control Panel' />  


      {/* <DraggableNode nodeId="node1" type="1. referendum_hash" label="referendum_hash" />
      <DraggableNode nodeId="node2" type="1. proposal_hash" label=" test_2" /> */}
      
      <div className="content">

        {pills.map(pill => (
          <DraggablePill key={pill.id} pill={pill} depth={0} onRemovePill={removePill} />
        ))}
      
      </div>
    </div>
  );
};

export default PanelForm;




