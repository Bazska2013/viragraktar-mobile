import {router, Stack} from "expo-router";
import React, {createContext, useContext, useState} from "react";
import axios from "@/scripts/axiosConfig";
import {Button} from "react-native";

const ItemsContext = createContext<{
    items: any,
    setItems: (items: any) => void,
    fetchItems: () => void
} | undefined>(undefined);

export function useItemsContext() {
    const context = useContext(ItemsContext);
    if (!context) {
        throw new Error('useItemsContext must be used within ItemsContextProvider');
    }
    return context;
}

export default function BuyLayout() {
    const [items, setItems] = useState([]);

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

    const contextValue = {
        items: items,
        setItems: setItems,
        fetchItems: fetchItems
    };

    return (
        <ItemsContext.Provider value={contextValue}>
            <Stack>
                <Stack.Screen name="index"
                              options={{title: 'Buy', headerShown: false}} />
                <Stack.Screen name="newItem"
                              options={{title: 'New item', headerShown: true, presentation: 'modal', headerLeft: () => <Button title="Cancel" onPress={() => router.back()} />}} />
                <Stack.Screen name='editItem'
                              options={{title: 'Edit item', headerShown: true, presentation: 'modal', headerLeft: () => <Button title="Cancel" onPress={() => router.back()} />}} />
            </Stack>
        </ItemsContext.Provider>
    )
}