import React from 'react';
import { ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
type Props = {
  customClass?: string;
  columnWrapperStyle?: any;
  data: any;
  isLoading: boolean;
  onEndReached: () => void;
  renderItem: any;
  isPaginate?: boolean;
  numColumns?: number;
  contentContainerStyle?: number;
  onEndReachedThreshold?: number;
};
function ListItem({
  customClass,
  data,
  isLoading,
  onEndReached,
  renderItem,
  columnWrapperStyle = {},
  numColumns = 1,
  isPaginate = false,
  contentContainerStyle = 0,
  onEndReachedThreshold = 0.5,
}: Props) {
  return isPaginate ? (
    <FlatList
      className={`${customClass ? customClass : 'flex-col bg-white'}`}
      data={data}
      renderItem={renderItem}
      numColumns={numColumns}
      columnWrapperStyle={columnWrapperStyle}
      contentContainerStyle={{ gap: contentContainerStyle }}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      ListFooterComponent={
        isLoading ? <ActivityIndicator size='small' color='#ef4444' /> : null
      }
    />
  ) : (
    <FlatList
      numColumns={numColumns}
      columnWrapperStyle={columnWrapperStyle}
      contentContainerStyle={{ gap: contentContainerStyle }}
      className={`${customClass ? customClass : 'flex-col bg-white'}`}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}

export default React.memo(ListItem);
