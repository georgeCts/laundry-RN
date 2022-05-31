import React from 'react';
import { StyleSheet, Alert, Dimensions, Platform, ScrollView, View, Image } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';
import Actions from '../../lib/actions';

import { nowTheme, Images } from '../../constants/';
import { iPhoneX } from "../../constants/utils";
import PropertyCounter from '../../components/PropertyCounter';
import PropertyType from '../../components/PropertyTypes';
import PropertyService from '../../services/property';

const { height, width } = Dimensions.get('screen');
const smallScreen       = height < 812 ? true : false;
const isIphone          = Platform.OS === 'ios';

export default class DomicilioInfoScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData        : null,
            isLoading       : false,

            propertyTypeValue: null,
            propertyItems   : [],
            propertyData    : [],

            address         : this.props.navigation.state.params.address,
            reference       : this.props.navigation.state.params.reference,
            alias           : this.props.navigation.state.params.alias,
            location        : this.props.navigation.state.params.location,
        };
    }

    componentDidMount() {
        Actions.extractUserData().then((result) => {
            if (result != null) {
                this.setState({userData: result.user});
            }
        });
    }

    updatePropertyInfo = (quantity, data) => {
        let propertyData = this.state.propertyData;
        if(propertyData.length < 1 && quantity > 0) {
            propertyData.push({
                id                      : 0,
                property_type_price_id  : data.id,
                quantity                : quantity
            });

            this.setState({propertyData: propertyData});
        } else if(propertyData.findIndex(item => item.property_type_price_id == data.id) == -1 && quantity > 0) {
            propertyData.push({
                id                      : 0,
                property_type_price_id  : data.id,
                quantity                : quantity
            });

            this.setState({propertyData: propertyData});
        } else if(quantity == 0) {
            let index = propertyData.map(element => element.property_type_price_id).indexOf(data.id);
            propertyData.splice(index, 1);
            this.setState({propertyData: propertyData});
        } else {
            let index = propertyData.map(element => element.property_type_price_id).indexOf(data.id);

            let item = {
                id                      : 0,
                property_type_price_id  : data.id,
                quantity                : quantity
            };

            propertyData.splice(index, 1, item);
            this.setState({propertyData: propertyData});
        }
    }

    updatePropertyType = (value, arrPrices) => {
        this.setState({ propertyTypeValue: value, propertyItems: arrPrices, propertyData: [] });
    }

    async _handleUploadProperty() {
        if(this.state.propertyData.length > 0) {
            this.setState({ isLoading: true });
    
            let params = {
                user_id             : this.state.userData.id,
                name                : this.state.alias,
                address             : this.state.address,
                reference           : this.state.reference,
                latitude            : this.state.location.latitude.toString(),
                altitude            : this.state.location.longitude.toString(),
                is_predetermined    : false,
                property_type_id    : this.state.propertyTypeValue,
                distribution        : this.state.propertyData,
            };
    
            await PropertyService.store(params)
                .then(response => {
                    this.setState({ isLoading: false, propertyTypeValue: null, propertyItems: [], propertyData: [] });
                    this.props.navigation.navigate('DomicilioIndex')
                })
                .catch(error => {
                    this.setState({ isLoading: false });
                    Alert.alert('Upps!', 'No se pudo registrar tu inmueble, vuelve a intentarlo.');
                });
        } else {
            Alert.alert('Upps!', 'Necesitas tener al menos un elemento en tu inmueble.');
        }
    }

    render() {
        let {propertyTypeValue, propertyItems, isLoading} = this.state;
        return (
            <Block flex style={styles.container}>
                <Block flex>
                        <Block space="between" style={styles.padded}>
                            <Block>
                                <Text style={[styles.title, smallScreen ? {paddingTop: 20} : {paddingVertical: 10}, {marginTop: iPhoneX ? 15 : 0}]}> Tipo de domicilio </Text>

                                <View style={[{ justifyContent: 'center', alignContent: 'center', paddingTop: 5, paddingBottom: 15 }, styles.titleBorder]}>
                                    <PropertyType value={propertyTypeValue} updateValue={this.updatePropertyType} />
                                </View>

                                <Block middle style={{ width: width - theme.SIZES.BASE * 4, paddingTop: 15}}>
                                    <Text style={[styles.title]}> Inmueble </Text>

                                    <Text style={styles.subtitle} color={nowTheme.COLORS.SECONDARY}>
                                        Selecciona las áreas idóneas a limpiar
                                    </Text>
                                </Block>

                                {
                                    propertyItems.length > 0 ? (
                                        <View style={{height: height * 0.38}}>
                                            <ScrollView>
                                            {
                                                propertyItems.map((value) => {
                                                    return <PropertyCounter key={value.id} id={value.id} label={value.name} price={value.price} value={value.key} getValues={(quantity, data) => this.updatePropertyInfo(quantity, data)} />
                                                })
                                            }

                                                <Block middle style={{ width: width - theme.SIZES.BASE * 3.8 }}>
                                                    <Button
                                                        round
                                                        color={nowTheme.COLORS.BASE}
                                                        style={styles.createButton}
                                                        loading={isLoading}
                                                        disabled={isLoading}
                                                        onPress={() => this._handleUploadProperty()}>
                                                        <Text style={{ fontFamily: 'montserrat-bold' }} size={14} color={nowTheme.COLORS.WHITE}>
                                                            SIGUIENTE
                                                        </Text>
                                                    </Button>
                                                </Block>
                                            </ScrollView>
                                        </View>
                                    ) : (
                                        <Block center>
                                            <Image source={Images.TayderHombreLimpieza} style={{width: width, height: height * 0.45}} />
                                        </Block>
                                    )
                                }
                            </Block>
                        </Block>
                </Block>
            </Block>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        //marginTop: Platform.OS === 'android' ? - HeaderHeight : 0,
        //marginTop: Platform.OS === 'android' ? HeaderHeight + 70 : 0,
        top:  isIphone ? 32 : 10,
    },
    padded: {
        paddingHorizontal: theme.SIZES.BASE * 2,
        bottom: Platform.OS === 'android' ? theme.SIZES.BASE * 2 : theme.SIZES.BASE * 3,
    },

    image: {
        width: 480,
        height: 280,
        bottom: 10
    },
    title: {
        fontFamily: 'trueno-extrabold',
        color: nowTheme.COLORS.GREY5,
        paddingHorizontal: 10,
        fontSize: 28,
        textAlign: 'center',
    },
    titleBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#E3E3E3'
    },
    subtitle: {
        fontFamily: 'trueno',
        textAlign: 'center',
        color: nowTheme.COLORS.GREY5,
        fontSize: 16,
        paddingBottom: 15,
    },

    createButton: {
        justifyContent: 'center',
        alignSelf: 'center',
        width: width * 0.5,
        marginTop: 20,
        marginBottom: 10,
        shadowRadius: 0,
        shadowOpacity: 0
    },
});