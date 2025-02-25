import {Stack} from "expo-router";

export default function SellLayout() {
    return (
        <Stack>
            <Stack.Screen name="index"
                          options={{title: 'Sell', headerShown: false}} />
            <Stack.Screen name="newItem"
                          options={{title: 'New item', headerShown: false, presentation: 'modal'}} />
        </Stack>
    )
}