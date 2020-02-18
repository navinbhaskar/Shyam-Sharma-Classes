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
   

class studyMaterial extends Component {

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
    title: "course"
  })


  async componentDidMount() {
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

              <ScrollView contentContainerStyle={styles.container}>
                <View>
                  {
                    this.props.navigation.state.params.blocks.material && this.props.navigation.state.params.blocks.material.map((blocks, index)=>{
                      
                      return(
                        <TouchableNativeFeedback
                          onPress={() => {
                            this.setState({startBuffering: true});
                            axios.post(`https://classcast-198812.appspot.com/coursedata/generateSignedUrl`, {
                              "path": blocks.path
                            })
                              .then( response => {
                                console.log("sdmonsd: "+response.data);
                                this.setState({startBuffering: false});
                                this.navigateToScreen('pdfViewer', response.data, blocks.block_id, this.props.navigation.state.params.course_id, blocks.name);
                              })
                          }}
                        >
                          <View style={styles.videoComponent}>
                            <View style={styles.videoPreview}>
                                <Image source={{uri: blocks.thumbnail}} style={{height:20 * vw, width: 30 * vw}}/>
                            </View>
                            
                            <View style = {styles.aboutVideo}>
                                <Text style={{fontSize: 16, color: 'black', fontFamily: 'Montserrat-SemiBold'}}>{blocks.name}</Text>
                                <Text style={{fontSize: 12, color: 'black'}}> {blocks.details} </Text>
                                <View style={{flexDirection: 'row', alignItems:'center'}}>
                                  <Image
                                      style={{height: 2 * vh, width: 2 * vh}}
                                      source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAA9GAAAPRgFoUyCCAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAOFQTFRF/////6oA5rMa6r8V7L0T770Z6rsV67kX67oX6rkV67oX67oW67sX67sW67sW67sW67sW67kW67oW67sV67oX67oX67oW67sW67oW67oW67sW67oW67oW67oW67oW67oX67sZ67sb7Lwe7L4i7L8m7cAs7cIw7cIx7sQ478Y/78lH78lJ8MtQ8c5a8tFk89Ru89Rv89Vx89d49NqD9dyH9d2O9uGZ9uGa9+Sk+Oev+eq5+u3C+u7G+/DL+/LT+/LU/PTa/Pbi/fjo/vru/vvx/vvy/vz2//36//78///+////OBaQhAAAAB50Uk5TAAMKDBsfPExOYmRocHSKjqSwtr7Ay9XY5ery+Pn+bfME6gAAAaZJREFUWMOtl9eSgzAMRcVCEkIPhFDj7S3be+9d//9B+7BlQrDBHuW+Ip0ZbEm+AhBINx0viJI8T6LAc0wdlGTYYcEqKkLbkM1ecOMx42gcuwsS6ZqVMqFSS2vL741Yo0a9xvTOkLVq2BHndzMmoawryu+XTEpln396PpOWzzlLbcAUNKgTfKYkv/b/TFEz59AtVQFl5S46GVNWNl0P9fqZnG62VtRU/da/3uLbYRvhv6o1Tv0/IOL1ektf/N2lxfgAfNlvJli//Z+KAIhXa02A9Gc+uEwMwOe9JoILAABxEwDxclUMiAEAjHEzAJ92hYCxAQA2awHg1/mKiGADQNgKQHycCAAhgF5IAPDzbJkbVuhgMhkA4v02N84ERxKAHydLnDgHPFkA4t1WPc6DQB6A78eLs3EBRAoAxJuNmbgIEiUAvh5U4xLI1QCIR5W4nA4g/wL5EMnXSC4kcimTm4nczuSBQh9p5KFKHuv0h4X8tJEfV/rzTjYYPIuzc6Ficegmi2zz6EaTbnXpZpts9+kLxxxWHvrSRV/75rB40lffOSzfauv/N60YzB5Az7qLAAAAAElFTkSuQmCC'}}
                                    />
                                  <Text style={{fontSize: 12, color: 'black'}}> Doc/Pdf </Text>
                                </View>
                            </View> 
                          </View>
                        </TouchableNativeFeedback>
                      ) 
                    })
                  }
                </View>
              </ScrollView>
            </View>
    
  );
  }
}
export default studyMaterial;


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
