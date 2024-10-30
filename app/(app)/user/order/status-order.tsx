import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { statusOrder } from '@/config/status_order';
type Props = {
  status: string;
  handleChangeStatus: (status: string) => void;
};
export default function StatusOrder({ status, handleChangeStatus }: Props) {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={true}
      style={styles.scrollView}
    >
      <Pressable style={styles.box} onPress={() => handleChangeStatus('')}>
        <Text className={`font-bold  ${status === '' ? 'text-red-500' : ''}`}>
          Tất cả
        </Text>
      </Pressable>
      {statusOrder.map((s) => {
        return (
          <Pressable
            style={styles.box}
            key={s.value}
            onPress={() => handleChangeStatus(s?.value.toString())}
          >
            <Text
              className={`font-bold  ${status === s?.value?.toString() ? 'text-red-500' : ''}`}
            >
              {s?.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingVertical: 4,
  },
  box: {
    marginHorizontal: 10,
    height: 48,
  },
});
