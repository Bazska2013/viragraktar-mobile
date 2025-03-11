import {router, Stack} from "expo-router";
import {Button, Dimensions} from "react-native";
import axios from "@/scripts/axiosConfig";

export default function ProfileLayout() {

    return (
        <Stack>
            <Stack.Screen name="index"
                          options={{title: 'Profile', headerShown: false}} />
            <Stack.Screen name="joinStore"
                          options={{title: 'Join Store', headerShown: true, presentation: Dimensions.get('window').width >= 768 ? "fullScreenModal" : "modal", headerLeft: () => <Button title="Cancel" onPress={() => router.back()} />}} />
            <Stack.Screen name="createStore"
                          options={{title: 'Create Store', headerShown: true, presentation: Dimensions.get('window').width >= 768 ? "fullScreenModal" : "modal", headerLeft: () => <Button title="Cancel" onPress={() => router.back()} />}} />
            <Stack.Screen name='editStore'
                          options={{title: 'Edit Store', headerShown: true, presentation: Dimensions.get('window').width >= 768 ? "fullScreenModal" : "modal", headerLeft: () => <Button title="Cancel" onPress={() => router.back()} />}} />
            <Stack.Screen name='storeDetails'
                          options={{title: 'Store details', headerShown: true }} />
        </Stack>
    )
}