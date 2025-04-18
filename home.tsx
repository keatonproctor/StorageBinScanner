import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const Home = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Image source={require('./assets/icon.png')} style={styles.icon} />
      <TouchableOpacity
        style={styles.mainButton} // Updated style for Scan Now button
        onPress={() => navigation.navigate('Scanner')} // Navigate to Scanner page
      >
        <Text style={styles.mainButtonText}>Scan Now</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BinsList')} // Navigate to BinsList page
      >
        <Text style={styles.buttonText}>My Bins</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: '#212121', // Changed button color to black
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#FFEB3B', // Changed button text color to yellow
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Home;