import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
} from 'react';
type Location = {
  province: {
    code: string;
    name: string;
  };
  district: {
    code: string;
    name: string;
  };
  ward: {
    code: string;
    name: string;
  };
};

type CTX = {
  location: Location;
  typeActionLocation: 'add' | 'update' | null;
  setLocation: Dispatch<SetStateAction<Location>>;
  setTypeActionLocation: Dispatch<SetStateAction<any>>;
  resetLocation: () => void;
};
export const LocationContext = createContext({} as CTX);
export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [typeActionLocation, setTypeActionLocation] = useState(null);
  const [location, setLocation] = useState({
    province: {
      code: '',
      name: '',
    },
    district: {
      code: '',
      name: '',
    },
    ward: {
      code: '',
      name: '',
    },
  });
  const resetLocation = useCallback(() => {
    setLocation((prevLocation) => {
      return {
        ...prevLocation,
        province: {
          code: '',
          name: '',
        },
        district: {
          code: '',
          name: '',
        },
        ward: {
          code: '',
          name: '',
        },
      };
    });
  }, []);
  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        resetLocation,
        typeActionLocation,
        setTypeActionLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
