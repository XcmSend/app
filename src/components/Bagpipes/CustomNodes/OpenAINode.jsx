// @ts-nocheck
import React, { useState, useContext, useEffect } from 'react';
import { useNodeId, } from 'reactflow';
import SocketContext from '../../../contexts/SocketContext';
import CustomNode from './CustomNode';
import OpenAINodeFields from './OpenAINodeFields';
import useExecuteScenario from '../hooks/useExecuteScenario';
import '../../../index.css';
import '../node.styles.scss';
import useAppStore from '../../../store/useAppStore';


const OpenAINode = ({ data, isConnectable }) => {
  const { nodeContent } = data;
  const socket = useContext(SocketContext);
  const { nodeContentMap, executeScenario } = useExecuteScenario();
  const nodeId = useNodeId();
  const [content, setContent] = useState("");

  const categories = ['action', 'explain', 'choice', 'call'];

  const { loading } = useAppStore(state => ({ loading: state.loading }));

  useEffect(() => {
    if (loading) { 
      setContent(""); 
  } else {
    setContent(nodeContentMap[nodeId] || '');
    // console.log(`Setting content for node ${nodeId}:`, nodeContentMap[nodeId]);  
    // console.log(`Full node content map:`, nodeContentMap);  

  }
}, [nodeContentMap, nodeId]);

  return (
    <>
      <CustomNode nodeId={nodeId} fieldsComponent={OpenAINodeFields} data={data} />

      {loading ? (
        <div className="loading-indicator">Loading...</div>
      ) : null}

      <div className="fixed bottom-1 flex px-1 text-center">
        {categories.map((category, index) => (
          <span key={index} className="inline-block bg-gray-200 rounded mx-1 px-1 py-1 text-xxs text-center text-slate-900">{category}</span>
        ))}
      </div>  
      <div className={nodeContent && 'typing-effect absolute px-1 pt-2 pb-2 rounded-b-lg bg-white -z-50 pt-3 px-2 pb-2 '}>
        {nodeContent}
      </div>
    </>
  );
};

export default OpenAINode;
 
