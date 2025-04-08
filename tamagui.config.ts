import { defaultConfig } from '@tamagui/config/v4'
import {Button, createTamagui, Group, ListItem, styled, XStack, YStack} from 'tamagui'

export const VerticalContainer = styled(YStack, {
    flex: 1,
    gap: "$5",
    padding: "$1",
});

export const HorizontalContainer = styled(XStack, {
    flex: 1,
    gap: "$5",
    padding: "$1",
});

export const EditContainer = styled(YStack, {
    flex: 1,
    gap: "$5",
    padding: "$5",
    borderRadius: "$5",
    marginTop: "$5",
    marginBottom: "$5",
    width: '90%',
    alignSelf: 'center',
    boxShadow: "0px 0px 10px 1px rgba(0,0,0,0.1)",
});

export const BigButton = styled(Button, {
    backgroundColor: '#292023',
    color: 'white',
    boxShadow: "0px 0px 10px 1px rgba(0,0,0,0.1)",
    animation: 'quick',
    hoverStyle: {
        backgroundColor: '#392D31',
    },
    focusStyle: {
        backgroundColor: '#392D31',
    },
    pressStyle: {
        backgroundColor: '#838072',
        scale: 0.95,
    },
    disabledStyle: {
        backgroundColor: '#44363A',
        border: 'none',
    },
    size: "$6",
});

export const SmallButtonWithAccent = styled(Button, {
    backgroundColor: '#FBF9EF',
    boxShadow: "0px 0px 10px 1px rgba(0,0,0,0.1)",
    animation: 'quick',
    hoverStyle: {
        backgroundColor: '#faf0e6',
    },
    focusStyle: {
        backgroundColor: '#faf5eb',
    },
    pressStyle: {
        backgroundColor: '#f5ebe1',
        scale: 0.95,
    },
    disabledStyle: {
        backgroundColor: '#fffaf5',
        border: 'none',
    },
    size: "$3",
});

export const SmallButton = styled(Button, {
    backgroundColor: '#f5f5f5',
    boxShadow: "0px 0px 10px 1px rgba(0,0,0,0.1)",
    animation: 'quick',
    hoverStyle: {
        backgroundColor: '#f0f0f0',
    },
    focusStyle: {
        backgroundColor: '#f3f3f3',
    },
    pressStyle: {
        backgroundColor: '#f1f1f1',
        scale: 0.95,
    },
    disabledStyle: {
        backgroundColor: '#fafafa',
        border: 'none',
    },
    size: "$3",
});

export const StyledListItem = styled(ListItem, {
    backgroundColor: '#ffffff',
    pressStyle: {
        backgroundColor: '#fafafa',
    }
});

export const StyledGroup = styled(Group, {
    boxShadow: "0px 0px 10px 1px rgba(0,0,0,0.1)",
});

export const tamaguiConfig = createTamagui(defaultConfig)

export default tamaguiConfig

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
    interface TamaguiCustomConfig extends Conf {}
}