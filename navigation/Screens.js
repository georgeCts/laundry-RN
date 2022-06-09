import React from 'react';
import { Easing, Animated, Dimensions } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';

// screens
import Home from '../screens/Home';
import History from '../screens/History';
import Schedule from '../screens/Schedule';
import ProfileScreen from '../screens/perfil/index';
import RegisterScreen from '../screens/Register';
import LoginScreen from '../screens/Login';
import Onboarding from '../screens/Onboarding';

import RequestServiceScreen from '../screens/RequestService';
import AgendaIndexScreen from '../screens/agenda/Index';
import AgendaFechaScreen from '../screens/agenda/DateAddressConf';
import AgendaInsumosScreen from '../screens/agenda/SuppliesConf';
import AgendaCheckoutScreen from '../screens/agenda/CheckoutConf';
import AgendaSuccessScreen from '../screens/agenda/Success';
import AgendaProgressScreen from '../screens/agenda/Progress';
import AgendaChatScreen from '../screens/agenda/Chat';

import DomicilioIndexScreen from '../screens/domicilios/Index';
import DomicilioInfoScreen from '../screens/domicilios/Information';
import DomicilioLocationScreen from '../screens/domicilios/Location';

import MetodoPagoIndexScreen from '../screens/metodosPagos/Index';
import MetodoPagoAddCardScreen from '../screens/metodosPagos/AddCard';

import CuponesIndexScreen from '../screens/cupones/Index';

import GeneraIngresoIndexScreen from '../screens/generarIngresos/Index';

import SoporteIndexScreen from '../screens/soporte/Index';
import SoporteCitaScreen from '../screens/soporte/Cita';

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

const ChatStack = createStackNavigator(
  {
    Chat: {
      screen: AgendaChatScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header back goToSchedule title="Chat" iconColor={nowTheme.COLORS.SECONDARY} navigation={navigation} />
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

const DomicilioStack = createStackNavigator(
  {
    DomicilioIndex: {
      screen: DomicilioIndexScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header title="Domicilio" iconColor={nowTheme.COLORS.SECONDARY} navigation={navigation} />
        ),
        headerTransparent: false
      })
    },
    DomicilioLocation: {
      screen: DomicilioLocationScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header back title="Domicilio" iconColor={nowTheme.COLORS.SECONDARY} navigation={navigation} />
        ),
        headerTransparent: false
      })
    },
    DomicilioInfo: {
      screen: DomicilioInfoScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header back title="Domicilio" iconColor={nowTheme.COLORS.SECONDARY} navigation={navigation} />
        ),
        headerTransparent: false
      })
    },
  },
  {
    cardStyle: { backgroundColor: '#FFFFFF' },
    transitionConfig
  }
);

const MetodoPagoStack = createStackNavigator(
  {
    MetodoPagoIndex: {
      screen: MetodoPagoIndexScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header title="Método de pago" iconColor={nowTheme.COLORS.SECONDARY} navigation={navigation} />
        ),
        headerTransparent: false
      })
    },
    MetodoPagoAddCard: {
      screen: MetodoPagoAddCardScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header back title="Método de pago" iconColor={nowTheme.COLORS.SECONDARY} navigation={navigation} />
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

const GeneraIngresoStack = createStackNavigator(
  {
    GeneraIngresoIndex: {
      screen: GeneraIngresoIndexScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header title="Genera Ingresos" iconColor={nowTheme.COLORS.SECONDARY} navigation={navigation} />
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

    Soporte: {
      screen: SoporteIndexScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    SoporteCita: {
      screen: SoporteCitaScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    BolsaTrabajo: {
      screen: SoporteCitaScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },

    Schedule: {
      screen: Schedule,
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
    AgendaFecha: {
      screen: AgendaFechaScreen,
      navigationOptions: {
        drawerLabel: () => {}
      }
    },
    AgendaInsumos: {
      screen: AgendaInsumosScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    AgendaCheckout: {
      screen: AgendaCheckoutScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    AgendaSuccess: {
      screen: AgendaSuccessScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    AgendaProgreso: {
      screen: AgendaProgressScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    AgendaChat: {
      screen: ChatStack,
      navigationOptions: {
        drawerLabel: () => { }
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
    Domicilio: {
      screen: DomicilioStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="DomicilioIndex" title="Domicilio" />
        )
      })
    },
    MetodoPago: {
      screen: MetodoPagoStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="MetodoPagoIndex" title="Método de pago" />
        )
      })
    },
    GeneraIngreso: {
      screen: GeneraIngresoStack,
      navigationOptions: {
        drawerLabel: () => { }
      }
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
