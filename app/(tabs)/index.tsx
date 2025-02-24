import {SafeAreaView} from "react-native";
import {Text} from "react-native";
import {SymbolView} from "expo-symbols";
import {useEffect, useState} from "react";
import api from "@/scripts/axiosConfig";
import * as SecureStore from "expo-secure-store";
import {router} from "expo-router";

export default function Sell() {

    const [items, setItems] = useState([]);

    const fetchItems = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            if (token) {
                const response = await api.get('/api/items');
                setItems(response.data);
            } else {
                router.replace('/login');
            }
        } catch (error: any) {
            console.log(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <SafeAreaView>
            <SymbolView name="storefront" />
            <Text>Sell</Text>
            {items.map((item: any) => (
                <Text key={item.id}>{item.name}</Text>
            ))}
        </SafeAreaView>
    )
}