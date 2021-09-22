import React,{component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity,TextInput} from 'react-native';
import db from '../config'
import firebase from 'firebase';

export default class MyDonation extends component{
    constructor(){
        super()
        this.state={
            userId:firebase.auth().currentUser.email,
            allDonations:[]
        }
        this.requestRef=null
    }
    componentDidMount(){
        this.getDonations()
    }
    componentWillMount(){
       this.requestRef() 
    }
    keyExtractor=(item,index)=>index.toString()

    renderItem = ( {item, i} ) =>{
        return (
          <ListItem
            key={i}
            title={item.book_name}
            subtitle={"Requested by"+item.requested_by+"status"+item.request_status}
            titleStyle={{ color: 'black', fontWeight: 'bold' }}
            leftElement={<Icon name="book" type="font-awesome" color="Red"></Icon>}
            rightElement={
                <TouchableOpacity style={styles.button,{
                  backgroundColor:item.request_status==="Book sent"?"Green":"Blue"
                }}
                onPress={()=>
                  this.sendBook(item)
                }
               
                >
                  
                  <Text style={{color:'#ffff'}}>item.request_status==="Book sent"?"Book sent":"Send book"</Text>
                </TouchableOpacity>
              }
            bottomDivider
          />
        )
      }
getAllDonations=()=>{
    this.requestRef=db.collection("All_donations").where('donor_id','==',this.state.userId)
    .onSnapShot((snapShot)=>{
        var allDonations=snapShot.docs.map(document=>document.data());
        this.setState({
           allDonations:allDonations 
        });
    })
}
sendNotification=(bookDetails,requestdStatus)=>{
var requestId=bookDetails.request_id
var donorId=bookDetails.donor_id
db.collection('all_Notifications').where('request_id','==',requestId)
.where('donor_id','==',donorId)
.get()
.then(snapShot=>{
  snapShot.forEach(doc=>{
var message=""
if(requestStatus==="bookSend"){
  message=this.state.donorName+"sentyourbook"
}
else{
  message=this.state.donorName+"has shown interest in donating the book"
}
db.collection('all_notifications').doc(doc.id).update({
  message:message,
  NotificationStatus:'unread',
  date:firebase.firestore.FieldValue.serverTimestamp()
})
  })
})

}
sendBook=(bookDetails)=>{
if(bookDetails.RequestStatus==="booksent"){
  var request="Donor Interested"
  db.collection('all_donations').doc(bookDetails.doc_id).update({
    request_status:"Donor Interested"
  })
  this.sendNotification(bookDetails.requestStatus)
}
else{
  var request="Book sent"
  db.collection('all_donations').doc(bookDetails.doc_id).update({
    request_status:"Book sent"
  })
  this.sendNotification(bookDetails.requestStatus)
}
}
render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="My donations"/>
        <View style={{flex:1}}>
          {
            this.state.allDonations.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>list of all donations</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allDonations}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  }
})
