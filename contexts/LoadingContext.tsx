'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import PageLoader from '@/components/ui/PageLoader';

interface LoadingContextType {
  showLoader: (message?: string) => void;
  hideLoader: () => void;
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  const showLoader = useCallback((msg?: string) => {
    setMessage(msg);
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
    setMessage(undefined);
  }, []);

  return (
    <LoadingContext.Provider value={{ showLoader, hideLoader, isLoading }}>
      {children}
      {isLoading && <PageLoader message={message} />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
