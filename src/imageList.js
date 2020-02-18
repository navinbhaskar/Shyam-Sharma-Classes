import React, { Component } from 'react'
import {
   Alert,
   LayoutAnimation,
   TouchableOpacity,
   Image,
   StyleSheet,
   ScrollView,
   Text,
   View,
   Dimensions,
   BackHandler,
   FlatList,
   TouchableNativeFeedback,
   ToastAndroid,
   ActivityIndicator
} from 'react-native';
import Orientation from 'react-native-orientation';
import {NavigationActions} from 'react-navigation';
import firebase from 'react-native-firebase';
import axios from "axios";
import Modal from 'react-native-modal';
import RazorpayCheckout from 'react-native-razorpay';

const screen = Dimensions.get('window');
 vh = screen.height / 100;
 vw = screen.width / 100;
const height= 100*vw * 1817/4000;


export default class imageList extends React.Component {

loadData() {
   const db = firebase.firestore()
       db.collection('imageList')
         .doc(this.props.navigation.state.params.document)
           .onSnapshot((doc)=> {
             if (doc.exists) {
               this.setState({images: doc.data().images})
               console.log("ImageList1: " + JSON.stringify(doc.data()));
               this.setState({
                button: doc.data().button,
                package: doc.data().package,
                package_text: doc.data().package_text,
                package_image: doc.data().package_image
              });
             }
           }),
           (error) => {
           console.error(error);
           };
   }
 static navigationOptions = {
   title: 'Image List',
   header: null
 };
 constructor(props) {
   super(props);
   this.handleBackButton = this.handleBackButton.bind(this);
   this._renderImages = this._renderImages.bind(this);
   this.navigateToScreen = this.navigateToScreen.bind(this);
   this.loadData = this.loadData.bind(this);
   this.state = {
     images:[],
     modal_list: [],
     header: '',
     button: {},
     package: [],
     package_text: '',
     package_image: '',
     modalVisible: false,
     startBuffering: false,
     imageModal: false,
     imageHeight: 0,
     imageWidth: 0,
     modalImageUrl: ''
   };
 }
 handleBackButton = () => {
   this.props.navigation.goBack(null);
   return true;
 }

 navigateToScreen = (route, url, name) => {
    console.log("saklndlknA: "+route);
    const navigateAction = NavigationActions.navigate({
      routeName: route,
      params: {
        url: url,
        name: name
      },
    });
    this.props.navigation.dispatch(navigateAction);
  }

