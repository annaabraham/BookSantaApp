import React,{Component} from 'react'
import{Text,View,StyleSheet,TouchableOpacity,KeyboardAvoidingView, TextInput, Alert} from 'react-native'
import firebase from 'firebase'
import MyHeader from '../components/MyHeader'
import {RFValue} from 'react-native-'

export default class SettingScreen extends Component{
    constructor(){
     super()
     this.state={
         emailId:'',
         firstName:'',
         lastName:'',
         docId:'',
         contact:'',
         address:''
     }
      }
     
     updateUserDetails=()=>{
         db.collection('users').doc(this.state.docId).update({
             firstName:this.state.firstName,
             lastName:this.state.lastName,
             address:this.state.address,
             contact:this.state.contact

         })
         Alert.alert("Profile Details Updated Successfully")
     }
     getUserDetails=()=>{
         var email=firebase.auth().currentUser.email
         db.collection('users').where('email_id','==',email).get()
         .then(snapShot=>{
             snapShot.forEach(doc=>{
                 var data=doc.data()
                 this.setState({
                     emailId:data.emailId,
                     firstName:data.firstName,
                     lastName:data.lastName,
                     address:data.address,
                     contact:data.contact,
                     docId:data.docId
                 })
             })
         })
     }
     componentDidMount(){
         this.getUserDetails()
     }
      render(){
        return(
          <View
          ><MyHeader title="Settings"
          navigation={this.props.navigation}/>
          <View>
              <Text style={styles.lable}>first name</Text>
              <TextInput
                  style={styles.FormTextInput}
                  placeHolder={"FirstName"}
                  maxLength={8}
                  onChangeText={(text)=>{
                      this.setState({
                          firstName: text
                      })
                  }}>
              </TextInput>
              <Text style={styles.lable}>last Name</Text>
              <TextInput
                  style={styles.formTextInput}
                  placeHolder={"LastName"}
                  maxLength={8}
                  onChangeText={(text)=>{
                      this.setState({
                          lastName: text
                      })
                  }}>
              </TextInput>
              <Text style={styles.lable}>EmailId</Text>
              <TextInput
                  style={styles.formTextInput}
                  placeHolder={"emailId"}
                  keyboardType={'email-address'}
                  onChangeText={(text)=>{
                      this.setState({
                          emailId: text
                      })
                  }}>
              </TextInput>
              <Text style={styles.lable}>contact</Text>
              <TextInput
                  style={styles.formTextInput}
                  placeHolder={"contact"}
                  maxLength={10}
                  keyboardType={'numeric'}
                  onChangeText={(text)=>{
                      this.setState({
                          contact: text
                      })
                  }}>
              </TextInput>
              <Text style={styles.lable}>Address</Text>
              <TextInput
                  style={styles.formTextInput}
                  placeHolder={"Address"}
                  multiLine={true}
                  onChangeText={(text)=>{
                      this.setState({
                          address: text
                      })
                  }}>
              </TextInput>
          <TouchableOpacity
          style={styles.button}
          onPress={()=>{
              this.updateUserDetails()
          }}
         >
             <Text>Save</Text>
              </TouchableOpacity>    
          </View>
          </View>  
        )
    }
    
}
const styles=StyleSheet.create({
    lable:{
        fontSize:RFValue(18),
        color:"Green",
        fontWeight:"bold",
        padding:RFValue(10),
        marginLeft:RFValue(20)
    }
})