import React, { useState, useEffect, useRef } from 'react';
import { Image, StyleSheet, Dimensions, Platform, View, ScrollView, Alert } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';
import { withNavigation } from 'react-navigation';

import { Images, nowTheme } from '../constants/';
import { Switch, Input } from '../components';
import { HeaderHeight, iPhoneX } from '../constants/utils';
import ServicesService from "../services/service";
import Actions from '../lib/actions';
import I18n from '../lib/i18n';

const { height, width } = Dimensions.get('screen');
const smallScreen = height < 812 ? true : false;

const RequestServiceScreen = (baseProps) => {
    const [isExpress, setIsExpress] = useState(false);
    const [userData, setUserData] = useState(null);
    const [address, setAddress] = useState('');
    const [reference, setReference] = useState('');
    const [isIphone, setIsIphone] = useState(Platform.OS === 'ios');
    const [isLoading, setIsLoading] = useState(false);

    const [hasError, setHasError] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUserInfo = async() => {
            await Actions.extractUserData().then((result) => {
                if(result != null) {
                    setUserData(result.user);
                }
            });
        }

        fetchUserInfo()
            .catch(console.error);
    }, [])

    const _handleNextAction = () => {
        if(address.trim() != '' && reference.trim() != '') {
            setIsLoading(true);
            let params = {
                user_id : userData.id,
                express : isExpress,
                address : address,
                reference : reference,
            };

            ServicesService.store(params)
                .then(response => {
                    setIsLoading(false);
                    Alert.alert('Servicio', 'El servicio se ha generado exitosamente.');
                    baseProps.navigation.navigate("History");
                })
                .catch(e => {
                    setIsLoading(false);
                    setHasError(true);
                    setErrorTitle('Servicio');
                    setErrorMessage(e.data.error);
                });
        } else {
            Alert.alert('Upps!', 'Al parecer el formulario se encuentra incompleto.');
        }
    }

    return (
        <Block flex style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Block flex>
                    <Image source={Images.RequestService} style={styles.image} />
                </Block>

                <Block flex style={{ backgroundColor: 'white' }}>
                    <Block space="between" style={styles.padded}>
                        <Text style={[styles.title, {paddingTop: smallScreen ? 50 : 30}, {marginTop: iPhoneX && 30}]}> { I18n.t('requestService.title') } </Text>

                        <Block row style={{width: width - theme.SIZES.BASE * 4, alignItems: 'center', justifyContent: 'space-evenly'}}>
                            <Text style={{fontFamily: 'trueno-semibold', fontWeight: '600', fontSize: smallScreen ? 16 : 18}} color={nowTheme.COLORS.BLACK}>
                                { I18n.t('requestService.switchTitle') }
                            </Text>
                            <Switch value={isExpress} onValueChange={(value) => setIsExpress(!isExpress)} />
                        </Block>

                        <Block middle style={{marginBottom : theme.SIZES.BASE,  width: width - theme.SIZES.BASE * 4}}>
                            <Text style={[styles.subtitle, {paddingVertical: 10}]}>
                                { !isExpress ? I18n.t('requestService.expressTitle1') : I18n.t('requestService.expressTitle2') }
                            </Text>
                        </Block>

                        <Block width={width * 0.8}>
                            <Input
                                placeholder={ I18n.t('requestService.inputAddress') }
                                placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                                style={styles.inputs}
                                onChangeText={(text) => setAddress(text)}
                            />
                        </Block>

                        <Block width={width * 0.8}>
                            <Input
                                placeholder={ I18n.t('requestService.inputReference') }
                                placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                                style={styles.inputs}
                                onChangeText={(text) => setReference(text)}
                            />
                        </Block>

                        <Block middle style={{ width: width - theme.SIZES.BASE * 4 }}>
                            <Button
                                round
                                color={nowTheme.COLORS.BASE}
                                style={styles.createButton}
                                loading={isLoading}
                                disabled={isLoading}
                                onPress={() => _handleNextAction()}>
                                <Text style={{ fontFamily: 'trueno-semibold' }} size={14} color={nowTheme.COLORS.WHITE}>
                                    { I18n.t('requestService.buttonRequest') }
                                </Text>
                            </Button>
                        </Block>
                    </Block>
                </Block>
            </ScrollView>
        </Block>
    );
}

