import { View, Text, Modal, Pressable } from 'react-native';
import React, { useCallback, useContext } from 'react';
import { ImageContext } from '@/contexts/ImageProvider';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import CustomImage from '../ui/CustomImage';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function ImageModal() {
  const {
    imagesList,
    indexValue,
    visibleImage,
    setImagesList,
    setVisibleImage,
    setIndexValue,
  } = useContext(ImageContext);
  const handleNext = useCallback(() => {
    setIndexValue((prevIndex) => {
      if (prevIndex + 1 === imagesList?.length) return 0;
      return prevIndex + 1;
    });
  }, []);
  const handlePrev = useCallback(() => {
    setIndexValue((prevIndex) => {
      if (prevIndex - 1 < 0) return imagesList?.length - 1;
      return prevIndex - 1;
    });
  }, []);
  return imagesList.length > 0 ? (
    <Modal
      visible={visibleImage}
      animationType='fade'
      transparent={true}
      statusBarTranslucent={true}
    >
      <View
        className='flex-1 justify-center items-center'
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <View className='w-11/12 h-1/2 bg-white p-4'>
          <View className='mb-8 flex-row justify-between items-center'>
            <Text className='text-lg font-bold'>Ảnh</Text>
            <Pressable
              onPress={() => {
                setVisibleImage(false);
                setIndexValue(0);
                setImagesList([]);
              }}
            >
              <FontAwesome6 name='xmark' size={24} color='black' />
            </Pressable>
          </View>
          <CustomImage
            width={380}
            height={300}
            src={imagesList?.[indexValue]?.url}
            alt={imagesList?.[indexValue]?.alt}
          />
          <View className='flex-row items-center justify-between'>
            {imagesList?.length > 1 && (
              <View className='flex-row items-center'>
                <Pressable onPress={handlePrev}>
                  <AntDesign name='left' size={24} color='black' />
                </Pressable>
                <Pressable onPress={handleNext}>
                  <AntDesign name='right' size={24} color='black' />
                </Pressable>
              </View>
            )}
            <Text className='text-lg'>
              {indexValue + 1}/{imagesList?.length}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  ) : (
    <></>
  );
}
