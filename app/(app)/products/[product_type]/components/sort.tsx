import { Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import React, { useCallback, useContext } from 'react';
import { sortItem } from '@/config/sort';
import { ParamsContext } from '../ParamsProvider';

export default function ProductSort() {
  const { params, setParams } = useContext(ParamsContext);

  const handleSortChange = useCallback(
    (key: string) => {
      if (typeof window !== 'undefined') {
        const sort = sortItem[`${key}`];
        setParams((prevParams: any) => {
          return { ...prevParams, sortColumn: sort?.sortColumn };
        });
        if (sort.sortDirection) {
          setParams((prevParams: any) => {
            return {
              ...prevParams,
              sortDirection: sort.sortDirection,
            };
          });
        } else {
          setParams((prevParams: any) => {
            return {
              ...prevParams,
              sortDirection: null,
            };
          });
        }
      }
    },
    [params]
  );
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={true}
      style={styles.scrollView}
    >
      {Object.entries(sortItem)?.map((s) => {
        return (
          <Pressable
            style={styles.box}
            key={s?.[0]}
            onPress={() => handleSortChange(s?.[0])}
          >
            <Text
              className={`font-bold ${s?.[1]?.sortColumn === params?.sortColumn && s?.[1]?.sortDirection === params?.sortDirection ? 'text-red-500' : ''}`}
            >
              {s?.[1]?.preview}
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
