import { createContext, useContext } from 'react';
import { issueStore } from './IssueStore';
import { swotStore } from './SwotStore';
import { actionStore } from './ActionStore';
import UiStore from './UiStore';

const uiStore = new UiStore();

interface StoreContextValue {
  issueStore: typeof issueStore;
  swotStore: typeof swotStore;
  actionStore: typeof actionStore;
  uiStore: typeof uiStore;
}

const StoreContext = createContext<StoreContextValue>({
  issueStore,
  swotStore,
  actionStore,
  uiStore,
});

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreContext.Provider 
      value={{ 
        issueStore, 
        swotStore, 
        actionStore, 
        uiStore 
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}; 