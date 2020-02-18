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
import DeviceInfo from 'react-native-device-info';
const uniqueId = DeviceInfo.getUniqueID();

const screen = Dimensions.get('window'),
  vh = screen.height / 100,
  vw = screen.width / 100;
   

class selectExam extends Component {


  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.state = {
      startBuffering: true,
      classes: [],
      standard: null,
      varifyStandard: false
    }
  }

  handleBackButton = () => {
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

  async componentDidMount() {
    console.log("bhjbkhkj: "+JSON.stringify(this.props.navigation.state.params));
    axios.get('https://classcast-198812.appspot.com/users/get_class_info')
      .then((response) => {
        this.setState({ classes: response.data.data });
        console.log("sniuasa: "+JSON.stringify(response.data));
      })
  }

  render() {
    console.log("sdabskjhkjbkrender: "+this.state.completion)
    return (
        <View style={{flex: 1, width: '100%', backgroundColor: '#293046'}}>
          <Text style={{fontFamily: 'Montserrat-Bold', color: 'white', fontSize: 6 * vw, paddingBottom: 4 * vh, paddingTop: 5 * vh, textAlign: 'center'}}>Choose your course</Text> 
            <View>
                  {
                    this.state.classes && this.state.classes.map((blocks, index)=>{
                      console.log("sdlkdasds: "+JSON.stringify(blocks));
                      console.log("sdlkdasdsdata: "+JSON.stringify(Object.values(blocks)));
                      console.log("sdlkdasds: "+JSON.stringify(Object.keys(blocks)));
                      return(
                        <View>
                          <Text style={styles.headerText}>{Object.keys(blocks)[0]}</Text>
                          <View style={{flexWrap: 'wrap', flexDirection: 'row', margin: 2 * vw, paddingBottom: 4 * vh}}>
                            {
                              Object.values(blocks)[0] && Object.values(blocks)[0].map((block, index) => {
                                console.log("asnlskas: "+JSON.stringify(block));
                                return(
                                  <TouchableNativeFeedback
                                    onPress={()=> {
                                      this.setState({ standard: block.id });
                                      this.setState({ varifyStandard: true });
                                    }}
                                  >
                                    <View style={[styles.classContainer, {backgroundColor: block.id == this.state.standard ? 'green': '#293046'}]}>
                                      <Text style={styles.classInfoText}>{block.name}</Text>    
                                    </View>
                                  </TouchableNativeFeedback>
                                )
                              })
                            }
                          </View>
                        </View>
                        )
                    })
                  }
            </View>
            <TouchableNativeFeedback
              onPress={() => {
                data = {
                  "firstname": this.props.navigation.state.params.firstname,
                  "lastname": this.props.navigation.state.params.lastname,
                  "gender": this.props.navigation.state.params.gender == "Male" ? 1: 2,
                  "standard": this.state.standard,
                  "phone_number": this.props.navigation.state.params.phone_number,
                  "username": this.props.navigation.state.params.username,
                  "email": this.props.navigation.state.params.email
                }

                if(this.state.varifyStandard) {
                  axios.defaults.headers.post['Content-Type'] = 'application/json';
                  axios.post('https://classcast-198812.appspot.com/users/updateprofile', data)
                    .then((response) => 
                      {
                        var data2 = {
                          "device_id": uniqueId
                        }
                        axios.post('https://classcast-198812.appspot.com/deviceid/save_device_id/',data2)
                          .then(res =>{
                            this.setState({loading: false});
                           this.props.navigation.navigate("accessCode");
                          })
                           .catch((e)=> console.log("sabkasdbds: "+e));
                        })
                        .catch((error) => {
                          console.log("sabkasdbds2: "+error);
                          ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
                          this.setState({loading: false});
                        })
                }

              }}
            >
              <View style={{height: 10*vh, width: 10 * vh, backgroundColor: 'purple', marginTop: 3 * vh, borderRadius: 10 * vh, alignSelf:'center'}}>
                <Image
                    style={styles.nextPageIcon}
                    resizeMode={'contain'}
                    source={{uri: 'data:image/png;base64,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'}}
                  />
              </View>
            </TouchableNativeFeedback>
      </View>
  );
  }
}

export default selectExam;


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
  headerText: {
    color: 'white',
    fontSize: 4 * vw,
    marginLeft: 4 * vw,
    fontFamily: 'Montserrat-SemiBold'
  },
  nextPageIcon: {
    height: '100%',
    width: '100%',
  },
  classContainer: {
    borderRadius: 5 * vw,
    borderWidth: 2,
    borderColor: 'white',
    padding: 1 * vw,
    width: 40 * vw,
    margin: 2 * vw,
    justifyContent: 'center',
    alignItems: 'center'
  },
  classInfoText: {
    color: 'white',
    fontSize: 4 * vw,
    fontFamily: 'Montserrat-Regular'
  },
  sectionHeader:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    margin: 1 * vh,
    marginTop: 3 * vh,
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
    margin: .6 * vh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContent: {
    backgroundColor: "white",
    margin: 1.5 * vw,
    elevation:5,
    borderRadius: 1 * vw,
  }
  
});
