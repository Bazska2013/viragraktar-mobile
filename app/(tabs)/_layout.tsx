import {Tabs} from "expo-router";
import {SymbolView} from "expo-symbols";
import {FontAwesome} from "@expo/vector-icons";
import {StyleSheet, TouchableOpacity, useColorScheme} from "react-native";
import * as Haptics from "expo-haptics";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
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
    )
}

const styles = StyleSheet.create({
    symbol: {
        width: 24,
        height: 24,
    },
});