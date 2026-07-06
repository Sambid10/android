import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

export type BottomTabsParamList = {
Home: undefined;
Schedule: undefined;
Favourites: undefined;
Profile: undefined;
};

export type AuthStackParamList = {
Auth:undefined
}


export type RootStackParamList = {
MainTabs: NavigatorScreenParams<BottomTabsParamList>;
VacationDetail: { id: string };
Search:undefined
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof BottomTabsParamList> =
BottomTabScreenProps<BottomTabsParamList, T>;