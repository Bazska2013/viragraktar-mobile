import {View, Text, StyleSheet, useColorScheme, Pressable, TextInput} from "react-native";
import {memo, useCallback, useEffect, useState} from "react";
import axios from "@/scripts/axiosConfig";
import {useItemsContext} from "@/app/(tabs)/(buy)/_layout";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {router} from "expo-router";
import {
    HorizontalContainer,
    SmallButton,
    VerticalContainer,
    SmallButtonWithAccent,
    StyledGroup
} from "@/tamagui.config";
import {Minus, Plus, X, Check} from "@tamagui/lucide-icons";
import flowerImage from "../../../assets/images/defaultFlower.png";
import {Group, H4, SizableText, Input, Image} from "tamagui";
import {Svg} from "react-native-svg"

const Item = ({props}: {props: any}) => {

    const [item, setItem] = useState(props);
    const [isChanged, setIsChanged] = useState(false);
    const [error, setError] = useState(null);

    const {fetchItems} = useItemsContext();
    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const handleSubmit = useCallback(async () => {
        let response;
        try {
            response = await axios.post('/api/item/edit/' + item.id, {
                name: item.name,
                description: item.description,
                price: item.price,
                stock: item.stock,
                /*image: image*/
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

    if (error) {
        return <Text style={{color: 'red'}}>{error}</Text>
    }

    return (
        <HorizontalContainer
            borderRadius="$5"
            boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
            width='90%'
            marginBottom='5%'
            marginTop='5%'
            alignSelf="center"
            flex={1}
            padding="$3"
        >
            <VerticalContainer
                flex={2}
                alignItems="center"
            >
                <Image borderRadius="$5" source={{
                    uri: item.image ? "http://localhost:8000/images/" + item.image : flowerImage,
                    width: 120,
                    height: 120,
                }} />
                <H4>{item.name}</H4>
                {/*<SizableText>{item.description}</SizableText>*/}
                <SizableText>Price: HUF {item.price}</SizableText>
            </VerticalContainer>
            <VerticalContainer
                flex={1}
            >
                <StyledGroup orientation='vertical'>
                    <SmallButtonWithAccent icon={Plus} onPress={() => handleChange('', 'add')} />
                    <Input flex={1}
                           keyboardType='numeric'
                           value={item.stock.toString()}
                           onChangeText={(value) => handleChange(value, 'field')}
                           alignSelf="center"
                           backgroundColor="transparent"
                           borderWidth={0}
                    />
                    <SmallButtonWithAccent icon={Minus} onPress={() => handleChange('', 'remove')} />
                </StyledGroup>
                <Group
                    orientation='horizontal'
                    boxShadow={isChanged ? "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)" : "none"}
                >
                    <SmallButton icon={X} disabled={!isChanged} opacity={isChanged ? "1" : "0.5"} onPress={() => handleCancel()} width="50%" />
                    <SmallButton icon={Check} disabled={!isChanged} opacity={isChanged ? "1" : "0.5"} onPress={() => handleSubmit()} width="50%" />
                </Group>
                <SmallButtonWithAccent
                    boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
                    onPress={() => {router.push(`/editItem?id=${item.id}`);}}
                >
                    Edit Item
                </SmallButtonWithAccent>
            </VerticalContainer>
        </HorizontalContainer>
    )
}

export default memo(Item);

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        padding: 10,
    },
    header: {
        fontSize: 25,
        padding: 10,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: 'lightblue',
        padding: 10,
        margin: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    textInput: {
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
    },
})