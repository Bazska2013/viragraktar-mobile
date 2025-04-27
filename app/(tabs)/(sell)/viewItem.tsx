import {Platform, SafeAreaView, useColorScheme} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useSearchParams} from "expo-router/build/hooks";
import React, {useEffect, useRef, useState} from "react";
import axios, {BASE_URL} from "@/scripts/axiosConfig";
import {StatusBar} from "expo-status-bar";
import {H4, Image, ScrollView, Separator, SizableText, Spinner} from "tamagui";
import {EditContainer, HorizontalContainer, SmallButton, VerticalContainer} from "@/tamagui.config";
import flowerImage from "@/assets/images/defaultFlower.png";
import {ChevronLeft, FileSearch} from "@tamagui/lucide-icons";
import {useUserContext} from "@/app/(tabs)/_layout";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";

export default function ViewItem() {
    const scrollViewRef = useRef<ScrollView>(null);
    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
    const defaultId = useSearchParams().get('id');
    const [id, setId] = useState(defaultId);
    const [screenStack, setScreenStack] = useState([]);
    const {sign, before} = useUserContext();

    const [item, setItem] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const tabBarHeight = useBottomTabBarHeight();

    const fetchItem = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.get('/api/item/' + id);
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response.data.error);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                setItem(response.data);
            }
        }
    }

    useEffect(() => {
        fetchItem();
    }, [id]);

    useEffect(() => {
        if (screenStack.length > 0) {
            setId(screenStack[screenStack.length - 1]);
        } else {
            setId(defaultId);
        }
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }

    }, [screenStack]);

    if (error) {
        return (
            <SafeAreaView>
                <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
                <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive' ref={scrollViewRef}>
                    <EditContainer
                        backgroundColor={theme.colors.card}
                        marginBottom={tabBarHeight + 20}
                    >
                        <VerticalContainer>
                            <H4>Error</H4>
                            <SizableText>{error}</SizableText>
                        </VerticalContainer>
                    </EditContainer>
                </ScrollView>
            </SafeAreaView>
        )
    }

    if (isLoading) {
        return (
            <SafeAreaView>
                <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
                <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive' ref={scrollViewRef}>
                    <EditContainer
                        backgroundColor={theme.colors.card}
                        marginBottom={tabBarHeight + 20}
                    >
                        <VerticalContainer>
                            <Spinner size="large" />
                        </VerticalContainer>
                    </EditContainer>
                </ScrollView>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive' ref={scrollViewRef}>
                <EditContainer
                    backgroundColor={theme.colors.card}
                    marginBottom={tabBarHeight + 20}
                >
                    <SmallButton opacity={screenStack.length > 0 ? 1 : 0} icon={ChevronLeft} height={screenStack.length > 0 ? 25 : 0} animation="quickest" onPress={() => setScreenStack(screenStack.slice(0, -1))}>Back</SmallButton>
                    <VerticalContainer>
                        <H4>Name of the item</H4>
                        <SizableText>{item?.name}</SizableText>
                    </VerticalContainer>
                    <Separator />
                    <VerticalContainer>
                        <H4>Labels of the item</H4>
                        <HorizontalContainer flexWrap="wrap">
                            {item && JSON.parse(item.description).labels.map((label, index) => (
                                <SizableText key={label}>{label}</SizableText>
                            ))}
                        </HorizontalContainer>
                    </VerticalContainer>
                    <Separator />
                    <VerticalContainer>
                        <H4>Price of the item</H4>
                        <SizableText>{before ? sign + item?.price : item?.price + " " + sign}</SizableText>
                    </VerticalContainer>
                    <Separator />
                    <VerticalContainer>
                        <H4>Stock of the item</H4>
                        <SizableText>{item?.stock}</SizableText>
                    </VerticalContainer>
                    <Separator />
                    <VerticalContainer>
                        <H4>Image of the item</H4>
                        <Image alignSelf="center" borderRadius="$5" source={{
                            uri: item?.image ? BASE_URL + "/images/" + item?.image : flowerImage,
                            width: 120,
                            height: 120,
                        }} />
                    </VerticalContainer>
                    { item && JSON.parse(item.description).connections.length > 0 &&
                        <>
                            <Separator />
                            <VerticalContainer>
                                <H4>Created by combining:</H4>
                                <VerticalContainer>
                                    {item && JSON.parse(item.description).connections.map((combinedItem, index) => (
                                        <SmallButton key={combinedItem.id} icon={FileSearch}
                                                     onPress={() => setScreenStack([...screenStack, combinedItem.id])}
                                        >
                                            {combinedItem.name}
                                        </SmallButton>
                                    ))}
                                </VerticalContainer>
                            </VerticalContainer>
                        </>
                    }
                </EditContainer>
            </ScrollView>
        </SafeAreaView>
    )
}