import {HorizontalContainer, SmallButton, SmallButtonWithAccent, StyledGroup, VerticalContainer} from "@/tamagui.config";
import {H4, Image, Input, SizableText, Square} from "tamagui";
import flowerImage from "@/assets/images/defaultFlower.png";
import React, {memo, useCallback, useEffect, useState} from "react";
import {FileSearch, Minus, Plus, ShoppingCart, X} from "@tamagui/lucide-icons";
import {useItemsContext} from "@/app/(tabs)/(sell)/_layout";
import {BASE_URL} from "@/scripts/axiosConfig";
import {Dimensions, useColorScheme} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {router} from "expo-router";
import {useUserContext} from "@/app/(tabs)/_layout";

const Item = ({item}) => {
    const [isChanged, setIsChanged] = useState(false);
    const [amount, setAmount] = useState(0);
    const [thereIsStock, setThereIsStock] = useState(false);

    const {addToCart, isItemInCart, removeFromCart} = useItemsContext();
    const {sign, before} = useUserContext();

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const handleAdd = useCallback(() => {
        if (amount < item.stock) {
            setAmount(amount + 1);
            setIsChanged(true);
        }
    }, [amount]);

    const handleRemove = useCallback(() => {
        if (amount > 0) {
            setAmount(amount - 1);
            setIsChanged(true);
        } else {
            setAmount(0);
            setIsChanged(false);
            removeFromCart(item);
        }
    }, [amount]);

    const handleField = useCallback((value: string) => {
        if (Number(value) > 0 && Number(value) <= item.stock) {
            setAmount(Number(value));
            setIsChanged(true);
        } else if (Number(value) === 0 && Number(value) <= item.stock) {
            setAmount(0);
            setIsChanged(false);
            removeFromCart(item);
        }
    }, [item]);

    const handleSetAmountToZero = useCallback(() => {
        setAmount(0);
        setIsChanged(false);
        removeFromCart(item);
    }, [item]);

    const handleViewItem = useCallback(() => {
        router.push(`/viewItem?id=${item.id}`);
    }, [item]);

    const handleAddToCart = () => {
        if (amount > 0) {
            let newItem = {...item, amount: amount};
            addToCart(newItem);
        }
    };

    useEffect(() => {
        if (item.stock > 0) {
            setThereIsStock(true);
        } else {
            setThereIsStock(false);
        }
    }, [item]);

    return (
        <VerticalContainer
            borderRadius="$5"
            boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)"
            width={Dimensions.get('window').width > 768 ? '100%' : '90%'}
            alignSelf="center"
            flex={1}
            padding="$3"
            marginTop={Dimensions.get('window').width >= 768 ? 20 : 10}
            marginBottom={Dimensions.get('window').width >= 768 ? 20 : 10}
            backgroundColor={isItemInCart(item) ? 'rgba(251,249,239,0.9)' : theme.colors.card}
            gap={0}
        >
            <Square animation="quick" pressStyle={{scale: 0.9}} scale={isChanged ? 1 : 0} opacity={isChanged ? 1 : 0} alignSelf="flex-end" marginBottom={0} onPress={handleSetAmountToZero}>
                <X color="#292023" size="$1" />
            </Square>
            <HorizontalContainer
                padding="$3"
            >
                <VerticalContainer
                    flex={3}
                    alignItems="center"
                    onPress={handleAdd}
                >
                    <Image borderRadius="$5" source={{
                        uri: item.image ? BASE_URL + "/images/" + item.image : flowerImage,
                        width: 120,
                        height: 120,
                    }} />
                    <H4>{item.name}</H4>
                    <SizableText>{before ? sign + item.price : item.price + " " + sign}</SizableText>
                    <SizableText>{thereIsStock ? 'Stock: ' + item.stock : 'Out of stock'}</SizableText>
                </VerticalContainer>
                <VerticalContainer
                    flex={2}
                >
                    <StyledGroup orientation='vertical'>
                        <SmallButtonWithAccent boxShadow="unset" icon={Plus} onPress={handleAdd} disabled={!thereIsStock} />
                        <Input
                            backgroundColor={theme.colors.card}
                            flex={1}
                            keyboardType='numeric'
                            value={amount.toString()}
                            onChangeText={handleField}
                            alignSelf="center"
                            textAlign="center"
                            width="100%"
                            borderWidth={0}
                            disabled={!thereIsStock}
                        />
                        <SmallButtonWithAccent boxShadow="unset" icon={Minus} onPress={handleRemove} disabled={!thereIsStock} />
                    </StyledGroup>
                    <SmallButton icon={FileSearch} onPress={handleViewItem}>{Dimensions.get('window').width >= 768 && 'View details'}</SmallButton>
                    <SmallButtonWithAccent
                        boxShadow={isChanged ? "0px 0px 10px 1px rgba(0,0,0,0.1)" : "none"}
                        icon={ShoppingCart}
                        disabled={!isChanged}
                        opacity={isChanged ? 1 : 0.5}
                        onPress={handleAddToCart}
                    >{Dimensions.get('window').width >= 768 && 'Add to cart'}</SmallButtonWithAccent>
                </VerticalContainer>
            </HorizontalContainer>
        </VerticalContainer>
    )
}

export default React.memo(Item);