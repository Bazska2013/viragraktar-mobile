import {HorizontalContainer, SmallButton, SmallButtonWithAccent, StyledGroup, VerticalContainer} from "@/tamagui.config";
import {Button, H4, Image, Input, SizableText} from "tamagui";
import flowerImage from "@/assets/images/defaultFlower.png";
import {memo, useCallback, useEffect, useState} from "react";
import {FileSearch, Minus, Plus, ShoppingCart, X} from "@tamagui/lucide-icons";
import {useItemsContext} from "@/app/(tabs)/(sell)/_layout";
import {BASE_URL} from "@/scripts/axiosConfig";
import {Dimensions} from "react-native";

const Item = ({item}) => {
    const [isChanged, setIsChanged] = useState(false);
    const [amount, setAmount] = useState(0);

    const {addToCart, isItemInCart, removeFromCart} = useItemsContext();

    const handleChange = useCallback((value, type: string) => {
        switch (type) {
            case 'minus':
                if (amount > 0) {
                    setAmount(amount - 1);
                    setIsChanged(true);
                }
                break;
            case 'plus':
                if (amount < item.stock) {
                    setAmount(amount + 1);
                    setIsChanged(true);
                }
                break;
            default: {
                if (Number(value) >= 0 && Number(value) <= item.stock) {
                    setAmount(Number(value));
                    setIsChanged(true);
                }}
                break;
        }
    }, [amount]);

    useEffect(() => {
        if (amount === 0) {
            setIsChanged(false);
            removeFromCart(item)
        }
    }, [amount]);

    const handleAddToCart = useCallback(() => {
        if (amount > 0) {
            let newItem = {...item, amount: amount};
            addToCart(newItem);
        }
    }, [amount]);

    return (
        <VerticalContainer
            borderRadius="$5"
            boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
            width={Dimensions.get('window').width > 768 ? '100%' : '90%'}
            alignSelf="center"
            flex={1}
            padding="$3"
            marginTop={Dimensions.get('window').width >= 768 ? 20 : 10}
            marginBottom={Dimensions.get('window').width >= 768 ? 0 : 10}
            backgroundColor={isItemInCart(item) ? '#f2f6d5' : ''}
            opacity={item.stock === 0 ? 0.5 : 1}
            gap={0}
        >
            <Button
                boxShadow={isChanged ? "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)" : "none"}
                icon={X}
                disabled={!isChanged}
                backgroundColor={isChanged ? '#f2f6d5' : 'transparent'}
                alignSelf="flex-end"
                marginBottom={0}
                size="$3"
                onPress={() => setAmount(0)} />
            <HorizontalContainer
                padding="$3"
            >
                <VerticalContainer
                    flex={3}
                    alignItems="center"
                >
                    <Image borderRadius="$5" source={{
                        uri: item.image ? BASE_URL + "/images/" + item.image : flowerImage,
                        width: 120,
                        height: 120,
                    }} />
                    <H4>{item.name}</H4>
                    <SizableText>Price: HUF {item.price}</SizableText>
                    <SizableText>Stock: {item.stock}</SizableText>
                </VerticalContainer>
                <VerticalContainer
                    flex={2}
                >
                    <StyledGroup orientation='vertical'>
                        <SmallButtonWithAccent icon={Plus} onPress={() => handleChange('', 'plus')} />
                        <Input flex={1}
                               keyboardType='numeric'
                               value={amount.toString()}
                               onChangeText={(value) => handleChange(value, 'field')}
                               alignSelf="center"
                               backgroundColor="transparent"
                               borderWidth={0}
                        />
                        <SmallButtonWithAccent icon={Minus} onPress={() => handleChange('', 'minus')} />
                    </StyledGroup>
                    <SmallButton
                        boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
                        icon={FileSearch}
                    >View details</SmallButton>
                    <SmallButtonWithAccent
                        boxShadow={isChanged ? "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)" : "none"}
                        icon={ShoppingCart}
                        disabled={!isChanged}
                        opacity={isChanged ? 1 : 0.5}
                        onPress={() => handleAddToCart()}
                    >Add to cart</SmallButtonWithAccent>
                </VerticalContainer>
            </HorizontalContainer>
        </VerticalContainer>
    )
}

export default memo(Item);