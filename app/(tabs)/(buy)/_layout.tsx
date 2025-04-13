import {router, Stack} from "expo-router";
import React, {createContext, useContext, useState} from "react";
import axios from "@/scripts/axiosConfig";
import {Button, Dimensions, Platform, useColorScheme} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";

const ItemsContext = createContext<{
    items: any,
    setItems: (items: any) => void,
    fetchItems: () => void,
    selectedItems: any,
    setSelectedItems: (items: any) => void,
    handleAddToSelected: (item: any) => void,
    removeFromSelected: (item: any) => void,
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
    const [selectedItems, setSelectedItems] = useState([]);

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

    const handleAddToSelected = (item) => {
        if (!selectedItems.includes(item)) {
            setSelectedItems([...selectedItems, item]);
        }
    }

    const removeFromSelected = (item) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
        }
    }

    const contextValue = {
        items: items,
        setItems: setItems,
        fetchItems: fetchItems,
        selectedItems: selectedItems,
        setSelectedItems: setSelectedItems,
        handleAddToSelected: handleAddToSelected,
        removeFromSelected: removeFromSelected,
    };

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    return (
        <ItemsContext.Provider value={contextValue}>
            <Stack>
                <Stack.Screen name="index"
                              options={{title: 'Buy', headerShown: false}} />
                <Stack.Screen name="newItem"
                              options={{title: 'New item', headerShown: true, presentation: Dimensions.get('window').width >= 768 ? "fullScreenModal" : "modal", headerLeft: Platform.OS === 'ios' ? () => <Button color={theme.dark ? '#FBF9EF' : "#292023"} title="Cancel" onPress={() => router.back()} /> : undefined}} />
                <Stack.Screen name='editItem'
                              options={{title: 'Edit item', headerShown: true, presentation: Dimensions.get('window').width >= 768 ? "fullScreenModal" : "modal", headerLeft: Platform.OS === 'ios' ? () => <Button color={theme.dark ? '#FBF9EF' : "#292023"} title="Cancel" onPress={() => router.back()} /> : undefined}} />
                <Stack.Screen name='combineItems'
                              options={{title: 'Combine items', headerShown: true, presentation: Dimensions.get('window').width >= 768 ? "fullScreenModal" : "modal", headerLeft: Platform.OS === 'ios' ? () => <Button color={theme.dark ? '#FBF9EF' : "#292023"} title="Cancel" onPress={() => router.back()} /> : undefined}} />
            </Stack>
        </ItemsContext.Provider>
    )
}