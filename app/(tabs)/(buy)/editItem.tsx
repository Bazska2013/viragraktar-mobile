import {useEffect, useState} from "react";
import {Platform, SafeAreaView, useColorScheme,} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useSearchParams} from "expo-router/build/hooks";
import axios, {BASE_URL} from '@/scripts/axiosConfig';
import {router} from "expo-router";
import {useItemsContext} from "@/app/(tabs)/(buy)/_layout";
import {StatusBar} from "expo-status-bar";
import {H4, ScrollView, Label, Input, Spinner, SizableText, Sheet, Image, Separator, H6, Square} from "tamagui";
import {
    BigButton,
    EditContainer,
    HorizontalContainer,
    SmallButtonWithAccent,
    VerticalContainer
} from "@/tamagui.config";
import * as ImagePicker from "expo-image-picker";
import Labels from "@/app/(tabs)/(buy)/Labels";
import {useUserContext} from "@/app/(tabs)/_layout";
import {Camera, FileImage} from "@tamagui/lucide-icons";
import CameraComponent from "@/app/(tabs)/(buy)/CameraComponent";

export default function EditItem() {
    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const {fetchItems} = useItemsContext();
    const {sign, before} = useUserContext();
    const id = useSearchParams().get('id');

    const [item, setItem] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [validInput, setValidInput] = useState(true);
    const [imageModal, setImageModal] = useState(false);
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

    const fetchItem = async () => {
        let response;
        try {
            response = await axios.get('/api/item/' + id);
        } catch (error: any) {
            setError(error.response.data.message);
        } finally {
            if (response?.status === 200) {
                setItem(response.data);
                setLabels(JSON.parse(response.data.description).labels);
            }
        }
    }

    const handleSubmit = async () => {
        let response;
        setIsLoading(true);
        let description = {
            labels: labels,
            connections: item.description.connections || [],
        }
        try {
            const formDataForEdit = new FormData();
            formDataForEdit.set('name', item.name);
            formDataForEdit.set('description', JSON.stringify(description));
            formDataForEdit.set('price', item.price);
            formDataForEdit.set('stock', item.stock);
            if (image) {
                formDataForEdit.append('image', {
                    uri: image,
                    name: 'image.jpg',
                    type: 'image/jpeg'
                } as any);
            }
            response = await axios.post('/api/item/edit/' + id, formDataForEdit, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
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
        fetchItem();
    }, []);

    useEffect(() => {
        if (item) {
            if (item.name.toString().length > 0 && item.price.toString().length > 0 && item.stock.toString().length > 0) {
                setValidInput(true);
            } else {
                setValidInput(false);
            }
        }
    }, [item]);

    return (
        <SafeAreaView>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            <Sheet
                modal={false}
                open={imageModal}
                onOpenChange={setImageModal}
                snapPoints={[Platform.OS === 'ios' ? 20 : 30]}
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
            {item &&
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
                                flex={1}
                                borderWidth={2}
                                id="name"
                                value={item.name.toString()}
                                onChangeText={(value) => setItem({...item, name: value})}
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
                                    value={item.price.toString()}
                                    onChangeText={(value) => setItem({...item, price: value})}
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
                                value={item.stock.toString()}
                                onChangeText={(value) => setItem({...item, stock: value})}
                                keyboardType="numeric"
                            />
                        </VerticalContainer>
                        <Separator />
                        <VerticalContainer>
                            <SmallButtonWithAccent onPress={setImageModal}>{item.image ? 'Change image' : 'Pick an image'}</SmallButtonWithAccent>
                            {(item.image || image) && <Image alignSelf="center" borderRadius={5} source={{
                                uri: image ? image : item.image ? BASE_URL + "/images/" + item.image : '',
                                width: 200,
                                height: 200,
                            }} />}
                        </VerticalContainer>
                        <Separator />
                        <BigButton onPress={() => {handleSubmit()}} disabled={!validInput}>{isLoading ? <Spinner /> : "Edit item"}</BigButton>
                        <SizableText>{error}</SizableText>
                    </EditContainer>
                </ScrollView>
            }
        </SafeAreaView>
    )
}