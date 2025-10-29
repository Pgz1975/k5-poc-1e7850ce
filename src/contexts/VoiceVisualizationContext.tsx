import { createContext, useContext, ReactNode } from 'react';

const VoiceVisualizationContext = createContext<boolean>(false);

export function VoiceVisualizationProvider({ children }: { children: ReactNode }) {
  return (
    <VoiceVisualizationContext.Provider value={true}>
      {children}
    </VoiceVisualizationContext.Provider>
  );
}

export function useHasParentVisualization() {
  return useContext(VoiceVisualizationContext);
}
