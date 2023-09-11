// onEdgesChange.js
import { applyEdgeChanges } from 'reactflow';

const onEdgesChange = (setEdges, setInputVariablesByEdgeId, inputVariablesByEdgeId, activeScenarioId, addEdgeToScenario, scenarios, takeSnapshot) => (changes) => {
    console.log("On Edges Change - Changes:", changes);

    takeSnapshot(); // Assuming you want to take a snapshot every time there's a change

    const currentScenario = scenarios && scenarios[activeScenarioId];
    if (!currentScenario) {
        console.error('No active scenario found. Cannot process edge changes.');
        return;
    }

    // Use applyEdgeChanges to handle edge changes
    const updatedEdges = applyEdgeChanges(changes, currentScenario.diagramData.edges);

    // Handle any additional edge-specific logic (like input variables) for each change
    changes.forEach(change => {
        if (change.item && change.type === 'add') {
            const edge = change.item;

            // Check if the edge is already in the scenario before adding
            if (currentScenario.diagramData.edges.some(e => e.id === edge.id)) {
                console.warn("Duplicate edge detected:", edge.id);
                return;
            }

            // Edge was added, so add a new entry
            // This assumes that the input variables are available in `edge.data`
            if (edge.data && edge.data.inputVariables) {
                setInputVariablesByEdgeId({
                    ...inputVariablesByEdgeId,
                    [edge.id]: edge.data.inputVariables,
                });
                console.log("Added edge:", edge);
                console.log("Updated state:", inputVariablesByEdgeId);
            }

            addEdgeToScenario(activeScenarioId, edge);
        }
    });

    // After handling individual changes, update the edges in the store with the consolidated updates
    setEdges(updatedEdges);
};

export default onEdgesChange;
