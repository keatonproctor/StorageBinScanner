import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './App';
import * as Print from 'expo-print';

const GeneratedQRCode = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'GeneratedQRCode'>>();
  const { qrData } = route.params;

  const handlePrint = async () => {
    if (!qrData) return;

    const htmlContent = `
      <html>
        <body style="margin: 0; padding: 0;">
          <div style="position: absolute; top: 0; left: 0; width: 2in; height: 2in;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=200x200" style="width: 100%; height: 100%;" />
          </div>
        </body>
      </html>
    `;

    console.log('QR Code Image Source:', `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=200x200`);

    try {
      await Print.printAsync({ html: htmlContent });
    } catch (error) {
      if (error instanceof Error && error.message === 'Printing did not complete') {
        return; // Suppress the error if printing was canceled
      }
      console.error('Error printing QR code:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generated QR Code</Text>
      <QRCode value={qrData} size={200} />
      <TouchableOpacity style={styles.printButton} onPress={handlePrint}>
        <Text style={styles.printButtonText}>Print</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFEB3B',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  printButton: {
    marginTop: 20,
    backgroundColor: '#212121',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  printButtonText: {
    color: '#FFEB3B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GeneratedQRCode;