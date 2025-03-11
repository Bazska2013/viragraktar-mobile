import {router, Stack} from "expo-router";
import React, {createContext, useContext, useState} from "react";
import axios from "@/scripts/axiosConfig";
import {Button, Dimensions} from "react-native";

const ItemsContext = createContext<{
    items: any,
    cartItems: any,
    setItems: (items: any) => void,
    setCartItems: (items: any) => void,
    fetchItems: () => void,
    addToCart: (item: any) => void,
    removeFromCart: (item: any) => void,
    emptyCart: () => void,
    editCart: (item: any) => void,
    isItemInCart: (item: any) => boolean
} | undefined>(undefined);

export function useItemsContext() {
    const context = useContext(ItemsContext);
    if (!context) {
        throw new Error('useItemsContext must be used within ItemsContextProvider');
    }
    return context;
}

export default function SellLayout() {
    const [items, setItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);

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

    const addToCart = (item) => {
        setCartItems([...cartItems, item]);
    }

    const removeFromCart = (item) => {
        setCartItems(cartItems.filter((i) => i.id !== item.id));
    }

    const emptyCart = () => {
        setCartItems([]);
    }

    const editCart = (item) => {
        setCartItems(cartItems.map((i) => i.id === item.id ? item : i));
    }

    const isItemInCart = (item) => {
        return cartItems.some((i) => i.id === item.id);
    }

    const contextValue = {
        items: items,
        cartItems: cartItems,
        setItems: setItems,
        setCartItems: setCartItems,
        fetchItems: fetchItems,
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        emptyCart: emptyCart,
        editCart: editCart,
        isItemInCart: isItemInCart
    }

    return (
        <ItemsContext.Provider value={contextValue}>
            <Stack>
                <Stack.Screen name="index"
                              options={{title: 'Sell', headerShown: false}} />
                <Stack.Screen name="cart"
                              options={{title: 'Cart', headerShown: true, presentation: Dimensions.get('window').width >= 768 ? "fullScreenModal" : "modal", headerLeft: () => <Button title="Cancel" onPress={() => router.back()} />}} />
            </Stack>
        </ItemsContext.Provider>
    )
}