// @ts-nocheck
// storageUtils.js

export function getSavedFormState(nodeId) {
    const savedState = localStorage.getItem(`node-form-state-${nodeId}`);
    return savedState ? JSON.parse(savedState) : null;
  }
  
  export const setSavedFormState = (nodeId, state) => {
    window.localStorage.setItem(`node-form-state-${nodeId}`, JSON.stringify(state));
  };


  export function generateEdgeId(source, target) {
    // Ensure the smallest string comes first (or use any other deterministic ordering criterion)
    console.log(`[generateEdgeId] source: ${source}, target: ${target}`);
    return `${source}-${target}`;
  }
  