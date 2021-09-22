import React,{ Component } from "react";
import{View,Text,StyleSheet,KeyboardAvoidingView,Alert,TouchableOpacity,TextInput, FlatList}from 'react-native';
import { Header } from "react-native/Libraries/NewAppScreen";

export default class Notification extends Component {
    constructor(){
        super()
    this.state={
        userId:firebase.auth().currentUSer.email,
        allNotifications:[]
    }
    this.requestRef=null
    }
    keyExtractor=(item,index)=>index.toString()
    renderItem=({item,i})=>{
    return(
        <ListItem
        key={i}
        title={item.book_name}
        titleStyle={{color:'black',fontWeight:'bold'}}
        subTitle={item.message}
        leftElement={<Icon name="Book" type="font-awesome" color="red"></Icon>}
        bottomDivider
        />

    )
    }
getNotifications=()=>{
    this.requestRef=db.collection('all_notifications')
    .where('notification_status','===',"unread")
    .where('targeted_user_id','===',this.state.userId())
    .onSnapshot(snapShot=>{
        var allNotifications=[]
        snapShot.docs.map(doc=>{
            var notification=doc.data
            notification["doc_id"]=doc.id
            allNotifications.push(notification)
        })
        this.setState({
            allNotifications:allNotifications
        })
    })
}
componentDidMount(){
    this.getNotifications()
}
componentWillUnmount(){
    this.notificationRef()
}
render(){
    return(
        <View style={{flex:1}}>
            <MyHeader title="Notifications"/>
            <View style={{flex:1}}>
                {
                    this.state.notifications.length===0
                    ?(
                       <View style={StyleSheet.subContainer}> 
                       <Text style={{fontSize:20}}>Notifications</Text>
                       </View>
                    )
                    :(
                        <FlatList
                        keyExtractor={this.keyExtractor}
                        data={this.state.notifications}
                        renderItem={this.renderItem}
                        />
                    )
                }
           </View>
           </View>
    )
}
}
const style=StyleSheet.create({
    subContainer:{
        flex:1,
        fontSize:20,
        justifyContent:'center',
        alignItems:'center'
    }
})