import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid';

const useBlinkStore = create(persist((set, get) => ({
  blinks: {},
  activeBlinksId: null,

  setActiveBlinksId: (blinkId) => set({ activeBlinksId: blinkId }),
  getBlinkData: (id) => get().blinks[id] || null,

  // Save form data for a blink
  saveBlinkFormData: (id, formData) => set(state => ({
    blinks: {
      ...state.blinks,
      [id]: formData
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