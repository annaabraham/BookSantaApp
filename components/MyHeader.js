import React, { Component} from 'react';
import { Header,Icon,Badge } from 'react-native-elements';
import { View, Text, StyeSheet ,Alert} from 'react-native';

export default class MyHeader extends Component{
constructor(props){
super(props)
this.state={
  value:""
}
}
GetNumberOfUnreadNotifications(){
  db.collection('all_notifications').where('Notification_status','===',"unread")
  .onSnapshot((snapshot)=>{
var unreadNotification=snapshot.docs.map(doc=>doc.data())
this.setState({
  value:unreadNotification.length
})
  }
  )
}
componentDidMount(){
  this.GetNumberOfUnreadNotifications()
}
 BellIconWithBadge=()=>{
  return(
    <View>
      <Icon name='bell' type='font-awesome' color='pink' size={25} onPress={()=>{this.props.navigation.navigate(Notification)}}/>
      <Badge
      value={this.state.value}
      containerStyle={{position:'Absolute',top:-4,right:-4}}/>
      </View>
  )
}
render(){
  return (
    <Header
    leftComponent={<Icon name='bars' type='font-awesome' color='Blue' onPress={()=>{props.navigation.toggleDrawer()}} />}
      centerComponent={{ text: props.title, style: { color: '#90A5A9', fontSize:20,fontWeight:"bold", } }}
      rightComponent={<BellIconWithBadge{...props}/>}
      backgroundColor = "#eaf8fe"
    />
  );
}
}

