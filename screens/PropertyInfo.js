import React from 'react';
import { StyleSheet, Dimensions, Platform, ScrollView, View, Image, Alert } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';
import { HeaderHeight } from '../constants/utils';
import Actions from '../lib/actions';
import { nowTheme, Images } from '../constants/';
import PropertyCounter from '../components/PropertyCounter';
import PropertyType from '../components/PropertyTypes';
import PropertyService from '../services/property';

const { height, width } = Dimensions.get('screen');
const isIphone          = Platform.OS === 'ios';

export default class PropertyInfoScreen extends React.Component {
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
                is_predetermined    : true,
                property_type_id    : this.state.propertyTypeValue,
                distribution        : this.state.propertyData,
                first_login         : true,
            };

            await PropertyService.store(params)
                .then(async(response) => {
                    this.setState({ isLoading: false, propertyTypeValue: null, propertyItems: [], propertyData: [] });
                    this.props.navigation.navigate('Home')
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
                <Block space="between" style={styles.padded}>
                    <Text style={[styles.title, {paddingVertical: 10}]}> Tipo de domicilio </Text>

                    <View style={[{ justifyContent: 'center', alignContent: 'center', paddingTop: 5, paddingBottom: 15 }, styles.titleBorder]}>
                        <PropertyType value={propertyTypeValue} updateValue={this.updatePropertyType} />
                    </View>

                    <Block middle style={{ width: width - theme.SIZES.BASE * 4, paddingTop: 15}}>
                        <Text style={[styles.title]}>Inmueble</Text>
                        <Text style={styles.subtitle} color={nowTheme.COLORS.SECONDARY}>Selecciona las áreas idóneas a limpiar</Text>
                    </Block>

                    {
                        propertyItems.length > 0 ? (
                            <View style={{height: height * 0.45, justifyContent: 'center', alignContent: 'center'}}>
                                <ScrollView contentContainerStyle={{justifyContent: 'center', alignContent: 'center'}}>
                                {
                                    propertyItems.map((value) => {
                                        return <PropertyCounter key={value.id} id={value.id} label={value.name} price={value.price} value={value.key} getValues={(quantity, data) => this.updatePropertyInfo(quantity, data)} />
                                    })

                                }
                                    <Button
                                        round
                                        color={nowTheme.COLORS.BASE}
                                        style={styles.createButton}
                                        loading={isLoading}
                                        disabled={isLoading}
                                        onPress={() => this._handleUploadProperty()}>
                                        <Text style={{ fontFamily: 'trueno-semibold' }} size={14} color={nowTheme.COLORS.WHITE}>
                                            SIGUIENTE
                                        </Text>
                                    </Button>
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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: isIphone ? HeaderHeight + 15 : 45,
    },
    padded: {
        paddingHorizontal: theme.SIZES.BASE * 2,
        bottom: Platform.OS === 'android' ? theme.SIZES.BASE * 3 : theme.SIZES.BASE * 3,
    },

    title: {
        fontFamily: 'trueno-extrabold',
        color: nowTheme.COLORS.GREY5,
        paddingHorizontal: 10,
        fontSize: 30,
        textAlign: 'center',
        lineHeight: 38
    },
    titleBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#E3E3E3'
    },
    subtitle: {
        fontFamily: 'trueno',
        color: nowTheme.COLORS.GREY5,
        textAlign: 'center',
        fontSize: 16,
        paddingBottom: 15,
    },

    createButton: {
        justifyContent: 'center',
        alignSelf: 'center',
        width: width * 0.5,
        marginTop: 20,
        marginBottom: 10
    },
});