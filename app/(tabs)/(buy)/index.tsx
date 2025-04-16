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
import BuyFilterBar from "@/app/(tabs)/(buy)/BuyFilterBar";

export default  function Buy() {

    const {items, fetchItems, selectedItems, setSelectedItems} = useItemsContext();

    const [filteredItems, setFilteredItems] = useState([]);
    const [filterString, setFilterString] = useState('');
    const [filterLabels, setFilterLabels] = useState([]);

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const {user, store, getUserData} = useUserContext();

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);
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

    useEffect(() => {
        getUserData()
        fetchItems().then(() => {
            setFilteredItems(items);
            setFilterString('');
            setFilterLabels([]);
        });
        setSelectedItems([]);
    }, []);

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
                              initialNumToRender={5}
                              maxToRenderPerBatch={10}
                              getItemLayout={(data, index) => ({
                                    length: Dimensions.get('window').width >= 768 ? 200 : 300,
                                    offset: Dimensions.get('window').width >= 768 ? 200 : 300 * index,
                                    index
                              })}
                              columnWrapperStyle={Dimensions.get('window').width >= 768 ? {gap: 20, width: '90%', alignSelf: 'center'} : undefined}
                              windowSize={5}
                              onScroll={handleScroll}
                              scrollEventThrottle={16}
                              ListEmptyComponent={
                                  <EditContainer marginBottom="$5" backgroundColor={theme.colors.card}>
                                      <H4>Oops!</H4>
                                      <Paragraph>{filterString ? "It looks like there's no item named " + filterString + " available in your store. Press the button below to add it!" : 'It looks like you have not yet added any item to your store. Press the button below to begin!'}</Paragraph>
                                  </EditContainer>
                              }
                              ListHeaderComponent={
                                  <BuyFilterBar onTextChange={setFilterString} onLabelChange={setFilterLabels} />
                              }
                              ListFooterComponent={
                                  <BigButton marginTop={20} marginBottom="5%" width="90%" alignSelf="center" icon={Plus} onPress={() => {router.push('/newItem')}}>{Dimensions.get('window').width >= 768 ? ' New item' : ''}</BigButton>
                              }
                    />
                    <BigButton
                        x={!isAtBottom ? 0 : Dimensions.get('window').width >= 768 ? 200 : 100}
                        animation="quick"
                        icon={Plus}
                        position="absolute"
                        bottom={10}
                        right={10}
                        onPress={() => {router.push('/newItem')}}
                    >
                        {Dimensions.get('window').width >= 768 ? 'New item' : ''}
                    </BigButton>
                    <SmallButtonWithAccent
                        x={showCombine ? 0 : Dimensions.get('window').width >= 768 ? 200 : 100}
                        size="$5"
                        animation="quick"
                        icon={Combine}
                        position="absolute"
                        bottom={100}
                        right={20}
                        onPress={() => router.push('/combineItems')}
                    >
                        {Dimensions.get('window').width >= 768 ? 'New item' : ''}
                    </SmallButtonWithAccent>
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