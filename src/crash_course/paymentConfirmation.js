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
  BackHandler
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
   

class paymentConfirmation extends Component {

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
    this.state = {
      startBuffering: false,
      title: '',
      completion: 0.00,
      completedBlocks: [],
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

  componentWillMount() {
    Orientation.lockToPortrait();
    const initial = Orientation.getInitialOrientation();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  static navigationOptions = ({ navigation }) => ({
    header: null
  })


  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  render() {
    return (
      <View style={{height: 100*vh, width: '100%', justifyContent: 'center',  alignItems: 'center', flex: 1}}>
        
      </View>
    
  );
  }
}
export default paymentConfirmation;


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
    margin: 1.3 * vw,
    height: 20 * vw,
    width: 30 * vw,
    backgroundColor: '#edeceb'
  },
  videoComponent:{
    marginTop: .5 * vh,
    marginLeft: 2 * vw,
    marginBottom: 0,
    marginRight: 2 * vw,
    flex:1,
    elevation: 1,
    padding: 1 * vw,
    borderRadius: 2 * vw,
    flexDirection: 'row',
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
