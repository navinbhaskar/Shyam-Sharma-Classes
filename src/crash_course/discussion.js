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
  SectionList,
  TouchableNativeFeedback,
  ActivityIndicator,
  Modal,
  ToastAndroid,
  Dimensions,
  BackHandler,
  TextInput 
} from 'react-native';
import Orientation from 'react-native-orientation';
import firebase from 'react-native-firebase';
import {NavigationActions} from 'react-navigation';
import { ProgressCircle }  from 'react-native-svg-charts';
import axios from 'axios';
import {MaterialIndicator} from 'react-native-indicators';
import {Circle} from 'react-native-progress';
//import * as Progress from 'react-native-progress';

const screen = Dimensions.get('window'),
  vh = screen.height / 100,
  vw = screen.width / 100;
   

class discussion extends Component {

  navigateToScreen = (route, url, block_id, course_id, name) => {
    console.log("saklndlknA: "+route);
    const navigateAction = NavigationActions.navigate({
      routeName: route,
      params: {
        url: url,
        block_id: block_id,
        course_id: course_id,
        name: name
      },
    });
    this.props.navigation.dispatch(navigateAction);
  }

  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.timeSince = this.timeSince.bind(this);
    this.loadData = this.loadData.bind(this);
    this.state = {
      startBuffering: false,
      title: '',
      completion: 0.00,
      completedBlocks: [],
      message: '',
      discussions: [],
      validMessage: false,
      blocks: [
        {
         
        }
      ]
    }
  }

  handleBackButton = () => {
    //this.props.navigation.navigate('HomeStack', {}, NavigationActions.navigate({ routeName: 'Home' }));
    this.props.navigation.goBack(null);
    return true;
  }

  loadData() {
   const db = firebase.firestore()
       db.collection('courseDatabase')
         .doc(this.props.navigation.state.params.subject).collection(this.props.navigation.state.params.course_id).doc(this.props.navigation.state.params.course_id)
           .onSnapshot((doc)=> {
             if (doc.exists) {
               this.setState({discussions: doc.data().discussions})
               console.log("ImageList: " + JSON.stringify(doc.data().discussions));
             }
           }),
           (error) => {
           console.error(error);
           };
   }

  timeSince(date) {

    //ToastArndroid.show(date, ToastAndroid.SHORT);
    var dif =  new Date() - date;
    var seconds = Math.floor(parseFloat(dif / 1000));


    var interval = Math.floor(parseFloat(seconds / 31536000));

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(parseFloat(seconds / 2592000));
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(parseFloat(seconds / 86400));
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(parseFloat(seconds / 3600));
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(parseFloat(seconds / 60));
    if (interval > 1) {
        return interval + " minutes";
    }
    //ToastAndroid.show("auaaaa" + Math.floor(parseFloat(seconds))+ new Date() + typeof(Math.floor(parseFloat(seconds))) + typeof(seconds) + typeof(interval), ToastAndroid.SHORT);
  
    return Math.floor(parseFloat(seconds)) + " seconds";
  }

  sendMessage() {
    if(this.state.validMessage){
      var data = {
        "text": this.state.message,
        "course_id": this.props.navigation.state.params.course_id,
        "time": new Date()
      }
      console.log("errorsakj: "+JSON.stringify(data));
      axios.post(`https://classcast-198812.appspot.com/coursedata/store_discussion_data`, data)
        .then((response)=>{
            console.log("errorsakj: "+JSON.stringify(response.data));
            this.setState({
              message: '',
              validMessage: false
            })
        })
        .catch((error) => {
            console.log('errorsakj: '+error);
        });
      }
  }

  componentWillMount() {
    Orientation.lockToPortrait();
    const initial = Orientation.getInitialOrientation();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  static navigationOptions = ({ navigation }) => ({
    title: "course"
  })


  async componentDidMount() {
    this.loadData();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  render() {
    return (
            <View style={{height: 100*vh, width: '100%', justifyContent: 'center',  alignItems: 'center', flex: 1}}>
              <Modal
                visible={this.state.startBuffering}
                transparent={true}
                backdropOpacity={0.6}
                backdropColor="black"
              >

              <View style={{height: 20 * vh,width: 30 * vw, borderRadius: 1.5 * vw, marginTop: 34 * vh, marginLeft: 35 * vw }}>
                <MaterialIndicator/>
                </View>
              </Modal>

              <ScrollView 
                contentContainerStyle={styles.container}
                ref={ref => this.scrollView = ref}
                onContentSizeChange={(contentWidth, contentHeight)=>{        
                    this.scrollView.scrollToEnd({animated: true});
                }}
              >
                <View>
                  {
                    this.state.discussions && this.state.discussions.map((blocks, index)=>{
                      
                      return(
                          <View style={styles.videoComponent}>
                            <View style={styles.videoPreview}>
                              <View style={{flexDirection: 'row'}}>
                                <View style={styles.header}>
                                  <Text style={{fontSize: 4 * vw, color: 'white', fontFamily: 'Montserrat-Bold'}}> {blocks.name.slice(0,1)} </Text>
                                </View>
                                <Text style={{fontSize: 4 * vw, color: 'black', fontFamily: 'Montserrat-SemiBold', alignSelf: 'center'}}>{blocks.name}</Text>
                              </View>
                              <Text style={{color: '#4286f4', fontSize: 3 * vw, fontStyle: 'italic'}}>{this.timeSince(new Date(blocks.time)) + ' ago'}</Text>
                            </View>
                            <View style={{width: '95%', alignSelf: 'center'}}>
                              <Text style={{fontSize: 4 * vw, color: 'black', fontFamily: 'Montserrat-Regular'}}> {blocks.text} </Text>
                            </View>
                            
                          </View>
                      ) 
                    })
                  }
                </View>
              </ScrollView>
              <View style={{flexDirection: 'row', position: 'absolute', bottom: 0, backgroundColor: 'rgba(255,255,255,0.6)'}}>
                <TextInput
                  style={{ height: 15 * vw, width: '80%', borderColor: '#3B97D3', borderWidth: 0.5 * vw, borderRadius: 10 * vw, padding: 5 * vw }}
                  onChangeText={(text) => {
                    this.setState({message: text});
                    if(text.length>0){
                      this.setState({validMessage: true})
                    }
                    else {
                      this.setState({validMessage: false}) 
                    }
                  }}
                  value = {this.state.message}
                  placeholder='Message'
                  placeholderTextColor= 'black'
                />
                <TouchableNativeFeedback
                  onPress={() => {
                    this.sendMessage();
                  }}
                >
                  <Image
                    source= {{uri: 'data:image/png;base64,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'}}
                    style={{
                      width: 10 * vw,
                      height: 10 * vw,
                      alignSelf: 'center',
                      marginLeft: 3 * vw
                    }}
                  />
                </TouchableNativeFeedback>
              </View>
            </View>
    
  );
  }
}
export default discussion;


const styles = StyleSheet.create({
  container:{
    paddingBottom: 10 * vh,
    width: 100 * vw,
    marginBottom: 10,
    backgroundColor: '#ffffff'
  },
  singleComponentCount:{
    flex: 1,
    flexDirection: 'row',
    margin: .6 * vh,
    alignItems:'center'
  },
  componentCount:{
    marginLeft: 2 * vw,
    marginTop: 1 * vh

  },
  sectionHeader:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    margin: 1 * vh,
    height: 2.5 * vh,
    marginTop: 3 * vh,
    marginLeft: 5 * vw,
    alignItems: 'center'
  },
  courseAboutContainer:{
    paddingBottom: 3 * vh,
    paddingTop: 1 * vh,
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    elevation: 2,
  },
  header: {
    height: 10 * vw, 
    width: 10 * vw, 
    borderRadius: 5 * vw, 
    backgroundColor: 'purple', 
    alignItems: 'center', 
    justifyContent:'center', 
    marginRight: 3 * vw
  },
  videoCount: {
    color: 'white'
    },
  progress: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContent: {
    backgroundColor: "white",
    margin: 1.5 * vw,
    elevation:5,
    borderRadius: 1 * vw,
  },
  videoPreview:{
    justifyContent: 'space-between',
    width: '95%',
    flexDirection: 'row',
    margin: 1 * vw,
    marginBottom: 2 * vw
  },
  videoComponent:{
    marginTop: .5 * vh,
    marginLeft: 2 * vw,
    marginBottom: 4 * vw,
    marginRight: 2 * vw,
    flex:1,
    padding: 1 * vw,
    borderRadius: 2 * vw
  },
  aboutVideo:{
    justifyContent:'center',
    width: 50*vw,
  },
  hairline: {
      backgroundColor: 'black',
      height: 2,
      width: 165
},
  
});
