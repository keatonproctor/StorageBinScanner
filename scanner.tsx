import { CameraView, Camera, useCameraPermissions } from 'expo-camera';
import { AppState, Button, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App';
import { useEffect, useRef } from 'react';

export default function Scanner() {
    const qrLock = useRef(false);
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                // App has come to the foreground
                qrLock.current = false;
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [permission, requestPermission] = useCameraPermissions();
  
    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
        <View style={styles.container}>
            <Text style={styles.message}>We need your permission to show the camera</Text>
            <Button onPress={requestPermission} title="grant permission" />
        </View>
        );
    }

    return (
        <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.backButtonText}>← Home</Text>
        </TouchableOpacity>
        <View style={styles.cameraContainer}>
            <CameraView 
                style={styles.scannerBox} 
                facing="back" 
                onBarcodeScanned={({ data }) => {
                    if(data && !qrLock.current) {
                        qrLock.current = true;
                        setTimeout(async () => {
                            await Linking.openURL(data); // Open the scanned URL
                            qrLock.current = false; // Reset the lock after opening the URL
                        }, 1000); // Delay for 1 second
                    }
                }}
                
            />
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFEB3B', // Match the background color of the home page
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    cameraContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scannerBox: {
        width: 300,
        height: 300, // Keep the box perfectly square
        borderWidth: 4, // Prominent border
        borderColor: '#212121', // Sleek black color
        borderRadius: 20, // Add more rounding for the edges
        overflow: 'hidden', // Ensure the camera content respects the rounded edges
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
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
