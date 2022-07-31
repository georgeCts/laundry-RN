import React from "react";
import { StyleSheet, Dimensions, Image, View, TouchableOpacity } from "react-native";
import { Block, theme, Text, Button } from "galio-framework";

import { Images, nowTheme } from '../constants/';

const { width, height } = Dimensions.get("screen");
const smallScreen = height < 812 ? true : false;

class ServiceHistoryComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showInfo    : false,
            service     : this.props.item,
            weekDay     : ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
            months      : ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
        };
    }

    async componentDidMount() {

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { item } = nextProps;

        if (item !== prevState.item) {
            return { service: item}
        }
        return null;
    }

    serviceTypeImage(isExpress) {
        if(isExpress)
            return (<Image source={Images.Icons.Servicio_express} style={{ width: 65, height: 65 }} />);
        else
            return (<Image source={Images.Icons.Servicio_normal} style={{ width: 65, height: 65 }} />);
    }

    formatDateTime = (item) => {
        let arrItem = null;
        let initialPhrase = "";

        switch(item.status) {
            case "PENDING":
            case "ACCEPTED":
                arrItem = item.dt_request.split(" ");
                initialPhrase = "Solicitado:";
            break;

            case "ON PROGRESS":
                arrItem = item.dt_start.split(" ");
                initialPhrase = "Inició:";
            break;

            case "FINISHED":
                if(item.delivered) {
                    arrItem = item.dt_finalized.split(" ");
                    initialPhrase = "Finalizó:";
                } else {
                    initialPhrase = "Finalizando servicio..."
                }
            break;
        }

        if(arrItem != null) {
            let arrDate = arrItem[0].split("-");
            let arrTime = arrItem[1].split(":");

            let datetime    = new Date(Number(arrDate[0]), Number(arrDate[1]) - 1, Number(arrDate[2]), Number(arrTime[0]), Number(arrTime[1]));
            let type        = "a.m.";
            let minutes     = datetime.getMinutes() < 10 ? `0${datetime.getMinutes()}` : datetime.getMinutes();
            let hour        = datetime.getHours();

            if(hour >= 12) {
                if(hour > 12) hour    -= 12;
                type    = "p.m.";
            }

            return `${initialPhrase} ${datetime.getDate()}/${arrDate[1]}/${datetime.getFullYear()}, ${hour}:${minutes} ${type}`;
        } else {
            return initialPhrase;
        }
    }

    estatusFormater = (service) => {
        let finalText;
        switch(service.status) {
            case "PENDING": finalText = "Pendiente"; break;
            case "ACCEPTED": finalText = "Aceptado"; break;
            case "ON PROGRESS": finalText = "En progreso"; break;
            case "FINISHED":
                if(service.delivered)
                    finalText = "Finalizado";
                else
                    finalText = "Falta entregar";

                break;
            case "CANCELLED": finalText = "Cancelado"; break;
        }

        return finalText;
    }

    _getServiceDetails(item) {
        let strDistribution = "";

        item.details.map(item => {
            strDistribution += `${item.quantity} ${item.service_catalog.unit_type.key_es} ${item.service_catalog.name_es} ${'$' + item.total}\n`;
        });

        return strDistribution;
    }

    render() {
        let {service, showInfo} = this.state;
        return (
            <Block flex style={{marginTop: 20}}>
                <Block middle style={styles.cardContainer}>
                <TouchableOpacity onPress={() =>  this.setState({ showInfo: !showInfo })}>
                        <Block row style={{ width: width - theme.SIZES.BASE * 3, paddingVertical: 20, paddingHorizontal: 10}}>
                            <Block style={{justifyContent: 'flex-start', alignContent: 'center'}}>
                                {this.serviceTypeImage(service.express)}
                            </Block>

                            <View style={{ width: 250, paddingHorizontal: 15}}>
                                <Text style={[styles.historyTitle]}>{ service.express ? 'Servicio Express' : ' Servicio Normal'  }</Text>
                                <Text style={[styles.historySubtitle, styles.divider]} color={nowTheme.COLORS.SECONDARY}>
                                    {this.estatusFormater(service)}
                                </Text>
                                <Block middle style={[styles.section, {width: '93%'}, showInfo && styles.divider]}>
                                    <Text style={[styles.historySubtitleBold]} color={nowTheme.COLORS.SECONDARY}>
                                        { !service.cancelled && this.formatDateTime(service) }
                                    </Text>
                                </Block>

                                {
                                    showInfo && (
                                        <View>
                                            <Block style={styles.divider}>
                                                <Text style={[styles.historySubtitle]} color={nowTheme.COLORS.SECONDARY}>
                                                    {  this._getServiceDetails(service) }
                                                </Text>
                                            </Block>

                                            <Block style={styles.divider}>
                                                <View style={styles.section}>
                                                    <Text style={styles.historySubtitle}>Subtotal</Text>
                                                    <Text style={styles.historySubtitle}>${parseFloat(service.subtotal).toFixed(2)}</Text>
                                                </View>
                                                <View style={[styles.section]}>
                                                    <Text style={styles.historySubtitle}>Impuesto</Text>
                                                    <Text style={styles.historySubtitle}>${service.tax}</Text>
                                                </View>
                                                <View style={[styles.section]}>
                                                    <Text style={styles.historySubtitleBold}>Total</Text>
                                                    <Text style={styles.historySubtitleBold}>${parseFloat(service.total).toFixed(2)}</Text>
                                                </View>
                                            </Block>
                                        </View>
                                    )
                                }
                            </View>
                        </Block>
                    </TouchableOpacity>
                </Block>
            </Block>
        );
    }
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: nowTheme.COLORS.WHITE,
        borderRadius: 25,
        shadowColor: nowTheme.COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowRadius: 8,
        shadowOpacity: 0.1,
        elevation: 1,
        overflow: 'hidden',
    },
    historyTitle: {
        fontFamily: 'trueno-extrabold',
        color: nowTheme.COLORS.SECONDARY,
        fontSize: 22,
        textAlign: 'left',
    },
    historySubtitle: {
        fontFamily: 'trueno-light',
        fontSize: 16,
        color: nowTheme.COLORS.SECONDARY,
        textAlign: 'left',
    },
    historySubtitleBold: {
        fontFamily: 'trueno-semibold',
        color: nowTheme.COLORS.SECONDARY,
        fontSize: 14,
        textAlign: 'left',
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    divider: {
        borderBottomColor: '#E3E3E3',
        borderBottomWidth: 1,
        paddingBottom: 15,
        marginBottom: 15,
    },
    button: {
        width: width * 0.5,
        height: theme.SIZES.BASE * 2,
        marginTop: 10,
        marginBottom: 10,
        shadowRadius: 0,
        shadowOpacity: 0
    }
});

export default ServiceHistoryComponent;
