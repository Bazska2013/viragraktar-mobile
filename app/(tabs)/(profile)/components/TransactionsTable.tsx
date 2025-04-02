import {EditContainer, HorizontalContainer, VerticalContainer} from "@/tamagui.config";
import {H4, H6, Separator, SizableText} from "tamagui";
import {useEffect, useState} from "react";
import axios from "@/scripts/axiosConfig";
import {Dimensions, View} from "react-native";

const TransactionsTable = (props) => {
    const [storeUsers, setStoreUsers] = useState([]);

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
                        boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
                        width="90%"
                        alignSelf="center"
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
                                    <View key={index}>
                                        <HorizontalContainer alignItems="center">
                                            <SizableText width="25%" textAlign="center" alignSelf="center">{item.name}</SizableText>
                                            <SizableText width="25%" textAlign="center" alignSelf="center">{item.price}</SizableText>
                                            <SizableText width="20%" textAlign="center" alignSelf="center">{item.amount}</SizableText>
                                            <SizableText width="20%" textAlign="center" alignSelf="center">{item.amount * item.price}</SizableText>
                                        </HorizontalContainer>
                                        <Separator />
                                    </View>
                                )
                            })}
                    </VerticalContainer>}
                    {props.transShown && <VerticalContainer
                        padding="$5"
                        borderRadius="$5"
                        marginTop="$5"
                        marginBottom="$5"
                        boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
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
                                    <View key={index}>
                                        <HorizontalContainer alignItems="center" width="100%">
                                            <SizableText width="19%" textAlign="center" alignSelf="center">{generateDate(item.created_at)}</SizableText>
                                            <SizableText width="6%" textAlign="center" alignSelf="center">{generateTime(item.created_at)}</SizableText>
                                            <SizableText width="18%" textAlign="center" alignSelf="center">{findUserName(item.user_id)}</SizableText>
                                            <SizableText width="20%" textAlign="center" alignSelf="center">{item.credit ? 'Credit card' : 'Cash'}</SizableText>
                                            <SizableText width="25%" textAlign="center" alignSelf="center">{item.total}</SizableText>
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
                                             boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
                                             width="90%"
                                             alignSelf="center"
                        >
                            <H6>Total</H6>
                            <H6>HUF {props.items.reduce((acc, item) => acc + item.amount * item.price, 0)}</H6>
                        </HorizontalContainer>
                    }
                </VerticalContainer> :
                <>
                    {props.distShown && <EditContainer>
                        <H4 alignSelf="center">Item distribution</H4>
                        <VerticalContainer>
                            <HorizontalContainer alignItems="center" justifyContent="space-between">
                                <SizableText fontSize="$7">Name</SizableText>
                                <SizableText fontSize="$7">Price</SizableText>
                                <SizableText fontSize="$7">Amount</SizableText>
                                <SizableText fontSize="$7">Revenue</SizableText>
                            </HorizontalContainer>
                            <Separator />
                            {props.items.map((item, index) => {
                                return (
                                    <View key={index}>
                                        <HorizontalContainer alignItems="center" width="100%" justifyContent="space-between">
                                            <SizableText width="20%" alignSelf="center">{item.name}</SizableText>
                                            <SizableText width="20%" alignSelf="center">{item.price}</SizableText>
                                            <SizableText width="20%" alignSelf="center">{item.amount}</SizableText>
                                            <SizableText width="20%" alignSelf="center">{item.amount * item.price}</SizableText>
                                        </HorizontalContainer>
                                        <Separator />
                                    </View>
                                )
                            })}
                        </VerticalContainer>
                    </EditContainer>}
                    {props.transShown && <EditContainer>
                        <H4 alignSelf="center">Transactions history</H4>
                        <VerticalContainer>
                            <HorizontalContainer alignItems="center" justifyContent="space-between">
                                <SizableText fontSize="$3" width="15%">Date</SizableText>
                                <SizableText fontSize="$3" width="13%">Time</SizableText>
                                <SizableText fontSize="$3" width="13%">User</SizableText>
                                <SizableText fontSize="$3" width="20%">Payment method</SizableText>
                                <SizableText fontSize="$3" width="15%">Total income</SizableText>
                            </HorizontalContainer>
                            <Separator />
                            {props.transactions.map((item, index) => {
                                return (
                                    <View key={index}>
                                        <HorizontalContainer alignItems="center" width="100%" justifyContent="space-between">
                                            <SizableText fontSize="$2" width="15%" alignSelf="center">{generateDate(item.created_at)}</SizableText>
                                            <SizableText fontSize="$2" width="13%" alignSelf="center">{generateTime(item.created_at)}</SizableText>
                                            <SizableText fontSize="$2" width="13%" alignSelf="center">{findUserName(item.user_id)}</SizableText>
                                            <SizableText fontSize="$2" width="20%" alignSelf="center">{item.credit ? 'Credit card' : 'Cash'}</SizableText>
                                            <SizableText fontSize="$2" width="15%" alignSelf="center">{item.total}</SizableText>
                                        </HorizontalContainer>
                                        <Separator />
                                    </View>
                                )
                            })}
                        </VerticalContainer>
                    </EditContainer>}
                    {props.totalShown &&
                        <EditContainer>
                            <HorizontalContainer alignItems="center" justifyContent="space-between">
                                <H6>Total</H6>
                                <H6>HUF {props.items.reduce((acc, item) => acc + item.amount * item.price, 0)}</H6>
                            </HorizontalContainer>
                        </EditContainer>
                    }
                </>
            }
        </>
    )
}

export default TransactionsTable;