import { View, Text, SafeAreaView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useSession } from '@/contexts/SessionProvider';
import { User } from '@/types/types';
import { AlterContext } from '@/contexts/AlterProvider';
import { CustomInput } from '@/components/ui/CustomInput';

export default function InformationScreen() {
  const { setAlertModal, setIsAlertModal, setMessages } =
    useContext(AlterContext);
  const { user, updateUser, isLoadingUpdate, errorResponse, isSuccessUpdate } =
    useSession();
  const [curUser, setCurUser] = useState<null | User>(null);
  useEffect(() => {
    if (user) {
      setCurUser(user);
    }
  }, [user]);
  useEffect(() => {
    if (isSuccessUpdate) {
      setAlertModal('success');
      setIsAlertModal(true);
      setMessages('Cập nhật thông tin thành công!');
    }
  }, [isSuccessUpdate]);
  return (
    curUser && (
      <SafeAreaView className='flex-1 p-2 gap-4'>
        <View>
          <Text className='text-base font-bold'>
            Thông tin người nhận email
          </Text>
          <Text className='border border-neutral-300 px-4 py-4'>
            {curUser?.email}
          </Text>
        </View>
        <View>
          <Text className='text-base font-bold'>Tên người dùng</Text>
          <CustomInput
            value={curUser?.name as string}
            nativeID='name'
            defaultValue={curUser?.name as string}
            placeholder='Nhập số điện thoại..'
            onChangeText={(text) =>
              setCurUser((prevUser: any) => {
                return { ...prevUser, name: text };
              })
            }
            errorValue={errorResponse?.errors?.name?.[0]}
          />
        </View>
        <View>
          <Text className='text-base font-bold'>Ngày sinh</Text>
        </View>
      </SafeAreaView>
    )
  );
}
