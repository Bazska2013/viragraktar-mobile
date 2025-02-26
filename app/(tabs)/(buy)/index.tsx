import {SymbolView} from "expo-symbols";
import {Pressable, SafeAreaView, ScrollView, StyleSheet, Text, useColorScheme, View} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useEffect, useState} from "react";
import axios from '../../../scripts/axiosConfig';
import * as SecureStore from 'expo-secure-store';
import {router} from "expo-router";
import {useItemsContext} from "@/app/(tabs)/(buy)/_layout";
import {useUserContext} from "@/app/(tabs)/_layout";
import Item from "@/app/(tabs)/(buy)/Item";

export default  function Buy() {

    const {items, fetchItems} = useItemsContext();

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const {user, setUser, store, setStore, getUserData} = useUserContext();

    useEffect(() => {
        getUserData()
        fetchItems();
    }, []);

    return (
        <SafeAreaView>
            {user?.is_buyer ? <>
                <ScrollView style={{height: '100%'}}>
                    <Pressable style={styles.button} onPress={() => {router.push('/newItem')}}>
                        <Text style={[styles.text, {color: theme.colors.text}]}>New item</Text>
                    </Pressable>
                    {items.map((item: any) => (
                        <Item key={item.id} props={item} />
                    ))}
                </ScrollView>
            </> : <>
                <View style={{justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                    <Text style={[styles.header, {color: theme.colors.text}]}>Permission denied</Text>
                    <Text style={[styles.text, {color: theme.colors.text}]}>You do not have permission to buy items. If you did not expect this message, please refer to your employer.</Text>
                </View>
            </>}
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