/* export default class RequestServiceScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isExpress : false,
            isIphone : Platform.OS === 'ios',
            userData : null,
            address: '',
            reference: ''
        };
    }

    async componentDidMount() {
        const { navigation } = this.props;

        await Actions.extractUserData().then((result) => {
             if(result != null) {
                 this.setState({userData : result.user});
             }
        });
    }

    _handleNextAction() {
        if(this.state.address.trim() != '' && this.state.reference.trim() != '') {
            console.log(this.state.userData);
            let params = {
                user_id : this.state.userData.id,
                express : this.state.isExpress,
                address : this.state.address,
                reference : this.state.reference,
            };

            ServicesService.store(params)
                .then(response => {
                    Alert.alert('Servicio', 'El servicio se ha generado exitosamente.');
                    this.props.navigation.navigate("History");
                })
                .catch(e => {
                    this.setState({hasError: true, errorTitle: 'Servicio', errorMessage: e.data.error});
                });
        } else {
            Alert.alert('Upps!', 'Al parecer el formulario se encuentra incompleto.');
        }
    }

    render() {
        return (
            <Block flex style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Block flex>
                        <Image source={Images.RequestService} style={styles.image} />
                    </Block>

                    <Block flex style={{ backgroundColor: 'white' }}>
                        <Block space="between" style={styles.padded}>
                            <Text style={[styles.title, {paddingTop: smallScreen ? 50 : 30}, {marginTop: iPhoneX && 30}]}> { I18n.t('requestService.title') } </Text>

                            <Block row style={{width: width - theme.SIZES.BASE * 4, alignItems: 'center', justifyContent: 'space-evenly'}}>
                                <Text style={{fontFamily: 'trueno-semibold', fontWeight: '600', fontSize: smallScreen ? 16 : 18}} color={nowTheme.COLORS.BLACK}>
                                    { I18n.t('requestService.switchTitle') }
                                </Text>
                                <Switch value={this.state.isExpress} onValueChange={(value) => this.setState({isExpress : !this.state.isExpress})} />
                            </Block>

                            <Block middle style={{marginBottom : theme.SIZES.BASE,  width: width - theme.SIZES.BASE * 4}}>
                                <Text style={[styles.subtitle, {paddingVertical: 10}]}>
                                    { !this.state.isExpress ? I18n.t('requestService.expressTitle1') : I18n.t('requestService.expressTitle2') }
                                </Text>
                            </Block>

                            <Block width={width * 0.8}>
                                <Input
                                    placeholder={ I18n.t('requestService.inputAddress') }
                                    placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                                    style={styles.inputs}
                                    onChangeText={(text) => this.setState({address: text})}
                                />
                            </Block>

                            <Block width={width * 0.8}>
                                <Input
                                    placeholder={ I18n.t('requestService.inputReference') }
                                    placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                                    style={styles.inputs}
                                    onChangeText={(text) => this.setState({reference: text})}
                                />
                            </Block>

                            <Block middle style={{ width: width - theme.SIZES.BASE * 4 }}>
                                <Button
                                    round
                                    color={nowTheme.COLORS.BASE}
                                    style={styles.createButton}
                                    onPress={() => this._handleNextAction()}>
                                    <Text style={{ fontFamily: 'trueno-semibold' }} size={14} color={nowTheme.COLORS.WHITE}>
                                        { I18n.t('requestService.buttonRequest') }
                                    </Text>
                                </Button>
                            </Block>
                        </Block>
                    </Block>
                </ScrollView>
            </Block>
        );
    }
} */

const styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === 'android' ? -HeaderHeight : -HeaderHeight - 15,
    },
    padded: {
        paddingHorizontal: theme.SIZES.BASE * 2,
        bottom: Platform.OS === 'android' ? theme.SIZES.BASE * 2 : theme.SIZES.BASE * 3,
    },

    image: {
        width       : width,
        height      : 350,
        marginTop   : smallScreen ? 30 : 70,
    },
    title: {
        fontFamily: 'trueno-extrabold',
        paddingHorizontal: 20,
        fontSize: 30,
        fontWeight: '700',
        textAlign: 'center',
    },
    titleBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#E3E3E3'
    },
    subtitle: {
        fontFamily: 'trueno',
        textAlign: 'center',
        fontSize: 16,
        paddingBottom: 15,
    },
    datetimeText: {
        fontFamily: 'trueno-extrabold',
        paddingHorizontal: 20,
        fontSize: 16,
        fontWeight: '700',
        color: nowTheme.COLORS.BASE
    },
    itemContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'baseline'
    },
    icons: {
        marginRight: 20,
        width: 25,
        height: 25,
    },
    labels: {
        fontFamily: 'trueno-semibold',
        fontSize: 16,
        width: 150,
        marginRight: 20,
    },

    createButton: {
        width: width * 0.5,
        marginTop: 10,
        marginBottom: 10,

        shadowRadius: 0,
        shadowOpacity: 0,
    },
});

export default withNavigation(RequestServiceScreen);