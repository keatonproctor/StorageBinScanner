import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const Scanner = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Scanner Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEB3B', // Same yellow as the home page
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121', // Black text to contrast with yellow background
    textAlign: 'center',
  },
});

export default Scanner;