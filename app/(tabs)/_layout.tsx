import {router, Tabs} from "expo-router";
import {SymbolView} from "expo-symbols";
import {Dimensions, StyleSheet, TouchableOpacity, useColorScheme} from "react-native";
import * as Haptics from "expo-haptics";
import {createContext, useContext, useEffect, useState} from "react";
import * as SecureStore from "expo-secure-store";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {Drawer} from "expo-router/drawer";

const UserContext = createContext<{
    user: any,
    setUser: (user: any) => void,
    store: any,
    setStore: (store: any) => void,
    getUserData: () => void
} | undefined>(undefined);

export function useUserContext() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within UserContextProvider');
    }
    return context;
}

const WideScreenThreshold = 768; // Example iPad breakpoint width

const useResponsiveLayout = () => {
    const [isWideScreen, setIsWideScreen] = useState(Dimensions.get('window').width >= WideScreenThreshold);

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setIsWideScreen(window.width >= WideScreenThreshold);
        });
        return () => subscription?.remove(); // Cleanup listener on unmount
    }, []);

    return isWideScreen;
};

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const [user, setUser] = useState(null);
    const [store, setStore] = useState(null);
    const isWideScreen = useResponsiveLayout();

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

    const contextValue = {
        user: user,
        setUser: setUser,
        store: store,
        setStore: setStore,
        getUserData: getUserData
    }

    return (
        <UserContext.Provider value={contextValue}>
            {isWideScreen ? <>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <Drawer>
                        <Drawer.Screen
                            name="(sell)"
                            options={{
                                drawerLabel: 'Sell',
                                title: 'Sell',
                                drawerIcon: ({ color }) => <SymbolView name="storefront.fill" tintColor={color} />,
                                drawerType: 'front'
                            }}
                        />
                        <Drawer.Screen
                            name="(buy)"
                            options={{
                                drawerLabel: 'Buy',
                                title: 'Buy',
                                drawerIcon: ({ color }) => <SymbolView name="cart.fill" tintColor={color} />,
                                drawerType: 'front'
                            }}
                        />
                        <Drawer.Screen
                            name="(profile)"
                            options={{
                                drawerLabel: 'Profile',
                                title: 'Profile',
                                drawerIcon: ({ color }) => <SymbolView name="person.crop.square.fill" tintColor={color} />,
                                drawerType: 'front'
                            }}
                        />
                    </Drawer>
                </GestureHandlerRootView>
            </> : <>
                <Tabs screenOptions={{tabBarActiveTintColor: colorScheme === "light" ? "black" : "white", tabBarInactiveTintColor: 'gray', tabBarButton: (props) => (
                        <TouchableOpacity {...props} onPress={() => {Haptics.selectionAsync(); props.onPress();}} />
                    )}}>
                    <Tabs.Screen name="(sell)"
                                 options={{title: 'Sell', headerShown: false,tabBarIcon: ({ color }) => <SymbolView name="storefront.fill" tintColor={color} />,}}
                    />
                    <Tabs.Screen name="(buy)"
                                 options={{title: 'Buy', headerShown: false, tabBarIcon: ({ color }) => <SymbolView name="cart.fill" tintColor={color} />,}}
                    />
                    <Tabs.Screen name="(profile)"
                                 options={{title: 'Profile', headerShown: false, tabBarIcon: ({color}) => <SymbolView name="person.crop.square.fill" tintColor={color} />}}
                    />
                </Tabs>
            </>}
        </UserContext.Provider>
    )
}

const styles = StyleSheet.create({
    symbol: {
        width: 24,
        height: 24,
    },
});