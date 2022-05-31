import React from 'react';
import { Image, StyleSheet, StatusBar, Dimensions, Platform, Alert } from 'react-native';
import { Block, Button, Text, theme, Toast } from 'galio-framework';

const { height, width } = Dimensions.get('screen');
import { Images, nowTheme } from '../constants/';
import { HeaderHeight } from '../constants/utils';
import Actions from '../lib/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthenticationService from '../services/authentication';

import I18n from '../lib/i18n';

const smallScreen = height < 812 ? true : false;

export default class Onboarding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMessage: this.props.navigation.state.params ? this.props.navigation.state.params.hasMessage : false,
      message   : this.props.navigation.state.params ? this.props.navigation.state.params.message : '',
    };
  }

  async componentDidMount() {
    //await Actions.removeUserData().then((response) => console.log("BORRADO"));
    await Actions.extractUserData().then((result) => {
      if (result != null) {
          this.props.navigation.navigate('Home');
      }
    });
  }

  loginAsGuest = async() => {
    this.setState({isLoading : true});

    const mobileToken = await AsyncStorage.getItem("movil_token");

    let params = {
      is_guest : true,
      device_id : mobileToken
    };

    await AuthenticationService.guest(params)
      .then(async (response) => {
        try {
          await AsyncStorage.setItem('access_token', response.token);
          await AsyncStorage.setItem('user', JSON.stringify(response));

          this.setState({ isLoading: false });
          this.props.navigation.navigate('Home');
        } catch (error) {
          console.error(error);
          this.setState({ isLoading: false });
          Alert.alert('Inicio de sesión', 'Ocurrió un error inesperado al iniciar sesión.');
        }
      })
      .catch(error => {
        this.setState({ isLoading: false });
        Alert.alert('Upps!', 'Correo o contraseña incorrectas.');
      })
  }

  render() {
    const { navigation } = this.props;

      return (
        <Block flex style={styles.container}>
          <StatusBar barStyle="light-content" />
          <Block flex>
            <Block space="between" style={styles.padded}>
              <Toast isShow={this.state.hasMessage} positionIndicator="top" color="success">{this.state.message}</Toast>
              <Block>
                <Block row style={{justifyContent : 'center'}}>
                  <Image source={Images.Logo} style={styles.logo} />
                </Block>

                <Block row>
                  <Button
                    shadowless
                    style={styles.button}
                    color={nowTheme.COLORS.BASE}
                    onPress={() => navigation.navigate('Login')}
                  >
                    <Text style={{ fontFamily: 'trueno-semibold', fontSize: 20, fontWeight: '600' }} color={nowTheme.COLORS.WHITE}>{ I18n.t('onBoarding.buttonLoginText') }</Text>
                  </Button>
                </Block>

                <Block row style={{marginTop: theme.SIZES.BASE * 0.8}}>
                  <Button
                    shadowless
                    style={styles.button}
                    color={nowTheme.COLORS.BASE}
                    onPress={() => this.loginAsGuest()}
                  >
                    <Text style={{ fontFamily: 'trueno-semibold', fontSize: 20, fontWeight: '600' }} color={nowTheme.COLORS.WHITE}>{ I18n.t('onBoarding.buttonGuestText') }</Text>
                  </Button>
                </Block>

                <Block row style={{marginTop: theme.SIZES.BASE * 0.8,marginBottom: theme.SIZES.BASE * 0.5}}>
                  <Button
                    shadowless
                    style={styles.button}
                    color={nowTheme.COLORS.BASE}
                    onPress={() => navigation.navigate('Register')}
                  >
                    <Text style={{ fontFamily: 'trueno-semibold', fontSize: 20, fontWeight: '600' }} color={nowTheme.COLORS.WHITE}>
                      { I18n.t('onBoarding.buttonRegisterText') }
                    </Text>
                  </Button>
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'android' ? - HeaderHeight : 0,
    backgroundColor: nowTheme.COLORS.WHITE,
  },

  logo : {
    width   : 300,
    height  : 300,
    bottom  : 50
  },

  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: 'absolute',
    bottom: Platform.OS === 'android' ? theme.SIZES.BASE * 2 : theme.SIZES.BASE * 3
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    borderRadius: 50,
  },

  buttonCircle: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    borderRadius: 50,
    bottom: 50,
    marginRight: 20,

    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
