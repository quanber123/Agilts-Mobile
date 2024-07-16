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
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
