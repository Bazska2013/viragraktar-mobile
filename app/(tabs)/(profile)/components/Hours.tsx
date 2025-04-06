import {HorizontalContainer, SmallButtonWithAccent, StyledGroup, VerticalContainer} from "@/tamagui.config";
import {Checkbox, Group, H4, H6, Label, Separator} from "tamagui";
import RNDateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {useState} from "react";
import {Check} from "@tamagui/lucide-icons";
import {Platform} from "react-native";

const Hours = (props) => {
    const [fromDate, setFromDate] = useState(() => {
        const [hours, minutes] = (props.from || "00:00").split(':').map(Number);
        return new Date(1970, 0, 1, hours, minutes);
    });
    const [toDate, setToDate] = useState(() => {
        const [hours, minutes] = (props.to || "00:00").split(':').map(Number);
        return new Date(1970, 0, 1, hours, minutes);
    });

    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);

    const handleFrom = (event: DateTimePickerEvent, date: Date) => {
        const {
            type,
            nativeEvent: {timestamp, utcOffset},
        } = event;
        if (type === 'dismissed') {
            setShowFromPicker(false);
            return;
        }
        setFromDate(new Date(date));
        props.onSelectFrom(date.getHours() + ':' + date.getMinutes());
        setShowFromPicker(false);
    }

    const handleTo = (event: DateTimePickerEvent, date: Date) => {
        const {
            type,
            nativeEvent: {timestamp, utcOffset},
        } = event;
        if (type === 'dismissed') {
            setShowToPicker(false);
            return;
        }
        setToDate(new Date(date));
        props.onSelectTo(date.getHours() + ':' + date.getMinutes());
        setShowToPicker(false);
    }

    return (
        <VerticalContainer width="100%">
            <H4>
                {props.day}
            </H4>

            <Group orientation="horizontal" width="100%" justifyContent="space-between">
                {Platform.OS === 'android' ? <>
                    <Group.Item>
                        <H6>From</H6>
                        <SmallButtonWithAccent onPress={setShowFromPicker}>{props.from}</SmallButtonWithAccent>
                        {showFromPicker &&
                            <RNDateTimePicker is24Hour display="clock" style={{width: '100%'}} alignSelf="center" value={fromDate} onChange={handleFrom} mode="time" />
                        }
                    </Group.Item>
                    <Group.Item>
                        <H6>to</H6>
                        <SmallButtonWithAccent onPress={setShowToPicker}>{props.to}</SmallButtonWithAccent>
                        {showToPicker &&
                            <RNDateTimePicker is24Hour display="clock" alignSelf="center" value={toDate} onChange={handleTo} mode="time" />
                        }
                    </Group.Item>
                </> : <>
                    <Group.Item>
                        <H6>From</H6>
                        <RNDateTimePicker style={{width: '100%'}} alignSelf="center" value={fromDate} onChange={handleFrom} mode="time" />
                    </Group.Item>
                    <Group.Item>
                        <H6>to</H6>
                        <RNDateTimePicker alignSelf="center" value={toDate} onChange={handleTo} mode="time" />
                    </Group.Item>
                </>}
            </Group>
            <HorizontalContainer width="inherit"
                                 justifyContent="space-between"
                                 alignItems="center"
            >
                <Label htmlFor={'closed' + props.day}>Closed</Label>
                <Checkbox id={'closed' + props.day} name="closed" checked={!!props.closed} onCheckedChange={props.onClick}>
                    <Checkbox.Indicator>
                        <Check />
                    </Checkbox.Indicator>
                </Checkbox>
            </HorizontalContainer>
            {props.day !== 'Sun' &&
                <Separator />
            }
        </VerticalContainer>
    )
}

export default Hours;