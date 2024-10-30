import {
  Modal,
  Pressable,
  View,
  Text,
  FlatList,
  TextInput,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ScrollView } from 'react-native-gesture-handler';
import { router, useLocalSearchParams } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
const formatNumber = (value: string) => {
  if (!value) return '';
  const numericValue = parseFloat(value.replace(/,/g, ''));
  return isNaN(numericValue)
    ? ''
    : new Intl.NumberFormat('vi-VN').format(numericValue);
};

export default function FilterDialog({ filters }: any) {
  const params = useLocalSearchParams();
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [filterForm, setFilterForm] = useState<any>();
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});
  const minPrice = useMemo(() => {
    return filters?.find((f: any) => f.name === 'minPrice');
  }, [filters]);
  const maxPrice = useMemo(() => {
    return filters?.find((f: any) => f.name === 'maxPrice');
  }, [filters]);
  const formatFilter = useMemo(() => {
    return filters?.filter(
      (f: any) => f.name !== 'maxPrice' && f.name !== 'minPrice'
    );
  }, [filters]);
  const handleInputChange = (input: string, name: string) => {
    const numericValue = input.replace(/[^0-9]/g, '');
    setFilterForm((prevForm: any) => {
      return { ...prevForm, [name]: numericValue };
    });
  };
  const formatFilterForm = useMemo(() => {
    return filters?.map((f: any) => f.name);
  }, [filters]);

  const handleChange = useCallback((type_form: string, value: string) => {
    setFilterForm((prevForm: any) => ({
      ...prevForm,
      [type_form]: value,
    }));
  }, []);

  const handleDeleteKey = useCallback(
    (key: string) => {
      const newParams = { ...params };
      delete newParams[key];
      router.setParams(newParams);
    },
    [params, router]
  );
  const handleDeleteKeyPrice = useCallback(() => {
    const newParams = { ...params };
    delete newParams['minPrice'];
    delete newParams['maxPrice'];
    router.setParams(newParams);
  }, [router]);
  const handleDeleteAllKey = useCallback(() => {
    router.setParams({});
    setIsVisibleModal(false);
  }, [router]);
  const handleApply = useCallback(() => {
    const newParams = { ...params };

    Object.keys(filterForm).forEach((key) => {
      if (filterForm[key]) {
        newParams[key] = filterForm[key];
      }
    });
    router.setParams(newParams);
    setIsVisibleModal(false);
  }, [filterForm, params, router]);
  useEffect(() => {
    const initialFilter = formatFilterForm?.reduce((acc: any, key: any) => {
      if (key === 'minPrice' || key === 'maxPrice') {
        acc[key] = Number(params[key]) || 0;
      } else {
        acc[key] = params[key] || '';
      }
      return acc;
    }, {});

    setFilterForm(initialFilter);
  }, [formatFilterForm, params]);

  const toggleExpand = (key: string) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };
  return (
    <View>
      <Pressable onPress={() => setIsVisibleModal(true)}>
        <AntDesign name='filter' size={26} color='#ef4444' />
      </Pressable>
      <Modal
        transparent={true}
        statusBarTranslucent={true}
        visible={isVisibleModal}
        animationType='fade'
      >
        <View className='flex-1' style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <SafeAreaView className='ml-auto w-11/12 h-full bg-white px-4'>
            <View className='flex-row justify-between items-center'>
              <Text className='text-lg font-bold'>
                Bộ lọc tìm kiếm nâng cao
              </Text>
              <Pressable onPress={() => setIsVisibleModal(false)}>
                <FontAwesome6 name='xmark' size={24} color='black' />
              </Pressable>
            </View>
            <ScrollView className='flex-1'>
              <View className='gap-y-6'>
                {formatFilter?.map((f: any, index: number) => {
                  const isExpanded = expandedSections[f.name] || false;
                  return (
                    <View key={index} className='gap-4'>
                      <View className='flex-row justify-between items-center'>
                        <Text className='text-lg font-bold'>{f?.label}</Text>
                        <Pressable onPress={() => handleDeleteKey(f?.name)}>
                          <Text className='text-blue-500'>
                            Xóa {f?.label?.toLowerCase()}
                          </Text>
                        </Pressable>
                      </View>
                      <View
                        style={{
                          height: isExpanded
                            ? 56 * Math.ceil(f?.data?.length / 2)
                            : f?.data?.length >= 3
                              ? 112
                              : 56,
                        }}
                      >
                        <FlatList
                          contentContainerStyle={{
                            gap: 20,
                          }}
                          columnWrapperStyle={{
                            justifyContent: 'space-between',
                          }}
                          numColumns={2}
                          keyExtractor={(index) => index.toString()}
                          data={f?.data}
                          renderItem={({ item }: any) => {
                            const itemKey =
                              typeof item === 'object'
                                ? Object.keys(item)[0]
                                : item;
                            return (
                              <Pressable
                                className={`w-[46%] border px-4 py-2 justify-center items-center ${
                                  filterForm[f?.name] === itemKey
                                    ? 'border-red-500'
                                    : 'border-neutral-500'
                                }`}
                                onPress={() => handleChange(f?.name, itemKey)}
                              >
                                <Text
                                  numberOfLines={1}
                                  className='h-[18px] font-medium text-neutral-400 text-xs'
                                >
                                  {typeof item === 'object'
                                    ? item[itemKey]
                                    : item}
                                </Text>
                              </Pressable>
                            );
                          }}
                        />
                      </View>
                      {f?.data?.length > 6 && (
                        <View className='justify-center items-center font-bold'>
                          <Pressable
                            className='w-[120px] flex-row justify-center items-center'
                            onPress={() => toggleExpand(f.name)}
                          >
                            <Text className='text-neutral-800 font-bold text-center'>
                              {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                            </Text>
                            <MaterialIcons
                              name={`keyboard-arrow-${isExpanded ? 'up' : 'down'}`}
                              size={24}
                              color='black'
                            />
                          </Pressable>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
              <View className='gap-4'>
                <View className='flex-row justify-between items-center'>
                  <Text className='text-lg font-bold'>Giá tiền</Text>
                  <Pressable onPress={handleDeleteKeyPrice}>
                    <Text className='text-blue-500'>Xóa giá tiền</Text>
                  </Pressable>
                </View>
                <View>
                  <View className='gap-1 my-2'>
                    <Text className='text-neutral-500'>
                      (Từ {minPrice?.data?.preview})
                    </Text>
                    <TextInput
                      placeholder='0'
                      className='border border-neutral-300 px-2 py-1'
                      value={formatNumber(filterForm?.minPrice)}
                      onChangeText={(text) =>
                        handleInputChange(text, 'minPrice')
                      }
                    />
                  </View>
                  <View className='gap-1 my-2'>
                    <Text className='text-neutral-500'>
                      (Đến {maxPrice?.data?.preview})
                    </Text>
                    <TextInput
                      className='border border-neutral-300 px-2 py-1'
                      placeholder='0'
                      value={formatNumber(filterForm?.maxPRice)}
                      onChangeText={(text) =>
                        handleInputChange(text, 'maxPrice')
                      }
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
            <View className='p-4 flex-row justify-between items-center'>
              <Pressable
                className='w-1/2 border border-red-500 py-2 mr-4'
                onPress={handleDeleteAllKey}
              >
                <Text className='text-red-500 text-center font-medium'>
                  Thiết lập lại
                </Text>
              </Pressable>
              <Pressable className='w-1/2 border border-red-500 bg-red-500 py-2'>
                <Text
                  className='text-white text-center font-medium'
                  onPress={handleApply}
                >
                  Áp dụng
                </Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}
