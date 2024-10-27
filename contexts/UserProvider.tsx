import { Address, Cart, Wishlist } from '@/types/types';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useSession } from './SessionProvider';
import {
  useGetAddressQuery,
  useGetCartQuery,
  useGetWishlistQuery,
} from '@/services/redux/query/appQuery';

type CTX = {
  previousRoute: string | null;
  wishlist: Wishlist[] | [];
  isFetchingWishlist: boolean;
  cart: Cart[] | [];
  isFetchingCart: boolean;
  addresses: Address[] | [];
  isFetchingAddress: boolean;
  defaultAddress: Address | null;
  setDefaultAddress: Dispatch<SetStateAction<Address | null>>;
};

export const UserContext = createContext({} as CTX);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [previousRoute, setPreviousRoute] = useState<string | null>(null);
  const { user } = useSession();
  const [wishlist, setWishlist] = useState<Wishlist[] | []>([]);
  const [cart, setCart] = useState<Cart[] | []>([]);
  const [addresses, setAddresses] = useState<Address[] | []>([]);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const {
    data: wishlistData,
    isFetching: isFetchingWishlist,
    isSuccess: isSuccessWishlist,
  } = useGetWishlistQuery(null, { skip: !user });
  console.log(wishlistData);
  const {
    data: cartData,
    isFetching: isFetchingCart,
    isSuccess: isSuccessCart,
  } = useGetCartQuery(null, { skip: !user });
  const {
    data: addressData,
    isFetching: isFetchingAddress,
    isSuccess: isSuccessAddress,
  } = useGetAddressQuery(null, { skip: !user });
  useEffect(() => {
    if (isSuccessWishlist && wishlistData) {
      setWishlist(wishlistData);
    } else {
      setWishlist([]);
    }
  }, [isSuccessWishlist, wishlistData]);
  useEffect(() => {
    if (isSuccessCart && cartData) {
      setCart([...cartData]);
    } else {
      setCart([]);
    }
  }, [isSuccessCart, cartData]);
  useEffect(() => {
    if (isSuccessAddress && addressData) {
      setAddresses(
        [...addressData].sort((a: Address, b: Address) => {
          if (a.default && !b.default) {
            return -1;
          }
          if (!a.default && b.default) {
            return 1;
          }
          return 0;
        })
      );
      setDefaultAddress(addressData?.find((a: Address) => a.default));
    } else {
      setAddresses([]);
      setDefaultAddress(null);
    }
  }, [isSuccessAddress, addressData]);
  const contextValue = {
    previousRoute,
    wishlist,
    isFetchingWishlist,
    cart,
    isFetchingCart,
    addresses,
    setPreviousRoute,
    isFetchingAddress,
    defaultAddress,
    setDefaultAddress,
  };
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
