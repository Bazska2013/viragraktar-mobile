import {router, Tabs} from "expo-router";
import {Dimensions, TouchableOpacity, useColorScheme, StyleSheet, Platform} from "react-native";
import * as Haptics from "expo-haptics";
import {createContext, useContext, useEffect, useState} from "react";
import * as SecureStore from "expo-secure-store";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {Drawer} from "expo-router/drawer";
import {ShoppingCart, Store, User} from "@tamagui/lucide-icons";
import axios from "@/scripts/axiosConfig";
import {BlurView} from "expo-blur";

const UserContext = createContext<{
    user: any,
    setUser: (user: any) => void,
    store: any,
    setStore: (store: any) => void,
    getUserData: () => void
    fetchUserData: () => void
    before: boolean,
    setBefore: (before: boolean) => void,
    sign: string,
    setSign: (sign: string) => void
} | undefined>(undefined);

export function useUserContext() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within UserContextProvider');
    }
    return context;
}

const WideScreenThreshold = 768;

const useResponsiveLayout = () => {
    const [isWideScreen, setIsWideScreen] = useState(Dimensions.get('window').width >= WideScreenThreshold);

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setIsWideScreen(window.width >= WideScreenThreshold);
        });
        return () => subscription?.remove();
    }, []);

    return isWideScreen;
};

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const [user, setUser] = useState(null);
    const [store, setStore] = useState(null);
    const [before, setBefore] = useState(false);
    const [sign, setSign] = useState('');
    const isWideScreen = useResponsiveLayout();

    const fetchUserData = async () => {
        let response;
        try {
            response = await axios.get('/api/user');
        } catch (error: any) {
            if (error.response.data.message === 'Unauthenticated.') {
                router.replace('/login');
            }
        } finally {
            if (response?.status === 200) {
                setUser(response.data);
            }
        }
    }

    const getUserData = async () => {
        const user = JSON.parse(await SecureStore.getItemAsync('user') as string);
        const store = JSON.parse(await SecureStore.getItemAsync('store') as string);
        if (user) {
            setUser(user);
            if (store) {
                setStore(store);
            }
        } else {
            router.replace('/login');
        }
    }

    useEffect(() => {
        if (store) {
            setBefore(JSON.parse(store.currency).before);
            setSign(JSON.parse(store.currency).sign);
        }
    }, [store]);

    const contextValue = {
        user: user,
        setUser: setUser,
        store: store,
        setStore: setStore,
        getUserData: getUserData,
        fetchUserData: fetchUserData,
        before: before,
        setBefore: setBefore,
        sign: sign,
        setSign: setSign
    }

    return (
        <UserContext.Provider value={contextValue}>
            {isWideScreen ? <>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <Drawer screenOptions={{drawerActiveBackgroundColor: colorScheme === 'light' ? "#292023" : "#FBF9EF", drawerInactiveTintColor: colorScheme === 'light' ? "#292023" : "#FBF9EF", drawerActiveTintColor: colorScheme === 'light' ? "#292023" : "#FBF9EF", drawerStyle: {width: 200}}}>
                        <Drawer.Screen
                            name="(sell)"
                            options={{
                                drawerLabel: 'Sell',
                                title: 'Sell',
                                drawerIcon: ({ color }) => <Store />,
                                drawerType: 'front'
                            }}
                        />
                        <Drawer.Screen
                            name="(buy)"
                            options={{
                                drawerLabel: 'Buy',
                                title: 'Buy',
                                drawerIcon: ({ color }) => <ShoppingCart />,
                                drawerType: 'front'
                            }}
                        />
                        <Drawer.Screen
                            name="(profile)"
                            options={{
                                drawerLabel: 'Profile',
                                title: 'Profile',
                                drawerIcon: ({ color }) => <User />,
                                drawerType: 'front'
                            }}
                        />
                    </Drawer>
                </GestureHandlerRootView>
            </> : <>
                <Tabs screenOptions={{tabBarActiveTintColor: colorScheme === "light" ? "#292023" : "#FBF9EF", tabBarInactiveTintColor: 'gray', tabBarButton: (props) => (
                        <TouchableOpacity {...props} onPress={() => {Haptics.selectionAsync(); props.onPress();}} />
                    ), animation: "fade",
                    tabBarStyle: { position: 'absolute', zIndex: Platform.OS === "android" ? 1 : undefined, elevation: 0},
                    tabBarBackground : Platform.OS === 'ios' ? () => (
                            <BlurView tint={colorScheme === 'light' ? 'light' : "prominent"} intensity={50} style={StyleSheet.absoluteFill} />
                        ) : undefined,
                }}>
                    <Tabs.Screen name="(sell)"
                                 options={{title: 'Sell', headerShown: false,tabBarIcon: ({ color }) => <Store color={color} />,}}
                    />
                    <Tabs.Screen name="(buy)"
                                 options={{title: 'Buy', headerShown: false, tabBarIcon: ({ color }) => <ShoppingCart color={color} />,}}
                    />
                    <Tabs.Screen name="(profile)"
                                 options={{title: 'Profile', headerShown: false, tabBarIcon: ({color}) => <User color={color} />}}
                    />
                </Tabs>
            </>}
        </UserContext.Provider>
    )
}