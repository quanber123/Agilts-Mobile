import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default function LoadingApp() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color='#ef4444' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});
