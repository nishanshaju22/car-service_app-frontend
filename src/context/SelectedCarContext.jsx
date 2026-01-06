import { createContext, useContext, useState } from 'react';

const SelectedCarContext = createContext();

export const SelectedCarProvider = ({ children }) => {
  const [selectedCar, setSelectedCar] = useState(null);

  return (
    <SelectedCarContext.Provider value={{ selectedCar, setSelectedCar }}>
      {children}
    </SelectedCarContext.Provider>
  );
};

export const useSelectedCar = () => useContext(SelectedCarContext);
