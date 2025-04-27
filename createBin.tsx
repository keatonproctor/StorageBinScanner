import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App';
import QRCode from 'react-native-qrcode-svg';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system'; // Ensure FileSystem is imported

const storageFilePath = FileSystem.documentDirectory + 'storageBinScanner.json'; // Define the file path

const CreateBin = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const qrCodeRef = useRef<any>(null);
  const [items, setItems] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollViewRef = useRef<ScrollView>(null); // Create a ref for the ScrollView
  const [isGenerateBinEnabled, setIsGenerateBinEnabled] = useState(false); // State to track button enable/disable
  const [binTitle, setBinTitle] = useState(''); // State to store the bin title
  const [isBinNameSet, setIsBinNameSet] = useState(false); // State to track if the bin name is set

  useEffect(() => {
    setIsGenerateBinEnabled(items.length > 0); // Enable button if at least 1 item exists
  }, [items]);

  const handleAddItem = () => {
    if (inputValue.trim()) {
      setItems([inputValue.trim(), ...items]); // Add new item to the top of the list
      setInputValue('');
    }
  };

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const generateUniqueId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit random number as a string
  };

  const saveBinToFile = async (binData: any) => {
    try {
      const fileContents = await FileSystem.readAsStringAsync(storageFilePath);
      const bins = JSON.parse(fileContents);
      bins.push(binData); // Add the new bin data to the array
      await FileSystem.writeAsStringAsync(storageFilePath, JSON.stringify(bins));
      console.log('Updated file contents:', bins); // Log the updated file contents
    } catch (error) {
      console.error('Error saving bin to file:', error);
    }
  };

  const handleGenerateBin = () => {
    Alert.alert(
      "Generate Bin",
      "You're about to generate a new bin, continue?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("User canceled bin generation"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
          const uniqueId = generateUniqueId();
          const binData = [uniqueId, binTitle, ...items]; // Ensure unique ID is the zeroth index and title is the first index
          await saveBinToFile(binData); // Save the bin data to the file
          setItems([]); // Clear the list in the user interface
          setBinTitle(''); // Clear the bin title
          setIsBinNameSet(false); // Reset the bin name state
          navigation.navigate('GeneratedQRCode', { qrData: uniqueId }); // Navigate to the QR code page with the unique ID
        },
        },
      ]
    );
  };

  const handleSetBinNameOrAddItem = () => {
    if (!isBinNameSet) {
      if (inputValue.trim()) {
        setBinTitle(inputValue.trim()); // Set the bin title
        setInputValue(''); // Clear the input field
        setIsBinNameSet(true); // Mark the bin name as set
      }
    } else {
      handleAddItem(); // Proceed with adding items
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backButtonText}>← Home</Text>
        </TouchableOpacity>
        {isBinNameSet && (
          <Text style={styles.binTitle}>{binTitle}</Text> // Display the title at the very top once set
        )}
        <View style={styles.fixedItemsContainer}> 
          <ScrollView ref={scrollViewRef} style={styles.scrollableList} alwaysBounceVertical={true}>
            {items.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.itemText}>{item}</Text>
                <TouchableOpacity onPress={() => handleDeleteItem(index)} style={styles.deleteButton}>
                  <Image source={require('./assets/delete.png')} style={styles.deleteIcon} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={isBinNameSet ? "Enter an item" : "Enter the name of the bin"} // Dynamic placeholder
          placeholderTextColor="#999"
          returnKeyType="default" 
        />
        <View style={styles.buttonRow}> 
          <TouchableOpacity style={styles.addButton} onPress={handleSetBinNameOrAddItem}>
            <Text style={styles.addButtonText}>{isBinNameSet ? "Add Item" : "Set Bin Name"}</Text> 
          </TouchableOpacity>
          {isBinNameSet && (
            <TouchableOpacity
              style={[styles.generateButton, !isGenerateBinEnabled && { backgroundColor: '#BDBDBD' }]} // Gray out button when disabled
              onPress={handleGenerateBin}
              disabled={!isGenerateBinEnabled}
            >
              <Text style={styles.generateButtonText}>Generate Bin</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFEB3B', // Match the background color of the home page
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
  fixedItemsContainer: {
    width: '100%',
    padding: 10,
    alignItems: 'flex-start',
    position: 'absolute',
    top: 100, // Adjust the position as needed
  },
  scrollableList: {
    maxHeight: 240, // Adjusted height to fit 6 items before scrolling
    width: '100%',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  itemText: {
    fontSize: 18, // Increased font size for list items
    color: '#212121',
    marginBottom: 5,
    marginLeft: 15, // Added spacing from the left side of the screen
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 5,
    marginRight: 15, // Moved the delete icon in from the right side of the screen
  },
  deleteIcon: {
    width: 30, // Set the width of the delete icon
    height: 30, // Set the height of the delete icon
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: '#000', // Keep the border black
    borderWidth: 3, // Make the border thicker
    textAlign: 'center', // Center placeholder and entered text
    borderRadius: 10, // Retain rounded corners
    paddingHorizontal: 10,
    marginBottom: 20, // Maintain spacing between input and button
    marginTop: 60, // Add spacing above the input
  },
  titleInput: {
    width: '90%',
    height: 40,
    borderColor: '#000',
    borderWidth: 3,
    textAlign: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 20,
  },
  binTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 10,
    position: 'absolute',
    top: 80, // Position the title at the very top
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10, // Add spacing above the buttons
    gap: 10, // Add spacing between the buttons
  },
  addButton: {
    backgroundColor: '#212121',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5, // Add spacing between buttons
  },
  addButtonText: {
    color: '#FFEB3B',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  printButton: {
    backgroundColor: '#212121',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  printButtonText: {
    color: '#FFEB3B',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  generateButton: {
    backgroundColor: '#212121',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5, // Add spacing between buttons
  },
  generateButtonText: {
    color: '#FFEB3B',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CreateBin;