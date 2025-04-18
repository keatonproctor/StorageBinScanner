import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App';
import QRCode from 'react-native-qrcode-svg';
import * as Print from 'expo-print';

// const handlePrintQRCode = async () => {
//   if (qrCodeRef.current) {
//     (qrCodeRef.current as any).toDataURL(async (dataURL: any) => {
//       const htmlContent = `
//         <html>
//           <body style="margin: 0; padding: 0;">
//             <div style="width: 3.5in; height: 3.5in; display: flex; justify-content: flex-start; align-items: flex-start;">
//               <img src="data:image/png;base64,${dataURL}" alt="QR Code" style="width: 100%; height: 100%; object-fit: contain;" />
//             </div>
//           </body>
//         </html>
//       `;

//       try {
//         await Print.printAsync({ html: htmlContent });
//       } catch (error: any) {
//         if (error.message !== 'Printing did not complete') {
//           console.error('Error printing QR code:', error);
//         }
//       }
//     });
//   }
// };

const CreateBin = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const qrCodeRef = useRef<any>(null);
  const [items, setItems] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = () => {
    if (inputValue.trim()) {
      setItems([...items, inputValue.trim()]);
      setInputValue('');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backButtonText}>← Home</Text>
        </TouchableOpacity>
        <View style={styles.itemsContainer}>
          {items.map((item, index) => (
            <Text key={index} style={styles.itemText}>{item}</Text>
          ))}
        </View>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Enter an item"
          returnKeyType="default" // Keep the enter button on the keyboard
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
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
  itemsContainer: {
    width: '100%',
    padding: 10,
    alignItems: 'flex-start',
  },
  itemText: {
    fontSize: 16,
    color: '#212121',
    marginBottom: 5,
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: '#212121',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#212121',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
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
});

export default CreateBin;