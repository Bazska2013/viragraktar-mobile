import {HorizontalContainer, SmallButton, SmallButtonWithAccent, VerticalContainer} from "@/tamagui.config";
import {Group, H4, Image, Input, SizableText} from "tamagui";
import flowerImage from "@/assets/images/defaultFlower.png";
import {memo, useCallback, useEffect, useState} from "react";
import {Check, FileSearch, Minus, Plus, ShoppingCart, X} from "@tamagui/lucide-icons";
import {router} from "expo-router";
import {useItemsContext} from "@/app/(tabs)/(sell)/_layout";

const Item = ({item}) => {
    const [isChanged, setIsChanged] = useState(false);
    const [error, setError] = useState(null);
    const [amount, setAmount] = useState(0);

    const {addToCart, isItemInCart, removeFromCart} = useItemsContext();

    const handleChange = useCallback((value, type) => {
        switch (type) {
            case 'minus':
                if (amount > 0) {
                    setAmount(amount - 1);
                }
                break;
            case 'plus':
                if (amount < item.stock) {
                    setAmount(amount + 1);
                }
                break;
            default: {
                if (Number(value) >= 0 && Number(value) <= item.stock) {
                    setAmount(Number(value));
                }}
                break;
        }
        setIsChanged(true);
    }, [amount]);

    useEffect(() => {
        if (amount === 0) {
            setIsChanged(false);
            removeFromCart(item)
        }
    }, [amount]);

    const handleAddToCart = useCallback(() => {
        let newItem = {...item, amount: amount};
        addToCart(newItem);
    }, [amount]);

    return (
        <HorizontalContainer
            borderColor="#292023"
            borderWidth={2}
            borderRadius="$3"
            boxShadow="0 0 10px 0 rgba(0, 0, 0, 0.2)"
            margin={10}
            backgroundColor={isItemInCart(item) ? '#f2f6d5' : 'white'}
        >
            <VerticalContainer>
                <Image source={{
                    uri: item.image ? "http://localhost:8000/images/" + item.image : flowerImage,
                    width: 100,
                    height: 100,
                }} />
                <H4>{item.name}</H4>
                <SizableText>{item.description}</SizableText>
                <SizableText>{item.price}</SizableText>
                <SizableText>{item.stock}</SizableText>
            </VerticalContainer>
            <VerticalContainer>
                <Group orientation='vertical'>
                    <SmallButtonWithAccent icon={Plus} onPress={() => handleChange('', 'plus')} />
                    <Input flex={1}
                           borderWidth={2}
                           keyboardType='numeric'
                           value={amount.toString()}
                           onChangeText={(value) => handleChange(value, 'field')}
                    />
                    <SmallButtonWithAccent icon={Minus} onPress={() => handleChange('', 'minus')} />
                </Group>
                <SmallButton icon={FileSearch}>View details</SmallButton>
                <SmallButtonWithAccent icon={ShoppingCart} disabled={!isChanged} opacity={isChanged ? "1" : "0.5"} onPress={() => handleAddToCart()}>Add to cart</SmallButtonWithAccent>
                <SmallButton icon={X} disabled={!isChanged} chromeless={!isChanged} onPress={() => setAmount(0)} />
            </VerticalContainer>
        </HorizontalContainer>
    )
}

export default memo(Item);