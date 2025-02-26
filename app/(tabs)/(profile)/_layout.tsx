import {Stack} from "expo-router";

export default function ProfileLayout() {
    return (
        <Stack>
            <Stack.Screen name="index"
                          options={{title: 'Profile', headerShown: false}} />
            <Stack.Screen name="joinStore"
                          options={{title: 'Join Store', headerShown: true, presentation: 'modal'}} />
            <Stack.Screen name="createStore"
                          options={{title: 'Create Store', headerShown: true, presentation: 'modal'}} />
        </Stack>
    )
}