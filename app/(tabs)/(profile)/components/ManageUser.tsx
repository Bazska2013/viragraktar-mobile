import {HorizontalContainer, SmallButtonWithAccent, StyledGroup, VerticalContainer} from "@/tamagui.config";
import {H4, Label, Separator, SizableText, Spinner, Switch} from "tamagui";
import {Save, Trash} from "@tamagui/lucide-icons";
import {useState} from "react";
import {useUserContext} from "@/app/(tabs)/_layout";
import axios from "@/scripts/axiosConfig";

const ManageUser = (props) => {
    const [isSeller, setIsSeller] = useState(!!props.isSeller);
    const [isBuyer, setIsBuyer] = useState(!!props.isBuyer);
    const [isAdmin, setIsAdmin] = useState(!!props.isAdmin);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isChanged, setIsChanged] = useState(false);

    const {user, setUser} = useUserContext();

    const handleChange = (checked, type) => {
        setIsChanged(true);
        switch (type) {
            case 'seller':
                setIsSeller(checked);
                break;
            case 'buyer':
                setIsBuyer(checked);
                break;
            case 'admin':
                if (user.id === props.id) {
                    return;
                }
                setIsAdmin(checked);
                break;
        }
    }

    const handleSave = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/update-privileges/' + user.id, {
                is_seller: isSeller,
                is_buyer: isBuyer,
                is_admin: isAdmin
            });
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response?.data?.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 204) {
                setIsChanged(false);
                await updateUser()
            }
        }
    }

    const updateUser = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.get('/api/user');
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                setUser(response.data);
                props.refetchUsers();
            }
        }
    }

    const handleDelete = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/store/users/remove/' + props.id);
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            setIsChanged(false);
            if (response?.status === 204) {
                props.refetchUsers();
            }
        }
    }

    return (
        <VerticalContainer>
            <HorizontalContainer flex={1} alignItems="center">
                <H4 flex={1}>Name</H4>
                <SizableText flex={2}>{props.name}</SizableText>
            </HorizontalContainer>
            <Separator />
            <HorizontalContainer flex={1} alignItems="center">
                <H4 flex={1}>Email</H4>
                <SizableText flex={2}>{props.email}</SizableText>
            </HorizontalContainer>
            <Separator />
            <HorizontalContainer flex={1} alignItems="center" justifyContent="space-between">
                <Label htmlFor={props.name + 'seller'}>
                    <H4>Seller</H4>
                </Label>
                <Switch checked={isSeller} id={props.name + 'seller'} size="$3" onCheckedChange={(checked) => handleChange(checked, 'seller')}>
                    <Switch.Thumb animation="bouncy" />
                </Switch>
            </HorizontalContainer>
            <Separator />
            <HorizontalContainer flex={1} alignItems="center" justifyContent="space-between">
                <Label htmlFor={props.name + 'buyer'}>
                    <H4>Buyer</H4>
                </Label>
                <Switch checked={isBuyer} id={props.name + 'buyer'} size="$3" onCheckedChange={(checked) => handleChange(checked, 'buyer')}>
                    <Switch.Thumb animation="bouncy" />
                </Switch>
            </HorizontalContainer>
            <Separator />
            <HorizontalContainer flex={1} alignItems="center" justifyContent="space-between">
                <Label htmlFor={props.name + 'admin'}>
                    <H4>Admin</H4>
                </Label>
                <Switch checked={isAdmin} disabled={user.id === props.id} opacity={user.id !== props.id ? 1 : 0.5} id={props.name + 'admin'} size="$3" onCheckedChange={(checked) => handleChange(checked, 'admin')}>
                    <Switch.Thumb animation="bouncy" />
                </Switch>
            </HorizontalContainer>
            <Separator />
            <StyledGroup orientation="horizontal" justifyContent="space-between" alignSelf="center">
                <SmallButtonWithAccent icon={Save} disabled={!isChanged} opacity={isChanged ? 1 : 0.5} onPress={() => handleSave()} >{isLoading ? <Spinner /> : 'Save changes'}</SmallButtonWithAccent>
                <SmallButtonWithAccent icon={Trash} disabled={user.id === props.id} opacity={user.id !== props.id ? 1 : 0.5} onPress={() => handleDelete()} >{isLoading ? <Spinner /> :'Remove user'}</SmallButtonWithAccent>
            </StyledGroup>
            {error && <SizableText color="$red1">{error}</SizableText>}
        </VerticalContainer>
    )
}

export default ManageUser;