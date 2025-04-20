import {Platform, SafeAreaView, useColorScheme, View} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {router} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {useItemsContext} from "@/app/(tabs)/(buy)/_layout";
import axios from "@/scripts/axiosConfig";
import {Input, Label, ScrollView, Spinner, Image, Sheet, H4, Separator, SizableText, H6, Square} from "tamagui";
import {
    BigButton,
    EditContainer,
    HorizontalContainer,
    SmallButton,
    SmallButtonWithAccent,
    VerticalContainer
} from "@/tamagui.config";
import * as ImagePicker from 'expo-image-picker';
import Labels from "@/app/(tabs)/(buy)/Labels";
import {useUserContext} from "@/app/(tabs)/_layout";
import {Camera, FileImage} from "@tamagui/lucide-icons";
import CameraComponent from "@/app/(tabs)/(buy)/CameraComponent";

export default function NewItem() {

    const {fetchItems} = useItemsContext();
    const {sign, before} = useUserContext();

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [validInput, setValidInput] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [error, setError] = useState(null);
    const [labels, setLabels] = useState([]);

    const [image, setImage] = useState<string | null>(null);

    const [cameraOpen, setCameraOpen] = useState(false);

    const pickImage = async () => {
        setImageModal(false);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        let response;
        setIsLoading(true);
        let description = {
            labels: labels,
            connections: [],
        }
        try {
            const formDataForNew = new FormData();
            formDataForNew.set('name', name);
            formDataForNew.set('description', JSON.stringify(description));
            formDataForNew.set('price', price);
            formDataForNew.set('stock', stock);
            if (image) {
                formDataForNew.append('image', {
                    uri: image,
                    name: 'image.jpg',
                    type: 'image/jpeg'
                } as any);
            }
            response = await axios.post('/api/item', formDataForNew, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 201) {
                fetchItems();
                router.back();
            }
        }
    }

    const handleOpenCamera = () => {
        setCameraOpen(true);
        setImageModal(false);
    }

    useEffect(() => {
        if (name.length > 0 && price.length > 0 && stock.length > 0) {
            setValidInput(true);
        } else {
            setValidInput(false);
        }
    }, [name, description, price, stock]);

    return (
        <SafeAreaView>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            <Sheet
                modal={false}
                open={imageModal}
                onOpenChange={setImageModal}
                snapPoints={[20]}
                snapPointsMode='percent'
                dismissOnSnapToBottom
                position={0}
                zIndex={100_000}
                animation='medium'
            >
                <Sheet.Overlay
                    animation="lazy"
                    backgroundColor="$shadow2"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Sheet.Frame>
                    <HorizontalContainer width="100%" justifyContent="space-around">
                        <Square onPress={pickImage}>
                            <FileImage />
                            <SizableText>Upload from gallery</SizableText>
                        </Square>
                        <Square onPress={handleOpenCamera}>
                            <Camera />
                            <SizableText>Take a picture</SizableText>
                        </Square>
                    </HorizontalContainer>
                </Sheet.Frame>
            </Sheet>
            <CameraComponent open={cameraOpen} setOpen={setCameraOpen} setImage={setImage} />
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'>
                <EditContainer
                    backgroundColor={theme.colors.card}
                >
                    <VerticalContainer>
                        <Label htmlFor="name">
                            <H4>Name of the item</H4>
                        </Label>
                        <Input
                            backgroundColor={theme.colors.card}
                            id="name"
                            flex={1}
                            borderWidth={2}
                            value={name}
                            onChangeText={setName}
                            autoFocus
                            autoCapitalize="words"
                        />
                    </VerticalContainer>
                    <Separator />
                    <VerticalContainer>
                        <Label htmlFor="labels">
                            <H4>Labels of the item</H4>
                        </Label>
                        <Labels
                            id="labels"
                            value={labels}
                            onChange={setLabels}
                            combined={false}
                        />
                    </VerticalContainer>
                    <Separator />
                    <VerticalContainer>
                        <Label htmlFor="price">
                            <H4>Price of the item</H4>
                        </Label>
                        <HorizontalContainer alignItems="center" justifyContent="space-between">
                            {before &&
                                <H6>{sign}</H6>
                            }
                            <Input
                                backgroundColor={theme.colors.card}
                                flex={1}
                                borderWidth={2}
                                id="price"
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="numeric"
                            />
                            {!before &&
                                <H6>{sign}</H6>
                            }
                        </HorizontalContainer>
                    </VerticalContainer>
                    <Separator />
                    <VerticalContainer>
                        <Label htmlFor="stock">
                            <H4>Stock of the item</H4>
                        </Label>
                        <Input
                            backgroundColor={theme.colors.card}
                            flex={1}
                            borderWidth={2}
                            id="stock"
                            value={stock}
                            onChangeText={setStock}
                            keyboardType="numeric"
                        />
                    </VerticalContainer>
                    <Separator />
                    <VerticalContainer>
                        <SmallButtonWithAccent onPress={setImageModal}>Pick an image</SmallButtonWithAccent>
                        {image && <Image alignSelf="center" borderRadius={5} source={{
                            uri: image ? image : '',
                            width: 200,
                            height: 200,
                        }} />}
                    </VerticalContainer>
                    <Separator />
                    <BigButton onPress={() => {handleSubmit()}} disabled={!validInput}>{isLoading ? <Spinner /> : "New item"}</BigButton>
                    <SizableText color="$red1">{error}</SizableText>
                </EditContainer>
            </ScrollView>
        </SafeAreaView>
    )
};