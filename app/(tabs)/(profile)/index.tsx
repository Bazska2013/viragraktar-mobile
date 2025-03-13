import {Pressable, RefreshControl, SafeAreaView, Text, useColorScheme} from "react-native";
import {Link, router} from "expo-router";
import * as SecureStore from 'expo-secure-store';
import {useEffect, useState} from "react";
import {StyleSheet} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import axios from "@/scripts/axiosConfig";
import {useUserContext} from "@/app/(tabs)/_layout";
import {Button, Group, H1, H2, H4, H6, ListItem, ScrollView, Separator, SizableText} from 'tamagui';
import {
    BigButton,
    EditContainer,
    SmallButton,
    SmallButtonWithAccent,
    StyledListItem,
    VerticalContainer
} from "@/tamagui.config";
import {
    BookKey, BookUser,
    Calendar,
    ChevronRight,
    DollarSign,
    FilePen, LogOut,
    TextSearch,
    UserPen,
    UserSearch
} from "@tamagui/lucide-icons";

export default function Profile() {
    const [profit, setProfit] = useState(0);
    const [storeId, setStoreId] = useState(null);
    const [storeIdShown, setStoreIdShown] = useState(false);

    const [isRefreshing, setIsRefreshing] = useState(false);

    const {user, setUser, store, setStore, getUserData} = useUserContext();

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const getTodayProfit = async () => {
        let response;
        try {
            response = await axios.get('/api/store/profit/today');
        } catch (error) {
            console.log(error);
        } finally {
            if (response?.status === 200) {
                setProfit(response.data);
            }
        }
    };

    useEffect(() => {
        getUserData();
        if (store) {
            getTodayProfit();
        }
    }, []);

    useEffect(() => {
        if (store) {
            getTodayProfit();
        }
    }, [store]);

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.log(error);
        } finally {
            await SecureStore.deleteItemAsync('token');
            await SecureStore.deleteItemAsync('user');
            await SecureStore.deleteItemAsync('store');
            setUser(null);
            setStore(null);
            router.replace('/login');
        }
    }

    const handleRefresh = () => {
        setIsRefreshing(true);
        getUserData();
        getTodayProfit().then(() => setIsRefreshing(false));
    }

    return (
        <SafeAreaView>
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'
                        automaticallyAdjustKeyboardInsets={true}
                        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
            >
                <VerticalContainer>
                    <H2 width="90%" alignSelf="center">Profile</H2>
                    <VerticalContainer
                        borderRadius="$5"
                        width="90%"
                        alignSelf="center"
                        boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
                    >
                        <H4>Hello {user?.name}!</H4>
                        <H6>Today's profit of {store?.name} is HUF {profit}</H6>
                    </VerticalContainer>
                    <VerticalContainer width="90%" alignSelf="center">
                        <SizableText>User settings</SizableText>
                        <Group orientation="vertical"
                               boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
                               separator={<Separator />}
                        >
                            <Group.Item>
                                <StyledListItem
                                    title="Profile details"
                                    icon={UserSearch}
                                    iconAfter={ChevronRight}
                                    onPress={() => {router.push('/profileDetails')}}
                                />
                            </Group.Item>
                            <Group.Item>
                                <StyledListItem
                                    title="Change profile name"
                                    icon={UserPen}
                                    iconAfter={ChevronRight}
                                    onPress={() => {router.push('/changeName')}}
                                />
                            </Group.Item>
                            <Group.Item>
                                <StyledListItem
                                    title="Change password"
                                    icon={BookKey}
                                    iconAfter={ChevronRight}
                                    onPress={() => {router.push('/changePassword')}}
                                />
                            </Group.Item>
                        </Group>
                    </VerticalContainer>
                    <VerticalContainer width="90%" alignSelf="center">
                        <SizableText>Store settings</SizableText>
                        <Group orientation="vertical"
                               boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
                               separator={<Separator />}
                        >
                            <Group.Item>
                                <StyledListItem
                                    title="Store details"
                                    icon={TextSearch}
                                    iconAfter={ChevronRight}
                                    onPress={() => {router.push('/storeDetails')}}
                                />
                            </Group.Item>
                            <Group.Item>
                                <StyledListItem
                                    title="Change store name"
                                    icon={FilePen}
                                    iconAfter={ChevronRight}
                                    onPress={() => {router.push('/changeStoreName')}}
                                />
                            </Group.Item>
                            <Group.Item>
                                <StyledListItem
                                    title="Change opening hours"
                                    icon={Calendar}
                                    iconAfter={ChevronRight}
                                    onPress={() => {router.push('/changeOpeningHours')}}
                                />
                            </Group.Item>
                            <Group.Item>
                                <StyledListItem
                                    title="Enable/Disable price calculation"
                                    icon={DollarSign}
                                    iconAfter={ChevronRight}
                                    onPress={() => {router.push('/changePriceCalculation')}}
                                />
                            </Group.Item>
                            <Group.Item>
                                <StyledListItem
                                    title="Manage users"
                                    icon={BookUser}
                                    iconAfter={ChevronRight}
                                    onPress={() => {router.push('/manageUsers')}}
                                />
                            </Group.Item>
                            <Group.Item>
                                <StyledListItem
                                    title="Leave store"
                                    icon={LogOut}
                                    iconAfter={ChevronRight}
                                />
                            </Group.Item>
                        </Group>
                    </VerticalContainer>
                    <BigButton width="90%" alignSelf="center" onPress={() => {handleLogout()}}>Log out</BigButton>
                </VerticalContainer>
            </ScrollView>
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
});