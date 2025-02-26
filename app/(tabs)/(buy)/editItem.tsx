import {useEffect, useState} from "react";
import {Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, useColorScheme} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useSearchParams} from "expo-router/build/hooks";
import axios from '@/scripts/axiosConfig';
import {router} from "expo-router";
import {useItemsContext} from "@/app/(tabs)/(buy)/_layout";
import {StatusBar} from "expo-status-bar";

export default function EditItem() {
    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const {fetchItems} = useItemsContext();

    const [item, setItem] = useState(null);
    const [name, setName] = useState('');
    const [nameInputStyle, setNameInputStyle] = useState(styles.textInput);
    const [description, setDescription] = useState('');
    const [descriptionInputStyle, setDescriptionInputStyle] = useState(styles.textInput);
    const [price, setPrice] = useState('');
    const [priceInputStyle, setPriceInputStyle] = useState(styles.textInput);
    const [stock, setStock] = useState('');
    const [stockInputStyle, setStockInputStyle] = useState(styles.textInput);

    const fetchItem = async () => {
        let response;
        try {
            response = await axios.get('/api/item/' + useSearchParams());
        } catch (error: any) {
            console.log(error.response.data.message);
        } finally {
            if (response?.status === 200) {
                setItem(response.data);
            }
        }
    }

    const handleSubmit = async () => {
        let response;
        try {
            response = await axios.put('/api/item/' + item.id, {
                name: name,
                description: description,
                price: price,
                stock: stock,
                /*image: image*/
            });
        } catch (error: any) {
            console.log(error.response.data.message);
        } finally {
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
            setName(item.name);
            setDescription(item.description);
            setPrice(item.price);
            setStock(item.stock);
        }
    }, [item]);

    return (
        <SafeAreaView>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            <ScrollView style={{height: '100%'}}>
                <Text style={[styles.text, {color: theme.colors.text}]}>Name of the item</Text>
                <TextInput value={name.toString()}
                           onChangeText={setName}
                           autoFocus
                           autoCapitalize="words"
                           style={[nameInputStyle, {color: theme.colors.text}]}
                           onFocus={() => setNameInputStyle({...styles.textInput, borderColor: 'blue'})}
                           onBlur={() => {
                               setNameInputStyle(styles.textInput);
                           }}
                />
                <Text style={[styles.text, {color: theme.colors.text}]}>Description of the item</Text>
                <TextInput value={description.toString()}
                           onChangeText={setDescription}
                           autoCapitalize="sentences"
                           style={[descriptionInputStyle, {color: theme.colors.text}]}
                           onFocus={() => setDescriptionInputStyle({...styles.textInput, borderColor: 'blue'})}
                           onBlur={() => {
                               setDescriptionInputStyle(styles.textInput);
                           }}
                />
                <Text style={[styles.text, {color: theme.colors.text}]}>Price of the item</Text>
                <TextInput value={price.toString()}
                           onChangeText={setPrice}
                           keyboardType="numeric"
                           style={[priceInputStyle, {color: theme.colors.text}]}
                           onFocus={() => setPriceInputStyle({...styles.textInput, borderColor: 'blue'})}
                           onBlur={() => {
                               setPriceInputStyle(styles.textInput);
                           }}
                />
                <Text style={[styles.text, {color: theme.colors.text}]}>Stock of the item</Text>
                <TextInput value={stock.toString()}
                           onChangeText={setStock}
                           keyboardType="numeric"
                           style={[stockInputStyle, {color: theme.colors.text}]}
                           onFocus={() => setStockInputStyle({...styles.textInput, borderColor: 'blue'})}
                           onBlur={() => {
                               setStockInputStyle(styles.textInput);
                           }}
                />
                <Pressable style={styles.button} onPress={() => {handleSubmit()}}>
                    <Text style={[styles.text, {color: theme.colors.text}]}>Edit item</Text>
                </Pressable>
            </ScrollView>
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
});