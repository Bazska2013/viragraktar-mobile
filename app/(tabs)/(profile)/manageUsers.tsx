import {RefreshControl, SafeAreaView} from "react-native";
import {Accordion, H4, ScrollView, Spinner, Square} from "tamagui";
import {useEffect, useState} from "react";
import axios from "@/scripts/axiosConfig";
import {VerticalContainer} from "@/tamagui.config";
import {ChevronDown} from "@tamagui/lucide-icons";
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
                    {isLoading ? <Spinner /> : error ? <H4>An error occurred while fetching the users. Error: {error}</H4> :
                        <Accordion overflow="hidden" type="multiple"
                                   boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)"
                                   borderRadius="$5"
                                   marginTop="10%"
                        >
                            {Object.keys(users).map((user, index) => (
                                <Accordion.Item value={user} key={index}>
                                    <Accordion.Trigger flexDirection="row" justifyContent="space-between">
                                        {({open}: {open: boolean}) => (
                                            <>
                                                <H4>{users[user].name}</H4>
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
                    }
                </VerticalContainer>
            </ScrollView>
        </SafeAreaView>
    )
}