import React,{ Component } from "react";
import {Text,View,TouchableOpacity,StyleSheet,KeyboardAvoidingView,Alert} from 'react-native'
import{createDrawerNavigator} from 'react-navigation-drawer'
import SettingScreen from "../screens/SettingScreen";
import {AppTabNavigator} from './AppTabNavigator'
import customSideBarMenu from './customSideBarMenu'
import NotificationScreen from "../screens/NotificationScreen";
import myDonationScreen from "../screens/myDonationScreen"
export const AppDrawerNavigator=createDrawerNavigator({
    Home:{
        screen:AppTabNavigator
    },
    setting:{
        screen:SettingScreen
    },
    Notification:{
        screen:NotificationScreen
    },
    myDonation:{
        screen:myDonationScreen
    }
},
{contentComponent:customSideBarMenu},
{
    initialRootName:'Home'
})