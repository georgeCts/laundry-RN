import React from 'react';
import { Image, StyleSheet, Dimensions, Platform, View, ScrollView, Modal, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Block, Button, Text, theme } from 'galio-framework';

import { Images, nowTheme } from '../constants/';
import { Switch, Input } from '../components';
import { HeaderHeight, iPhoneX } from '../constants/utils';
import I18n from '../lib/i18n';

const { height, width } = Dimensions.get('screen');
const smallScreen = height < 812 ? true : false;

export default class RequestServiceScreen extends React.Component {
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
            let params = {
                user_id : this.state.userData.id,
                express : this.state.isExpress,
                address : this.state.address,
                reference : this.state.reference,
            };

            ServicesService.store(params)
                .then(response => {
                    this.props.navigation.navigate("AgendaSuccess", {
                        schedule: this._datetimeFormat()
                    });
                })
                .catch(e => {
                    this.setState({hasError: true, errorTitle: 'Servicio', errorMessage: e.data.error});
                });
            /* this.props.navigation.navigate("AgendaInsumos", {
                userData        : this.state.userData,
                propertyInfo    : this.state.propertyInfo,
                datetime        : {
                    weekDay     : this.state.date.getDay(),
                    day         : this.state.date.getDate(),
                    month       : this.state.date.getMonth(),
                    year        : this.state.date.getFullYear(),
                    hour        : this.state.time.getHours(),
                    minutes     : this.state.time.getMinutes()
                }
            }); */
        } else {
            Alert.alert('Upps!', 'Al parecer el formulario se encuentra incompleto.');
        }
    }

    render() {
        return (
            <Block flex style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Block flex>
                        <Image source={Images.AgendaFecha} style={styles.image} />
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
}

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