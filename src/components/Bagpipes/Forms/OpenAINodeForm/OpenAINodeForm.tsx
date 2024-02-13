import React, { useEffect, useRef } from 'react';
import NodeForm from '../NodeForm';
import { OpenAINodeFormProps } from '../types';
import '../Forms.scss';
import { Model, Prompt, SystemMessage } from '../fields';

const OpenAINodeForm: React.FC<OpenAINodeFormProps> = ({ visible, nodeId, nodes, edges, onNodesChange, setModalNodeId, inputNodes, formState }) => {
    const richTextEditorRef = useRef();
    useEffect(() => {
        console.log('OpenAINodeForm Node ID:', nodeId);
        console.log('OpenAINodeForm Form State:', formState);
    }, [nodeId, formState]);

    const handleModelChange = (event: { target: { value: string; }; }) => {
        formState.model = event.target.value; // Adjust based on your state management
    };

    return (
        <div className="node-form main-font">
            <NodeForm
            visible={visible}
                nodeId={nodeId}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                setModalNodeId={setModalNodeId}
                inputNodes={inputNodes}
            />
            {/* Specific fields for OpenAINodeForm */}
            <Model value={formState.model} onChange={handleModelChange} />
            <SystemMessage value={formState.systemMessage} onChange={(value: string) => formState.systemMessage = value} />
            <Prompt
                nodeId={nodeId}
                edges={edges}
                inputNodes={inputNodes}
                formState={formState}
                richTextEditorRef={richTextEditorRef} setInputNodes={undefined} setFormState={undefined}            />
        </div>
    );
};

export default OpenAINodeForm;

