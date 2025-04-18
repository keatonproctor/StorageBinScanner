import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App';

const BinsList = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backButtonText}>← Home</Text>
      </TouchableOpacity>
      <Text style={styles.text}>This is the Bins List Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEB3B', // Same yellow as other pages
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121', // Black text to contrast with yellow background
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'transparent', // Remove background color
    paddingVertical: 0, // Remove padding
    paddingHorizontal: 0, // Remove padding
  },
  backButtonText: {
    color: '#212121', // Black text
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BinsList;