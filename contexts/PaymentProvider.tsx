import { createContext, Dispatch, SetStateAction, useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
type CTX = {
  curPayment: any;
  setCurPayment: Dispatch<SetStateAction<any>>;
};
export const PaymentContext = createContext({} as CTX);
export const ListPayment = [
  {
    id: 0,
    name: 'Thanh toán tiền mặt',
    icon: <FontAwesome name='money' size={18} color='#ef4444' />,
    validRoute: ['item'],
  },
  {
    id: 1,
    name: 'Chuyển khoản ngân hàng',
    icon: <Entypo name='shop' size={18} color='#ef4444' />,
    validRoute: ['item', 'motor-cycle'],
  },
];
export const PaymentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [curPayment, setCurPayment] = useState(null);
  return (
    <PaymentContext.Provider value={{ curPayment, setCurPayment }}>
      {children}
    </PaymentContext.Provider>
  );
};
