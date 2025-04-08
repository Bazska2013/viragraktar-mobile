import {Dimensions, FlatList, RefreshControl, SafeAreaView, useColorScheme, View, StyleSheet, Platform, StatusBar} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {router} from "expo-router";
import {useItemsContext} from "@/app/(tabs)/(buy)/_layout";
import {useUserContext} from "@/app/(tabs)/_layout";
import Item from "@/app/(tabs)/(buy)/Item";
import {BigButton, EditContainer, HorizontalContainer, SmallButtonWithAccent,} from "@/tamagui.config";
import {AnimatePresence, H2, H4, Input, Paragraph} from "tamagui";
import {Combine, Plus, Search, X} from "@tamagui/lucide-icons";

export default  function Buy() {

    const {items, fetchItems, selectedItems, setSelectedItems} = useItemsContext();
    const [filteredItems, setFilteredItems] = useState(items);

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const {user, store, getUserData} = useUserContext();

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);

    const [openSearch, setOpenSearch] = useState(false);
    const [search, setSearch] = useState("");
    const [showCombine, setShowCombine] = useState(false);

    const handleScroll = (event) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 80;
        setIsAtBottom(isBottom);
    }

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchItems().then(() => setIsRefreshing(false));
    }

    const handleSearch = () => {
        if (search.length > 0) {
            const filtered = items.filter((item) => {
                return item.name.toLowerCase().includes(search.toLowerCase());
            });
            setFilteredItems(filtered);
        } else {
            setFilteredItems(items);
        }
    }

    useEffect(() => {
        handleSearch();
    }, [search]);

    useEffect(() => {
        if (!openSearch) {
            setSearch("");
            setFilteredItems(items);
        }
    }, [openSearch]);

    useEffect(() => {
        getUserData()
        fetchItems();
        if (!openSearch) {
            setSearch("");
            setFilteredItems(items);
        }
        setSelectedItems([]);
    }, []);

    useEffect(() => {
        if (items.length > 0) {
            setFilteredItems(items);
        } else {
            setFilteredItems([]);
        }
    }, [items]);

    useEffect(() => {
        if (selectedItems.length > 1) {
            setShowCombine(true);
        } else {
            setShowCombine(false);
        }
    }, [selectedItems]);

    return (
        <SafeAreaView style={[styles.AndroidSafeArea]}>
            {store ? <>
                {user?.is_buyer ? <>
                    <FlatList data={filteredItems}
                              style={{height: '100%'}}
                              numColumns={Dimensions.get('window').width >= 768 ? 2 : 1}
                              renderItem={({item}) => <Item key={item.id} props={item} />}
                              keyExtractor={(item) => item.id.toString()}
                              refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
                              keyboardDismissMode='interactive'
                              initialNumToRender={10}
                              maxToRenderPerBatch={10}
                              columnWrapperStyle={Dimensions.get('window').width >= 768 ? {gap: 20, width: '90%', alignSelf: 'center'} : undefined}
                              windowSize={10}
                              onScroll={handleScroll}
                              scrollEventThrottle={16}
                              ListEmptyComponent={
                                  <EditContainer marginBottom="$5" backgroundColor={theme.colors.card}>
                                      <H4>Oops!</H4>
                                      <Paragraph>{openSearch ? "It looks like there's no item named " + search + " available in your store. Press the button below to add it!" : 'It looks like you have not yet added any item to your store. Press the button below to begin!'}</Paragraph>
                                  </EditContainer>
                              }
                              ListHeaderComponent={
                                  <HorizontalContainer marginTop={Dimensions.get('window').width >= 768 ? 20 : 0} width="90%" alignSelf="center" justifyContent="space-between">
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
                                              <H2 animation="medium" enterStyle={{x: -100}} exitStyle={{x: 100}}>Buy</H2>
                                          </>}
                                      </AnimatePresence>
                                      <SmallButtonWithAccent height="100%" icon={openSearch ? X : Search} onPress={() => setOpenSearch(!openSearch)}>{!openSearch && 'Search'}</SmallButtonWithAccent>
                                  </HorizontalContainer>
                              }
                              ListFooterComponent={
                                  <BigButton marginTop={20} marginBottom="5%" width="90%" alignSelf="center" icon={Plus} onPress={() => {router.push('/newItem')}}>{Dimensions.get('window').width >= 768 ? ' New item' : ''}</BigButton>
                              }
                    />
                    <AnimatePresence>
                        {!isAtBottom &&
                            <BigButton animation="quick" enterStyle={
                                {x: Dimensions.get('window').width >= 768 ? 200 : 100}
                            } exitStyle={
                                {x: Dimensions.get('window').width >= 768 ? 200 : 100}
                            } icon={Plus} position="absolute" bottom={10} right={10} onPress={() => {router.push('/newItem')}}>{Dimensions.get('window').width >= 768 ? 'New item' : ''}</BigButton>
                        }
                    </AnimatePresence>
                    <AnimatePresence>
                        {showCombine &&
                            <SmallButtonWithAccent size="$5" animation="quick" enterStyle={
                                {x: Dimensions.get('window').width >= 768 ? 200 : 100}
                            } exitStyle={
                                {x: Dimensions.get('window').width >= 768 ? 200 : 100}
                            } icon={Combine} position="absolute" bottom={100} right={20}
                            onPress={() => router.push('/combineItems')}
                            >{Dimensions.get('window').width >= 768 ? 'New item' : ''}</SmallButtonWithAccent>
                        }
                    </AnimatePresence>
                </> : <>
                    <View justifyContent="center" alignItems="center" alignSelf="center" height="100%">
                        <H2>Permission denied</H2>
                        <Paragraph>You do not have permission to buy items. If you did not expect this message, please refer to your employer.</Paragraph>
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

const styles = StyleSheet.create({
    AndroidSafeArea: {
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flex: 1,
    }
})