 _renderImages = ({ item, index }) => {
   var height= 100*vw * item.height/item.width;
   
   return (
    <TouchableNativeFeedback 
    onPress={()=> {
      if(item.type == 'video'){
        this.setState({startBuffering: true});
        axios.post(`https://classcast-198812.appspot.com/coursedata/generateSignedUrl`, {
          "path": item.path
        })
          .then( response => {
            this.setState({startBuffering: false});
            this.navigateToScreen('video', response.data, item.display_name);
          })
          .catch(err => {
            console.log("mkldfsndfskl: "+err);
            this.setState({startBuffering: false});
            ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
          })
      }
      else if(item.type == 'crash_course'){
        this.setState({startBuffering: true});
        axios.get('https://classcast-198812.appspot.com/coursedata/courseblocks/'+item.course_id+'/')
          .then(response =>{
            this.setState({startBuffering: false});
            if(item.course_id.slice(0,2) == 'MA')
              var subject = 'Mathematics'
            else if(item.course_id.slice(0,2) == 'PH')
              var subject = 'Physics'
            else if(item.course_id.slice(0,2) == 'CH')
              var subject = 'Chemistry'
            else
              var subject = 'Null'

            //console.log("asnlnsaadsa: "+JSON.stringify(response.data));
            const navigateAction = NavigationActions.navigate({
            routeName: 'crashCourseNavigator',
            params: {
              course_id: item.course_id,
              display_name: item.display_name,
              blocks: response.data,
              subject: subject
            },
          });
          this.props.navigation.dispatch(navigateAction);
          })
          .catch(error=>{
            console.log("asnlnsaadsa: "+error);
            this.setState({startBuffering: false});
            ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);      
          });
      }
      else if(item.type == 'pdf'){
        const navigateAction = NavigationActions.navigate({
                                routeName: 'pdfViewer',
                                params: {
                                  url: item.url
                                },
                              });
                              this.props.navigation.dispatch(navigateAction);
      }
      else if(item.type == 'modal'){
        this.setState({
          modalVisible: true,
          header: item.heading,
          modal_list: item.data
        })
      }
      else if(item.type == 'image'){
        this.setState({
          modalImageUrl: item.url,
          imageModal: true,
          imageHeight: item.height,
          imageWidth: item.width
        })
      }
    }}>
      <View style={{width: 100*vw, height: height,}}>
        <Image
          source={{uri: item.thumbnail}}
          style={{ width: '100%', height: '100%', resizeMode: 'cover'}}/>
      </View>
    </TouchableNativeFeedback>
   )
 }
 componentWillUnmount() {
   BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
 }
 componentDidMount() {
   BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
   this.loadData();
 }
 render() {
  console.log("ImageList: " + JSON.stringify(this.props.navigation.state.params.document));
   return (
     <View style={styles.container}>
      
     <ScrollView>
     <FlatList
         data={this.state.images}
         extraData={this.state}
         renderItem={this._renderImages}
         horizontal={false}
       />
       </ScrollView>
       <TouchableOpacity style={{backgroundColor: this.state.button.backgroundColor, width: 100*vw, padding: 2*vh, alignItems:'center', elevation: 5, borderTopLeftRadius: 2 * vw, borderTopRightRadius: 2 * vw}}
          onPress={() => {
            const navigateAction = NavigationActions.navigate({
              routeName: 'selectPackage',
              params: {
                package: this.state.package,
                package_text: this.state.package_text,
                package_image: this.state.package_image
              },
            });
            this.props.navigation.dispatch(navigateAction);
          }}   
        >
           <Text style={{ fontFamily:'Montserrat-Bold', color: this.state.button.color, fontSize: 3*vh}}> {this.state.button.name}</Text>
       </TouchableOpacity>
       { 
        
        <Modal
          backdropOpacity={0.6}
          backdropColor="black"
          transparent={true}
          isVisible={this.state.startBuffering}
          >
          <View style={{position: 'absolute', height: 25 * vw, width: 25 * vw, backgroundColor: 'rgba(255, 255, 255, 1)', borderRadius: 5 * vw, justifyContent: 'center', alignSelf: 'center'}}>
            <ActivityIndicator color={'black'} size="large"/>
          </View>
        </Modal>
       }
       { 
        
        <Modal
          backdropOpacity={0.8}
          backdropColor="black"
          transparent={true}
          isVisible={this.state.imageModal}
          onRequestClose={() => {
            this.setState({imageModal: false})
          }}>
          <View style={{ height: 100*vw * this.state.imageHeight/this.state.imageWidth, width: '100%', backgroundColor: 'rgba(255, 255, 255, 1)', borderRadius: 5 * vw, justifyContent: 'center', alignSelf: 'center', alignSelf: 'center'}}>
            <Image
              source={{uri: this.state.modalImageUrl}}
              style={{ width: '100%', height: '100%', borderRadius: 5 * vw}}
              resizeMode={'cover'}
              />
          </View>
        </Modal>
       }
       {
        <Modal
          backdropOpacity={0.6}
          backdropColor="black"
          transparent={true}
          isVisible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible: false})
          }}>
          <View style={[styles.tncModal, {height: 60 * vh}]}>
          <Text style={styles.tncHeadingBig}>{this.state.header}</Text>
          <ScrollView>
            {
              this.state.modal_list && this.state.modal_list.map((section, index)=>{
                return(
                  <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>

                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{flex: 4, height: 15 * vw, width: 15 * vw, borderRadius: 7.5 * vw, margin: 1 * vw, marginRight: 4 * vw, alignItems: 'center', justifyContent: 'center'}}>
                          <Image
                            source={{uri: section.image}}
                            style={{ width: '100%', height: '100%', borderRadius: 7.5 * vw}}/>
                        </View>
                        <View style={{flex: 16}}>
                          <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 3.5 * vw, textDecorationLine: 'none', color: 'black'}}>{section.text}</Text>
                        </View>
                      </View>

                  </View>
                  )
              })
            }
          </ScrollView>
          </View>

        </Modal>
       }
   </View>
   )
 }
}


const styles = StyleSheet.create({
   container: {
    height: '100%',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#035473'
   },
   pdf: {
       flex:1,
       width:Dimensions.get('window').width,
   },
   tncModal: {
   height: 80 * vh,
   width: 90 * vw,
   backgroundColor: 'white',
   borderRadius: 1.5 * vw,
   paddingTop: 5 * vh,
   paddingLeft: 7.5 * vw,
   paddingRight: 7.5 * vw,
   paddingBottom: 3 * vh,
 },
 tncHeadingBig: {
   fontSize: 5.5 * vw,
   color: 'black',
   fontFamily: 'Montserrat-Bold',
   marginBottom: 2 * vh,
 },
});