import React from 'react';
import { Text, View, TextInput, TextInputProps } from 'react-native';
type Props = {
  flex1?: boolean;
  nativeID: string;
  value: string;
  errorValue?: string;
  textcenter?: boolean;
} & TextInputProps;
export const CustomInput = ({
  flex1,
  nativeID,
  value,
  errorValue,
  textcenter = false,
  ...rest
}: Props) => {
  return (
    <View className={`gap-y-2 ${flex1 ? 'flex-1' : ''}`}>
      <View>
        <TextInput
          style={{ paddingHorizontal: 16, paddingVertical: 12 }}
          nativeID={nativeID}
          className={`border border-neutral-300 rounded-sm px-4 py-2 ${
            textcenter ? 'text-center' : ''
          }`}
          {...rest}
        />
      </View>
      {errorValue && (
        <Text className='font-bold text-red-500'>{errorValue}</Text>
      )}
    </View>
  );
};
