import {
    Dimensions,
    FlatList,
    Pressable,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    useColorScheme,
    View
} from "react-native";
import {Text} from "react-native";
import {SymbolView} from "expo-symbols";
import {useEffect, useState} from "react";
import api from "@/scripts/axiosConfig";
import * as SecureStore from "expo-secure-store";
import {router} from "expo-router";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import axios from "@/scripts/axiosConfig";
import {useUserContext} from "@/app/(tabs)/_layout";
import Item from "@/app/(tabs)/(sell)/Item";
import {BigButton} from "@/tamagui.config";
import {ShoppingBasket} from "@tamagui/lucide-icons";
import {AnimatePresence} from "tamagui";

export default function Sell() {

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const {user, setUser, store, setStore, getUserData} = useUserContext();

    const [items, setItems] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [cart, setCart] = useState([]);

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
        setCart([...cart, item]);
    }

    const removeFromCart = (item) => {
        setCart(cart.filter((i) => i.id !== item.id));
    }

    const emptyCart = () => {
        setCart([]);
    }

    const editCart = (item) => {
        setCart(cart.map((i) => i.id === item.id ? item : i));
    }

    const isItemInCart = (item) => {
        return cart.some((i) => i.id === item.id);
    }

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchItems().then(() => setIsRefreshing(false));
    }

    useEffect(() => {
        getUserData()
        fetchItems();
    }, []);

    return (
        <SafeAreaView style={{height: '100%'}}>
            {user?.is_seller ? <>
                <FlatList data={items}
                          numColumns={Dimensions.get('window').width >= 768 ? 3: 1}
                          renderItem={({item}) =>
                                  <Item item={item} addToCart={addToCart} selected={isItemInCart(item)} />}
                          keyExtractor={(item) => item.id.toString()}
                          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
                          keyboardDismissMode='interactive'
                          initialNumToRender={3}
                          maxToRenderPerBatch={3}
                          windowSize={10}
                    // initialNumToRender={10}
                    // onEndReached={handleLoadMore}
                    // onEndReachedThreshold={0.5}
                    //       ListHeaderComponent={
                    //           <Pressable style={styles.button} onPress={() => {router.push('/newItem')}}>
                    //               <Text style={[styles.text, {color: theme.colors.text}]}>New item</Text>
                    //           </Pressable>
                    //       }
                          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: 'gray' }} />}
                />
                <AnimatePresence>
                    {(cart && cart.length) > 0 &&
                        <BigButton
                            animation="bouncy"
                            enterStyle={{
                                x: 20,
                                y: 20,
                                scale: 1,
                            }}
                            position="absolute"
                            bottom={10}
                            right={10}
                            icon={ShoppingBasket}
                            onPress={() => setCart([])}
                        />
                    }
                </AnimatePresence>
            </> : <>
                <View style={{justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                    <Text style={[styles.header, {color: theme.colors.text}]}>Permission denied</Text>
                    <Text style={[styles.text, {color: theme.colors.text}]}>You do not have permission to sell items. If you did not expect this message, please refer to your employer.</Text>
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