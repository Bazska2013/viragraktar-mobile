import {Dimensions, FlatList, RefreshControl, SafeAreaView, useColorScheme, View} from "react-native";
import {useEffect, useState} from "react";
import {router} from "expo-router";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useUserContext} from "@/app/(tabs)/_layout";
import Item from "@/app/(tabs)/(sell)/Item";
import {BigButton, EditContainer, HorizontalContainer, SmallButtonWithAccent} from "@/tamagui.config";
import {Search, ShoppingBasket, X} from "@tamagui/lucide-icons";
import {AnimatePresence, H2, H4, Input, Paragraph} from "tamagui";
import {useItemsContext} from "@/app/(tabs)/(sell)/_layout";

export default function Sell() {

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const {user, store, getUserData} = useUserContext();
    const {items, fetchItems, cartItems} = useItemsContext();

    const [showCartButton, setShowCartButton] = useState(false);

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);
    const [search, setSearch] = useState("");

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchItems().then(() => setIsRefreshing(false));
    }

    useEffect(() => {
        getUserData()
        fetchItems();
    }, []);

    useEffect(() => {
        if (cartItems.length > 0) {
            setShowCartButton(true);
        } else {
            setShowCartButton(false);
        }
    }, [cartItems]);

    return (
        <SafeAreaView style={{height: '100%'}}>
            {store ? <>
                {user?.is_seller ? <>
                    <FlatList data={items}
                              numColumns={Dimensions.get('window').width >= 768 ? 3: 1}
                              renderItem={({item}) =>
                                  <Item key={item.id} item={item} />}
                              keyExtractor={(item) => item.id.toString()}
                              refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
                              keyboardDismissMode='interactive'
                              initialNumToRender={10}
                              maxToRenderPerBatch={10}
                              windowSize={10}
                              ListEmptyComponent={
                                  <EditContainer marginBottom="$5">
                                      <H4>Oops!</H4>
                                      <Paragraph>It looks like there's nothing left to sell. Pull down to refresh this page and wait for the items to appear or add them yourself on the Buy page!</Paragraph>
                                  </EditContainer>
                              }
                              ListHeaderComponent={
                                  <HorizontalContainer width="90%" alignSelf="center" justifyContent="space-between">
                                      <AnimatePresence mode="wait" initial="false">
                                          {openSearch ? <>
                                              <HorizontalContainer animation="medium" enterStyle={{x: -100}} exitStyle={{x: 100}}>
                                                  <Input
                                                      flex={1}
                                                      borderWidth={2}
                                                      id="search"
                                                      value={search}
                                                      onChangeText={setSearch}
                                                      autoFocus
                                                      autoCapitalize="words"
                                                  />
                                              </HorizontalContainer>
                                          </> : <>
                                              <H2 animation="medium" enterStyle={{x: -100}} exitStyle={{x: 100}}>Sell</H2>
                                          </>}
                                      </AnimatePresence>
                                      <SmallButtonWithAccent height="100%" icon={openSearch ? X : Search} onPress={() => setOpenSearch(!openSearch)}>{!openSearch && 'Search'}</SmallButtonWithAccent>
                                  </HorizontalContainer>
                              }
                    />
                    <AnimatePresence>
                        {showCartButton &&
                            <BigButton
                                animation="quick"
                                enterStyle={{
                                    x: 100,
                                }}
                                exitStyle={{
                                    x: 100,
                                }}
                                position="absolute"
                                bottom={10}
                                right={10}
                                icon={ShoppingBasket}
                                onPress={() => router.push('/cart')}
                            />
                        }
                    </AnimatePresence>
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
                    <SmallButtonWithAccent onPress={() => router.replace('/(tabs)/(profile)')}>Go to Profile</SmallButtonWithAccent>
                </View>
            </>}
        </SafeAreaView>
    )
}