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
   

class crashCourse extends Component {

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
      startBuffering: true,
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


  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  render() {
    console.log("sanlassa: "+this.props.navigation.state.params.display_name)
    return (
            <View style={{height: 100*vh, width: '100%', justifyContent: 'center',  alignItems: 'center', flex: 1}}>
            
              <ScrollView contentContainerStyle={styles.container}>
                <View>
                  {
                    this.props.navigation.state.params.blocks.blocks && this.props.navigation.state.params.blocks.blocks.map((blocks, index)=>{
                      
                      return(
                      <View>
                      <View style={styles.sectionHeader}>
                        <Text style={{fontSize: 2.2 * vh, color: '#5e5e5e', fontFamily: 'Montserrat-Bold'}}>{blocks.title} </Text>
                      </View>

                      <View style={styles.sectionContent}>
                        {
                          blocks.data && blocks.data.map((data, index)=>{
                            console.log("nkaskajxas: "+(new Date(data.release_date) - new Date()));
                            if(data.block_type == 'video') {
                              return(
                                <TouchableNativeFeedback
                                  onPress={() => {
                                    if((new Date(data.release_date) - new Date()) < 0){
                                      this.setState({startBuffering: true});
                                      //this.setState({completion: this.state.completion + (100/this.props.navigation.state.params.number_of_videos)})
                                      axios.post('https://classcast-198812.appspot.com/coursedata/generateSignedUrl', {
                                        "path": data.path
                                        //"path": "/classcast-198812.appspot.com/classcast_videos/Mathematics_CBSE/Anurag_Chauhan_Delhi/Class_12/Applications_of_Derivatives/Day%201%20Out%20-%20%20(1)-1.mp4"
                                      })
                                        .then( response => {
                                          console.log("nkaskajxasaa: "+JSON.stringify(response.data));
                                          this.setState({startBuffering: false});
                                          this.navigateToScreen('video', response.data, data.block_id, this.props.navigation.state.params.course_id, data.display_name);
                                        })
                                        .catch(err => {
                                          this.setState({startBuffering: false});
                                          ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
                                        })
                                      }
                                    else{
                                      ToastAndroid.show('Not released yet', ToastAndroid.SHORT);
                                    }
                                  }
                                }

                                >
                                <View style={styles.videoComponent}>
                                  <View style={styles.videoPreview}>
                                      <Image source={{uri: data.image}} style={{height:20 * vw, width: 30 * vw, opacity: ((new Date(data.release_date) - new Date()) < 0) ? 1: 0.4}}/>
                                  </View>
                                  
                                  <View style = {styles.aboutVideo}>
                                      <Text style={{fontSize: 16, color: ((new Date(data.release_date) - new Date()) < 0) ? 'black': 'grey', fontFamily: 'Montserrat-SemiBold'}}>{data.display_name}</Text>
                                      <Text style={{fontSize: 12, color: 'black'}}></Text>
                                      <View style={{flexDirection: 'row', alignItems:'center'}}>
                                        <Image
                                          style={{height: 2 * vh, width: 2 * vh, opacity: ((new Date(data.release_date) - new Date()) < 0) ? 1: 0.4}}
                                          source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAA9GAAAPRgFoUyCCAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAOFQTFRF/////6oA5rMa6r8V7L0T770Z6rsV67kX67oX6rkV67oX67oW67sX67sW67sW67sW67sW67kW67oW67sV67oX67oX67oW67sW67oW67oW67sW67oW67oW67oW67oW67oX67sZ67sb7Lwe7L4i7L8m7cAs7cIw7cIx7sQ478Y/78lH78lJ8MtQ8c5a8tFk89Ru89Rv89Vx89d49NqD9dyH9d2O9uGZ9uGa9+Sk+Oev+eq5+u3C+u7G+/DL+/LT+/LU/PTa/Pbi/fjo/vru/vvx/vvy/vz2//36//78///+////OBaQhAAAAB50Uk5TAAMKDBsfPExOYmRocHSKjqSwtr7Ay9XY5ery+Pn+bfME6gAAAaZJREFUWMOtl9eSgzAMRcVCEkIPhFDj7S3be+9d//9B+7BlQrDBHuW+Ip0ZbEm+AhBINx0viJI8T6LAc0wdlGTYYcEqKkLbkM1ecOMx42gcuwsS6ZqVMqFSS2vL741Yo0a9xvTOkLVq2BHndzMmoawryu+XTEpln396PpOWzzlLbcAUNKgTfKYkv/b/TFEz59AtVQFl5S46GVNWNl0P9fqZnG62VtRU/da/3uLbYRvhv6o1Tv0/IOL1ektf/N2lxfgAfNlvJli//Z+KAIhXa02A9Gc+uEwMwOe9JoILAABxEwDxclUMiAEAjHEzAJ92hYCxAQA2awHg1/mKiGADQNgKQHycCAAhgF5IAPDzbJkbVuhgMhkA4v02N84ERxKAHydLnDgHPFkA4t1WPc6DQB6A78eLs3EBRAoAxJuNmbgIEiUAvh5U4xLI1QCIR5W4nA4g/wL5EMnXSC4kcimTm4nczuSBQh9p5KFKHuv0h4X8tJEfV/rzTjYYPIuzc6Ficegmi2zz6EaTbnXpZpts9+kLxxxWHvrSRV/75rB40lffOSzfauv/N60YzB5Az7qLAAAAAElFTkSuQmCC'}}
                                        />
                                        <Text style={{fontSize: 12, color: ((new Date(data.release_date) - new Date()) < 0) ? 'black': 'grey'}}> Video </Text>
                                        { ((new Date(data.release_date) - new Date()) > 0) &&
                                          <Image
                                            style={{height: 2 * vh, width: 2 * vh}}
                                            source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjChYUCg5lvh1PAAACcUlEQVRo3u2YzWsTQRiHnyQ9KG3QQwsqtgcFW9RaS6VQQcWDePHQ0krxJHgS/xvxIurFUv8GxQ88FHMQUXsSQSuoSRp76EciVJtmvLRgZnY3b96dTS87c8m7md/7e3b2ndmPDJp2kitMMMgAeQw1vvOZAi/4pMrWVtvPHT5iQvp7brMvOfMMtyiHmu/2EjfJJGF/hNctzXf7Sw77th+nIrY3GJY559P+EtW27A2GKhd92Z9lvW17g2GNER/2B1lS2RsMXzgQH2A+MPU6c0wzRDfdDDHDHBuB4x7Htb8ckHSLu/Q6I/u4R90Z24hbCQtOyg2uhY6+yqoz/k0c+/NOuhqjkYoxfjuaCT3AAyfZTEvNrKO5r7XPsmKleirSPbdUFe3WPOKci2x3G3d0Z6LOMryNWfFX3okA3rJkHYmomyiAE1YsuwAAz6x4UAdgr/VvYgB7ZG/40CiAHiteFgOUrTivA7D/2xID/LXinA6gIy0F2HMAtz0KuKn66nUe2nbuLl2PqtnYbZuuVgAm4Rm2HPe8BlKAFCAF6IqlLvOBDKMc8okk3VaLTO7MX5YpSmKdJ4Ai/U2qATGCJ4BJRzfVSYBiQPFmBd+PAgB0q2CRhnOswaImlQ4g+IbtaUlLprEUgJDTXQIdgGHa0V3v7CoocaxJdVx4/t4ADIUmVUGs81Y4q03RmjaNHuBHRNQRgJ8RUQrQEQBPNaB/MclT+y/qoapz1M/A0aaoX5klxgyssMD2zu8cF+jTOabvhimAC5BsDQjuhr8SBai0BniVKIAg+zB/xA8X7fZNTksobySEsMmsdKKGedLG257sGXKeU0FW/wB9Wk6ZYZGyjQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOS0xMC0yMlQyMDoxMDoxNCswMDowMPrsrA0AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMTAtMjJUMjA6MTA6MTQrMDA6MDCLsRSxAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg=='}}
                                          />
                                        }
                                      </View>
                                  </View> 
                                  { this.state.completedBlocks.indexOf(data.block_id) != -1 &&
                                    <View style={{margin: 1.3 * vw, height: 7 * vw, width: 7 * vw, alignSelf: 'center'}}>
                                        <Image 
                                          source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABDlBMVEUAAAAf8F0i81ki81kh8lkh81ki9Fkj81cg8Vgg81kh81ki9VoA/wAg8loh81kg/2AA/4Ah8lki81kX6F0h81kr6lUh8lkh81ka/00g81gh81kh81kk7Vsg81kh9Fkh8lkh81kh81kh81kh8lkj8lsh81kh81kh8lwh81ki8Vgh81ki9Foz/2Yi8lkh9Fki9Fkf9Vgg81gj9lgh81gh81kh81kh81gg72Ah81oh81kg9Fkg8loh81gh81kg9Fog81gg81gi8lsA/1Uh81kh81kg81og81kh9Fkh81kh81ki81og81kh9Fkg8lkh81ki9Fkh9Fkh81kh81kg81gm8lkh9Fkh81kk/0kh81kAAACV40ciAAAAWHRSTlMAIWqPo5JyLDe9z0oBd/0IAqC+C8MMob8KrW3rDmey4Pfs0I07uPAn+0v8WwU8XFkxVx2Z7+eFEGbtSI5r/m9/bkwD11al3PTy2lLURXaEicn68UAUtJsHFlw9zQAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjCAEOLTdGwT3CAAACPElEQVR42u2Y11LDQAxFlxB66L2G3ntvoffe0f9/CQnMAAn2WmtLqxlG99necyTXlTEajUaj0Wi8pixVnq6orJLCV9fAV2rrJPCZ+gb4TrrRO7+pGX6npVWWD9DWLsv3bBDA92rQ1AFB6eySrL+Q7oxk/YX0iNafT2+faP359AvzYYCd32zlQ1a2foBB2foBhmTrBxiWrR9gRLZ+gFHZ+mFMuP7xCVn+5BQfH9P/6RnlK1/5yle+8pWv/JLMzs2nFhbj7Jhx/z9L9kWWV1Y/j1tb3xDhbw5+H7q17Z+f2Sm6WLve+RXFh+f2HPgE918p38WAh4834OJjDUie//3g03IHCD7F83eYg7gGJPyj49BTo64Czfv3xHKyvQck9Rtzajvd1gOq79+ZdYHwHhDVb8y5fYmwHtB9/y8gjgHh/8dl1DJBV4Gs//lEl/K3B6T/X1fRS5X2gLL+/IvoGmFQ1APq/8+babce0NZfyC1iwR8Der4xdxiDPZ7+uxpw7T+wBnz7H5wB5/7rHmPwgDjI8f5z6wFf/WQGifa/BAYJ99+JDRLv/xMaEMwfEhmQzD8SGBDNX2IbkM1/YhoQzp9iGZDOv2IYEM/fnA3I53+OBgzzx3VhvpMB0/wVbcA2/0UaMM6fUQaMfJQBKx9hwMyPNGDnRxh44FsNvPAtBp74oQbe+CEGHvmBBl75AQae+X8MvPNLDAT4RQYi/F/zg8e4+/+k6X/65GefhfjGvKTSr28L72J8jUaj0Wj+bT4Aji2oqqiUTYMAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDgtMDFUMTI6NDU6NTUrMDI6MDBoqZSoAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTA4LTAxVDEyOjQ1OjU1KzAyOjAwGfQsFAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII='}} 
                                          style={{height: 7 * vw, width: 7 * vw}}/>
                                    </View>                    
                                  }

                              </View>
                              </TouchableNativeFeedback>
                              )
                              }
                            else if(data.block_type == 'youtube_video') {
                              return(
                                <TouchableNativeFeedback
                                  onPress={() => {
                                    if((new Date(data.release_date) - new Date()) < 0){
                                      this.setState({startBuffering: true});
                                      const navigateAction = NavigationActions.navigate({
                                        routeName: 'youtubeVideo',
                                        params: {
                                          block_id: data.block_id,
                                          video_id: data.video_id,
                                          course_id: this.props.navigation.state.params.course_id,
                                          display_name: this.props.navigation.state.params.display_name,
                                          blocks: this.props.navigation.state.params.blocks,
                                          subject: this.props.navigation.state.params.subject
                                        }
                                      });
                                      this.props.navigation.dispatch(navigateAction);
                                      }
                                    else{
                                      ToastAndroid.show('Not released yet', ToastAndroid.SHORT);
                                    }
                                  }
                                }

                                >
                                <View style={styles.videoComponent}>
                                  <View style={styles.videoPreview}>
                                      <Image source={{uri: data.image}} style={{height:20 * vw, width: 30 * vw, opacity: ((new Date(data.release_date) - new Date()) < 0) ? 1: 0.4}}/>
                                  </View>
                                  
                                  <View style = {styles.aboutVideo}>
                                      <Text style={{fontSize: 16, color: ((new Date(data.release_date) - new Date()) < 0) ? 'black': 'grey', fontFamily: 'Montserrat-SemiBold'}}>{data.display_name}</Text>
                                      <Text style={{fontSize: 12, color: 'black'}}></Text>
                                      <View style={{flexDirection: 'row', alignItems:'center'}}>
                                        <Image
                                          style={{height: 2 * vh, width: 2 * vh, opacity: ((new Date(data.release_date) - new Date()) < 0) ? 1: 0.4}}
                                          source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAA9GAAAPRgFoUyCCAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAOFQTFRF/////6oA5rMa6r8V7L0T770Z6rsV67kX67oX6rkV67oX67oW67sX67sW67sW67sW67sW67kW67oW67sV67oX67oX67oW67sW67oW67oW67sW67oW67oW67oW67oW67oX67sZ67sb7Lwe7L4i7L8m7cAs7cIw7cIx7sQ478Y/78lH78lJ8MtQ8c5a8tFk89Ru89Rv89Vx89d49NqD9dyH9d2O9uGZ9uGa9+Sk+Oev+eq5+u3C+u7G+/DL+/LT+/LU/PTa/Pbi/fjo/vru/vvx/vvy/vz2//36//78///+////OBaQhAAAAB50Uk5TAAMKDBsfPExOYmRocHSKjqSwtr7Ay9XY5ery+Pn+bfME6gAAAaZJREFUWMOtl9eSgzAMRcVCEkIPhFDj7S3be+9d//9B+7BlQrDBHuW+Ip0ZbEm+AhBINx0viJI8T6LAc0wdlGTYYcEqKkLbkM1ecOMx42gcuwsS6ZqVMqFSS2vL741Yo0a9xvTOkLVq2BHndzMmoawryu+XTEpln396PpOWzzlLbcAUNKgTfKYkv/b/TFEz59AtVQFl5S46GVNWNl0P9fqZnG62VtRU/da/3uLbYRvhv6o1Tv0/IOL1ektf/N2lxfgAfNlvJli//Z+KAIhXa02A9Gc+uEwMwOe9JoILAABxEwDxclUMiAEAjHEzAJ92hYCxAQA2awHg1/mKiGADQNgKQHycCAAhgF5IAPDzbJkbVuhgMhkA4v02N84ERxKAHydLnDgHPFkA4t1WPc6DQB6A78eLs3EBRAoAxJuNmbgIEiUAvh5U4xLI1QCIR5W4nA4g/wL5EMnXSC4kcimTm4nczuSBQh9p5KFKHuv0h4X8tJEfV/rzTjYYPIuzc6Ficegmi2zz6EaTbnXpZpts9+kLxxxWHvrSRV/75rB40lffOSzfauv/N60YzB5Az7qLAAAAAElFTkSuQmCC'}}
                                        />
                                        <Text style={{fontSize: 12, color: 'black', color: ((new Date(data.release_date) - new Date()) < 0) ? 'black': 'grey'}}> Video </Text>
                                        { ((new Date(data.release_date) - new Date()) > 0) &&
                                          <Image
                                            style={{height: 2 * vh, width: 2 * vh}}
                                            source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjChYUCg5lvh1PAAACcUlEQVRo3u2YzWsTQRiHnyQ9KG3QQwsqtgcFW9RaS6VQQcWDePHQ0krxJHgS/xvxIurFUv8GxQ88FHMQUXsSQSuoSRp76EciVJtmvLRgZnY3b96dTS87c8m7md/7e3b2ndmPDJp2kitMMMgAeQw1vvOZAi/4pMrWVtvPHT5iQvp7brMvOfMMtyiHmu/2EjfJJGF/hNctzXf7Sw77th+nIrY3GJY559P+EtW27A2GKhd92Z9lvW17g2GNER/2B1lS2RsMXzgQH2A+MPU6c0wzRDfdDDHDHBuB4x7Htb8ckHSLu/Q6I/u4R90Z24hbCQtOyg2uhY6+yqoz/k0c+/NOuhqjkYoxfjuaCT3AAyfZTEvNrKO5r7XPsmKleirSPbdUFe3WPOKci2x3G3d0Z6LOMryNWfFX3okA3rJkHYmomyiAE1YsuwAAz6x4UAdgr/VvYgB7ZG/40CiAHiteFgOUrTivA7D/2xID/LXinA6gIy0F2HMAtz0KuKn66nUe2nbuLl2PqtnYbZuuVgAm4Rm2HPe8BlKAFCAF6IqlLvOBDKMc8okk3VaLTO7MX5YpSmKdJ4Ai/U2qATGCJ4BJRzfVSYBiQPFmBd+PAgB0q2CRhnOswaImlQ4g+IbtaUlLprEUgJDTXQIdgGHa0V3v7CoocaxJdVx4/t4ADIUmVUGs81Y4q03RmjaNHuBHRNQRgJ8RUQrQEQBPNaB/MclT+y/qoapz1M/A0aaoX5klxgyssMD2zu8cF+jTOabvhimAC5BsDQjuhr8SBai0BniVKIAg+zB/xA8X7fZNTksobySEsMmsdKKGedLG257sGXKeU0FW/wB9Wk6ZYZGyjQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOS0xMC0yMlQyMDoxMDoxNCswMDowMPrsrA0AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMTAtMjJUMjA6MTA6MTQrMDA6MDCLsRSxAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg=='}}
                                          />
                                        }
                                      </View>
                                  </View> 
                                  { this.state.completedBlocks.indexOf(data.block_id) != -1 &&
                                    <View style={{margin: 1.3 * vw, height: 7 * vw, width: 7 * vw, alignSelf: 'center'}}>
                                        <Image 
                                          source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABDlBMVEUAAAAf8F0i81ki81kh8lkh81ki9Fkj81cg8Vgg81kh81ki9VoA/wAg8loh81kg/2AA/4Ah8lki81kX6F0h81kr6lUh8lkh81ka/00g81gh81kh81kk7Vsg81kh9Fkh8lkh81kh81kh81kh8lkj8lsh81kh81kh8lwh81ki8Vgh81ki9Foz/2Yi8lkh9Fki9Fkf9Vgg81gj9lgh81gh81kh81kh81gg72Ah81oh81kg9Fkg8loh81gh81kg9Fog81gg81gi8lsA/1Uh81kh81kg81og81kh9Fkh81kh81ki81og81kh9Fkg8lkh81ki9Fkh9Fkh81kh81kg81gm8lkh9Fkh81kk/0kh81kAAACV40ciAAAAWHRSTlMAIWqPo5JyLDe9z0oBd/0IAqC+C8MMob8KrW3rDmey4Pfs0I07uPAn+0v8WwU8XFkxVx2Z7+eFEGbtSI5r/m9/bkwD11al3PTy2lLURXaEicn68UAUtJsHFlw9zQAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjCAEOLTdGwT3CAAACPElEQVR42u2Y11LDQAxFlxB66L2G3ntvoffe0f9/CQnMAAn2WmtLqxlG99necyTXlTEajUaj0Wi8pixVnq6orJLCV9fAV2rrJPCZ+gb4TrrRO7+pGX6npVWWD9DWLsv3bBDA92rQ1AFB6eySrL+Q7oxk/YX0iNafT2+faP359AvzYYCd32zlQ1a2foBB2foBhmTrBxiWrR9gRLZ+gFHZ+mFMuP7xCVn+5BQfH9P/6RnlK1/5yle+8pWv/JLMzs2nFhbj7Jhx/z9L9kWWV1Y/j1tb3xDhbw5+H7q17Z+f2Sm6WLve+RXFh+f2HPgE918p38WAh4834OJjDUie//3g03IHCD7F83eYg7gGJPyj49BTo64Czfv3xHKyvQck9Rtzajvd1gOq79+ZdYHwHhDVb8y5fYmwHtB9/y8gjgHh/8dl1DJBV4Gs//lEl/K3B6T/X1fRS5X2gLL+/IvoGmFQ1APq/8+babce0NZfyC1iwR8Der4xdxiDPZ7+uxpw7T+wBnz7H5wB5/7rHmPwgDjI8f5z6wFf/WQGifa/BAYJ99+JDRLv/xMaEMwfEhmQzD8SGBDNX2IbkM1/YhoQzp9iGZDOv2IYEM/fnA3I53+OBgzzx3VhvpMB0/wVbcA2/0UaMM6fUQaMfJQBKx9hwMyPNGDnRxh44FsNvPAtBp74oQbe+CEGHvmBBl75AQae+X8MvPNLDAT4RQYi/F/zg8e4+/+k6X/65GefhfjGvKTSr28L72J8jUaj0Wj+bT4Aji2oqqiUTYMAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDgtMDFUMTI6NDU6NTUrMDI6MDBoqZSoAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTA4LTAxVDEyOjQ1OjU1KzAyOjAwGfQsFAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII='}} 
                                          style={{height: 7 * vw, width: 7 * vw}}/>
                                    </View>                    
                                  }

                              </View>
                              </TouchableNativeFeedback>
                              )
                              }
                            else if(data.block_type == 'pdf'){
                              return(
                                <TouchableNativeFeedback
                                  onPress={() => {
                                    if((new Date(data.release_date) - new Date()) < 0){
                                      this.setState({startBuffering: true});
                                      axios.post(`http://classcast-198812.appspot.com/coursedata/storestudentblockinteractions`, {
                                        "course_id": this.props.navigation.state.params.course_id,
                                        "block_id": data.block_id
                                      });
                                      axios.post(`https://classcast-198812.appspot.com/coursedata/generateSignedUrl`, {
                                        "path": data.path
                                      })
                                        .then( response => {
                                          this.setState({startBuffering: false});
                                          this.navigateToScreen('pdfViewer', response.data, data.block_id, this.props.navigation.state.params.course_id, data.display_name);
                                          //this.navigateToScreen('pdfViewer', response.data);
                                        })
                                      }
                                    else{
                                      ToastAndroid.show('Not released yet', ToastAndroid.SHORT);
                                    }
                                  }
                                }
                                >
                                  <View style={styles.videoComponent}>
                                  <View style={styles.videoPreview}>
                                    <Image source={{uri: data.image}} style={{height:20 * vw, width: 30 * vw, opacity: ((new Date(data.release_date) - new Date()) < 0) ? 1: 0.4}}/>
                                  </View>
                                  
                                  <View style = {styles.aboutVideo}>
                                      <Text style={{fontSize: 16, color: ((new Date(data.release_date) - new Date()) < 0) ? 'black': 'grey', fontFamily: 'Montserrat-SemiBold'}}>{data.display_name}</Text>
                                      <Text style={{fontSize: 12, color: 'black'}}></Text>
                                      <View style={{flexDirection: 'row', alignItems:'center'}}>
                                        <Image
                                          style={{height: 2 * vh, width: 2 * vh, opacity: ((new Date(data.release_date) - new Date()) < 0) ? 1: 0.4}}
                                          source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAALdAAAC3QHkSGdAAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAASNQTFRF////5FtJ5VhP4ldMxkM1xUI1xkI2xkI2xkM2x0M2x0M3x0M3x0Q4x0Q4yUQ44lZN4ldMtTYpuTksxUI13VRI4ldM4lhN41xS42BV5GFX5GRZ5WVb5Wdd5Wlf5mxi5m9l5m9m5nBn5nFn53du6Hxz6X516YF46YF56oR864yE7JGK7JOM7ZaP7ZmS7puU7p6Y7p+Z76Gb76Wf8Kei8Kmj8a2o8a6p8a+p8a+q8bGr8rKt8rOu8rWw8rax87q187u39L669MG99cbC9cfD9snF9svI9szI99HO99LP+NbT+NfV+d7c+uPh++fm/Ovq/O3r/O3s/O7t/O/t/O/u/PHw/fLy/fPy/vf3/vj3/vj4/vn5/vr6/vz7//z8//39//7+////wwIZXgAAABF0Uk5TABwdp7u8vL29vr6/v8DA5u1MYiQcAAABb0lEQVRYw+3X2U7CQBQGYKDuWxnwqID7hqCiuOOuICpuuCCVETnv/xR2StVQMvGMjXfzX53+yXyZTJqmEwiIhAwTfk1HQJpgGAhhnVLAABLAumSASQSkAlABmUAHJIICwLr9AqzHL8B6/QKszy/QLqgCrN8v4N2DOuDZAw2ItAgD6kC0BWCDysBwRCoAUYi2EkOqQFs0oIH/BA4tzu/z0/a0X+X88XInJtqjGuf8nARUUeRtBqDuTFhetFtLTA8kgOP2/IaFBQDEYno9j/g0JtqtVGqCCKwAnOKzAHL2cxZxV7RJ6hl4gfgHlhSBXHLTwosvAEr4KtrVuSkq4Bzi7DdwhbWRZpslAnVeLtjrXSD2jjdNtpGhn4GTJrCGeCza9GQClIFiOnPWwEpC6RCruOxO7ov0suS0C1Tg+G7cnfbsV7lyfRAX88ntqP4eaEADGtAABTD/tt5UvPq2xVC8fHsTDv78rpOu/579GyFn6Sc8UES8860f+AAAAABJRU5ErkJggg=='}}
                                        />
                                        <Text style={{fontSize: 12, color: 'black', color: ((new Date(data.release_date) - new Date()) < 0) ? 'black': 'grey'}}> PDF </Text>
                                        { ((new Date(data.release_date) - new Date()) > 0) &&
                                          <Image
                                            style={{height: 2 * vh, width: 2 * vh}}
                                            source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjChYUCg5lvh1PAAACcUlEQVRo3u2YzWsTQRiHnyQ9KG3QQwsqtgcFW9RaS6VQQcWDePHQ0krxJHgS/xvxIurFUv8GxQ88FHMQUXsSQSuoSRp76EciVJtmvLRgZnY3b96dTS87c8m7md/7e3b2ndmPDJp2kitMMMgAeQw1vvOZAi/4pMrWVtvPHT5iQvp7brMvOfMMtyiHmu/2EjfJJGF/hNctzXf7Sw77th+nIrY3GJY559P+EtW27A2GKhd92Z9lvW17g2GNER/2B1lS2RsMXzgQH2A+MPU6c0wzRDfdDDHDHBuB4x7Htb8ckHSLu/Q6I/u4R90Z24hbCQtOyg2uhY6+yqoz/k0c+/NOuhqjkYoxfjuaCT3AAyfZTEvNrKO5r7XPsmKleirSPbdUFe3WPOKci2x3G3d0Z6LOMryNWfFX3okA3rJkHYmomyiAE1YsuwAAz6x4UAdgr/VvYgB7ZG/40CiAHiteFgOUrTivA7D/2xID/LXinA6gIy0F2HMAtz0KuKn66nUe2nbuLl2PqtnYbZuuVgAm4Rm2HPe8BlKAFCAF6IqlLvOBDKMc8okk3VaLTO7MX5YpSmKdJ4Ai/U2qATGCJ4BJRzfVSYBiQPFmBd+PAgB0q2CRhnOswaImlQ4g+IbtaUlLprEUgJDTXQIdgGHa0V3v7CoocaxJdVx4/t4ADIUmVUGs81Y4q03RmjaNHuBHRNQRgJ8RUQrQEQBPNaB/MclT+y/qoapz1M/A0aaoX5klxgyssMD2zu8cF+jTOabvhimAC5BsDQjuhr8SBai0BniVKIAg+zB/xA8X7fZNTksobySEsMmsdKKGedLG257sGXKeU0FW/wB9Wk6ZYZGyjQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOS0xMC0yMlQyMDoxMDoxNCswMDowMPrsrA0AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMTAtMjJUMjA6MTA6MTQrMDA6MDCLsRSxAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg=='}}
                                          />
                                        }
                                      </View>
                                  </View>                     

                              </View>
                              </TouchableNativeFeedback>
                              )
                            }
                            else if(data.block_type == 'problem'){
                              return(
                                <TouchableNativeFeedback
                                  onPress={() => {
                                    if((new Date(data.release_date) - new Date()) < 0){
                                      this.setState({startBuffering: true});
                                      axios.post(`http://classcast-198812.appspot.com/coursedata/storestudentblockinteractions`, {
                                        "course_id": this.props.navigation.state.params.course_id,
                                        "block_id": data.block_id
                                      });
                                      axios.post(`https://classcast-198812.appspot.com/coursedata/fetchassignmentquestions`, {
                                        "block_id": data.url
                                      })
                                        .then( response => {
                                          
                                          this.setState({startBuffering: false});
                                          this.navigateToScreen('assignmentQuestions', response.data, data.block_id, this.props.navigation.state.params.course_id, data.display_name);
                                          //this.navigateToScreen('assignmentQuestions', response.data);
                                        })
                                        .catch(err=> {
                                          console.log("error")
                                        })
                                      }
                                    else{
                                      ToastAndroid.show('Not released yet', ToastAndroid.SHORT);
                                    }
                                  }
                                }

                                >
                                  <View style={styles.videoComponent}>
                                  <View style={styles.videoPreview}>
                                    <Image source={{uri: data.image}} style={{height:20 * vw, width: 30 * vw, opacity: ((new Date(data.release_date) - new Date()) < 0) ? 1: 0.4}}/>
                                  </View>
                                  
                                  <View style = {styles.aboutVideo}>
                                      <Text style={{fontSize: 16, color: ((new Date(data.release_date) - new Date()) < 0) ? 'black': 'grey', fontFamily: 'Montserrat-SemiBold'}}>{data.display_name}</Text>
                                      <Text style={{fontSize: 12, color: 'black'}}></Text>
                                      <View style={{flexDirection: 'row', alignItems:'center'}}>
                                      <Image
                                          style={{height: 2 * vh, width: 2 * vh, opacity: ((new Date(data.release_date) - new Date()) < 0) ? 1: 0.4}}
                                          source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAABYgAAAWIBXyfQUwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAN/SURBVHic7ZrNS5RBHMe/M8/bum7KmnmQCqIs0Sw7RCeDgjrUQYIWCjpKx+gUdOrsoYL8AyIROtTJgwR2kSJWDwUWQRQokUKFmbbu4+7zMh0WXfftmUcf5xnheT7wHGbmNzPf/c7ze+Z5WYKQYBODPYDzEQCtaFhsqw1uNjPk5ouXYeii/JBdgtgPfM9nqY/EiikTigFsYrAHjFz33aGoHWLPM/7jA0C8Gt/eu9GpWLTHz0CKwdSzF9YcMIfVNDr0Lgi7WrdjvRQAAN3+BcN+WF3tMkazWVcx847lRxcz3MlLI+MfGrWrXp0Vm15mwFM/EykUgOOirqek1hMuRbUDRXW4upoCAFmGWbB9DWMQ7TiAoUbt4V0D9iixAbIFyCY2QLYA2UTeAM9tkEdXZghaqgUAQIgLpB2AeN5a1GC2fd72vL0DZ+CqCQCAUyggO3x/22NsEMiAfYePwki3BxkCBefAjvpt2KxpeqD5I58CsQGyBcgmNkC2ANmEa0ChCKzkANcNdVovAm2DvmAMyM4CUzPA4u9SnaED/d3AlfPCp+ch1gDXBUbHgfdVNzuFIjA9C3z6CjJwEuxcn1AZXohNgcl3tT9+K2sm1kfGQJZXhcrwQpwBRQt4na2s6+wATh0HdG2zyrVssGfjwmTwEJcC8wulU32D3mPA7UzpWWHuB/B4dLPJ/jIfwsWoPuLOgJVcZbmvq/ygdOQg0JrabHLzpjAZPMQZUL3VKUplWd2y5mwHL013ifDOvOlZYG6hXM7lQ5vai/AM+Pa9dOwx4lth2QJkE14KDF4ETp8ol5+MAX//hTZ9I8IzIJUE2tPlcvWuIIk4BYSNbOiVK25UvbxMtwCEQDEM0OakMBk8xBnQ3106GnHnFgBAX7omTIIfIp8CkTdAWAq4jg3b5v+JwyryYxRVAaVi1kqYAbZtIZ9b4caZJv+ZoKkpCaqLMSDyKRB5A4SlgKpqSKZauXF+rwGiEGYAVVToCn94bcv7QRlEPgUib4CwFLAK6zBN/uNubpUfYyQT0FQxqSLMAAYG13G4cS7z8Z1Q4KfEOAVEDUxAQH289KDExxoIXCZhBmhGApqR4Mb5SRORRD4FYgNkC5BNbIBsAbKJvAGBtsGfM1NQks2BBND9HYH62/lgX5kDGbDw5lWgyQFg6c9y4DGCEPkUiA2QLUA2sQGyBcgm8gb8Bya00aZhTcMdAAAAAElFTkSuQmCC'}}
                                        />
                                        <Text style={{fontSize: 12, color: 'black', color: ((new Date(data.release_date) - new Date()) < 0) ? 'black': 'grey'}}> Assignment </Text>
                                        { ((new Date(data.release_date) - new Date()) > 0) &&
                                          <Image
                                            style={{height: 2 * vh, width: 2 * vh}}
                                            source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjChYUCg5lvh1PAAACcUlEQVRo3u2YzWsTQRiHnyQ9KG3QQwsqtgcFW9RaS6VQQcWDePHQ0krxJHgS/xvxIurFUv8GxQ88FHMQUXsSQSuoSRp76EciVJtmvLRgZnY3b96dTS87c8m7md/7e3b2ndmPDJp2kitMMMgAeQw1vvOZAi/4pMrWVtvPHT5iQvp7brMvOfMMtyiHmu/2EjfJJGF/hNctzXf7Sw77th+nIrY3GJY559P+EtW27A2GKhd92Z9lvW17g2GNER/2B1lS2RsMXzgQH2A+MPU6c0wzRDfdDDHDHBuB4x7Htb8ckHSLu/Q6I/u4R90Z24hbCQtOyg2uhY6+yqoz/k0c+/NOuhqjkYoxfjuaCT3AAyfZTEvNrKO5r7XPsmKleirSPbdUFe3WPOKci2x3G3d0Z6LOMryNWfFX3okA3rJkHYmomyiAE1YsuwAAz6x4UAdgr/VvYgB7ZG/40CiAHiteFgOUrTivA7D/2xID/LXinA6gIy0F2HMAtz0KuKn66nUe2nbuLl2PqtnYbZuuVgAm4Rm2HPe8BlKAFCAF6IqlLvOBDKMc8okk3VaLTO7MX5YpSmKdJ4Ai/U2qATGCJ4BJRzfVSYBiQPFmBd+PAgB0q2CRhnOswaImlQ4g+IbtaUlLprEUgJDTXQIdgGHa0V3v7CoocaxJdVx4/t4ADIUmVUGs81Y4q03RmjaNHuBHRNQRgJ8RUQrQEQBPNaB/MclT+y/qoapz1M/A0aaoX5klxgyssMD2zu8cF+jTOabvhimAC5BsDQjuhr8SBai0BniVKIAg+zB/xA8X7fZNTksobySEsMmsdKKGedLG257sGXKeU0FW/wB9Wk6ZYZGyjQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOS0xMC0yMlQyMDoxMDoxNCswMDowMPrsrA0AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMTAtMjJUMjA6MTA6MTQrMDA6MDCLsRSxAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg=='}}
                                          />
                                        }
                                      </View>
                                  </View>                     

                              </View>
                              </TouchableNativeFeedback>
                              )
                            }
                            else {
                              return(
                                <TouchableNativeFeedback
                                  onPress={() => {
                                    
                                    }
                                }

                                >
                                  <View style={styles.videoComponent}>
                                  <View style={styles.videoPreview}>
                                    <Image source={{uri: data.image}} style={{height:20 * vw, width: 30 * vw, opacity: ((new Date(data.release_date) - new Date()) < 0) ? 1: 0.4}}/>
                                  </View>
                                  
                                  <View style = {styles.aboutVideo}>
                                      <Text style={{fontSize: 16, color: ((new Date(data.release_date) - new Date()) < 0) ? 'black': 'grey', fontFamily: 'Montserrat-SemiBold'}}>{data.display_name}</Text>
                                      <Text style={{fontSize: 12, color: 'black'}}></Text>
                                      <View style={{flexDirection: 'row', alignItems:'center'}}>
                                      
                                        <Text style={{fontSize: 12, color: 'black'}}>  </Text>
                                        <Text style={{fontSize: 12, color: '#08ab00', marginLeft: 2 * vw}}> </Text>
                                      </View>
                                  </View>                     

                              </View>
                              </TouchableNativeFeedback>
                              )
                            }
                          })
                        }
                      </View>
                      </View>
                      )
                    })
                  }
                </View>
              </ScrollView>
            </View>
    
  );
  }
}
export default crashCourse;


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
