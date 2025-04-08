import {Dimensions, Text, useColorScheme} from "react-native";
import {memo, useCallback, useEffect, useState} from "react";
import axios from "@/scripts/axiosConfig";
import {BASE_URL} from "@/scripts/axiosConfig";
import {useItemsContext} from "@/app/(tabs)/(buy)/_layout";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {router} from "expo-router";
import {HorizontalContainer, SmallButton, VerticalContainer, SmallButtonWithAccent, StyledGroup} from "@/tamagui.config";
import {Minus, Plus, X, Check, CheckSquare, Square} from "@tamagui/lucide-icons";
import flowerImage from "../../../assets/images/defaultFlower.png";
import {Group, H4, SizableText, Input, Image} from "tamagui";

const Item = ({props} : {props: any}) => {

    const [item, setItem] = useState(props);
    const [isChanged, setIsChanged] = useState(false);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState(false);

    const {fetchItems, handleAddToSelected, removeFromSelected, selectedItems} = useItemsContext();
    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const handleSubmit = useCallback(async () => {
        let response;
        try {
            response = await axios.post('/api/item/edit/' + item.id, {
                name: item.name,
                description: item.description,
                price: item.price,
                stock: item.stock,
            });
        } catch (error: any) {
            setError(error.response.data.message);
        } finally {
            if (response?.status === 200) {
                setItem(response.data);
                setIsChanged(false);
                fetchItems();
            }
        }
    }, [item])

    const handleChange = useCallback((value: string, type: string) => {
        switch (type) {
            case 'add':
                setItem({...item, stock: item.stock + 1});
                break;
            case 'remove':
                if (item.stock > 0) {
                    setItem({...item, stock: item.stock - 1});
                }
                break;
            case 'field':
                const parsedValue = parseInt(value);
                if (!isNaN(parsedValue) && parsedValue >= 0) {
                    setItem({...item, stock: parsedValue});
                }
                break;
        }
        setIsChanged(true);
    }, [item])

    const handleCancel = useCallback(() => {
        setItem(props);
        setIsChanged(false);
    }, [props])

    useEffect(() => {
        setItem(props);
    }, [props])

    useEffect(() => {
        if (selected) {
            handleAddToSelected(item);
        } else {
            removeFromSelected(item);
        }
    }, [selected]);

    useEffect(() => {
        if (selectedItems.includes(item)) {
            setSelected(true);
        } else {
            setSelected(false);
        }
    }, [selectedItems]);

    if (error) {
        return <Text style={{color: 'red'}}>{error}</Text>
    }

    return (
        <HorizontalContainer
            borderRadius="$5"
            boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)"
            width={Dimensions.get('window').width > 768 ? '100%' : '90%'}
            alignSelf="center"
            flex={1}
            padding="$3"
            marginTop={Dimensions.get('window').width >= 768 ? 20 : 10}
            marginBottom={Dimensions.get('window').width >= 768 ? 0 : 10}
            backgroundColor={selected ? 'rgba(251,249,239,0.9)' : theme.colors.card}
        >
            <VerticalContainer
                flex={2}
                alignItems="center"
            >
                <Image borderRadius="$5" source={{
                    uri: item.image ? BASE_URL + "/images/" + item.image : flowerImage,
                    width: 120,
                    height: 120,
                }} />
                <H4>{item.name}</H4>
                <SizableText>Price: HUF {item.price}</SizableText>
            </VerticalContainer>
            <VerticalContainer
                flex={1}
            >
                <StyledGroup orientation='vertical'>
                    <SmallButtonWithAccent boxShadow="unset" icon={Plus} onPress={() => handleChange('', 'add')} />
                    <Input flex={1}
                           keyboardType='numeric'
                           value={item.stock.toString()}
                           onChangeText={(value) => handleChange(value, 'field')}
                           alignSelf="center"
                           textAlign="center"
                           width="100%"
                           borderWidth={0}
                    />
                    <SmallButtonWithAccent boxShadow="unset" icon={Minus} onPress={() => handleChange('', 'remove')} />
                </StyledGroup>
                <Group
                    orientation='horizontal'
                    boxShadow={isChanged ? "0px 0px 10px 1px rgba(0,0,0,0.1)" : "none"}
                >
                    <SmallButton boxShadow='unset' icon={X} disabled={!isChanged} opacity={isChanged ? 1 : 0.5} onPress={() => handleCancel()} width="50%" />
                    <SmallButton boxShadow='unset' icon={Check} disabled={!isChanged} opacity={isChanged ? 1 : 0.5} onPress={() => handleSubmit()} width="50%" />
                </Group>
                <SmallButtonWithAccent
                    onPress={() => {router.push(`/editItem?id=${item.id}`);}}
                >
                    Edit Item
                </SmallButtonWithAccent>
                <SmallButton width="100%" icon={selected ? CheckSquare : Square} onPress={() => setSelected(!selected)}>Select</SmallButton>
            </VerticalContainer>
        </HorizontalContainer>
    )
}

export default memo(Item);