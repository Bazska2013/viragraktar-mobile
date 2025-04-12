import {EditContainer, HorizontalContainer, VerticalContainer} from "@/tamagui.config";
import {H4, H6, Separator, SizableText} from "tamagui";
import React, {useEffect, useState} from "react";
import axios from "@/scripts/axiosConfig";
import {Dimensions, useColorScheme, View} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useUserContext} from "@/app/(tabs)/_layout";

const TransactionsTable = (props) => {
    const [storeUsers, setStoreUsers] = useState([]);

    const {before, sign} = useUserContext();

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    useEffect(() => {
        fetchStoreUsers();
    }, []);

    const generateDate = (dateString) => {
        const date = new Date(dateString);
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString();
        let day = (date.getDate()).toString();
        if (parseInt(month) < 10) {
            month = '0' + month;
        }
        if (parseInt(day) < 10) {
            day = '0' + day;
        }
        return `${year}. ${month}. ${day}.`;
    }

    const generateTime = (dateString: string) => {
        const date = new Date(dateString);
        let hours = (date.getHours()).toString();
        let minutes = (date.getMinutes()).toString();
        if (parseInt(hours) < 10) {
            hours = '0' + hours;
        }
        if (parseInt(minutes) < 10) {
            minutes = '0' + minutes;
        }
        return `${hours}:${minutes}`;
    }

    const fetchStoreUsers = async () => {
        let response;
        try {
            response = await axios.get('/api/store/users');
        } catch (error) {
            console.error(error);
        } finally {
            setStoreUsers(response.data);
        }
    }

    const findUserName = (userId: number) => {
        for (let user of storeUsers) {
            if (user.id === userId) {
                return user.name;
            }
        }
    }

    return (
        <>
            {Dimensions.get('window').width > 768 ?
                <VerticalContainer>
                    {props.distShown && <VerticalContainer
                        padding="$5"
                        borderRadius="$5"
                        marginTop="$5"
                        marginBottom="$5"
                        boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)"
                        width="90%"
                        alignSelf="center"
                        backgroundColor={theme.colors.card}
                    >
                        <H4 alignSelf="center">Item distribution</H4>
                            <HorizontalContainer alignItems="center">
                                <H6 width="25%" textAlign="center">Name</H6>
                                <H6 width="25%" textAlign="center">Price</H6>
                                <H6 width="20%" textAlign="center">Amount</H6>
                                <H6 width="20%" textAlign="center">Revenue</H6>
                            </HorizontalContainer>
                            <Separator />
                            {props.items.map((item, index) => {
                                return (
                                    <View key={item.id}>
                                        <HorizontalContainer alignItems="center">
                                            <SizableText width="25%" textAlign="center" alignSelf="center">{item.name}</SizableText>
                                            <SizableText width="25%" textAlign="center" alignSelf="center">{before ? sign + item.price : item.price + " " + sign}</SizableText>
                                            <SizableText width="20%" textAlign="center" alignSelf="center">{item.amount}</SizableText>
                                            <SizableText width="20%" textAlign="center" alignSelf="center">{before ? sign + item.amount * item.price : item.amount * item.price + " " + sign}</SizableText>
                                        </HorizontalContainer>
                                        <Separator />
                                    </View>
                                )
                            })}
                    </VerticalContainer>}
                    {props.transShown && <VerticalContainer
                        backgroundColor={theme.colors.card}
                        padding="$5"
                        borderRadius="$5"
                        marginTop="$5"
                        marginBottom="$5"
                        boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)"
                        width="90%"
                        alignSelf="center"
                    >
                        <H4 alignSelf="center">Transactions history</H4>
                        <VerticalContainer>
                            <HorizontalContainer alignItems="center">
                                <H6 width="19%" textAlign="center">Date</H6>
                                <H6 width="6%" textAlign="center">Time</H6>
                                <H6 width="18%" textAlign="center">User</H6>
                                <H6 width="20%" textAlign="center">Payment method</H6>
                                <H6 width="25%" textAlign="center">Total income</H6>
                            </HorizontalContainer>
                            <Separator />
                            {props.transactions.map((item, index) => {
                                return (
                                    <View key={item.id}>
                                        <HorizontalContainer alignItems="center" width="100%">
                                            <SizableText width="19%" textAlign="center" alignSelf="center">{generateDate(item.created_at)}</SizableText>
                                            <SizableText width="6%" textAlign="center" alignSelf="center">{generateTime(item.created_at)}</SizableText>
                                            <SizableText width="18%" textAlign="center" alignSelf="center">{findUserName(item.user_id)}</SizableText>
                                            <SizableText width="20%" textAlign="center" alignSelf="center">{item.credit ? 'Credit card' : 'Cash'}</SizableText>
                                            <SizableText width="25%" textAlign="center" alignSelf="center">{before ? sign + item.total : item.total + " " + sign}</SizableText>
                                        </HorizontalContainer>
                                        <Separator />
                                    </View>
                                )
                            })}
                        </VerticalContainer>
                    </VerticalContainer>}
                    {props.totalShown &&
                        <HorizontalContainer alignItems="center" justifyContent="space-between"
                                             padding="$5"
                                             borderRadius="$5"
                                             marginTop="$5"
                                             marginBottom="$5"
                                             boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)"
                                             width="90%"
                                             alignSelf="center"
                                             backgroundColor={theme.colors.card}
                        >
                            <H6>Total</H6>
                            <H6>HUF {props.items.reduce((acc, item) => acc + item.amount * item.price, 0)}</H6>
                        </HorizontalContainer>
                    }
                </VerticalContainer> :
                <>
                    {props.distShown && <EditContainer backgroundColor={theme.colors.card}>
                        <H4 alignSelf="center">Item distribution</H4>
                        <VerticalContainer>
                            <HorizontalContainer alignItems="center">
                                <SizableText width="18%" textAlign="center" fontSize="$5">Name</SizableText>
                                <SizableText width="15%" textAlign="center" fontSize="$5">Price</SizableText>
                                <SizableText width="20%" textAlign="center" fontSize="$5">Amount</SizableText>
                                <SizableText width="22%" textAlign="center" fontSize="$5">Revenue</SizableText>
                            </HorizontalContainer>
                            <Separator />
                            {props.items.map((item, index) => {
                                return (
                                    <View key={item.id}>
                                        <HorizontalContainer alignItems="center" width="100%">
                                            <SizableText width="18%" textAlign="center" alignSelf="center">{item.name}</SizableText>
                                            <SizableText width="15%" textAlign="center" alignSelf="center">{before ? sign + item.price : item.price + " " + sign}</SizableText>
                                            <SizableText width="20%" textAlign="center" alignSelf="center">{item.amount}</SizableText>
                                            <SizableText width="22%" textAlign="center" alignSelf="center">{before ? sign + item.amount * item.price : item.amount * item.price + " " + sign}</SizableText>
                                        </HorizontalContainer>
                                        <Separator />
                                    </View>
                                )
                            })}
                        </VerticalContainer>
                    </EditContainer>}
                    {props.transShown && <EditContainer backgroundColor={theme.colors.card}>
                        <H4 alignSelf="center">Transactions history</H4>
                        <VerticalContainer>
                            <HorizontalContainer alignItems="center">
                                <SizableText textAlign="center" fontSize="$3" width="14%">Date</SizableText>
                                <SizableText textAlign="center" fontSize="$3" width="11%">Time</SizableText>
                                <SizableText textAlign="center" fontSize="$3" width="12%">User</SizableText>
                                <SizableText textAlign="center" fontSize="$3" width="18%">Payment method</SizableText>
                                <SizableText textAlign="center" fontSize="$3" width="18%">Total income</SizableText>
                            </HorizontalContainer>
                            <Separator />
                            {props.transactions.map((item, index) => {
                                return (
                                    <View key={item.id}>
                                        <HorizontalContainer alignItems="center" width="100%" justifyContent="space-between">
                                            <SizableText textAlign="center" fontSize="$2" width="14%" alignSelf="center">{generateDate(item.created_at)}</SizableText>
                                            <SizableText textAlign="center" fontSize="$2" width="11%" alignSelf="center">{generateTime(item.created_at)}</SizableText>
                                            <SizableText textAlign="center" fontSize="$2" width="12%" alignSelf="center">{findUserName(item.user_id)}</SizableText>
                                            <SizableText textAlign="center" fontSize="$2" width="18%" alignSelf="center">{item.credit ? 'Credit card' : 'Cash'}</SizableText>
                                            <SizableText textAlign="center" fontSize="$2" width="18%" alignSelf="center">{before ? sign + item.total : item.total + " " + sign}</SizableText>
                                        </HorizontalContainer>
                                        <Separator />
                                    </View>
                                )
                            })}
                        </VerticalContainer>
                    </EditContainer>}
                    {props.totalShown &&
                        <EditContainer backgroundColor={theme.colors.card}>
                            <HorizontalContainer alignItems="center" justifyContent="space-between">
                                <H6>Total</H6>
                                <H6>{before ? sign + props.items.reduce((acc, item) => acc + item.amount * item.price, 0) : props.items.reduce((acc, item) => acc + item.amount * item.price, 0) + " " + sign}</H6>
                            </HorizontalContainer>
                        </EditContainer>
                    }
                </>
            }
        </>
    )
}

export default React.memo(TransactionsTable);