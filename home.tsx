import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App';
import * as FileSystem from 'expo-file-system'; // Revert to using Expo FileSystem

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const storageFilePath = `${FileSystem.documentDirectory}storageBinScanner.json`; // Define the original path

const initializeStorageFile = async () => {
  try {
    const fileExists = await FileSystem.getInfoAsync(storageFilePath);
    if (!fileExists.exists) {
      await FileSystem.writeAsStringAsync(storageFilePath, JSON.stringify([])); // Create an empty JSON file
      console.log('storageBinScanner.json created successfully at:', storageFilePath);
    } else {
      console.log('storageBinScanner.json already exists at:', storageFilePath);
    }
  } catch (error) {
    console.error('Error initializing storage file:', error);
  }
};

const Home = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    initializeStorageFile();
  }, []); // Run on component mount

  return (
    <View style={styles.container}>
      <Image source={require('./assets/icon.png')} style={styles.icon} />
      <TouchableOpacity
        style={styles.mainButton} 
        onPress={() => navigation.navigate('Scanner')} 
      >
        <Text style={styles.mainButtonText}>Scan Now</Text>
      </TouchableOpacity>
      <View style={styles.buttonRow}> 
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BinsList')}>
          <Text style={styles.buttonText}>My Bins</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createNewButton} onPress={() => navigation.navigate('CreateBin')}>
          <Text style={styles.buttonText}>Create New Bin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFEB3B', // Changed background to yellow
    paddingTop: 300,
  },
  icon: {
    width: 200,
    height: 200,
    marginBottom: 0,
  },
  mainButton: {
    backgroundColor: '#212121', // Changed button color to black
    paddingVertical: 20, // Increased padding for larger button
    paddingHorizontal: 40, // Increased padding for larger button
    borderRadius: 10, // Increased border radius for more prominent button
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  mainButtonText: {
    color: '#FFEB3B', // Changed button text color to yellow
    fontSize: 18, // Increased font size for more prominent text
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'space-between', // Add space between buttons
    marginTop: 40,
  },
  button: {
    backgroundColor: '#212121',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    flex: 1, // Keep 'My Bins' button flexible
    alignItems: 'center',
  },
  createNewButton: {
    backgroundColor: '#212121',
    paddingVertical: 15,
    paddingHorizontal: 33, // Shorten width for 'Create New Bin'
    borderRadius: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFEB3B', // Changed button text color to yellow
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Home;