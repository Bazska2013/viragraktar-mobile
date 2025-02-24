import {Button, Pressable, SafeAreaView, ScrollView, Text, useColorScheme} from "react-native";
import {Link, router} from "expo-router";
import * as SecureStore from 'expo-secure-store';
import {useEffect, useState} from "react";
import {StyleSheet} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import axios from "@/scripts/axiosConfig";

export default function Profile() {

    const [user, setUser] = useState(null);
    const [store, setStore] = useState(null);
    const [profit, setProfit] = useState(0);
    const [storeId, setStoreId] = useState(null);

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const getUserData = async () => {
        const user = JSON.parse(await SecureStore.getItemAsync('user') as string);
        const store = JSON.parse(await SecureStore.getItemAsync('store') as string);
        if (user) {
            setUser(user);
            if (store) {
                setStore(store);
            }
        } else {
            router.replace('/login');
        }
    }

    const getTodayProfit = async () => {
        let response;
        try {
            response = await axios.get('/api/store/profit/today');
        } catch (error) {
            console.log(error);
        } finally {
            if (response?.status === 200) {
                setProfit(response.data);
            }
        }
    };

    const getStoreId = async () => {
        let response;
        try {
            response = await axios.get('/api/store/id');
        } catch (error) {
            console.log(error);
        } finally {
            if (response?.status === 200) {
                setStoreId(response.data);
            }
        }
    }

    useEffect(() => {
        getUserData().then(() => {
            if (store) {
                getStoreId();
                getTodayProfit();
            }
        });
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.log(error);
        } finally {
            await SecureStore.deleteItemAsync('token');
            setUser(null);
            router.replace('/login');
        }
    }

    return (
        <SafeAreaView>
            <ScrollView style={{height: '100%'}}>
                <Text style={[styles.header, {color: theme.colors.text}]}>User info</Text>
                <Text style={[styles.text, {color: theme.colors.text}]}>Name: {user?.name}</Text>
                <Text style={[styles.text, {color: theme.colors.text}]}>Email: {user?.email}</Text>
                <Pressable style={styles.button}>
                    <Text style={[styles.text, {color: theme.colors.text}]}>Edit profile</Text>
                </Pressable>
                <Text style={[styles.header, {color: theme.colors.text}]}>Store info</Text>
                <Text style={[styles.text, {color: theme.colors.text}]}>Store name: {store?.name}</Text>
                <Text style={[styles.text, {color: theme.colors.text}]}>Today's profit: {profit}</Text>
                <Pressable style={styles.button} onPress={() => {getTodayProfit()}}>
                    <Text style={[styles.text, {color: theme.colors.text}]}>Refresh</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => {getStoreId()}}>
                    <Text style={[styles.text, {color: theme.colors.text}]}>Show store id</Text>
                </Pressable>
                <Text style={[styles.text, {color: theme.colors.text}]}>{storeId}</Text>
                <Pressable style={styles.button}>
                    <Text style={[styles.text, {color: theme.colors.text}]}>Edit store</Text>
                </Pressable>
                <Button title="Log out" onPress={() => {handleLogout()}} />
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
});