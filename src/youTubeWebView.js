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
import { ProgressCircle } from 'react-native-svg-charts';
import axios from 'axios';
import Orientation from 'react-native-orientation';
import WebView from 'react-native-webview';

class youTubeWebView extends Component {


  static navigationOptions = {
    title: 'Pdf Viewer',
    header: null
  };

  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.setWebViewUrlChanged = this.setWebViewUrlChanged.bind(this);
    this.goBack = this.goBack.bind(this);
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
  
  setWebViewUrlChanged = webviewState => {
    if (webviewState.url !== this.props.navigation.state.params.url) {
      console.log("sdnsndsadf: "+webviewState.url);
      this.goBack();
    }
  };

  goBack = () => {
    this.webview.goBack();
  };

  render() {
    console.log("mlasndlakna: "+this.props.navigation.state.params.url);
    const source = {uri: this.props.navigation.state.params.url , cache: true};
    return (
      <WebView
        ref={r => this.webview = r}
        source={{uri: this.props.navigation.state.params.url}}
        style={{height: '100%', width: '100%'}}
        onNavigationStateChange={ this.setWebViewUrlChanged }
      />
    )

  }
}

export default youTubeWebView;

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