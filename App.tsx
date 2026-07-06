import { Provider } from 'react-redux';
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { persistor, store } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import MainLoader from './src/components/Loaders/MainLoader';
import { StatusBar } from 'react-native';
import { NavigationController } from './src/navigation/NavigationController';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '960335128349-dl7qn70fsgojkntkulirt2teb5vabv0c.apps.googleusercontent.com',
});

export default function App() {

  return (
    <Provider store={store}>
      <StatusBar barStyle={"dark-content"} />
      <PersistGate loading={<MainLoader />} persistor={persistor}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F2EC" }}>
          <NavigationContainer>
              <NavigationController/>
          </NavigationContainer>
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
}