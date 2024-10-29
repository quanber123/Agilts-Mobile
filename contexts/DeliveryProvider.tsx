import { createContext, Dispatch, SetStateAction, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
type CTX = {
  curDelivery: any;
  setCurDelivery: Dispatch<SetStateAction<any>>;
};
export const DeliveryContext = createContext({} as CTX);
export const ListDelivery = [
  {
    id: 0,
    name: 'Nhận tại cửa hàng',
    icon: <Ionicons name='storefront-outline' size={18} color='#ef4444' />,
  },
  {
    id: 1,
    name: 'Giao hàng tận nơi',
    icon: (
      <MaterialCommunityIcons
        name='truck-fast-outline'
        size={18}
        color='#ef4444'
      />
    ),
  },
];
export const DeliveryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [curDelivery, setCurDelivery] = useState(null);
  return (
    <DeliveryContext.Provider value={{ curDelivery, setCurDelivery }}>
      {children}
    </DeliveryContext.Provider>
  );
};
