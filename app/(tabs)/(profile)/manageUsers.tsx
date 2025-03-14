import {RefreshControl, SafeAreaView} from "react-native";
import {Accordion, Group, H6, Label, Paragraph, ScrollView, Separator, SizableText, Square, Switch} from "tamagui";
import {useEffect, useState} from "react";
import axios from "@/scripts/axiosConfig";
import {
    BigButton,
    HorizontalContainer,
    SmallButton, SmallButtonWithAccent,
    StyledGroup,
    StyledListItem,
    VerticalContainer
} from "@/tamagui.config";
import {ChevronDown, ChevronRight, Save, Trash, User, UserSearch} from "@tamagui/lucide-icons";
import {router} from "expo-router";
import ManageUser from "@/app/(tabs)/(profile)/components/ManageUser";

export default function ManageUsers() {
    const [users, setUsers] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchUsers = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.get('/api/store/users');
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                setUsers(response.data);
            }
        }
    };

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchUsers().then(() => setIsRefreshing(false));
    }

    return (
        <SafeAreaView>
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'
                        automaticallyAdjustKeyboardInsets={true}
                        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
            >
                <VerticalContainer width="90%" alignSelf="center">
                    <Accordion overflow="hidden" type="multiple"
                               boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
                               borderRadius="$5"
                               marginTop="10%"
                    >
                    {Object.keys(users).map((user, index) => (
                        <Accordion.Item value={user} key={index}>
                            <Accordion.Trigger flexDirection="row" justifyContent="space-between">
                                {({open}: {open: boolean}) => (
                                    <>
                                        <Paragraph>{users[user].name}</Paragraph>
                                        <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                                            <ChevronDown size="$1" />
                                        </Square>
                                    </>

                                )}
                            </Accordion.Trigger>
                            <Accordion.HeightAnimator animation="medium">
                                <Accordion.Content animation="medium" exitStyle={{ opacity: 0 }}>
                                    <ManageUser
                                        name={users[user].name}
                                        email={users[user].email}
                                        isSeller={users[user].is_seller}
                                        isBuyer={users[user].is_buyer}
                                        isAdmin={users[user].is_admin}
                                        id={users[user].id}
                                        refetchUsers={fetchUsers}
                                    />
                                </Accordion.Content>
                            </Accordion.HeightAnimator>
                        </Accordion.Item>
                    ))}
                    </Accordion>
                </VerticalContainer>
            </ScrollView>
        </SafeAreaView>
    )
}