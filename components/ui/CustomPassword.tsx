import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, View, TextInput, TextInputProps, Pressable } from 'react-native';
type Props = {
  customClass?: string;
  value: string;
  errorValue?: string;
} & TextInputProps;
export const CustomInputPassword = ({
  customClass = '',
  value,
  errorValue,
  ...rest
}: Props) => {
  const [isShowPwd, setIsShowPwd] = useState(false);
  return (
    <View className='w-full gap-y-2'>
      <View>
        <TextInput
          secureTextEntry={!isShowPwd}
          className={'border border-neutral-300 rounded-sm px-4 py-2'}
          style={{ paddingHorizontal: 16, paddingVertical: 12 }}
          nativeID='password'
          {...rest}
        />
        <Pressable
          className='absolute h-full top-3 right-4 justify-center items-center'
          onPress={() => setIsShowPwd(!isShowPwd)}
        >
          <FontAwesome
            name={!isShowPwd ? 'eye-slash' : 'eye'}
            size={24}
            color='black'
          />
        </Pressable>
      </View>
      {errorValue && (
        <Text className='font-bold text-red-500'>{errorValue}</Text>
      )}
    </View>
  );
};
