import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid';

const useBlinkStore = create(persist((set, get) => ({
  blinks: {},
  activeBlinksId: null,
  fetchedBlinks: {},

  setActiveBlinksId: (blinkId) => set({ activeBlinksId: blinkId }),
  getBlinkData: (id) => get().blinks[id] || null,
  getBlinkMetadata: (id) => get().blinks[id]?.metadata || {},
  getOnChainURLs: (id) => get().blinks[id]?.onChainURLs || [],
  // retrieve fetched on-chain blink data. This is related to the BlinkAppViewer not the builder. 
  getFetchedOnChainBlink: (chain, blockNumber, txIndex) => {
    const id = `${chain}:${blockNumber}:${txIndex}`;
    const state = get()
    console.log('Retrieving fetched on-chain blink:', id);
    const blinkData = state.fetchedBlinks[id] || null;
    console.log('Retrieved fetched on-chain blink data:', blinkData);
    return blinkData;
  },


  saveBlinkFormData: (id, formData) => set(state => (
    console.log('Saving form data for blink:', id, formData),

    {
    blinks: {
      ...state.blinks,
      [id]: formData
    }
  })),


    // Save metadata specifically
    saveBlinkMetadata: (id, metadata) => set(state => ({
      blinks: {
        ...state.blinks,
        [id]: {
          ...state.blinks[id],
          metadata,
        }
      }
    })),
  
    // Add an on-chain URL to the existing array
    addOnChainURL: (id, url) => set(state => ({
      blinks: {
        ...state.blinks,
        [id]: {
          ...state.blinks[id],
          onChainURLs: [...(state.blinks[id]?.onChainURLs || []), url]
        }
      }
    })),

  // Create a new blink and set it as active
  createNewBlink: () => {
    const newId = uuidv4();
    set(state => ({
      activeBlinkId: newId,
      blinks: {
        ...state.blinks,
        [newId]: { id: newId, title: '', description: '', actions: [] } // Initialize with empty data or defaults
      }
    }));
    return newId;
  },

    // New action to save fetched on-chain blink data
    saveFetchedOnChainBlink: (chain, blockNumber, txIndex, blinkData) =>
      set((state) => {
        const id = `${chain}:${blockNumber}:${txIndex}`;
        console.log('Saving fetched on-chain blink:', id, blinkData);
        return {
            fetchedBlinks: {
              ...state.fetchedBlinks,
            [id]: blinkData
            }
        };
      }),
  


}),
{
    name: 'blink-app-storage',  
    storage: createJSONStorage(() => localStorage),
    onRehydrateStorage: (state) => {
      console.log('Hydrating state for blinks...');
      return (state, error) => {
        if (error) {
          console.error('An error occurred during hydration:', error);
        } else {
          console.log('State hydrated successfully for blinks.');
        }
      };
    }
  }
  ),
);
  
  window.store = useBlinkStore; // For zukeeper debugging, remove for production
export default useBlinkStore;