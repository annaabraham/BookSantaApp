import react, {Component} from 'react';
import {Text,View,StyleSheet,KeyboardAvoidingView,TouchableOpacity,TextInput, Dimensions} from 'react-native';
import db from '../config';
import firebase from 'firebase';

export default class Flatlist extends Component{
constructor(props){
    super(props)
    this.state={AllNotifications:this.props.allNotifications}
    
}

updateMarkasRead=(notification)=>{
    db.collection('all_notifications').doc(notification.doc_id).update({
        notification_status:"read"
    })
}
onSwipeValueChange=(swipedata)=>{
    var allNotifications=this.state.allNotifications
    const {key,value}=swipedata
    if(value<-Dimensions.get("window").width){
        const newData=[...allNotifications]
        this.updateMarkasRead(allNotifications[key])
        newData.splice(key,1)
        this.setState({
            allNotifications:newData
        })
    }
}
renderItem=(data)=>{
    <ListItem
    title={data.item.book_name}
    subtitle={data.item.message}
    titleStyle={{ color: 'black', fontWeight: 'bold' }}
    leftElement={<Icon name="book" type="font-awesome" color="Red"></Icon>}
       
    bottomDivider
  />
}
renderHiddenItem=()=>{
    <View>
        <View><Text>Mark as Read</Text></View>
    </View>
}
render(){
    return(
        <View>
            <SwipeListView
            disableRightSwipe
            data={this.state.allNotifications}
            renderItem={this.renderItem}
            renderHiddenItem={this.renderHiddenItem}
            openValue={-Dimensions.get("window").width}
            previewRowKey={"0"}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            onSwipeValueChange={this.onSwipeValueChange}
            KeyExtracter={(item,index)=>index.toString()}
            

            >

            </SwipeListView>
        </View>
    )
}
}