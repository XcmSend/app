// @ts-nocheck
import React, { useEffect } from 'react';
import { getAllConnectedNodes } from '../../utils/getAllConnectedNodes';
import RichTextEditor from '../../RichTextEditor/RichTextEditor';

const Prompt = ({ nodeId, edges, inputNodes, setInputNodes, formState, setFormState, richTextEditorRef }) => {
  console.log('formState in PROMPT:', formState); 
  
  useEffect(() => {
    if (nodeId && edges) {
      const connectedNodeIds = getAllConnectedNodes(nodeId, edges);
      const disconnectedNodeIds = inputNodes.filter(id => !connectedNodeIds.includes(id));

      disconnectedNodeIds.forEach(disconnectedNodeId => {
        const nodeIndex = formState.prompt.indexOf(`{${disconnectedNodeId}}`);
        const quill = richTextEditorRef.current.quillRef.current;
        quill.formatText(nodeIndex, disconnectedNodeId.length + 2, 'class', 'removed-node');
      });

      setInputNodes(connectedNodeIds);
    }
  }, [nodeId, edges, formState.prompt, setInputNodes]);

  useEffect(() => {
  }, [nodeId, inputNodes, formState]);
  
  // Render form
  return (
    <div className='field'>
      <label className='label'>Prompt:</label>
        <div className='control'>
          <RichTextEditor
            ref={richTextEditorRef}
            value={formState.prompt}
            onChange={(value) => setFormState(prevState => ({ ...prevState, prompt: value }))}
          />
        </div>
    </div>
  );
};

export default Prompt;
