import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SignupScreen from './src/screens/SignupScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <SignupScreen />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}