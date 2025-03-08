import {SymbolView} from "expo-symbols";
import {
    Dimensions,
    FlatList,
    Pressable,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useEffect, useState} from "react";
import axios from '../../../scripts/axiosConfig';
import * as SecureStore from 'expo-secure-store';
import {router} from "expo-router";
import {useItemsContext} from "@/app/(tabs)/(buy)/_layout";
import {useUserContext} from "@/app/(tabs)/_layout";
import Item from "@/app/(tabs)/(buy)/Item";
import {BigButton, HorizontalContainer} from "@/tamagui.config";
import {ScrollView} from "tamagui";

export default  function Buy() {

    const {items, fetchItems} = useItemsContext();

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const {user, setUser, store, setStore, getUserData} = useUserContext();

    const [isRefreshing, setIsRefreshing] = useState(false);

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
            {user?.is_buyer ? <>
                <FlatList data={items}
                          numColumns={Dimensions.get('window').width >= 768 ? 3: 1}
                          renderItem={({item}) => <Item props={item} />}
                          keyExtractor={(item) => item.id.toString()}
                          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
                          keyboardDismissMode='interactive'
                          // initialNumToRender={10}
                          // onEndReached={handleLoadMore}
                          // onEndReachedThreshold={0.5}
                          ListHeaderComponent={
                              <BigButton onPress={() => {router.push('/newItem')}}>New Item</BigButton>
                          }
                />
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
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        backgroundColor: 'pink',
        alignItems: 'center',
        justifyContent: 'center',
    },
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