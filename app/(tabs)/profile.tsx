import {Button, Pressable, SafeAreaView, ScrollView, Text, useColorScheme} from "react-native";
import {Link, router} from "expo-router";
import * as SecureStore from 'expo-secure-store';
import {useEffect, useState} from "react";
import {StyleSheet} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import axios from "@/scripts/axiosConfig";

export default function Profile() {

    const [user, setUser] = useState(null);

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const getUser = async () => {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
            try {
                const response = await axios.get('/api/user');
                setUser(response.data);
            } catch (error: any) {
                console.log(error.response.data.message);
            }
        } else {
            router.replace('/login');
        }
    }

    useEffect(() => {
        getUser();
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
                <Link href="/login" asChild>
                    <Button title="Log in" />
                </Link>
                {user && <>
                    <Text style={[styles.text, {color: theme.colors.text}]}>Name: {user.name}</Text>
                    <Text style={[styles.text, {color: theme.colors.text}]}>Email: {user.email}</Text>
                </>}
                {user && <>
                    <Button title="Log out" onPress={() => {handleLogout()}} />
                </>}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        padding: 10,
    }
})