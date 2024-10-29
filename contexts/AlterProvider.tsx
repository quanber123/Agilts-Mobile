import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
type CTX = {
  alterModal: 'success' | 'error' | '';
  setAlertModal: (type: 'success' | 'error' | '') => void;
  isAlertModal: boolean;
  setIsAlertModal: Dispatch<SetStateAction<boolean>>;
  setMessages: (msg: string) => void;
  messages: string;
};
export const AlterContext = createContext({} as CTX);
export default function AlterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [alterModal, setAlertModal] = useState<'success' | 'error' | ''>('');
  const [isAlertModal, setIsAlertModal] = useState(false);
  const [messages, setMessages] = useState<string>('');
  useEffect(() => {
    if (alterModal && isAlertModal && messages) {
      const timeoutId = setTimeout(() => {
        setAlertModal('');
        setIsAlertModal(false);
        setMessages('');
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [alterModal, isAlertModal, messages]);
  return (
    <AlterContext.Provider
      value={{
        alterModal,
        setAlertModal,
        isAlertModal,
        setIsAlertModal,
        messages,
        setMessages,
      }}
    >
      {children}
    </AlterContext.Provider>
  );
}
