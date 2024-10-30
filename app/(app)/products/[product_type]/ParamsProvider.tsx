import { createContext, useState } from 'react';

export const ParamsContext = createContext<any>({});

export const ParamsProvider = ({ children }: { children: React.ReactNode }) => {
  const [params, setParams] = useState<any>({});
  return (
    <ParamsContext.Provider value={{ params, setParams }}>
      {children}
    </ParamsContext.Provider>
  );
};
