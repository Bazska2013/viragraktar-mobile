import { Pressable, SafeAreaView, ScrollView, Text, useColorScheme} from "react-native";
import {Link, router} from "expo-router";
import * as SecureStore from 'expo-secure-store';
import {useEffect, useState} from "react";
import {StyleSheet} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import axios from "@/scripts/axiosConfig";
import {useUserContext} from "@/app/(tabs)/_layout";
import { Button } from 'tamagui';

export default function Profile() {
    const [profit, setProfit] = useState(0);
    const [storeId, setStoreId] = useState(null);
    const [storeIdShown, setStoreIdShown] = useState(false);

    const {user, setUser, store, setStore, getUserData} = useUserContext();

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

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
        getUserData();
        if (store) {
            getTodayProfit();
            getStoreId();
        }
    }, []);

    useEffect(() => {
        if (store) {
            getTodayProfit();
            getStoreId();
        }
    }, [store]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            getStoreId();
        }, 30000); // 30000 milliseconds = 30 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.log(error);
        } finally {
            await SecureStore.deleteItemAsync('token');
            await SecureStore.deleteItemAsync('user');
            await SecureStore.deleteItemAsync('store');
            setUser(null);
            setStore(null);
            router.replace('/login');
        }
    }

    return (
        <SafeAreaView>
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'>
                <Text style={[styles.header, {color: theme.colors.text}]}>User info</Text>
                <Text style={[styles.text, {color: theme.colors.text}]}>Name: {user?.name}</Text>
                <Text style={[styles.text, {color: theme.colors.text}]}>Email: {user?.email}</Text>
                <Button>Edit profile</Button>
                <Pressable style={styles.button}>
                    <Text style={[styles.text, {color: theme.colors.text}]}>Edit profile</Text>
                </Pressable>
                {store ? <>
                    <Text style={[styles.header, {color: theme.colors.text}]}>Store info</Text>
                    <Text style={[styles.text, {color: theme.colors.text}]}>Store name: {store?.name}</Text>
                    <Text style={[styles.text, {color: theme.colors.text}]}>Today's profit: {profit}</Text>
                    <Pressable style={styles.button} onPress={() => {getTodayProfit()}}>
                        <Text style={[styles.text, {color: theme.colors.text}]}>Refresh</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => {setStoreIdShown(!storeIdShown)}}>
                        <Text style={[styles.text, {color: theme.colors.text}]}>{storeIdShown ? "Hide" : "Show"} store ID</Text>
                    </Pressable>
                    {storeIdShown && <Text style={[styles.text, {color: theme.colors.text}]}>Store ID: {storeId}</Text>}
                    {user.is_admin && <>
                        <Pressable style={styles.button} onPress={() => {router.push('/editStore')}}>
                            <Text style={[styles.text, {color: theme.colors.text}]}>Edit store</Text>
                        </Pressable>
                    </>}
                </> : <>
                    <Pressable style={styles.button} onPress={() => {router.push('/joinStore')}}>
                        <Text style={[styles.text, {color: theme.colors.text}]}>Join a store</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => {router.push('/createStore')}}>
                        <Text style={[styles.text, {color: theme.colors.text}]}>Create a store</Text>
                    </Pressable>
                </>}
                <Button onPress={() => {handleLogout()}}>Log out</Button>
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