// @ts-nocheck
// storageUtils.js

export function getSavedFormState(nodeId) {
    const savedState = localStorage.getItem(`node-form-state-${nodeId}`);
    return savedState ? JSON.parse(savedState) : null;
  }
  
  export const setSavedFormState = (nodeId, state) => {
    window.localStorage.setItem(`node-form-state-${nodeId}`, JSON.stringify(state));
  };
  