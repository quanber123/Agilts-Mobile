import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { usePostImageMutation } from '@/services/redux/query/appQuery';
import AntDesign from '@expo/vector-icons/AntDesign';
import LoadingApp from '@/components/ui/LoadingApp';
type Props = {
  setImages: (img: string) => void;
  setImagesUpload: (img: string) => void;
};
const ImageUpload: React.FC<Props> = ({ setImages }) => {
  const [uploadingImg, setUploadingImg] = useState<string | null>(null);
  const [postImage, { data, isSuccess, isLoading, isError, error }] =
    usePostImageMutation();
  const pickImage = useCallback(async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Bạn cần cấp quyền để truy cập thư viện ảnh!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const formData = new FormData();
      formData.append('image', result.assets[0].uri);
      setUploadingImg(result.assets[0].uri);
      await postImage(formData);
    }
  }, [postImage]);
  useEffect(() => {
    if (isSuccess && data) {
      if (uploadingImg) {
        setImages(uploadingImg);
      }
      setUploadingImg(data?.file_name);
      setUploadingImg(null);
    }
    if (isError && error) {
      Alert.alert((error as any)?.data?.message || 'Lỗi khi tải ảnh!');
    }
  }, [isSuccess, isError, error]);
  if (isLoading) return <LoadingApp />;
  return (
    <Pressable
      className='justify-center items-center gap-1 border border-neutral-300 p-4 rounded-xl'
      onPress={pickImage}
      disabled={isLoading}
    >
      <AntDesign name='clouduploado' size={24} color='#ef4444' />
      <Text className='text-center'>Tải ảnh của bạn lên đây</Text>
    </Pressable>
  );
};

export default ImageUpload;
