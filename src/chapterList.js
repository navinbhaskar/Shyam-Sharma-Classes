import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Modal,
  AsyncStorage,
  Dimensions,
  Alert,
  TouchableHighlight,
  ToastAndroid,
  Animated,
  ScrollView,
  Platform,
  Button,
  BackHandler,
  TouchableNativeFeedback
} from 'react-native';
import { Input, Icon } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import Carousel from 'react-native-snap-carousel';
import axios from 'axios';
import CourseListPlaceholder from "./courseListPlaceholder";
import firebase from 'react-native-firebase';
//import RNAppShortcuts from 'react-native-app-shortcuts';
//import AddShortcut from 'react-native-add-shortcut';
//import QuickActions from "react-native-quick-actions";
const db = firebase.firestore();

const Header_Maximum_Height = 25 * vh;
 
const Header_Minimum_Height = 0 * vh;

const SCREEN_WIDTH = Dimensions.get('window').width;

class chapterList extends Component {
  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.AnimatedHeaderValue = new Animated.Value(0);
    this.state = {
      courses: [
        {
         
        }
      ],
      isReady: false,
      modalVisible: false,
      isEnrolled: true,
      enrollCode: '',
      username: '',
      redirectCourse: ''
    }
    this.switchModal = this.switchModal.bind(this);
    this.tryenroll = this.tryenroll.bind(this);
  }

  static navigationOptions = ({ navigation }) => ({
    title:  `${navigation.state.params.data.course_name}`,
  })

  switchModal(){
    if(this.state.modalVisible){
      this.setState({modalVisible: false});
    }
    else {
      this.setState({modalVisible: true});
    }
  }

  tryenroll(){

    var data= {
      "access_code" : this.state.enrollCode
    }

    axios.post('https://classcast-198812.appspot.com/accesstoken/enroll/', data)
              .then((response) => 
              {
                  if(response.code == 201) {
                  Alert.alert('');
                 }
                 this.props.navigation.navigate("Home");
              })
              .catch((error) => {
                  Alert.alert('Wrong passcode, please try again or contact ClassCast team');
              })
  }

  handleBackButton = () => {
    this.props.navigation.navigate('HomeStack', {}, NavigationActions.navigate({ routeName: 'Home' }));
    return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

   async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
     console.log('znjdnd: '+JSON.stringify(this.props.navigation.state.params));
      axios.get('https://classcast-198812.appspot.com/white_label/get_cahpter_list_shyam/'+this.props.navigation.state.params.data.course_id)
                .then(function (response){
                  console.log("danslkadsdas: "+JSON.stringify(response.data));
                  this.setState({courses: response.data});
                  this.setState({isReady: true});
                }.bind(this))
                .catch(function (error) {
                  console.log('danslkadsdaserror');
                });

    var currentUser = await firebase.auth().currentUser;                 
     await currentUser.getIdToken()
            .then(idToken => {
                  this.setState({ username: currentUser['phoneNumber'].slice(3, 13) })
                });
  }

  _renderItem ({item, index}) {
    console.log("djdsdijk: "+JSON.stringify(item));
    if(item.block_id == this.state.redirectCourse) {
      const navigateAction = NavigationActions.navigate({
        routeName: 'Courses',
        params: {
          course_id: this.props.navigation.state.params.data.course_id,
          chapter_id: item.block_id,
          details: item.details,
          display_name: item.display_name
        },
      });
      this.props.navigation.dispatch(navigateAction);
    }
    return (
            <View style={styles.courseCardContainer}>
              <Text style={styles.h2}>{item.chapter_name} </Text>
              <View style={styles.coursePreview}>
                <View style={styles.coursePreviewLeft}>
                  <View style={styles.courseAbout}>
                  <Text style={styles.h3}>{item.details} </Text>
                  </View>
                 
                </View>
                <View style={styles.courseImageContainer}>
                    <Image source={{uri: item.thumbnail}} style={styles.courseImage}/>
                    {
                      <Button title={this.props.navigation.state.params.data.enrolled ? "Resume": "View"}
                        raised={true}
                        theme='dark'
                        overrides={{backgroundColor: "3fffff"}}
                        onPress = {()=> {
                          if(this.state.isReady){
                              const navigateAction = NavigationActions.navigate({
                              routeName: 'Course',
                              params: {
                                course_id: this.props.navigation.state.params.data.course_id,
                                amount: this.props.navigation.state.params.data.amount,
                                details: this.props.navigation.state.params.data.course_details,
                                chapter_id: item.course_id,
                                details: item.details,
                                display_name: item.chapter_name,
                                enrolled: this.props.navigation.state.params.data.enrolled
                              },
                            });
                            this.props.navigation.dispatch(navigateAction);
                          }
                        }
                        } 
                        />
                      }
                </View>
              </View>
              
            </View>

         );
    }

  render () {
    console.log("meslfkmssadasfmle: "+JSON.stringify(this.props.navigation))  
        
    return (
      <View style={styles.container}>
      
      <ScrollView>
             
      <CourseListPlaceholder onReady={this.state.isReady} animate="fade">
        <FlatList
          data={this.state.courses}
          showsVerticalScrollIndicator={false}
          renderItem={this._renderItem.bind(this) }
          keyExtractor={(item, index) => index.toString()}
        />
        </CourseListPlaceholder>
        {(!this.state.isEnrolled && !this.state.modalVisible) &&
         <Button
                containerStyle={{ marginVertical: 20, marginLeft: 20 }}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                
                buttonStyle={{
                  height: 55,
                  width: SCREEN_WIDTH - 40,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                title="Enrol Now"
                titleStyle={{
                  fontFamily: 'regular',
                  fontSize: 20,
                  color: 'white',
                  textAlign: 'center',
                }}
                onPress={() => {
                  const navigateAction = NavigationActions.navigate({
                          routeName: 'accessCode'
                        });
                        this.props.navigation.dispatch(navigateAction);
                }}
                activeOpacity={0.5}
              />
            }
          <Modal backdropOpacity={0.6}
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.switchModal();
            Alert.alert('Modal has been closed.');
          }}>

          <View style={{margin: 35, height: '50%' , width: '80%', marginTop: '40%', backgroundColor: '#1e90ff', borderRadius: 10, elevation: 3, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.headerText}>Enter Access Code given by your teacher</Text>
              
                <Input
                  onChangeText={enrollCode => this.setState({ enrollCode })}
                  inputStyle={styles.inputStyle}
                  autoFocus={true}
                  autoCapitalize="none"
                  errorStyle={styles.errorInputStyle}
                  autoCorrect={true}
                  blurOnSubmit={true}
                  placeholderTextColor="#7384B4"
                />
                <Icon
                      raised
                      name='keyboard-arrow-right'
                      type='material'
                      color='red'
                      onPress = {()=> this.tryenroll()}
                    />
              <TouchableHighlight onPress={() => {
                  firebase.firestore().collection('enrollment_requests').add({
                    student: this.state.username,
                    status: false,
                  })
                  this.switchModal();}}>
                <Text style={[styles.headerText, {color: 'red'}]}>Don't have any Access Code</Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => {
                  this.switchModal();}}>
                <Text style={styles.headerText}>Dismiss</Text>
              </TouchableHighlight>
          </View>
        </Modal>
        </ScrollView>
        { !this.props.navigation.state.params.data.enrolled &&
            <TouchableNativeFeedback
            onPress={() => {
              const navigateAction = NavigationActions.navigate({
                routeName: 'buynow',
                params: {
                  data: this.props.navigation.state.params.data,
                  teacher_id: 50
                },
              });
              this.props.navigation.dispatch(navigateAction);
            }}
            >
              <View style={{backgroundColor: 'purple', alignItems: 'center', justifyContent: 'center', paddingRight: 5 * vw, paddingLeft: 5 * vw, paddingTop: 1 * vh, paddingBottom: 1 * vh, width: '100%', height: '8%'}}>
                  <Text style={{fontFamily: 'Montserrat-SemiBold', color: '#ffffff', fontSize: 5 * vw, textAlign: 'center'}}>Buy Now</Text>
              </View>
            </TouchableNativeFeedback>
        }
      </View>
      )
  }
}

