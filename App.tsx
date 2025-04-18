import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import Home from './home';
import Scanner from './scanner';
import BinsList from './binsList';

// Define the type for the navigation stack
export type RootStackParamList = {
  Home: undefined;
  Scanner: undefined;
  BinsList: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          animation: route.name === 'Home' ? 'slide_from_left' : 'slide_from_right',
          gestureDirection: 'horizontal',
          gestureEnabled: false, // Disable swipe gestures for all screens
        })}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Scanner" component={Scanner} />
        <Stack.Screen name="BinsList" component={BinsList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
