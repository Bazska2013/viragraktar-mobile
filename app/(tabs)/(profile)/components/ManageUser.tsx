import {HorizontalContainer, SmallButtonWithAccent, StyledGroup, VerticalContainer} from "@/tamagui.config";
import {H4, Label, Separator, SizableText, Spinner, Switch} from "tamagui";
import {Save, Trash} from "@tamagui/lucide-icons";
import React, {useState} from "react";
import {useUserContext} from "@/app/(tabs)/_layout";
import axios from "@/scripts/axiosConfig";

const ManageUser = ({isSeller, isBuyer, isAdmin, id, refetchUsers, name, email }) => {
    const [isSellerField, setIsSellerField] = useState(!!isSeller);
    const [isBuyerField, setIsBuyerField] = useState(!!isBuyer);
    const [isAdminField, setIsAdminField] = useState(!!isAdmin);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isChanged, setIsChanged] = useState(false);

    const {user, setUser} = useUserContext();

    const handleChange = (checked, type) => {
        setIsChanged(true);
        switch (type) {
            case 'seller':
                setIsSellerField(checked);
                break;
            case 'buyer':
                setIsBuyerField(checked);
                break;
            case 'admin':
                if (user.id === id) {
                    return;
                }
                setIsAdminField(checked);
                break;
        }
    }

    const handleSave = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/update-privileges/' + id, {
                is_seller: isSellerField,
                is_buyer: isBuyerField,
                is_admin: isAdminField
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
                refetchUsers();
            }
        }
    }

    const handleDelete = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/store/users/remove/' + id);
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            setIsChanged(false);
            if (response?.status === 204) {
                refetchUsers();
            }
        }
    }

    return (
        <VerticalContainer>
            <HorizontalContainer flex={1} alignItems="center">
                <H4 flex={1}>Name</H4>
                <SizableText flex={2}>{name}</SizableText>
            </HorizontalContainer>
            <Separator />
            <HorizontalContainer flex={1} alignItems="center">
                <H4 flex={1}>Email</H4>
                <SizableText flex={2}>{email}</SizableText>
            </HorizontalContainer>
            <Separator />
            <HorizontalContainer flex={1} alignItems="center" justifyContent="space-between">
                <Label htmlFor={name + 'seller'}>
                    <H4>Seller</H4>
                </Label>
                <Switch checked={isSellerField} id={name + 'seller'} size="$3" onCheckedChange={(checked) => handleChange(checked, 'seller')}>
                    <Switch.Thumb animation="bouncy" />
                </Switch>
            </HorizontalContainer>
            <Separator />
            <HorizontalContainer flex={1} alignItems="center" justifyContent="space-between">
                <Label htmlFor={name + 'buyer'}>
                    <H4>Buyer</H4>
                </Label>
                <Switch checked={isBuyerField} id={name + 'buyer'} size="$3" onCheckedChange={(checked) => handleChange(checked, 'buyer')}>
                    <Switch.Thumb animation="bouncy" />
                </Switch>
            </HorizontalContainer>
            <Separator />
            <HorizontalContainer flex={1} alignItems="center" justifyContent="space-between">
                <Label htmlFor={name + 'admin'}>
                    <H4>Admin</H4>
                </Label>
                <Switch checked={isAdminField} disabled={user.id === id} opacity={user.id !== id ? 1 : 0.5} id={name + 'admin'} size="$3" onCheckedChange={(checked) => handleChange(checked, 'admin')}>
                    <Switch.Thumb animation="bouncy" />
                </Switch>
            </HorizontalContainer>
            <Separator />
            <StyledGroup orientation="horizontal" justifyContent="space-between" alignSelf="center">
                <SmallButtonWithAccent boxShadow="unset" icon={Save} disabled={!isChanged} opacity={isChanged ? 1 : 0.5} onPress={handleSave} >{isLoading ? <Spinner /> : 'Save changes'}</SmallButtonWithAccent>
                <SmallButtonWithAccent boxShadow="unset" icon={Trash} disabled={user.id === id} opacity={user.id !== id ? 1 : 0.5} onPress={handleDelete} >{isLoading ? <Spinner /> :'Remove user'}</SmallButtonWithAccent>
            </StyledGroup>
            {error && <SizableText color="$red1">{error}</SizableText>}
        </VerticalContainer>
    )
}

export default React.memo(ManageUser);