export default chapterList;

const styles = StyleSheet.create({
  
  container:{
     flex: 1,
     alignItems: 'center',
     backgroundColor: '#ffffff'
   },
   h2:{
    fontFamily: 'ProximaNova-Bold',
    paddingLeft: 1 * vw,
     fontSize: 3.2 * vh,
     color: 'black'
   },
   h3:{
    fontFamily: 'ProximaNova-Regular',
    paddingLeft: 1 * vw,
     fontSize: 2 * vh,
     color: 'black'
   },
   videoCount: {
    fontFamily: 'ProximaNova-Regular',
     color: 'black'
   },
   h2Blue:{
     fontSize: 3.0 *vh,
     fontWeight: 'bold',
     color: 'blue'
   },
   courseCardContainer:{
     width: '98%',
     borderRadius: 2 * vw,
     backgroundColor:'#ffffff',
     elevation: 10,
     marginTop: 1 * vh,
     padding: 1.5* vh,
     marginBottom: 1 * vh,
     alignSelf: 'center',
   },
   coursePreview:{
     flex:1,
     flexDirection:'row',
   },
   coursePreviewLeft:{
     width:'70%',
     margin: 0.5 * vh,
   },
   courseAbout:{
     padding: 1 * vw,
     width: '100%'
   },
   courseImageContainer:{
     width:'28%',
     margin: 0.4 * vh,
     alignSelf: 'center',
   },
   courseImage:{
     resizeMode:'contain',
     alignItems: 'flex-end',
     height: 10 * vh,
     width: 10 * vh,
     marginBottom: 0.5 * vh,
     alignSelf: 'center',
   },
    headerText: {
    fontSize: 20,
    color: 'white',
    zIndex: 100,
    paddingTop: 2 * vh,
    paddingLeft: 3 * vw,
    fontFamily: 'ProximaNova-Regular',
  },
    videoTestCount:{
      flex:1,
      alignItems:'center',
      flexDirection:'row',
    },
    inputContainer: {
      paddingLeft: 8,
      borderRadius: 40,
      borderWidth: 1,
      borderColor: 'red',
      height: 45,
      width: 150,
      marginVertical: 10,
    },
    inputStyle: {
      flex: 1,
      marginLeft: 10,
      color: 'white',
      fontFamily: 'light',
      fontSize: 16,
    },
    errorInputStyle: {
      marginTop: 0,
      textAlign: 'center',
      color: '#F44336',
    },
    HeaderStyle:
    {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        left: 0,
        right: 0,
        top: (Platform.OS == 'ios') ? 20 : 0,
    },
  });
