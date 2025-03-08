import { Pressable, SafeAreaView, Text, useColorScheme} from "react-native";
import {Link, router} from "expo-router";
import * as SecureStore from 'expo-secure-store';
import {useEffect, useState} from "react";
import {StyleSheet} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import axios from "@/scripts/axiosConfig";
import {useUserContext} from "@/app/(tabs)/_layout";
import {Button, H2, ScrollView, SizableText} from 'tamagui';
import {BigButton, SmallButton, SmallButtonWithAccent, VerticalContainer} from "@/tamagui.config";

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
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'
                        automaticallyAdjustKeyboardInsets={true}
            >
                <VerticalContainer>
                    <H2>User info</H2>
                    <SizableText>Name: {user?.name}</SizableText>
                    <SizableText>Email: {user?.email}</SizableText>
                    <SmallButtonWithAccent>Edit profile</SmallButtonWithAccent>
                    {store ? <>
                        <H2>Store info</H2>
                        <SizableText>Store name: {store?.name}</SizableText>
                        <SizableText>Today's profit: {profit}</SizableText>
                        <SmallButton onPress={() => {getTodayProfit()}}>Refresh</SmallButton>
                        <SmallButtonWithAccent onPress={() => {setStoreIdShown(!storeIdShown)}}>{storeIdShown ? "Hide" : "Show"} store ID</SmallButtonWithAccent>
                        {storeIdShown && <SizableText>Store ID: {storeId}</SizableText>}
                        {user.is_admin && <>
                            <SmallButtonWithAccent onPress={() => {router.push('/editStore')}}>Edit store</SmallButtonWithAccent>
                        </>}
                    </> : <>
                        <BigButton onPress={() => {router.push('/joinStore')}}>Join a store</BigButton>
                        <BigButton onPress={() => {router.push('/createStore')}}>Create a store</BigButton>
                    </>}
                    <BigButton onPress={() => {handleLogout()}}>Log out</BigButton>
                </VerticalContainer>
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