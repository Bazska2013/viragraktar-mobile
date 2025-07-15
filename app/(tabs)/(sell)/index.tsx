import {Dimensions, FlatList, Platform, RefreshControl, SafeAreaView, StatusBar, StyleSheet, useColorScheme, View} from "react-native";
import {useCallback, useEffect, useState} from "react";
import {router} from "expo-router";
import {DarkTheme, DefaultTheme, useIsFocused} from "@react-navigation/native";
import {useUserContext} from "@/app/(tabs)/_layout";
import Item from "@/app/(tabs)/(sell)/Item";
import {BigButton, EditContainer, SmallButtonWithAccent} from "@/tamagui.config";
import {ShoppingBasket} from "@tamagui/lucide-icons";
import {H2, H4, Paragraph, Spinner} from "tamagui";
import {useItemsContext} from "@/app/(tabs)/(sell)/_layout";
import SellFilterBar from "@/app/(tabs)/(sell)/SellFilterBar";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";

export default function Sell() {

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
    const tabBarHeight = Platform.OS === "android" ? 0 : useBottomTabBarHeight();

    const {user, store, getUserData} = useUserContext();
    const {items, fetchItems, cartItems, isLoading} = useItemsContext();

    const [filteredItems, setFilteredItems] = useState([]);
    const [filterString, setFilterString] = useState('');
    const [filterLabels, setFilterLabels] = useState([]);

    const isFocused = useIsFocused();

    const [showCartButton, setShowCartButton] = useState(false);

    const [refresh, setRefresh] = useState(false);

    const handleGoToProfile = useCallback(() => {
        router.push('/(tabs)/(profile)');
    }, []);

    const handleShowCart = useCallback(() => {
        router.push('/cart');
    }, []);

    const handleRefresh = () => {
        setFilteredItems([]);
        fetchItems();
    }

    useEffect(() => {
        getUserData();
        setFilterString('');
        setFilterLabels([]);
        fetchItems();
    }, []);

    useEffect(() => {
        if (cartItems.length > 0) {
            setShowCartButton(true);
        } else {
            setShowCartButton(false);
        }
    }, [cartItems]);

    useEffect(() => {
        if (filterString.length > 0) {
            setFilteredItems(items.filter((item) => item.name.toLowerCase().includes(filterString.toLowerCase())));
        } else {
            setFilteredItems(items);
        }
    }, [filterString]);

    useEffect(() => {
        if (filterLabels.length > 0) {
            setFilteredItems(items.filter((item) => JSON.parse(item.description).labels.some(label => filterLabels.includes(label))));
        } else {
            setFilteredItems(items);
        }
    }, [filterLabels]);

    useEffect(() => {
        if (items.length > 0) {
            setRefresh(true);
            setFilteredItems(items);
        }
    }, [items]);

    return (
        <SafeAreaView style={[styles.SafeArea]}>
            {store ? <>
                {user?.is_seller ? <>
                    <FlatList data={filteredItems}
                              style={{height: '100%'}}
                              contentContainerStyle={{paddingBottom: tabBarHeight + 40}}
                              numColumns={Dimensions.get('window').width >= 768 ? 2 : 1}
                              renderItem={({item}) =>
                                  <Item key={item.id} item={item} />}
                              keyExtractor={(item) => item.id.toString()}
                              refreshControl={<RefreshControl refreshing={isLoading && refresh} onRefresh={handleRefresh} />}
                              keyboardDismissMode='interactive'
                              initialNumToRender={15}
                              maxToRenderPerBatch={10}
                              updateCellsBatchingPeriod={25}
                              getItemLayout={(data, index) => ({
                                  length: Dimensions.get('window').width >= 768 ? 200 : 300,
                                  offset: Dimensions.get('window').width >= 768 ? 200 : 300 * index,
                                  index
                              })}
                              columnWrapperStyle={Dimensions.get('window').width >= 768 ? {gap: 20, width: '90%', alignSelf: 'center'} : undefined}
                              windowSize={5}
                              ListEmptyComponent={refresh ? <></> :
                                  isLoading ?
                                      <Spinner size="large" />
                                      :
                                      items.length === 0 && <EditContainer marginBottom="$5" backgroundColor={theme.colors.card}>
                                          <H4>Oops!</H4>
                                          <Paragraph>{filterString ? "It looks like there's no item named " + filterString + " available in your store. Pull down to refresh this page or if you have permission add it on the Buy page!" : "It looks like there's nothing left to sell. Pull down to refresh this page and wait for the items to appear or add them yourself on the Buy page!"}</Paragraph>
                                      </EditContainer>
                              }
                              ListHeaderComponent={
                                  <SellFilterBar onTextChange={setFilterString} onLabelChange={setFilterLabels} />
                              }
                    />
                    <BigButton
                        animation="quick"
                        x={isFocused && showCartButton ? 0 : Dimensions.get('window').width >= 768 ? 200 : 100}
                        position="absolute"
                        bottom={tabBarHeight + 10}
                        right={10}
                        icon={ShoppingBasket}
                        onPress={handleShowCart}
                    >
                        {Dimensions.get('window').width >= 768 ? 'Checkout' : ''}
                    </BigButton>
                </> : <>
                    <View justifyContent="center" alignItems="center" alignSelf="center" height="100%">
                        <H2>Permission denied</H2>
                        <Paragraph>You do not have permission to sell items. If you did not expect this message, please refer to your employer.</Paragraph>
                    </View>
                </>}
            </> : <>
                <View justifyContent="center" alignItems="center" alignSelf="center" height="100%">
                    <H2>No store membership found</H2>
                    <Paragraph>You are not yet a part of a store. Navigate to the Profile page to join or create one.</Paragraph>
                    <SmallButtonWithAccent onPress={handleGoToProfile}>Go to Profile</SmallButtonWithAccent>
                </View>
            </>}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    SafeArea: {
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flex: 1,
    }
})