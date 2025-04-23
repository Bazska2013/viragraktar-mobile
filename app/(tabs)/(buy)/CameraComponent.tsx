import {useEffect, useState, useCallback, useRef} from "react";
import {CameraType, CameraView, useCameraPermissions} from "expo-camera";
import {Spinner, YStack, Square, Circle, Image, SizableText, useTheme, H6, Paragraph} from "tamagui";
import {BigButton, EditContainer, SmallButton} from "@/tamagui.config";
import {RotateCcw, X, Save} from "@tamagui/lucide-icons"
import {Platform, useColorScheme, Linking} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";

const CameraComponent = ({open, setOpen, setImage}) => {
    const [facingMode, setFacingMode] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const ref = useRef<CameraView>(null);
    const [uri, setUri] = useState<string | null>(null);

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const handleTakePicture = async () => {
        const photo = await ref.current?.takePictureAsync();
        if (photo) {
            setUri(photo.uri);
        }
    }

    const handleSavePicture = async () => {
        if (uri) {
            setImage(uri);
            setOpen(false);
        }
    }

    const renderPicture = () => {
        return (
            <YStack backgroundColor={theme.colors.background} height="100%" width="100%">
                <Image top={60} width={350} height={350} alignSelf="center" borderRadius={5} source={{
                    uri: uri,
                }} />
                <Square position="absolute" bottom={60} left={20} onPress={() => setUri(null)}>
                    <RotateCcw />
                    <SizableText>Retake picture</SizableText>
                </Square>
                <Square position="absolute" bottom={60} right={20} onPress={handleSavePicture}>
                    <Save />
                    <SizableText>Save picture</SizableText>
                </Square>
            </YStack>
        )
    }

    const renderCamera = () => {
        return (
            <>
                <CameraView
                    style={{ flex: 1 }}
                    facing={facingMode}
                    ref={ref}
                >
                    <Square position="absolute" top={10} left={10} onPress={() => setFacingMode(() => (facingMode === 'back' ? 'front' : 'back'))}>
                        <RotateCcw size="$3" color="white" />
                    </Square>
                    <Square position="absolute" top={10} right={10} onPress={() => setOpen(false)}>
                        <X size="$3" color="white" />
                    </Square>
                    <Circle position="absolute" elevation="$4" pressStyle={{
                        opacity: 0.5,
                    }} backgroundColor="white" bottom={Platform.OS === 'ios' ? 10 : 60} alignSelf="center" size={80} onPress={handleTakePicture} />
                </CameraView>
            </>
        )
    }

    const askForPermission = () => {
        if (!permission?.canAskAgain) {
            return (
                <YStack backgroundColor={theme.colors.background} height="100%" width="100%">
                    <EditContainer>
                        <H6>Camera access is currently disabled.</H6>
                        <Paragraph>To enable access, please open your device's settings and allow camera permissions for this app.</Paragraph>
                        <BigButton onPress={() => Linking.openSettings()}>Go to settings</BigButton>
                        <SmallButton onPress={() => setOpen(false)}>Close</SmallButton>
                    </EditContainer>
                </YStack>
            )
        }
        return (
            <YStack backgroundColor={theme.colors.background} height="100%" width="100%">
                <EditContainer>
                    <H6>We need your permission to access the camera</H6>
                    <BigButton onPress={requestPermission}>Grant permission</BigButton>
                    <SmallButton onPress={() => setOpen(false)}>Do not give permission</SmallButton>
                </EditContainer>
            </YStack>
        )
    }

    if (!open) return null;

    if (!permission) {
        return <Spinner/>
    }

    return (
        <YStack position="absolute" top={0} left={0} zIndex={100} height="100%" width="100%">
            {uri ? renderPicture() : permission.granted ? renderCamera() : askForPermission()}
        </YStack>
    );
}

export default CameraComponent;