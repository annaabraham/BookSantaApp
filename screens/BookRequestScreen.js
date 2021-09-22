import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TouchableHighlight,
  FlatList} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import{BookSearch} from 'react-native-google-books'

export default class BookRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      bookName:"",
      reasonToRequest:"",
      dataSource:"",
      
    }
  }
  createUniqueId(){
    return Math.random().toString(36).substring(7);

  }
addRequest=(bookName,reasonToRequest)=>{
var userId=this.state.userId
var randomRequestId=this.createUniqueId()
var books=await BookSearch.searchbook(bookName,'AIzaSyBL5247xZoh3exc6vHARZRfnxyi-hww_Bg')
db.collection('requested_Books').add({
user_Id:userId,
book_Name:bookName,
reason_To_Request:reasonToRequest,
request_Id=randomRequestId,
bookStatus:'requested',
date:firebase.fireStore.FieldValue.serverTimestamp(),
image_link:books.data[0].volumeInfo.imageLinks.smallThumbnail
})

await this.getBookRequest()
db.collection('users').where("EmailId","==",userId).get()
.then()
.then(snapshot=>{
  db.collection('users').doc(doc.id).update({
    isBookRequestActive:true
  })
})

this.setState({
  bookName:'',
  reasonToRequest:''
})
return Alert.alert("Book requested successfully")
}

recieveBooks=(bookName)=>{
var userId=this.state.userId
var requestId=this.state.requestId
db.collection('reciveBooks').add({
  userId:userId,
  bookName:bookName,
  requestId:requestId,
  bookStatus:'recieved'
})
}

getIsBookRequestActive=()=>{
  db.collection('users').where('EmailId',"==",this.state.userId)
  .onSnapshot(querySnapshot=>{
    querySnapshot.forEach(doc=>{
      this.setState({
        isBookRequestActive:doc.data().isBookRequestActive(),
        userdocId:doc.id
      })
    })
  })
}

getBookRequest=()=>{
  var bookRequest=db.collection('requestedBooks').where('UserId',"==",this.state.userId)
.get()
.then(snapshot=>{
  snapshot.forEach(doc=>{
    if(doc.data().bookStatus!="recieved"){
      this.setState({
        requestId:doc.data().request_Id,
        requestedBookName:doc.data().book_Name,
        bookStatus:doc.data().bookStatus,
        docId:docId
      })
    }
  })
})
}

sendNotfication=()=>{
  db.collection('users').where('EmailId',"==",this.state.userId)
  .get()
  .then(snapshot=>{
    snapshot.forEach(doc=>{
      var name=doc.data().first_name,
      var lastName=doc.data().Last_name
      db.collection('all_notifications').where('requestId',"==",this.state.requestId)
      .get()
      .then(snapshot=>{
        snapshot.forEach(doc=>{
          var donorId=doc.data().donorId,
         var bookName=doc.data().bookName
         db.collection('all_notifications').add({
           targetedUserId:donorId,
           message:name+""+lastName+"Recieved the book"+bookName,
           NotificationStatus:"unread",
           bookName:bookName
         })
        })
      })
    })
  })
}
componentDidMount(){
  this.getBookRequest()
  this.getIsBookRequestActive()
}
updateBookRequestStatus=()=>{
  db.collection('requested_books').doc(this.state.docId)
  .update({
    bookStatus:"recieved"
  })
  db.collection('users').where('email_id',"==",this.state.userId)
  .get()
  .then(snapshot=>{
    snapshot.forEach(doc=>{
      db.collection('users').doc(doc.id).update({
        isBookRequestActive:false
      })
    })
  })
}

async GetBooksFromAPI(bookName){
  this.setState({
    bookName:bookName
  })
  if(bookName.length>2){
    var books=await BookSearch.searchbook(bookName,'AIzaSyBL5247xZoh3exc6vHARZRfnxyi-hww_Bg')
    this.setState({
      dataSource:books.data,
      showFlatlist:true
    })
  }
}
renderItem=(item,i)=>{
return(
  <TouchableHighlight style={{alignItems:'center',backgroundColor:"Orange",padding:10,width:'90%'}}
  activeOpacity={0.6}
  underlayColor="orange"
  onPress={()=>{
this.setState({
  showFlatlist:false,
  bookName:item.volumeInfo.title
})
  }}
  bottomDivider>
    <Text>{item.volumeInfo.title}</Text>
  </TouchableHighlight>
)
}
  render(){
    if(this.state.isBookRequestActive==true){
      return(
        <View>
          <View>
            <Text>bookName</Text>
            <Text>{this.state.requestedBookName}</Text> 
          </View>
          <View>
            <Text>bookStatus</Text>
            <Text>{this.state.bookStatus}</Text>
          </View>
          <TouchableOpacity
          onPress={()=>{
            this.sendNotfication(),
            this.updateBookRequestStatus(),
            this.recievedBooks(this.state.requestedBookName)
          }}>
<Text>I recieved the book.</Text>
          </TouchableOpacity>
        </View>
      )
    }
    {
    return(
      <View>
        <MyHeader title="Request book"/>
        <KeyboardAvoidingView style={styles.keyBoardStyle}>
          <TextInput
          style={styles.formTextInput}
         placeHolder="Enter book name"
         onChangeText={(text)=>{
           this.setState({
             bookName:Text
           })
         }}
         value={this.state.bookName}
         />
         {this.state.showFlatlist?
         (
           <FlatList
           data={this.state.dataSource}
             renderItem={this.renderItem}
             enableEmptySection={true}
             style={{
               marginTop:10
             }
             }
             keyExtractor={(item,index)=>{index.toString()}}/>

         )
         :
         (<TextInput
        style={styles.formTextInput}
        multiLine
        numberOfLines={8}
        placeHolder="Why do you need the book"
        onChangeText={(text)=>{
          this.setState({reasonToRequest:text})
        }}
        value={this.state.reasonToRequest}
        />
        <TouchableOpacity
        style={styles.button}
        onPress={()=>{
          this.addRequest(this.state.bookName,this.state.reasonToRequest)
        }}>
        <Text>request</Text>  
        </TouchableOpacity>
        )
      }
         </KeyboardAvoidingView>
      </View>   
    )
  }
}
}
const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)
