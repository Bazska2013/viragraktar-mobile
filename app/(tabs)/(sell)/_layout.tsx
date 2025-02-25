import {Stack} from "expo-router";

export default function SellLayout() {
    return (
        <Stack>
            <Stack.Screen name="index"
                          options={{title: 'Sell', headerShown: false}} />
        </Stack>
    )
}