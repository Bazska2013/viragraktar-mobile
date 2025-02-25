import {Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, useColorScheme} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useState} from "react";
import {router} from "expo-router";
import {StatusBar} from "expo-status-bar";

export default function NewItem() {
    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const [name, setName] = useState('');
    const [nameInputStyle, setNameInputStyle] = useState(styles.textInput);
    const [description, setDescription] = useState('');
    const [descriptionInputStyle, setDescriptionInputStyle] = useState(styles.textInput);
    const [price, setPrice] = useState('');
    const [priceInputStyle, setPriceInputStyle] = useState(styles.textInput);
    const [stock, setStock] = useState('');
    const [stockInputStyle, setStockInputStyle] = useState(styles.textInput);

    return (
        <SafeAreaView>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            <ScrollView style={{height: '100%'}}>
                <Text style={[styles.text, {color: theme.colors.text}]}>Name of the item</Text>
                <TextInput value={name}
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
                <TextInput value={description}
                           onChangeText={setDescription}
                           autoCapitalize="sentences"
                           style={[descriptionInputStyle, {color: theme.colors.text}]}
                           onFocus={() => setDescriptionInputStyle({...styles.textInput, borderColor: 'blue'})}
                           onBlur={() => {
                               setDescriptionInputStyle(styles.textInput);
                           }}
                />
                <Text style={[styles.text, {color: theme.colors.text}]}>Price of the item</Text>
                <TextInput value={price}
                           onChangeText={setPrice}
                           keyboardType="numeric"
                           style={[priceInputStyle, {color: theme.colors.text}]}
                           onFocus={() => setPriceInputStyle({...styles.textInput, borderColor: 'blue'})}
                           onBlur={() => {
                               setPriceInputStyle(styles.textInput);
                           }}
                />
                <Text style={[styles.text, {color: theme.colors.text}]}>Stock of the item</Text>
                <TextInput value={stock}
                           onChangeText={setStock}
                           keyboardType="numeric"
                           style={[stockInputStyle, {color: theme.colors.text}]}
                           onFocus={() => setStockInputStyle({...styles.textInput, borderColor: 'blue'})}
                           onBlur={() => {
                               setStockInputStyle(styles.textInput);
                           }}
                />
                <Pressable style={styles.button} onPress={() => {router.back()}}>
                    <Text style={[styles.text, {color: theme.colors.text}]}>Add new item</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    )
};

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