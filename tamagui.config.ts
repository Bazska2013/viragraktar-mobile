import { defaultConfig } from '@tamagui/config/v4'
import {Button, createTamagui, Group, ListItem, styled, XStack, YStack} from 'tamagui'
import {Dimensions} from "react-native";

export const VerticalContainer = styled(YStack, {
    flex: 1,
    gap: "$5",
    padding: "$1",
    elevation: "$10"
});

export const HorizontalContainer = styled(XStack, {
    flex: 1,
    gap: "$5",
    padding: "$1",
    elevation: "$10"
});

export const EditContainer = styled(YStack, {
    flex: 1,
    gap: "$5",
    padding: "$5",
    width: Dimensions.get('window').width > 1280 ? '50%' : Dimensions.get('window').width > 768 ? '75%' : '100%',
    alignSelf: 'center',
});

export const BigButton = styled(Button, {
    backgroundColor: '#292023',
    color: 'white',
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)",
    hoverStyle: {
        backgroundColor: '#392D31',
    },
    focusStyle: {
        backgroundColor: '#392D31',
    },
    pressStyle: {
        backgroundColor: '#838072'
    },
    disabledStyle: {
        backgroundColor: '#44363A',
        border: 'none',
    },
    size: "$6",
});

export const SmallButtonWithAccent = styled(Button, {
    backgroundColor: '#8e8b7c',
    color: 'white',
    hoverStyle: {
        backgroundColor: '#979487',
    },
    focusStyle: {
        backgroundColor: '#979487',
    },
    pressStyle: {
        backgroundColor: '#838072'
    },
    disabledStyle: {
        backgroundColor: '#A09E92',
        border: 'none',
    },
    size: "$3",
});

export const SmallButton = styled(Button, {
    backgroundColor: '#f2f6d5',
    color: 'black',
    hoverStyle: {
        backgroundColor: '#fafbee',
    },
    focusStyle: {
        backgroundColor: '#fafbee',
    },
    pressStyle: {
        backgroundColor: '#F0F3CD'
    },
    disabledStyle: {
        backgroundColor: '#FFFFFF',
        border: 'none',
    },
    size: "$3",
});

export const StyledListItem = styled(ListItem, {
    pressStyle: {
        backgroundColor: '#ffffff',
    }
})

export const StyledGroup = styled(Group, {
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)",
})

export const tamaguiConfig = createTamagui(defaultConfig)

export default tamaguiConfig

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
    interface TamaguiCustomConfig extends Conf {}
}