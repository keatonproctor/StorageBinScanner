import * as FileSystem from 'expo-file-system'; // Import FileSystem for file operations
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native'; // Import Image for the delete and edit icons
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App';
import { Swipeable } from 'react-native-gesture-handler'; // Import Swipeable for swipe functionality

const storageFilePath = FileSystem.documentDirectory + 'storageBinScanner.json'; // Define the file path

const BinsList = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [bins, setBins] = useState<any[]>([]); // State to store parsed bins
  const [expandedBins, setExpandedBins] = useState<Set<number>>(new Set()); // State to track expanded bins

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const fileContents = await FileSystem.readAsStringAsync(storageFilePath);
        const parsedBins = JSON.parse(fileContents);
        setBins(parsedBins);
      } catch (error) {
        console.error('Error reading bins file:', error);
      }
    };

    fetchBins();
  }, []);

  const toggleBinExpansion = (index: number) => {
    setExpandedBins((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const deleteItemFromBin = async (binIndex: number, itemIndex: number) => {
    try {
      const updatedBins = [...bins];
      updatedBins[binIndex].splice(itemIndex + 1, 1); // Remove the item from the bin
      setBins(updatedBins); // Update the state
      await FileSystem.writeAsStringAsync(storageFilePath, JSON.stringify(updatedBins)); // Save the updated bins to the file
      console.log('Updated file contents after deletion:', updatedBins);
    } catch (error) {
      console.error('Error deleting item from bin:', error);
    }
  };

  const deleteBin = async (binIndex: number) => {
    try {
      const updatedBins = [...bins];
      updatedBins.splice(binIndex, 1); // Remove the bin from the list
      setBins(updatedBins); // Update the state
      await FileSystem.writeAsStringAsync(storageFilePath, JSON.stringify(updatedBins)); // Save the updated bins to the file
      console.log('Updated file contents after bin deletion:', updatedBins);
    } catch (error) {
      console.error('Error deleting bin:', error);
    }
  };

  const editBinTitle = async (binIndex: number, newTitle: string) => {
    try {
      const updatedBins = [...bins];
      updatedBins[binIndex][1] = newTitle; // Update the title in the array
      setBins(updatedBins); // Update the state
      await FileSystem.writeAsStringAsync(storageFilePath, JSON.stringify(updatedBins)); // Save the updated bins to the file
      console.log('Updated file contents after title edit:', updatedBins);
    } catch (error) {
      console.error('Error editing bin title:', error);
    }
  };

  const renderRightActions = (binIndex: number) => (
    <TouchableOpacity
      style={styles.swipeDeleteButton}
      onPress={() => deleteBin(binIndex)}
    >
      <Text style={styles.swipeDeleteText}>Delete</Text>
    </TouchableOpacity>
  );

  const navigateToEditBin = (binIndex: number) => {
    navigation.navigate('EditBin', { binIndex }); // Navigate to the EditBin page with the bin index
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backButtonText}>← Home</Text>
      </TouchableOpacity>
      <ScrollView style={styles.scrollView}>
        {bins.map((bin, index) => (
          <Swipeable
            renderRightActions={() => renderRightActions(index)}
            key={index}
          >
            <TouchableOpacity
              style={styles.binContainer} // Make the entire white section clickable
              onPress={() => toggleBinExpansion(index)}
              activeOpacity={0.7} // Add animation effect on press
            >
              <View style={styles.binHeaderRow}>
                <TouchableOpacity onPress={() => navigateToEditBin(index)} style={styles.editButton}>
                  <Image source={require('./assets/edit.png')} style={styles.editIcon} />
                </TouchableOpacity>
                <View style={styles.centeredBinHeaderContainer}> 
                  <TextInput
                    style={styles.binHeaderInput}
                    value={bin[1] || ''}
                    onChangeText={(newTitle) => editBinTitle(index, newTitle)}
                    placeholder="Enter bin title"
                    placeholderTextColor="#999"
                  />
                </View>
                {bin.length > 1 ? (
                  <Text style={styles.toggleSymbol}>{expandedBins.has(index) ? '-' : '+'}</Text>
                ) : (
                  <Text style={styles.emptyBinMessage}>(Empty)</Text>
                )}
              </View>
              {expandedBins.has(index) && bin.length > 2 && (
                bin.slice(2).map((item: string, itemIndex: number) => (
                  <View key={itemIndex} style={styles.itemContainer}>
                    <Text style={styles.binItem}>- {item}</Text>
                    <TouchableOpacity onPress={() => deleteItemFromBin(index, itemIndex + 2)} style={styles.deleteButton}>
                      <Image source={require('./assets/delete.png')} style={styles.deleteIcon} />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </TouchableOpacity>
          </Swipeable>
        ))}
      </ScrollView>
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
  scrollView: {
    width: '100%',
    padding: 10,
    marginTop: 100, // Increased margin to move the bin headers further down below the back button
  },
  binContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F5F5F5', // Light gray background for bins
    borderTopLeftRadius: 10, // Rounded corners only on the left side
    borderBottomLeftRadius: 10, // Rounded corners only on the left side
    borderTopRightRadius: 0, // No rounding on the right side
    borderBottomRightRadius: 0, // No rounding on the right side
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, // Softer shadow for a subtle effect
    shadowRadius: 4,
    elevation: 2, // Slight elevation for depth
  },
  binHeader: {
    fontSize: 20, // Larger font size for better readability
    fontWeight: 'bold',
    color: '#333', // Darker text for contrast
  },
  binHeaderInput: {
    fontSize: 20, // Larger font size for better readability
    fontWeight: 'bold',
    color: '#333', // Darker text for contrast
    textAlign: 'center', // Center the text input
  },
  binItem: {
    fontSize: 16,
    color: '#555', // Softer text color for items
    marginLeft: 15, // Indent items for hierarchy
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
  binHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  placeholderSymbol: {
    width: 20, // Placeholder width to match the toggle symbol
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 5,
  },
  deleteIcon: {
    width: 20, // Set the width of the delete icon
    height: 20, // Set the height of the delete icon
  },
  emptyBinMessage: {
    fontSize: 16,
    color: 'red', // Red font for empty bin message
    marginLeft: 10,
  },
  binHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10, // Add spacing between header and items
  },
  editButton: {
    marginLeft: 10,
    padding: 5,
  },
  editIcon: {
    width: 20, // Set the width of the edit icon
    height: 20, // Set the height of the edit icon
  },
  leftAlignedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centeredBinHeaderContainer: {
    flex: 1,
    alignItems: 'center', // Center the content
    position: 'relative', // Allow positioning of the empty message
  },
  swipeDeleteButton: {
    backgroundColor: '#FF5252', // Bright red for delete button
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '77.7%', // Ensure the delete button matches the height of the bin container
    borderTopRightRadius: 0, // Match bin container rounding
    borderBottomRightRadius: 0, // Match bin container rounding
  },
  swipeDeleteText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BinsList;