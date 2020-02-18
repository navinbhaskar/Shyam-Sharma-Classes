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
  Slider, 
  StatusBar,
  Animated,
  Dimensions,
  BackHandler
} from 'react-native';
import VideoPlayer from 'react-native-video';
import {Icon} from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';
import { ProgressCircle }  from 'react-native-svg-charts';
import axios from 'axios';
import Pdf from 'react-native-pdf';
import Orientation from 'react-native-orientation';

class pdfViewer extends Component {


  static navigationOptions = {
    title: 'Pdf Viewer',
    header: null
  };

  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.state = {
      playVideo: false,
      rate: 1,
      volume: 1,
      muted: false,
      resizeMode: 'contain',
      duration: 0,
      currentPosition: 200.0,
      currentTime: 0.0,
      paused: false,
      seek: 0,
      showControls: false,
      showSettings: false,
      loaded: false,
      buffer: false,
      videoUrl: 0,
      sliderValue: 0,
    };
  }

  handleBackButton = () => {
    this.props.navigation.goBack(null);
    return true;
  }


  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  
  render() {
    const source = {uri: this.props.navigation.state.params.url , cache: true};
    return (
      <View style={styles.container}>
                <Pdf
                    source={source}
                    onLoadComplete={(numberOfPages,filePath)=>{
                        console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages)=>{
                        console.log(`current page: ${page}`);
                    }}
                    onError={(error)=>{
                        console.log('error');
                    }}
                    style={styles.pdf}/>
            </View>
    )

  }
}

export default pdfViewer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
    }
});