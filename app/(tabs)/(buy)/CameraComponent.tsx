import {useEffect, useState, useCallback, useRef} from "react";
import {CameraType, CameraView, useCameraPermissions} from "expo-camera";
import {Spinner, YStack, Square, Circle, Image, SizableText} from "tamagui";
import {SmallButton} from "@/tamagui.config";
import {RotateCcw, X, Save} from "@tamagui/lucide-icons"
import {Platform} from "react-native";

const CameraComponent = ({open, setOpen, setImage}) => {
    const [facingMode, setFacingMode] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const ref = useRef<CameraView>(null);
    const [uri, setUri] = useState<string | null>(null);

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
            <>
                <Image position="absolute" top={0} alignSelf="center" borderRadius={5} source={{
                    uri: uri,
                    width: '100%',
                    height: '100%',
                }} />
                <Square position="absolute" bottom={Platform.OS === 'ios' ? 10 : 60} left={10} onPress={() => setUri(null)}>
                    <RotateCcw />
                    <SizableText>Retake picture</SizableText>
                </Square>
                <Square position="absolute" bottom={Platform.OS === 'ios' ? 10 : 60} right={10} onPress={handleSavePicture}>
                    <Save />
                    <SizableText>Save picture</SizableText>
                </Square>
            </>
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
                        <RotateCcw />
                    </Square>
                    <Square position="absolute" top={10} right={10} onPress={() => setOpen(false)}>
                        <X />
                    </Square>
                    <Circle position="absolute" elevation="$4" pressStyle={{
                        opacity: 0.5,
                    }} backgroundColor="white" bottom={Platform.OS === 'ios' ? 10 : 60} alignSelf="center" size={80} onPress={handleTakePicture} />
                </CameraView>
            </>
        )
    }

    if (!open) return null;

    if (!permission) {
        return <Spinner/>
    }

    if (!permission.granted) {
        return (
            <YStack position="fixed" top={0} left={0} zIndex={100}>
                <SmallButton onPress={requestPermission}>Grant permission</SmallButton>
            </YStack>
        )
    }

    return (
        <YStack position="absolute" top={0} left={0} zIndex={100} height="100%" width="100%">
            {uri ? renderPicture() : renderCamera()}
        </YStack>
    );
}

export default CameraComponent;