import React,{component} from 'react';
import recieverDetailScreen from '../screens/recieverDetailsScreen';
import BookDonateScreen from '../screens/BookDonateScreen';
import{createStackNavigator} from 'react-navigation-stack';

export const AppStackNavigator=createStackNavigator({
    BookDonateList:{
        screen:BookDonateScreen,
        navigationOptions:{
            headerShown:false
        }
    },
recieverDetails:{
    screen:recieverDetailScreen,
    navigationOptions:{
        headerShown:false
    }
},
},
{
    initialRootName:'BookDonateList'
})