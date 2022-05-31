import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block, GalioProvider } from 'galio-framework';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { nowTheme } from './constants';
import Screens from './navigation/Screens';

async function _getToken() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  await AsyncStorage.setItem('movil_token', token);
  console.log('Our token', token);
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();

        await _getToken();

        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          'montserrat-regular': require('./assets/font/Montserrat-Regular.ttf'),
          'montserrat-bold'   : require('./assets/font/Montserrat-Bold.ttf'),
          'trueno-extrabold'  : require('./assets/font/TruenoExBd.ttf'),
          'trueno-semibold'   : require('./assets/font/TruenoSBd.ttf'),
          'trueno'            : require('./assets/font/TruenoRg.ttf'),
          'trueno-light'      : require('./assets/font/TruenoLt.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GalioProvider theme={nowTheme}>
      <Block flex onLayout={onLayoutRootView}>
        <Screens />
      </Block>
    </GalioProvider>
  );
}
