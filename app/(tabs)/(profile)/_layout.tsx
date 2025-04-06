import {router, Stack} from "expo-router";
import {Button, Dimensions, Platform} from "react-native";
import React, {createContext, useContext, useState} from "react";

const ReportContext = createContext<{
        data: any,
        setData: (data: any) => void,
        date: Date,
        setDate: (date: Date) => void,
        start: Date,
        setStart: (start: Date) => void,
        end: Date,
        setEnd: (end: Date) => void,
        items: any,
        setItems: (items: any) => void,
        oneDay: boolean,
        setOneDay: (oneDay: boolean) => void,
        showDistribution: boolean,
        setShowDistribution: (showDistribution: boolean) => void,
        showRevenue: boolean,
        setShowRevenue: (showRevenue: boolean) => void,
        showTable: boolean,
        setShowTable: (showTable: boolean) => void,
        showPie: boolean,
        setShowPie: (showPie: boolean) => void,
        showLine: boolean,
        setShowLine: (showLine: boolean) => void,
        showDistTable: boolean,
        setShowDistTable: (showDistTable: boolean) => void,
        showTransactionTable: boolean,
        setShowTransactionTable: (showTransactionTable: boolean) => void,
        showTotal: boolean,
        setShowTotal: (showTotal: boolean) => void,
        getReadableDate: (date: Date) => string,
} | undefined>(undefined);

export function useReportContext() {
        const context = useContext(ReportContext);
        if (!context) {
                throw new Error('useReportContext must be used within ReportContextProvider');
        }
        return context;
}

export default function ProfileLayout() {
        const [data, setData] = useState([]);
        const [date, setDate] = useState(new Date());
        const [start, setStart] = useState(new Date());
        const [end, setEnd] = useState(new Date());
        const [items, setItems] = useState([]);
        const [oneDay, setOneDay] = useState(true);
        const [showDistribution, setShowDistribution] = useState(true);
        const [showRevenue, setShowRevenue] = useState(true);
        const [showTable, setShowTable] = useState(true);
        const [showPie, setShowPie] = useState(true);
        const [showLine, setShowLine] = useState(true);
        const [showDistTable, setShowDistTable] = useState(true);
        const [showTransactionTable, setShowTransactionTable] = useState(true);
        const [showTotal, setShowTotal] = useState(true);

        const getReadableDate = (date: Date) => {
                let year = date.getFullYear();
                let month = (date.getMonth() + 1).toString();
                let day = (date.getDate()).toString();
                if (parseInt(month) < 10) {
                        month = '0' + month;
                }
                if (parseInt(day) < 10) {
                        day = '0' + day;
                }
                return year + '-' + month + '-' + day;
        }

        const contextValue = {
                data: data,
                setData: setData,
                date: date,
                setDate: setDate,
                start: start,
                setStart: setStart,
                end: end,
                setEnd: setEnd,
                items: items,
                setItems: setItems,
                oneDay: oneDay,
                setOneDay: setOneDay,
                showDistribution: showDistribution,
                setShowDistribution: setShowDistribution,
                showRevenue: showRevenue,
                setShowRevenue: setShowRevenue,
                showTable: showTable,
                setShowTable: setShowTable,
                showPie: showPie,
                setShowPie: setShowPie,
                showLine: showLine,
                setShowLine: setShowLine,
                showDistTable: showDistTable,
                setShowDistTable: setShowDistTable,
                showTransactionTable: showTransactionTable,
                setShowTransactionTable: setShowTransactionTable,
                showTotal: showTotal,
                setShowTotal: setShowTotal,
                getReadableDate: getReadableDate,
        }

    return (
        <ReportContext.Provider value={contextValue}>
                <Stack screenOptions={{ headerTintColor: "#292023" }}>
                        <Stack.Screen name="index"
                                      options={{title: 'Profile', headerShown: false}} />
                        <Stack.Screen name="joinStore"
                                      options={{title: 'Join Store', headerShown: true, presentation: Dimensions.get('window').width >= 768 ? "fullScreenModal" : "modal", headerLeft: Platform.OS === 'ios' ? () => <Button color="#292023" title="Cancel" onPress={() => router.back()} /> : undefined}} />
                        <Stack.Screen name="createStore"
                                      options={{title: 'Create Store', headerShown: true, presentation: Dimensions.get('window').width >= 768 ? "fullScreenModal" : "modal", headerLeft: Platform.OS === 'ios' ? () => <Button color="#292023" title="Cancel" onPress={() => router.back()} /> : undefined}} />
                        <Stack.Screen name='storeDetails'
                                      options={{title: 'Store details', headerShown: true }} />
                        <Stack.Screen name="profileDetails"
                                      options={{title: 'Profile details', headerShown: true }} />
                        <Stack.Screen name="changeName"
                                      options={{title: 'Change name', headerShown: true}} />
                        <Stack.Screen name="changePassword"
                                      options={{title: 'Change password', headerShown: true}} />
                        <Stack.Screen name="changeStoreName"
                                      options={{title: 'Change store name', headerShown: true}} />
                        <Stack.Screen name="changeOpeningHours"
                                      options={{title: 'Change opening hours', headerShown: true}} />
                        <Stack.Screen name="changePriceCalculation"
                                      options={{title: 'Change price calculation', headerShown: true}} />
                        <Stack.Screen name="manageUsers"
                                      options={{title: 'Manage users', headerShown: true}} />
                        <Stack.Screen name="generateReport"
                                      options={{title: 'Generate report', headerShown: true}} />
                        <Stack.Screen name="viewReport"
                                      options={{title: 'View report', headerShown: true, headerBackTitle: 'Generate report'}} />
                </Stack>
        </ReportContext.Provider>
    )
}