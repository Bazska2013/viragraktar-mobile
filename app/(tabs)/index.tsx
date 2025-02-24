import {Pressable, SafeAreaView, ScrollView, StyleSheet, useColorScheme} from "react-native";
import {Text} from "react-native";
import {SymbolView} from "expo-symbols";
import {useEffect, useState} from "react";
import api from "@/scripts/axiosConfig";
import * as SecureStore from "expo-secure-store";
import {router} from "expo-router";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import axios from "@/scripts/axiosConfig";

export default function Sell() {

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const [user, setUser] = useState(null);
    const [store, setStore] = useState(null);
    const [items, setItems] = useState([]);

    const getUserData = async () => {
        const user = JSON.parse(await SecureStore.getItemAsync('user') as string);
        const store = JSON.parse(await SecureStore.getItemAsync('store') as string);
        if (user) {
            if (user.is_seller) {
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
                {items.map((item: any) => (
                    <Text key={item.id} style={[styles.text, {color: theme.colors.text}]}>{item.name}</Text>
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