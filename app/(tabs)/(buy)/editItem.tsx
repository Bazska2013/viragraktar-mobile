import {useEffect, useState} from "react";
import {
    ActivityIndicator,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View
} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useSearchParams} from "expo-router/build/hooks";
import axios from '@/scripts/axiosConfig';
import {router} from "expo-router";
import {useItemsContext} from "@/app/(tabs)/(buy)/_layout";
import {StatusBar} from "expo-status-bar";

export default function EditItem() {
    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const {fetchItems} = useItemsContext();
    const id = useSearchParams().get('id');

    const [item, setItem] = useState(null);
    const [nameInputStyle, setNameInputStyle] = useState(styles.textInput);
    const [descriptionInputStyle, setDescriptionInputStyle] = useState(styles.textInput);
    const [priceInputStyle, setPriceInputStyle] = useState(styles.textInput);
    const [stockInputStyle, setStockInputStyle] = useState(styles.textInput);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [validInput, setValidInput] = useState(true);

    const fetchItem = async () => {
        let response;
        try {
            response = await axios.get('/api/item/' + id);
        } catch (error: any) {
            setError(error.response.data.message);
        } finally {
            if (response?.status === 200) {
                setItem(response.data);
            }
        }
    }

    const handleSubmit = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.put('/api/item/' + id, {
                name: item.name,
                description: item.description,
                price: item.price,
                stock: item.stock,
                /*image: image*/
            });
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                fetchItems();
                router.back();
            }
        }
    }

    useEffect(() => {
        fetchItem();
    }, []);

    useEffect(() => {
        if (item) {
            if (item.name.toString().length > 0 && item.description.toString().length > 0 && item.price.toString().length > 0 && item.stock.toString().length > 0) {
                setValidInput(true);
            } else {
                setValidInput(false);
            }
        }
    }, [item]);

    return (
        <SafeAreaView>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            {item ? <>
                <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'>
                    <Text style={[styles.text, {color: theme.colors.text}]}>Name of the item</Text>
                    <TextInput value={item.name.toString()}
                               onChangeText={(value) => setItem({...item, name: value})}
                               autoFocus
                               autoCapitalize="words"
                               style={[nameInputStyle, {color: theme.colors.text}]}
                               onFocus={() => setNameInputStyle({...styles.textInput, borderColor: 'blue'})}
                               onBlur={() => {
                                   setNameInputStyle(styles.textInput);
                               }}
                    />
                    <Text style={[styles.text, {color: theme.colors.text}]}>Description of the item</Text>
                    <TextInput value={item.description.toString()}
                               onChangeText={(value) => setItem({...item, description: value})}
                               autoCapitalize="sentences"
                               style={[descriptionInputStyle, {color: theme.colors.text}]}
                               onFocus={() => setDescriptionInputStyle({...styles.textInput, borderColor: 'blue'})}
                               onBlur={() => {
                                   setDescriptionInputStyle(styles.textInput);
                               }}
                    />
                    <Text style={[styles.text, {color: theme.colors.text}]}>Price of the item</Text>
                    <TextInput value={item.price.toString()}
                               onChangeText={(value) => setItem({...item, price: value})}
                               keyboardType="numeric"
                               style={[priceInputStyle, {color: theme.colors.text}]}
                               onFocus={() => setPriceInputStyle({...styles.textInput, borderColor: 'blue'})}
                               onBlur={() => {
                                   setPriceInputStyle(styles.textInput);
                               }}
                    />
                    <Text style={[styles.text, {color: theme.colors.text}]}>Stock of the item</Text>
                    <TextInput value={item.stock.toString()}
                               onChangeText={(value) => setItem({...item, stock: value})}
                               keyboardType="numeric"
                               style={[stockInputStyle, {color: theme.colors.text}]}
                               onFocus={() => setStockInputStyle({...styles.textInput, borderColor: 'blue'})}
                               onBlur={() => {
                                   setStockInputStyle(styles.textInput);
                               }}
                    />
                    {isLoading ? <>
                        <ActivityIndicator size='large' />
                    </> : <>
                        <Pressable style={validInput ? styles.button : styles.defaultButton} onPress={() => {handleSubmit()}} disabled={!validInput}>
                            <Text style={[styles.text, {color: theme.colors.text}]}>Edit item</Text>
                        </Pressable>
                    </>}
                </ScrollView>
            </> : <>
                <View>
                    <Text>{error}</Text>
                </View>
            </>}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    text: {
        margin: 10,
        fontSize: 20,
    },
    textInput: {
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
    },
    button: {
        backgroundColor: 'lightblue',
        padding: 10,
        margin: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    defaultButton: {
        backgroundColor: 'lightgrey',
        padding: 10,
        margin: 10,
        alignItems: 'center',
        borderRadius: 5,
    }
});