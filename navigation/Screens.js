import React from 'react';
import { Easing, Animated, Dimensions } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';

// screens
import Home from '../screens/Home';
import History from '../screens/History';
import ProfileScreen from '../screens/perfil/index';
import RegisterScreen from '../screens/Register';
import LoginScreen from '../screens/Login';
import Onboarding from '../screens/Onboarding';

import RequestServiceScreen from '../screens/RequestService';
import CuponesIndexScreen from '../screens/cupones/Index';

// drawer
import Drawer from './Drawer';
import DrawerItem from '../components/DrawerItem';

// header for screens
import Header from '../components/Header';
import { nowTheme } from '../constants';

const { width } = Dimensions.get('screen');

const transitionConfig = (transitionProps, prevTransitionProps) => ({
  transitionSpec: {
    duration: 400,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing
  },
  screenInterpolator: sceneProps => {
    const { layout, position, scene } = sceneProps;
    const thisSceneIndex = scene.index;
    const width = layout.initWidth;

    const scale = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [4, 1, 1]
    });
    const opacity = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [0, 1, 1]
    });
    const translateX = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex],
      outputRange: [width, 0]
    });

    const scaleWithOpacity = { opacity };
    const screenName = 'Search';

    if (
      screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName)
    ) {
      return scaleWithOpacity;
    }
    return { transform: [{ translateX }] };
  }
});

const ProfileStack = createStackNavigator(
  {
    Profile: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header title="Perfil" iconColor={nowTheme.COLORS.SECONDARY} navigation={navigation} />
        ),
        headerTransparent: true
      })
    }
  },
  {
    cardStyle: { backgroundColor: '#FFFFFF' },
    transitionConfig
  }
);

const CuponesStack = createStackNavigator(
  {
    CuponesIndex: {
      screen: CuponesIndexScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header title="Cupones" iconColor={nowTheme.COLORS.SECONDARY} navigation={navigation} />
        ),
        headerTransparent: false
      })
    }
  },
  {
    cardStyle: { backgroundColor: '#FFFFFF' },
    transitionConfig
  }
);

const DrawerClient = createDrawerNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="Home" title="Inicio" />
        )
      })
    },
    History: {
      screen: History,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    Agenda: {
      screen: RequestServiceScreen,
      navigationOptions: {
        drawerLabel: () => {}
      }
    },

    Perfil: {
      screen: ProfileStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="Profile" title="Perfil" />
        )
      })
    },
    Idioma: {
      screen: ProfileStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="Profile" title="Idioma" />
        )
      })
    },
    Cupones: {
      screen: CuponesStack,
      navigationOptions: {
        drawerLabel: () => {}
      }
    }
  },
  {
    contentComponent: Drawer,
    drawerBackgroundColor: '#F7F7F7',
    drawerWidth: width * 0.95,
    contentOptions: {
      activeTintColor: nowTheme.COLORS.SECONDARY,
      inactiveTintColor: nowTheme.COLORS.SECONDARY,
      activeBackgroundColor: 'transparent',
      itemStyle: {
        width: width * 1,
        backgroundColor: 'transparent'
      },
      labelStyle: {
        fontSize: 18,
        marginLeft: 20,
        fontWeight: 'normal'
      },
      itemsContainerStyle: {
        paddingVertical: 16,
        paddingHorizonal: 12,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }
    },
    initialRouteName: 'Home',
  }
);

// Main App Navigation
export const AppStack = createSwitchNavigator({
  Onboarding: {
    screen: Onboarding,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: true
    }
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: true
    }
  },
  DrawerClient: {
      screen: DrawerClient,
      navigationOptions: {
          header: null,
          gesturesEnabled: false
      }
  }
},
{
  headerMode: 'none',
  initialRouteName : "Onboarding",
}
);

const AppContainer = createAppContainer(AppStack);
export default AppContainer;
