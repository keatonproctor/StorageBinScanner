## April 18, 2025

### Added
- Implemented QR code scanning functionality using `expo-camera`.
- Configured `CameraView` to automatically detect QR codes with the `onBarCodeScanned` callback.
- Added `barcodeScannerSettings` to specify QR code scanning.

### Updated
- Adjusted `scanner.tsx` to handle QR code scanning and log results to the console.
- Ensured proper permissions are requested for camera access.