import React,{component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity,TextInput} from 'react-native';
import db from '../config'
import firebase from 'firebase';
import {RFValue} from 'react-native-responsive-fontSize'
export default class MyDonation extends component{
    constructor(){
        super()
        this.state={
            userId:firebase.auth().currentUser.email,
            RecievedBookList:[]
        }
        this.requestRef=null
    }
    componentDidMount(){
        this.getRecievedBookList()
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
            subtitle={item.bookStatus}
            titleStyle={{ color: 'black', fontWeight: 'bold' }}
            leftElement={<Image style={style.liimage} source={{uri:item.image_link}}></Image>}
            bottomDivider
          />
        )
      }
getRecievedBookList=()=>{
    this.requestRef=db.collection("Requested_books").where('user_id','==',this.state.userId)
    .where("book_Status", "==", "recieved")
    .onSnapShot((snapShot)=>{
        var recievedBookList=snapShot.docs.map(document=>document.data());
        this.setState({
           recievedBookList:recievedBookList
        });
    })
}

render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="My Recieved books list"/>
        <View style={{flex:1}}>
          {
            this.state.RecievedBookList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>list of recieved book list</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.RecievedBookList}
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
