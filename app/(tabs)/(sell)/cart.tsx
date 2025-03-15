import {Dimensions, Platform, SafeAreaView} from "react-native";
import {StatusBar} from "expo-status-bar";
import {Group, H3, H4, Input, ScrollView, Separator, SizableText, Spinner} from "tamagui";
import {
    BigButton,
    EditContainer,
    HorizontalContainer,
    SmallButton,
    SmallButtonWithAccent,
    VerticalContainer
} from "@/tamagui.config";
import {useItemsContext} from "@/app/(tabs)/(sell)/_layout";
import {Banknote, CreditCard, DollarSign, Minus, Plus, Trash} from "@tamagui/lucide-icons";
import {useEffect, useState} from "react";
import axios from "@/scripts/axiosConfig";
import {router} from "expo-router";

export default function Cart() {

    const {cartItems, emptyCart, fetchItems, editCart, removeFromCart} = useItemsContext();
    const [cash, setCash] = useState(true);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

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
                        <EditContainer>
                            <HorizontalContainer>
                                <H3>#</H3>
                                <H3>Name</H3>
                                <H3>Amount</H3>
                                <H3>Price</H3>
                                <H3>Total</H3>
                            </HorizontalContainer>
                            {cartItems.map((item, index) => (
                                <HorizontalContainer key={index}>
                                    <SizableText>{index + 1}</SizableText>
                                    <SizableText>{item.name}</SizableText>
                                    <Group orientation="horizontal">
                                        <SmallButton icon={Minus} onPress={() => handleChange('minus', item, 0)} />
                                        <Input
                                            value={item.amount.toString()}
                                            keyboardType='numeric'
                                            onChangeText={(value) => handleChange('', item, value)}
                                        />
                                        <SmallButton icon={Plus} onPress={() => handleChange('plus', item, 0)} />
                                    </Group>
                                    <SizableText>{item.price}</SizableText>
                                    <SizableText>{item.price * item.amount}</SizableText>
                                    <SmallButtonWithAccent icon={Trash} onPress={() => removeFromCart(item)} />
                                </HorizontalContainer>
                            ))}
                            <HorizontalContainer>
                                <Group orientation='horizontal'>
                                    <SmallButton icon={Banknote} onPress={() => setCash(!cash)}>Cash</SmallButton>
                                    <SmallButton icon={CreditCard} onPress={() => setCash(!cash)}>Credit</SmallButton>
                                </Group>
                                <H3>
                                    Total: {total} HUF
                                </H3>
                                <BigButton icon={DollarSign} onPress={() => handleCheckout()}>{isLoading ? <Spinner /> : 'Sell'}</BigButton>
                                {error && <SizableText color='red' >{error}</SizableText>}
                            </HorizontalContainer>
                        </EditContainer>
                    </> : <>
                        <EditContainer>
                            {cartItems.map((item, index) => (
                                <VerticalContainer key={index}>
                                    <HorizontalContainer>
                                        <H4>{item.name}</H4>
                                    </HorizontalContainer>
                                    <Separator />
                                    <Group orientation="horizontal" flex={1} alignItems="center">
                                        <SmallButton flex={1} icon={Minus} onPress={() => handleChange('minus', item, 0)} />
                                        <Input
                                            flex={3}
                                            value={item.amount.toString()}
                                            keyboardType='numeric'
                                            onChangeText={(value) => handleChange('', item, value)}
                                        />
                                        <SmallButton flex={1} icon={Plus} onPress={() => handleChange('plus', item, 0)} />
                                    </Group>
                                    <Separator />
                                    <HorizontalContainer>
                                        <H4>HUF {item.price * item.amount}</H4>
                                    </HorizontalContainer>
                                    <Separator />
                                    <SmallButtonWithAccent icon={Trash} onPress={() => removeFromCart(item)}>Remove from cart</SmallButtonWithAccent>
                                </VerticalContainer>
                            ))}
                        </EditContainer>
                        <EditContainer>
                            <VerticalContainer>
                                <Group orientation='horizontal' flex={1}>
                                    <SmallButton flex={1} icon={Banknote} onPress={() => setCash(!cash)}>Cash</SmallButton>
                                    <SmallButton flex={1} icon={CreditCard} onPress={() => setCash(!cash)}>Credit</SmallButton>
                                </Group>
                                <Separator />
                                <H4>
                                    Total: {total} HUF
                                </H4>
                                <Separator />
                                <BigButton icon={DollarSign} onPress={() => handleCheckout()}>{isLoading ? <Spinner /> : 'Sell'}</BigButton>
                                {error && <SizableText color='red' >{error}</SizableText>}
                            </VerticalContainer>
                        </EditContainer>
                    </>}
            </ScrollView>
        </SafeAreaView>
    )
}