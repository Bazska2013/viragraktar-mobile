import {SymbolView} from "expo-symbols";
import {Pressable, SafeAreaView, ScrollView, StyleSheet, Text, useColorScheme} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useEffect, useState} from "react";
import axios from '../../scripts/axiosConfig';
import * as SecureStore from 'expo-secure-store';
import {router} from "expo-router";

export default  function Buy() {

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const [user, setUser] = useState(null);
    const [store, setStore] = useState(null);
    const [items, setItems] = useState([]);

    const getUserData = async () => {
        const user = JSON.parse(await SecureStore.getItemAsync('user') as string);
        const store = JSON.parse(await SecureStore.getItemAsync('store') as string);
        if (user) {
            if (user.is_buyer) {
                setUser(user);
                if (store) {
                    setStore(store);
                }
            } else {
                router.replace('/(tabs)/profile');
            }
        } else {
            router.replace('/login');
        }
    }

    const fetchItems = async () => {
        try {
            const response = await axios.get('/api/items');
            if (response.status === 200) {
                setItems(response.data);
            }
        } catch (error: any) {
            console.log(error.response.data.message);
        }
    }

    useEffect(() => {
        getUserData().then(() => {
            fetchItems();
        });
    }, []);

    return (
        <SafeAreaView>
            <ScrollView style={{height: '100%'}}>
                <Pressable style={styles.button}>
                    <Text style={[styles.text, {color: theme.colors.text}]}>New item</Text>
                </Pressable>
                {items.map((item: any) => (
                    <Text style={[styles.text, {color: theme.colors.text}]} key={item.id}>{item.name}</Text>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

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
    }
})