

export interface NodeFormProps {
    visible: string | null;
    nodeId: string;
    nodes: any[]; // Replace 'any' with a specific type if available
    onNodesChange: (changes: any) => void; // Replace 'any' with a specific type
    setModalNodeId: (nodeId: string | null) => void;
    edges: any[]; // Replace 'any' with a specific type if available
    inputNodes: string[];
} 

export interface OpenAINodeFormProps extends NodeFormProps {
    formState: {
        model: string;
        prompt: string;
        systemMessage: string;
        // Add other specific properties here
    };
}

export interface ChainNodeFormProps extends NodeFormProps {
    formState: {
        // Add other specific properties here
    };
}

