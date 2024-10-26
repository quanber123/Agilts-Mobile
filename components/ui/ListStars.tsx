import React from 'react';
import { View, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type ListStarsProps = {
  size?: number;
  rating: string;
};

const ListStars: React.FC<ListStarsProps> = ({ size = 16, rating }) => {
  const getStarArray = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    return [
      ...Array(fullStars).fill('full'),
      ...Array(halfStar).fill('half'),
      ...Array(emptyStars).fill('empty'),
    ];
  };

  const stars = getStarArray(Number(rating));

  return (
    <View className='text-red-500' style={styles.container}>
      {stars.map((star, index) => (
        <View key={index} style={{ width: size, height: size }}>
          {star === 'full' && (
            <FontAwesome name='star' size={size} color='#ef4444' />
          )}
          {star === 'half' && (
            <FontAwesome name='star-half-o' size={size} color='#ef4444' />
          )}
          {star === 'empty' && (
            <FontAwesome name='star-o' size={size} color='#ef4444' />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  starIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
});

export default React.memo(ListStars);
