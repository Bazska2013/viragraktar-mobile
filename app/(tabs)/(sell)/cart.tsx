import {Dimensions, Platform, SafeAreaView, useColorScheme} from "react-native";
import {StatusBar} from "expo-status-bar";
import {Group, H3, H4, Input, ScrollView, Separator, SizableText, Spinner} from "tamagui";
import {
    BigButton,
    EditContainer,
    HorizontalContainer,
    SmallButton,
    SmallButtonWithAccent,
    StyledGroup,
    VerticalContainer
} from "@/tamagui.config";
import {useItemsContext} from "@/app/(tabs)/(sell)/_layout";
import {Banknote, CreditCard, DollarSign, Minus, Plus, Trash} from "@tamagui/lucide-icons";
import {useEffect, useState} from "react";
import axios from "@/scripts/axiosConfig";
import {router} from "expo-router";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useUserContext} from "@/app/(tabs)/_layout";

export default function Cart() {

    const {cartItems, emptyCart, fetchItems, editCart, removeFromCart} = useItemsContext();
    const {sign, before} = useUserContext();
    const [cash, setCash] = useState(true);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const [error, setError] = useState(null);

    const handleChange = (type, item, fieldValue) => {
        switch (type) {
            case 'minus':
                if (item.amount > 0) {
                    editCart({...item, amount: item.amount - 1});
                }
                break;
            case 'plus':
                if (item.amount < item.stock) {
                    editCart({...item, amount: item.amount + 1});
                }
                break;
            default: {
                const value = Number(fieldValue);
                if (value >= 0 && value <= item.stock) {
                    editCart({...item, amount: value});
                }}
                break;
        }
        if (item.amount === 0) {
            removeFromCart(item);
        }
    }

    const handleCheckout = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/new/transaction', {
                items: cartItems,
                total: total,
                credit: !cash,
            });
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 201) {
                setTotal(0);
                emptyCart();
                fetchItems();
                router.back();
            }
        }
    }

    useEffect(() => {
        let total = 0;
        cartItems.forEach((item) => {
            total += item.price * item.amount;
        });
        setTotal(total);
    }, [cartItems]);

    useEffect(() => {
        if (cartItems.length === 0) {
            router.back();
        }
    }, [cartItems]);

    return (
        <SafeAreaView>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            <ScrollView style={{height: '100%'}}>
                    {Dimensions.get('window').width >= 768 ? <>
                        <EditContainer
                            backgroundColor={theme.colors.card}
                        >
                            <HorizontalContainer>
                                <H3>#</H3>
                                <H3>Name</H3>
                                <H3>Amount</H3>
                                <H3>Price</H3>
                                <H3>Total</H3>
                            </HorizontalContainer>
                            {cartItems.map((item, index) => (
                                <HorizontalContainer key={item.id}>
                                    <SizableText>{index + 1}</SizableText>
                                    <SizableText>{item.name}</SizableText>
                                    <Group orientation="horizontal">
                                        <SmallButton icon={Minus} onPress={() => handleChange('minus', item, 0)} />
                                        <Input
                                            backgroundColor={theme.colors.card}
                                            value={item.amount.toString()}
                                            keyboardType='numeric'
                                            onChangeText={(value) => handleChange('', item, value)}
                                        />
                                        <SmallButton icon={Plus} onPress={() => handleChange('plus', item, 0)} />
                                    </Group>
                                    <SizableText>{before ? sign + item.price : item.price + " " + sign}</SizableText>
                                    <SizableText>{before ? sign + item.price * item.amount : item.price * item.amount + " " + sign}</SizableText>
                                    <SmallButtonWithAccent icon={Trash} onPress={() => removeFromCart(item)} />
                                </HorizontalContainer>
                            ))}
                            <HorizontalContainer>
                                <Group orientation='horizontal'>
                                    <SmallButton icon={Banknote} onPress={() => setCash(!cash)}>Cash</SmallButton>
                                    <SmallButton icon={CreditCard} onPress={() => setCash(!cash)}>Credit</SmallButton>
                                </Group>
                                <H3>
                                    Total: {before ? sign + total : total + " " + sign}
                                </H3>
                                <BigButton icon={DollarSign} onPress={() => handleCheckout()}>{isLoading ? <Spinner /> : 'Sell'}</BigButton>
                                {error && <SizableText color='red' >{error}</SizableText>}
                            </HorizontalContainer>
                        </EditContainer>
                    </> : <>
                        <EditContainer
                            backgroundColor={theme.colors.card}
                        >
                            {cartItems.map((item, index) => (
                                <VerticalContainer key={item.id}>
                                    <HorizontalContainer>
                                        <H4>{item.name}</H4>
                                    </HorizontalContainer>
                                    <Separator />
                                    <StyledGroup orientation="horizontal" flex={1} alignItems="center">
                                        <SmallButton boxShadow="unset" height="100%" flex={1} icon={Minus} onPress={() => handleChange('minus', item, 0)} />
                                        <Input
                                            backgroundColor={theme.colors.card}
                                            flex={3}
                                            value={item.amount.toString()}
                                            keyboardType='numeric'
                                            onChangeText={(value) => handleChange('', item, value)}
                                        />
                                        <SmallButton boxShadow="unset" height="100%" flex={1} icon={Plus} onPress={() => handleChange('plus', item, 0)} />
                                    </StyledGroup>
                                    <Separator />
                                    <HorizontalContainer>
                                        <H4>{before ? sign + item.price * item.amount : item.price * item.amount + " " + sign}</H4>
                                    </HorizontalContainer>
                                    <Separator />
                                    <SmallButtonWithAccent icon={Trash} onPress={() => removeFromCart(item)}>Remove from cart</SmallButtonWithAccent>
                                </VerticalContainer>
                            ))}
                        </EditContainer>
                        <EditContainer
                            backgroundColor={theme.colors.card}
                        >
                            <VerticalContainer>
                                <StyledGroup orientation='horizontal' flex={1}>
                                    <SmallButton boxShadow="unset" flex={1} icon={Banknote} onPress={() => setCash(!cash)}>Cash</SmallButton>
                                    <SmallButton boxShadow="unset" flex={1} icon={CreditCard} onPress={() => setCash(!cash)}>Credit</SmallButton>
                                </StyledGroup>
                                <Separator />
                                <H4>
                                    Total: {before ? sign + total : total + " " + sign}
                                </H4>
                                <Separator />
                                <BigButton icon={DollarSign} onPress={() => handleCheckout()}>{isLoading ? <Spinner /> : 'Sell'}</BigButton>
                                {error && <SizableText color='$red1'>{error}</SizableText>}
                            </VerticalContainer>
                        </EditContainer>
                    </>}
            </ScrollView>
        </SafeAreaView>
    )
}