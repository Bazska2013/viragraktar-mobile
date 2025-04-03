import {
    Alert,
    Dimensions,
    Platform,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    useColorScheme
} from "react-native";
import {router} from "expo-router";
import * as SecureStore from 'expo-secure-store';
import {useEffect, useState} from "react";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import axios from "@/scripts/axiosConfig";
import {useUserContext} from "@/app/(tabs)/_layout";
import {Group, H2, H4, H6, ScrollView, Separator, SizableText} from 'tamagui';
import {BigButton, StyledListItem, VerticalContainer} from "@/tamagui.config";
import {BookKey, BookUser, Calendar, ChevronRight, DollarSign, FilePen, LineChart, LogOut, TextSearch, UserPen, UserSearch} from "@tamagui/lucide-icons";

export default function Profile() {
    const [profit, setProfit] = useState(0);

    const [isRefreshing, setIsRefreshing] = useState(false);

    const {user, setUser, store, setStore, getUserData, fetchUserData} = useUserContext();

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
        fetchUserData();
        getUserData();
        if (store) {
            getTodayProfit();
        }
        setIsRefreshing(false);
    }

    const handleLeaveStore = async () => {
        let response;
        try {
            response = await axios.post('/api/store/users/remove/' + user.id);
        } catch (error: any) {
            console.log(error.response.data.message);
        } finally {
            if (response?.status === 204) {
                setStore(null);
                handleLogout();
            }
        }
    }

    const confirmAlert = (type) =>
        Alert.alert(type ? 'Leave store' : 'Log out', type ? 'Please confirm if you want to leave the store\n(Note: you will also be logged out)' : 'Please confirm if you want to log out', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            (type ? {
                text: 'Confirm', onPress: () => handleLeaveStore()
            } : {
                text: 'Confirm', onPress: () => handleLogout()
            }),
        ]);

    return (
        <SafeAreaView style={[styles.AndroidSafeArea]}>
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'
                        automaticallyAdjustKeyboardInsets={true}
                        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
            >
                <VerticalContainer marginTop={Dimensions.get('window').width >= 768 ? 20 : 0}>
                    <H2 width="90%" alignSelf="center">Profile</H2>
                    <VerticalContainer
                        borderRadius="$5"
                        width="90%"
                        alignSelf="center"
                        boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
                        padding="$3"
                    >
                        <H4>Hello {user?.name}!</H4>
                        {store &&
                            <H6>Today's profit of {store?.name} is HUF {profit}</H6>
                        }
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
                    {store && user.is_admin ?
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
                                        title="View report"
                                        icon={LineChart}
                                        iconAfter={ChevronRight}
                                        onPress={() => {router.push('/generateReport')}}
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
                            </Group>
                        </VerticalContainer> :
                        store ?
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
                                            title="Leave store"
                                            icon={LogOut}
                                            iconAfter={ChevronRight}
                                            onPress={() => confirmAlert(true)}
                                        />
                                    </Group.Item>
                                </Group>
                            </VerticalContainer>
                            :
                            <VerticalContainer width="90%" alignSelf="center">
                                <SizableText>Join or create Store</SizableText>
                                <Group orientation="vertical"
                                       boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
                                       separator={<Separator />}
                                >
                                    <Group.Item>
                                        <StyledListItem
                                            title="Join store"
                                            icon={TextSearch}
                                            iconAfter={ChevronRight}
                                            onPress={() => {router.push('/joinStore')}}
                                        />
                                    </Group.Item>
                                    <Group.Item>
                                        <StyledListItem
                                            title="Create store"
                                            icon={TextSearch}
                                            iconAfter={ChevronRight}
                                            onPress={() => {router.push('/createStore')}}
                                        />
                                    </Group.Item>
                                </Group>
                            </VerticalContainer>
                    }
                    <BigButton marginBottom={20} width="90%" alignSelf="center" onPress={() => confirmAlert(false)}>Log out</BigButton>
                </VerticalContainer>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    AndroidSafeArea: {
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flex: 1,
    }
})