import {StyledGroup, VerticalContainer} from "@/tamagui.config";
import {Group, H4} from "tamagui";
import RNDateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {useState} from "react";

const Hours = (props) => {
    const [fromDate] = useState(new Date(props.from.split(':')[0], props.from.split(':')[1]));
    const [toDate] = useState(new Date(props.to.split(':')[0], props.to.split(':')[1]));

    const setFromDate = (event: DateTimePickerEvent, date: Date) => {
        const {
            type,
            nativeEvent: {timestamp, utcOffset},
        } = event;
        props.onSelectFrom(date.getHours() + ':' + date.getMinutes());
    }

    const setToDate = (event: DateTimePickerEvent, date: Date) => {
        const {
            type,
            nativeEvent: {timestamp, utcOffset},
        } = event;
        props.onSelectTo(date.getHours() + ':' + date.getMinutes());
    }

    return (
        <VerticalContainer>
            <H4>
                {props.day}
            </H4>
            <StyledGroup orientation="vertical">
                <Group.Item>
                    <RNDateTimePicker minimumDate={new Date(0,0)} value={fromDate} onChange={setFromDate} mode="time" />
                </Group.Item>
                <Group.Item>
                    <RNDateTimePicker minimumDate={new Date(0,0)} value={toDate} onChange={setToDate} mode="time" />
                </Group.Item>
            </StyledGroup>
        </VerticalContainer>
    )
}

export default Hours;