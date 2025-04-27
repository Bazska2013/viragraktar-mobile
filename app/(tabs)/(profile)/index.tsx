import {Alert, Dimensions, Platform, RefreshControl, SafeAreaView, StatusBar, StyleSheet, useColorScheme} from "react-native";
import {router} from "expo-router";
import * as SecureStore from 'expo-secure-store';
import {useEffect, useState} from "react";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import axios from "@/scripts/axiosConfig";
import {useUserContext} from "@/app/(tabs)/_layout";
import {Group, H4, H6, ScrollView, Separator, SizableText} from 'tamagui';
import {BigButton, StyledGroup, StyledListItem, VerticalContainer} from "@/tamagui.config";
import {BookKey, BookUser, Calendar, ChevronRight, DollarSign, FilePen, LineChart, LogOut, Tags, TextSearch, UserPen, UserSearch} from "@tamagui/lucide-icons";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";

export default function Profile() {
    const [profit, setProfit] = useState(0);

    const [isRefreshing, setIsRefreshing] = useState(false);

    const {user, setUser, store, setStore, getUserData, fetchUserData, sign, before} = useUserContext();

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
    const tabBarHeight = useBottomTabBarHeight();

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
                style: 'cancel',
            },
            (type ? {
                text: 'Confirm', onPress: () => handleLeaveStore()
            } : {
                text: 'Confirm', onPress: () => handleLogout()
            }),
        ]);

    return (
        <SafeAreaView style={[styles.SafeArea]}>
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'
                        automaticallyAdjustKeyboardInsets={true}
                        contentInsetAdjustmentBehavior="automatic"
                        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
            >
                <VerticalContainer marginTop={Dimensions.get('window').width >= 768 ? 20 : 0} marginBottom={tabBarHeight + 20}>
                    <VerticalContainer
                        borderRadius="$5"
                        width="90%"
                        alignSelf="center"
                        boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)"
                        backgroundColor={theme.colors.card}
                        padding="$3"
                        marginTop={Platform.OS === 'android' ? StatusBar.currentHeight : 0}
                    >
                        <H4>Hello {user?.name}!</H4>
                        {store &&
                            <H6>Today's profit of {store?.name} is {before ? sign + profit : profit + " " + sign}</H6>
                        }
                    </VerticalContainer>
                    <VerticalContainer width="90%" alignSelf="center">
                        <SizableText>User settings</SizableText>
                        <StyledGroup orientation="vertical"
                               separator={<Separator />}
                        >
                            <Group.Item>
                                <StyledListItem
                                    title="Profile details"
                                    icon={UserSearch}
                                    iconAfter={ChevronRight}
                                    onPress={() => {router.navigate('/profileDetails')}}
                                />
                            </Group.Item>
                            <Group.Item>
                                <StyledListItem
                                    title="Change profile name"
                                    icon={UserPen}
                                    iconAfter={ChevronRight}
                                    onPress={() => {router.navigate('/changeName')}}
                                />
                            </Group.Item>
                            <Group.Item>
                                <StyledListItem
                                    title="Change password"
                                    icon={BookKey}
                                    iconAfter={ChevronRight}
                                    onPress={() => {router.navigate('/changePassword')}}
                                />
                            </Group.Item>
                        </StyledGroup>
                    </VerticalContainer>
                    {store && user.is_admin ?
                        <VerticalContainer width="90%" alignSelf="center">
                            <SizableText>Store settings</SizableText>
                            <StyledGroup orientation="vertical"
                                   separator={<Separator />}
                            >
                                <Group.Item>
                                    <StyledListItem
                                        title="Store details"
                                        icon={TextSearch}
                                        iconAfter={ChevronRight}
                                        onPress={() => {router.navigate('/storeDetails')}}
                                    />
                                </Group.Item>
                                <Group.Item>
                                    <StyledListItem
                                        title="Change store name"
                                        icon={FilePen}
                                        iconAfter={ChevronRight}
                                        onPress={() => {router.navigate('/changeStoreName')}}
                                    />
                                </Group.Item>
                                <Group.Item>
                                    <StyledListItem
                                        title="Change opening hours"
                                        icon={Calendar}
                                        iconAfter={ChevronRight}
                                        onPress={() => {router.navigate('/changeOpeningHours')}}
                                    />
                                </Group.Item>
                                <Group.Item>
                                    <StyledListItem
                                        title="Change currency"
                                        icon={DollarSign}
                                        iconAfter={ChevronRight}
                                        onPress={() => {router.navigate('/changeCurrency')}}
                                    />
                                </Group.Item>
                                <Group.Item>
                                    <StyledListItem
                                        title="View report"
                                        icon={LineChart}
                                        iconAfter={ChevronRight}
                                        onPress={() => {router.navigate('/generateReport')}}
                                    />
                                </Group.Item>
                                <Group.Item>
                                    <StyledListItem
                                        title="Manage users"
                                        icon={BookUser}
                                        iconAfter={ChevronRight}
                                        onPress={() => {router.navigate('/manageUsers')}}
                                    />
                                </Group.Item>
                                <Group.Item>
                                    <StyledListItem
                                        title="Modify labels"
                                        icon={Tags}
                                        iconAfter={ChevronRight}
                                        onPress={() => {router.navigate('/modifyLabels')}}
                                    />
                                </Group.Item>
                            </StyledGroup>
                        </VerticalContainer> :
                        store ?
                            <VerticalContainer width="90%" alignSelf="center">
                                <SizableText>Store settings</SizableText>
                                <StyledGroup orientation="vertical"
                                       separator={<Separator />}
                                >
                                    <Group.Item>
                                        <StyledListItem
                                            title="Store details"
                                            icon={TextSearch}
                                            iconAfter={ChevronRight}
                                            onPress={() => {router.navigate('/storeDetails')}}
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
                                </StyledGroup>
                            </VerticalContainer>
                            :
                            <VerticalContainer width="90%" alignSelf="center">
                                <SizableText>Join or create Store</SizableText>
                                <StyledGroup orientation="vertical"
                                       separator={<Separator />}
                                >
                                    <Group.Item>
                                        <StyledListItem
                                            title="Join store"
                                            icon={TextSearch}
                                            iconAfter={ChevronRight}
                                            onPress={() => {router.navigate('/joinStore')}}
                                        />
                                    </Group.Item>
                                    <Group.Item>
                                        <StyledListItem
                                            title="Create store"
                                            icon={TextSearch}
                                            iconAfter={ChevronRight}
                                            onPress={() => {router.navigate('/createStore')}}
                                        />
                                    </Group.Item>
                                </StyledGroup>
                            </VerticalContainer>
                    }
                    <BigButton marginBottom={20} width="90%" alignSelf="center" onPress={() => confirmAlert(false)}>Log out</BigButton>
                </VerticalContainer>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    SafeArea: {
        flex: 1,
    }
})