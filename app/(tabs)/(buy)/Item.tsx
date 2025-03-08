import {View, Text, StyleSheet, useColorScheme, Pressable, TextInput} from "react-native";
import {useEffect, useState} from "react";
import axios from "@/scripts/axiosConfig";
import {useItemsContext} from "@/app/(tabs)/(buy)/_layout";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {router} from "expo-router";
import {HorizontalContainer, SmallButton, VerticalContainer, SmallButtonWithAccent} from "@/tamagui.config";
import {Minus, Plus, X, Check} from "@tamagui/lucide-icons";
import flowerImage from "../../../assets/images/defaultFlower.svg";
import {Group, H4, SizableText, Input, Image} from "tamagui";

const Item = ({props}: {props: any}) => {

    const [item, setItem] = useState(props);
    const [isChanged, setIsChanged] = useState(false);
    const [error, setError] = useState(null);

    const {fetchItems} = useItemsContext();
    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const handleSubmit = async () => {
        let response;
        try {
            response = await axios.post('/api/item/edit/' + item.id, item);
        } catch (error: any) {
            setError(error.response.data.message);
        } finally {
            if (response?.status === 200) {
                setItem(response.data);
                setIsChanged(false);
                fetchItems();
            }
        }
    }

    const handleChange = (value: string, type: string) => {
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
    }

    const handleCancel = () => {
        setItem(props);
        setIsChanged(false);
    }

    useEffect(() => {
        setItem(props);
    }, [props])

    if (error) {
        return <Text style={{color: 'red'}}>{error}</Text>
    }

    return (
        <View style={{padding: 10, flex: 3}}>
            <HorizontalContainer
                borderColor="#292023"
                borderWidth={2}
                borderRadius="$3"
                boxShadow="0 0 10px 0 rgba(0, 0, 0, 0.2)"
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
                </VerticalContainer>
                <VerticalContainer>
                    <Group orientation='vertical'>
                        <SmallButtonWithAccent icon={Plus} onPress={() => handleChange('', 'add')} />
                        <Input flex={1}
                               borderWidth={2}
                               keyboardType='numeric'
                               value={item.stock.toString()}
                               onChangeText={(value) => handleChange(value, 'field')}
                        />
                        <SmallButtonWithAccent icon={Minus} onPress={() => handleChange('', 'remove')} />
                    </Group>
                    <Group orientation='horizontal'>
                        <SmallButton icon={X} disabled={!isChanged} chromeless={!isChanged} onPress={() => handleCancel()} width="50%" />
                        <SmallButton icon={Check} disabled={!isChanged} chromeless={!isChanged} onPress={() => handleSubmit()} width="50%" />
                    </Group>
                    <SmallButtonWithAccent onPress={() => {router.push(`/editItem?id=${item.id}`);}}>
                        Edit Item
                    </SmallButtonWithAccent>
                </VerticalContainer>
            </HorizontalContainer>
            {/*<Text style={[styles.header, {color: theme.colors.text}]}>{item.name}</Text>*/}
            {/*<View>*/}
            {/*    <Text style={[styles.text, {color: theme.colors.text}]}>{item.description}</Text>*/}
            {/*    <Text style={[styles.text, {color: theme.colors.text}]}>{item.price}</Text>*/}
            {/*</View>*/}
            {/*<View>*/}
            {/*    <SmallButton icon={Plus} onPress={() => handleChange('', 'add')} />*/}
            {/*    <TextInput value={item.stock.toString()}*/}
            {/*               keyboardType='numeric'*/}
            {/*               onChangeText={(value) => handleChange(value, 'field')}*/}
            {/*               style={[styles.textInput, {color: theme.colors.text}]}*/}
            {/*    />*/}
            {/*    {isChanged ? <>*/}
            {/*        <Pressable style={styles.button} onPress={() => handleSubmit()}>*/}
            {/*            <Text style={[styles.text, {color: theme.colors.text}]}>Save changes</Text>*/}
            {/*        </Pressable>*/}
            {/*        <Pressable style={styles.button} onPress={() => handleCancel()}>*/}
            {/*            <Text style={[styles.text, {color: theme.colors.text}]}>Cancel changes</Text>*/}
            {/*        </Pressable>*/}
            {/*    </> : <></>}*/}
            {/*    <SmallButton icon={Minus} onPress={() => handleChange('', 'remove')} />*/}
            {/*</View>*/}
            {/*<Pressable style={styles.button} onPress={() => {router.push(`/editItem?id=${item.id}`);}}>*/}
            {/*    <Text style={[styles.text, {color: theme.colors.text}]}>Edit item</Text>*/}
            {/*</Pressable>*/}
        </View>
    )
}

export default Item;

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