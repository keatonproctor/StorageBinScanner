import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EditBin = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit Bin Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFEB3B', // Match the background color of other pages
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121', // Black text to contrast with yellow background
  },
});

export default EditBin;