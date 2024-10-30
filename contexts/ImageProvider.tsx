import { SingleImage } from '@/types/types';
import { createContext, Dispatch, SetStateAction, useState } from 'react';
type Props = {
  visibleImage: boolean;
  imagesList: SingleImage[] | [];
  indexValue: number;
  setVisibleImage: Dispatch<SetStateAction<boolean>>;
  setImagesList: Dispatch<SetStateAction<SingleImage[] | []>>;
  setIndexValue: Dispatch<SetStateAction<number>>;
};
export const ImageContext = createContext<Props>({} as Props);

export const ImageProvider = ({ children }: { children: React.ReactNode }) => {
  const [visibleImage, setVisibleImage] = useState(false);
  const [imagesList, setImagesList] = useState<SingleImage[] | []>([]);
  const [indexValue, setIndexValue] = useState(0);
  return (
    <ImageContext.Provider
      value={{
        visibleImage,
        setVisibleImage,
        imagesList,
        setImagesList,
        indexValue,
        setIndexValue,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
