import {
  license_plate_registration_option,
  registration_options,
} from '@/constants/Config';
import { Branch } from '@/types/types';
import { type PropsWithChildren, createContext, useState } from 'react';

type Option = { label: string; value: number };

type CTX = {
  branchOption: Branch | null;
  setBranchOption: React.Dispatch<React.SetStateAction<Branch | null>>;
  registrationOptions: Option;
  setRegistrationOptions: React.Dispatch<React.SetStateAction<Option>>;
  licensePlateRegistrationOption: Option;
  setLicensePlateRegistrationOption: React.Dispatch<
    React.SetStateAction<Option>
  >;
};

export const OptionMotorContext = createContext<CTX>({} as CTX);

export function OptionMotorProvider({ children }: PropsWithChildren) {
  const [branchOption, setBranchOption] = useState<Branch | null>(null);
  const [registrationOptions, setRegistrationOptions] = useState<Option>(
    registration_options[0]
  );
  const [licensePlateRegistrationOption, setLicensePlateRegistrationOption] =
    useState<Option>(license_plate_registration_option[0]);

  return (
    <OptionMotorContext.Provider
      value={{
        branchOption,
        setBranchOption,
        registrationOptions,
        setRegistrationOptions,
        licensePlateRegistrationOption,
        setLicensePlateRegistrationOption,
      }}
    >
      {children}
    </OptionMotorContext.Provider>
  );
}
