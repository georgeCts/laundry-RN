import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block, GalioProvider } from 'galio-framework';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import * as Localization from 'expo-localization';
import * as Font from 'expo-font';
import { nowTheme } from './constants';
import Screens from './navigation/Screens';

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
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
    token = (await Notifications.getExpoPushTokenAsync()).data;
    await AsyncStorage.setItem('movil_token', token);
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

async function registerLanguage() {
  const language = Localization.locale.indexOf('-' || "_") !== -1 ? Localization.locale.slice(0, 2) : Localization.locale;
  console.log(language);
  await AsyncStorage.setItem('language', language);
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();

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

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    registerLanguage();

    prepare();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
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
