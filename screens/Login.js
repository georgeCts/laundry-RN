import React, { useState } from 'react';
import { StyleSheet, Image, Dimensions, TouchableWithoutFeedback, Keyboard, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, View, TouchableHighlight } from 'react-native';
import { Block, Text, Button, } from 'galio-framework';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withNavigation } from 'react-navigation';

import { Input } from '../components';
import { Images, nowTheme } from '../constants';
import AuthenticationService from '../services/authentication';
import I18n from '../lib/i18n';
const { width, height } = Dimensions.get('screen');

const DismissKeyboard = ({ children }) => (
  <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={{flex: 1}}>
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);

const LoginScreen = (baseProps) => {
  const [form, setForm] = useState({
    email     : '',
    password  : '',

  });
  const [isLoading, setIsLoading] = useState(false);

  const _handleLogin = () => {
    if(form.email != '' && form.password != '') {
      _handleRequest();
    } else {
      Alert.alert('Upps!', 'Al parecer el formulario de registro se encuentra incompleto.');
    }
  }

  const _handleRequest = async() => {
    setIsLoading(true);

    let params = {
      email : form.email,
      password : form.password
    };

    await AuthenticationService.login(params)
      .then(async (response) => {
        try {
          await AsyncStorage.setItem('access_token', response.access_token);
          await AsyncStorage.setItem('user', JSON.stringify(response.user));

          setForm({
            phone     : '',
            email     : '',
            name      : '',
            lastname  : '',
            password  : '',
            confirm   : '',
          });
          setIsLoading(false);
          baseProps.navigation.navigate('Home');
        } catch(error) {
          console.error(error);
          setIsLoading(false);
          Alert.alert('Inicio de sesión', 'Ocurrió un error inesperado al iniciar sesión.');
        }
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
        Alert.alert('Upps!', 'Correo o contraseña incorrectas.');
      })
  }

  const _goBack = () => {
      baseProps.navigation.navigate('Onboarding');
  }

  return (
    <DismissKeyboard>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <Block flex middle>
          <TouchableOpacity onPress={() => _goBack()} style={{alignSelf: 'flex-start', marginLeft: 20}}>
            <Image source={Images.Icons.RegresarRojo} style={{width: 25, height: 25}} />
          </TouchableOpacity>
          <Block flex space="evenly">
            <Block middle style={styles.titleContainer}>
              <Block middle>
                <Text style={{fontFamily: 'trueno-extrabold', textAlign: 'center'}} color={nowTheme.COLORS.BASE} size={32}>
                { I18n.t('login.title') }
                </Text>
              </Block>

              <Block middle>
                <Image source={Images.TaydRegistro} style={styles.logo} />
              </Block>
            </Block>

            <Block flex={1} middle space="between">
              <Block center flex={0.9}>
                <Block flex space="between">
                  <Block>
                    <Block width={width * 0.8}>
                      <Input
                        placeholder={ I18n.t('login.inputEmail') }
                        placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                        type="email-address"
                        style={styles.inputs}
                        iconContent={
                          <Image style={styles.inputIcons} source={Images.Icons.Correo} />
                        }
                        onChangeText={(text) => setForm({ ...form, email: text })}
                      />
                    </Block>
                    <Block width={width * 0.8}>
                      <Input
                        placeholder={ I18n.t('login.inputPassword') }
                        placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                        password
                        viewPass
                        style={styles.inputs}
                        iconContent={
                          <Image style={styles.inputIcons} source={Images.Icons.Contrasena} />
                        }
                        onChangeText={(text) => setForm({ ...form, password: text })}
                      />
                    </Block>
                    <Block width={width * 0.8} style={{ marginTop: nowTheme.SIZES.BASE * 0.8, marginBottom: 10 }}>
                      <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: 'trueno', fontSize: 12 }} color={nowTheme.COLORS.BASE}>{ I18n.t('login.labelRegister1') } </Text>
                        <TouchableHighlight onPress={() => baseProps.navigation.navigate('Register')}>
                          <View>
                            <Text style={{ fontFamily: 'trueno-semibold', fontSize: 12, fontWeight: '700' }} color={nowTheme.COLORS.BASE}> { I18n.t('login.labelRegister2') }</Text>
                          </View>
                        </TouchableHighlight>
                      </View>
                    </Block>

                    <Block width={width * 0.8} style={{marginBottom: nowTheme.SIZES.BASE * 2 }}>
                      <View style={{alignSelf: 'center', justifyContent: 'center' }}>
                        <TouchableHighlight onPress={() => { }}>
                          <View>
                            <Text style={{ fontFamily: 'trueno-semibold', fontSize: 12, fontWeight: '700' }} color={nowTheme.COLORS.BASE}>
                              { I18n.t('login.labelLostPassword') }
                            </Text>
                          </View>
                        </TouchableHighlight>
                      </View>
                    </Block>
                  </Block>
                  <Block center>
                    <Button
                      round
                      color={nowTheme.COLORS.BASE}
                      style={styles.createButton}
                      loading={isLoading}
                      disabled={isLoading}
                      onPress={() => _handleLogin()}>
                      <Text style={{ fontFamily: 'montserrat-bold' }} size={14} color={nowTheme.COLORS.WHITE}>
                        { I18n.t('login.buttonSignInText') }
                      </Text>
                    </Button>
                  </Block>
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
      </ScrollView>
    </DismissKeyboard>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: nowTheme.COLORS.WHITE,
    paddingTop: 45
  },
  titleContainer: {
    backgroundColor: nowTheme.COLORS.WHITE
  },
  logo : {
    width   : 300,
    height  : 300,
  },

  inputIcons: {
    marginRight: 25,
    width: 25,
    height: 25,
  },
  inputs: {
    borderWidth: 1,
    borderColor: '#C0C0C0',
    borderRadius: 21.5
  },
  passwordCheck: {
    paddingLeft: 2,
    paddingTop: 6,
    paddingBottom: 15
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
    marginBottom: 40,

    shadowRadius: 0,
    shadowOpacity: 0,
  }
});

export default withNavigation(LoginScreen);
