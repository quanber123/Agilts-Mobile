import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import smallError from '../../assets/images/not-found-img.avif';
import largerError from '../../assets/images/not-found-img-larger.png';

interface CustomImageProps {
  src: string;
  alt: string;
  larger?: boolean;
  style?: object;
  width?: number;
  height?: number;
}

const CustomImage: React.FC<CustomImageProps> = ({
  src,
  alt,
  width,
  height,
  larger = false,
  style = {},
}) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const errorImage = larger ? largerError : smallError;
  const handleError = () => {
    setLoaded(true);
    setFailed(true);
  };

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  if (failed || src === null) {
    return (
      <View className='flex-1 rounded-sm justify-center items-center'>
        <Image
          source={errorImage}
          style={{ width: width ? width : 180, height: height ? height : 120 }}
          resizeMode='cover'
          accessibilityLabel='Not Found'
        />
      </View>
    );
  }

  return (
    <View style={[styles.loaderContainer, style]}>
      {!loaded && src && <ActivityIndicator size='large' color='#ef4444' />}
      {src && (
        <Image
          key={src}
          alt={alt}
          source={{ uri: loaded ? src : '' }}
          style={{ width: width ? width : 180, height: height ? height : 120 }}
          onLoad={() => setLoaded(true)}
          onError={handleError}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomImage;
