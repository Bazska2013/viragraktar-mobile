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
import {BigButton, HorizontalContainer, SmallButtonWithAccent, VerticalContainer} from "@/tamagui.config";
import {AnimatePresence, H2, Input, Paragraph, ScrollView, Spinner} from "tamagui";
import {Plus, Search, X} from "@tamagui/lucide-icons";

export default  function Buy() {

    const {items, fetchItems} = useItemsContext();

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const {user, setUser, store, setStore, getUserData} = useUserContext();

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);

    const [openSearch, setOpenSearch] = useState(false);
    const [search, setSearch] = useState("");

    const handleScroll = (event) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 80;
        setIsAtBottom(isBottom);
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
            {store ? <>
                {user?.is_buyer ? <>
                    <FlatList data={items}
                              style={{height: '100%'}}
                              numColumns={Dimensions.get('window').width >= 768 ? 3: 1}
                              renderItem={({item}) => <Item key={item.id} props={item} />}
                              keyExtractor={(item) => item.id.toString()}
                              refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
                              keyboardDismissMode='interactive'
                              initialNumToRender={10}
                              maxToRenderPerBatch={10}
                              windowSize={10}
                              marginBottom="5%"
                        // onEndReached={handleLoadMore}
                        // onEndReachedThreshold={0.5}
                              onScroll={handleScroll}
                              scrollEventThrottle={16}
                              ListEmptyComponent={<Spinner />}
                              ListHeaderComponent={
                                  <HorizontalContainer width="90%" alignSelf="center" justifyContent="space-between">
                                      <AnimatePresence mode="wait" initial="false">
                                          {openSearch ? <>
                                              <HorizontalContainer animation="medium" enterStyle={{x: -100}} exitStyle={{x: 100}}>
                                                  <Input
                                                      flex={1}
                                                      // size="$3"
                                                      borderWidth={2}
                                                      id="search"
                                                      // isInvalid={!!errors.name}
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
                                  <BigButton marginBottom="5%" width="90%" alignSelf="center" icon={Plus} onPress={() => {router.push('/newItem')}} />
                              }
                    />
                    <AnimatePresence>
                        {!isAtBottom &&
                            <BigButton animation="quick" enterStyle={
                                {x: 100}
                            } exitStyle={
                                {x: 100}
                            } icon={Plus} position="absolute" bottom={30} right={10} onPress={() => {router.push('/newItem')}} />
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