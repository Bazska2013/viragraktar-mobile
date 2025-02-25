import {Stack} from "expo-router";

export default function BuyLayout() {
    return (
        <Stack>
            <Stack.Screen name="index"
                          options={{title: 'Buy', headerShown: false}} />
            <Stack.Screen name="newItem"
                            options={{title: 'New item', headerShown: true, presentation: 'modal'}} />
        </Stack>
    )
}