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

export default function Sell() {

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const {user, setUser, store, setStore, getUserData} = useUserContext();

    const [items, setItems] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

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

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchItems().then(() => setIsRefreshing(false));
    }

    useEffect(() => {
        getUserData()
        fetchItems();
    }, []);

    return (
        <SafeAreaView>
            {user?.is_seller ? <>
                <FlatList data={items}
                          style={{height: '100%'}}
                          numColumns={Dimensions.get('window').width >= 768 ? 3: 1}
                          renderItem={({item}) =>
                              <Text style={[styles.text, {color: theme.colors.text}]}>{item.name}</Text>
                          }
                          keyExtractor={(item) => item.id.toString()}
                          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
                          keyboardDismissMode='interactive'
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