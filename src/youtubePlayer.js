import React, { Component } from 'react'
import {
  Image,
  Alert,
  StyleSheet,
  Text,
  View,
  Dimensions,
  BackHandler,
  Button,
  TouchableOpacity,
  TouchableNativeFeedback,
  ScrollView,
  TextInput
} from 'react-native';
import YouTube from 'react-native-youtube';
import Slider from 'react-native-slider';
import firebase from 'react-native-firebase';
import axios from 'axios';
import { StackActions, NavigationActions } from "react-navigation";
const screen = Dimensions.get('window');
vh = screen.height / 100;
vw = screen.width / 100;


class youtubeVideo extends Component {
 constructor(props) {
   super(props);
   this.duration = this.duration.bind(this);
   this.currentTime = this.currentTime.bind(this);
   this.getTime = this.getTime.bind(this);
   this.loadData = this.loadData.bind(this);
   this.sendMessage = this.sendMessage.bind(this);
   this.timeSince = this.timeSince.bind(this);
   this._didFocusSubscription = props.navigation.addListener(
      'didFocus',
      payload =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid
        )
    );
   //this.handleBackButton = this.handleBackButton.bind(this);
   this.state = {
     isPlaying: false,
     isReady: false,
     showControls: false,
     fullscreen: false,
     currentTime: 0.0,
     error: '',
     duration: 1,
     discussions: [],
     message: '',
     validMessage: false
   };
 }
  static navigationOptions = {
    title: 'Some Random ',
  };

  timeSince(date) {
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
   
    return Math.floor(parseFloat(seconds)) + " seconds";
  }

  loadData() {
   const db = firebase.firestore()
       db.collection('discussion')
         .doc(this.props.navigation.state.params.block_id)
           .onSnapshot((doc)=> {
             if (doc.exists) {
               this.setState({discussions: doc.data().comments})
               console.log("ImageList: " + JSON.stringify(doc.data().comments));
             }
           }),
           (error) => {
           console.error(error);
           };
   }

  onBackButtonPressAndroid = () => {
    console.log('kjbkbkbk1');
    //this.props.navigation.dispatch(StackActions.popToTop());
    //this.props.navigation.dispatch(NavigationActions.back());
    const navigateAction = NavigationActions.navigate({
        routeName: 'crashCourseNavigator',
        params: {
          course_id: this.props.navigation.state.params.course_id,
          display_name: this.props.navigation.state.params.display_name,
          blocks: this.props.navigation.state.params.blocks,
          subject: this.props.navigation.state.params.subject
        },
      });
      this.props.navigation.dispatch(navigateAction);
    //this.props.navigation.navigate("Home");
    return true;
  };

  renderVideo() {
    return(
      <View style={{height: 40 * vh, backgroundColor: 'black'}}>
       <YouTube
         apiKey={'AIzaSyDw1TYmD5lBEU-pZcwEl2r7WCARq1xHtSQ'}
         ref = {component => this._youTubeRef = component}
         videoId={this.props.navigation.state.params.video_id}
         play={this.state.isPlaying}
         fullscreen={this.state.fullscreen}
         controls={2}
         style={{ height: 40*vh}}
         showFullscreenButton ={true}
         onReady={e => {
          console.log("adskjkjasbdskj: "+JSON.stringify(e));
          this.duration();
          this.setState({ isReady: true })
        }}
         onChangeFullscreen={e =>
          this.setState({ fullscreen: e.isFullscreen })
         }
         onError={e => Alert.alert(JSON.stringify(e))}
       />
      </View>
    )
  }
 
 componentWillUnmount() {
   //BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
   this._willBlurSubscription && this._willBlurSubscription.remove();
   this._didFocusSubscription && this._didFocusSubscription.remove();
 }
 async componentDidMount() {
   //BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
   //this.video.seek(1000);
   this.loadData();
   this._willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid
        )
    );

   setInterval(() => {
      if(this.state.isReady){
        this.currentTime()
      }
    }, 1000);

 }

 sendMessage() {
    if(this.state.validMessage){
      var data = {
        "text": this.state.message,
        "block_id": this.props.navigation.state.params.block_id,
        "time": new Date()
      }
      console.log("errorsakj: "+JSON.stringify(data));
      axios.post(`https://classcast-198812.appspot.com/coursedata/store_block_discussion_data`, data)
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

 getTime = sec => {
    let s = parseInt(sec);
    let m = Math.floor(s / 60);
    s = s % 60;
    s = s >= 10 ? s : '0' + s;
    m = m >= 10 ? m : '0' + m;
    return `${m}:${s}`
  };

 duration = () => {
    this._youTubeRef
        .getDuration()
        .then(duration => {
          console.log("daslskakasnduration: "+duration);
          this.setState({ duration });
      })
        .catch(errorMessage =>
          this.setState({ error: errorMessage })
        )
 }

 currentTime = () => {
    this._youTubeRef && this._youTubeRef
        .getCurrentTime()
          .then(currentTime => {
          this.setState({
            sliderValue: currentTime/this.state.duration,
            currentTime: currentTime
          });
          console.log("daslskakasncurrent: "+currentTime);
      })
        .catch(errorMessage =>
          this.setState({ error: errorMessage })
        )
 }

 render() {
  console.log("ndsksnadnas: "+this.props.navigation.state.params.video_id)
   return (
    <View style={{height: '100%'}}>
      <TouchableNativeFeedback
          style={styles.fullScreen}
          onPress={() => {
            this.setState({showControls: !this.state.showControls});
            setTimeout(() => this.setState({showControls: false}), 10000);
          }}
        >

          { 
            this.renderVideo()
          }
      </TouchableNativeFeedback>
      <TouchableNativeFeedback
        onPress={() => this.setState({isFullscreen: !this.state.isFullscreen})}
      >
        <Image
          style={styles.fullScreenIcon}
          resizeMode={'contain'}
          source={{uri: this.state.isFullscreen ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAQAAABpN6lAAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjCgIHBxt81loIAAAEj0lEQVR42u3dP25TQRDH8XFEFTsR4gC5ADeIKEJHwXGQ3CDFZUqkNNyDCIcCIsifko4DkCNARPujsI3fn923szuzeZMwUxLHft8Pjv3s97wmCgz2cYp9Uhgsxr8GIiJMcYqn/At/BXAjJ8ACEF8HcCK+jl18AfAdz/j5kBNgAagACAnW+WARNPKFBKt8JQABQSM/TdDJFxBs8tUACgk6+cMEgfxCgm2+IkABQSA/ThDJLyBo5qsCZBJE8sMEA/kAcM0naOcrA2QQDOT3CRL5GQTdfHUAJkEiv03AyGcS9PMrADAIGPlbAmY+gyCUXwUgQcDM3xDgHfPCAHCFvbz8SgCI7yBjhm8ZRe8Ju/ic8QvXYYJYfjWAyL0AU1xk1Kye3zLuMhGCeH5FgABBZv72T1pGMJRfFaBDUJwvIxjOrwzQIBDllxOk8qsDrAnE+WUE6fx7AABOVPKJiDBj7xMAwE/Ohe4BgLkl6+k8lU+69wI6o5fSjW7dwET2+3LC1tzQq8nv5j/sdDb3D72mC9WbtDS9/B7AoyYI5Ecm8+Fw/McAzlzHd+OrEhgByMvXJDABkJ+vR2AAoCxfi2B0gPL8NcHFgwa4EuUTZe9l2wJg5DP20zCjH3RQGjDinuAtPZ/cpS60w7iiN+X5o84BvVW4Fs4rPrN/AvIjy9L80QFkBPJ8AwDlBBr5JgDKCHTyjQDkE2jlmwHII9DLNwTAJ9DMNwXAI9DNNwaQJtDONwcwTKCfbxAgTlAj3yRAmKBOvlGAPkGtfLMAbYJ6+YYBtgQ1800DACdET7CgY+lGPtiZ6x549PHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8bE5E8xJvFzd4A3Y+vB0dxZEhPl/e4rM5tyYmgSGAZqnBtUjMAvQPTOqFoFRgNCJYXUITALEzourQWAQYOi0QH0CcwCpsyK1CYwBcE4K1SUwBcA9J1aTwBBAzinBegRmAHLPiNYiMAJQckK4DoEJgNLz4TUIDABIPg4gJxgdQPppCCnByAAaHwaREYwKwMj3RVSSGzClDw92EZVPo68iNPpjgHAdKXH+6ACilcQU8g0AFK8lp5JvAqBoNUGlfCMA2etJquWbAYgSBJ4GMaUzOpJuuLk5pPMQQQ/gkeZHCToAjzg/QtACwIzOM/Jvx+4p2JJD+ohZ5GeZD31X2OO8TJK2MbbkOHtx9dDDYX4+EeeVYnWA44Kt7xOU5XMIKgP8e8ErIijPTxNUBWi93i8mkOWnCCoC9N7uKCKQ5w8TVAMIvttTQIBlxi9cRp9CLH3R0mVG0ZJwiF+y//3he0EVgMH3+jLuBXc4IuISMFZpDhFUAEi+1ckkWOUTj4C5RnefQB2A9UY3g2CbzyDIWKK8S6AMwH6fP0HQzk8QZK7Q3iZQBcg6zDFA0M8fIChYoL5JoAiQfZQnQhDOjxAUrs+/JVADKDrIFSCI5wcIBF9PsCFQAig+xtchGM7vEAi/nWFFoAIgOsTZIEjnNwjkX05BmKsAiI/wrgl4+UREeIFlfKc366YX418DERFmWOJF6Cd/Aa1+Vwr1n8+4AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTEwLTAyVDA3OjA3OjI3KzAwOjAwLvgn+AAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0xMC0wMlQwNzowNzoyNyswMDowMF+ln0QAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC'
                                                : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAQAAABpN6lAAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjCgIHAzMtDzf2AAABW0lEQVR42u3d0U3CUACG0dawgpswhAylDzoUDOEmDFEXMPHmpnCCfOe5NH+/hBcCl3Xbllu5rKd9brSdl7dbjXy52eM/iALoAVoB9ACtAHqAVgA9QCuAHqAVQA/QCqAHaAXQA7R16BOhj+V74t7XdeZVv9iOy+vEy47L598XHYZu9b2e93mUOXMhxz7re/q3QAH0AK0AeoBWAD1AK4AeoBVAD9AKoAdoBdADtALoAVoB9ACtAHqAVgA9QCuAHqAdlsvAVVc9c8p16NmSJEmSJEmSJEmSJEmS/GvrNvLD+Pe9TgK4p+24fI1cNmKnozHvHOA08mhP/z3BAugBWgH0AK0AeoBWAD1AK4AeoBVAD9AKoAdoBdADtALoAVoB9ACtAHqAVgA9QBs7Wfo49Y9s/mjtAWNni8/p3+YeQQH0AK0AeoBWAD1AK4AeoBVAD9AKoAdoBdADtALoAdoPRPxrrvP+7V4AAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMTAtMDJUMDc6MDM6NTErMDA6MDBOBruhAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTEwLTAyVDA3OjAzOjUxKzAwOjAwP1sDHQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII='
        }}
        />
      </TouchableNativeFeedback>
      <View style={styles.trackingControls}>
              <Text style={styles.timeLabelText}>{this.state.currentTime == undefined ? '00:00' : this.getTime(this.state.currentTime)}</Text>
              <Slider
                style={styles.seek}
                trackStyle={styles.trackStyle}
                thumbStyle={styles.thumbStyle}
                minimumTrackTintColor={'#5e4096'}
                maximumTrackTintColor={'rgba(255,255,255,1)'}
                thumbTintColor={'#5e4096'}
                value={this.state.sliderValue}
                onValueChange={value => {
                  this._youTubeRef && this._youTubeRef
                      .getCurrentTime()
                      .then(currentTime => {
                        this.setState({ currentTime });
                        this.setState({ sliderValue: value * currentTime/this.state.duration })
                        this._youTubeRef && this._youTubeRef.seekTo(value * this.state.duration);
                    })
                      .catch(errorMessage =>
                        this.setState({ error: errorMessage })
                      )
                }}
              />
              <Text style={styles.timeLabelText}>{this.getTime(this.state.duration)}</Text>
              {!this.state.fullscreen && (
              <TouchableNativeFeedback
                onPress={() => this.setState({fullscreen: true})}
              >
                <Image
                  style={styles.fullScreenIcon}
                  resizeMode={'contain'}
                  source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAQAAABpN6lAAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjCgIHAzMtDzf2AAABW0lEQVR42u3d0U3CUACG0dawgpswhAylDzoUDOEmDFEXMPHmpnCCfOe5NH+/hBcCl3Xbllu5rKd9brSdl7dbjXy52eM/iALoAVoB9ACtAHqAVgA9QCuAHqAVQA/QCqAHaAXQA7R16BOhj+V74t7XdeZVv9iOy+vEy47L598XHYZu9b2e93mUOXMhxz7re/q3QAH0AK0AeoBWAD1AK4AeoBVAD9AKoAdoBdADtALoAVoB9ACtAHqAVgA9QCuAHqAdlsvAVVc9c8p16NmSJEmSJEmSJEmSJEmS/GvrNvLD+Pe9TgK4p+24fI1cNmKnozHvHOA08mhP/z3BAugBWgH0AK0AeoBWAD1AK4AeoBVAD9AKoAdoBdADtALoAVoB9ACtAHqAVgA9QBs7Wfo49Y9s/mjtAWNni8/p3+YeQQH0AK0AeoBWAD1AK4AeoBVAD9AKoAdoBdADtALoAdoPRPxrrvP+7V4AAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMTAtMDJUMDc6MDM6NTErMDA6MDBOBruhAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTEwLTAyVDA3OjAzOjUxKzAwOjAwP1sDHQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII='
                }}
                />              
              </TouchableNativeFeedback>
              )}
        </View>
        
          <Text style={{fontSize: 4 * vw, color: 'black', fontFamily: 'Montserrat-Bold'}}> Discussions </Text>
        
        <ScrollView 
        style={{height: 50 * vh, marginBottom: 10 * vh}}
        ref={ref => this.scrollView = ref}
        onContentSizeChange={(contentWidth, contentHeight)=>{        
            this.scrollView.scrollToEnd({animated: true});
        }}
        >
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
                      <Text style={{color: '#4286f4', fontSize: 3 * vw, fontStyle: 'italic'}}>{this.timeSince(new Date(blocks.datetime)) + ' ago'}</Text>
                    </View>
                    <View style={{width: '95%', alignSelf: 'center'}}>
                      <Text style={{fontSize: 4 * vw, color: 'black', fontFamily: 'Montserrat-Regular'}}> {blocks.text} </Text>
                    </View>
                    
                  </View>
              ) 
            })
          }
        </ScrollView>
        <View style={{flexDirection: 'row', position: 'absolute', bottom: 0, height: 10 * vh, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
          <TextInput
              style={{ height: 10 * vw, width: '80%', borderColor: 'black', borderWidth: 0.5 * vw, borderRadius: 10 * vw, paddingLeft: 5 * vw }}
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
                source= {{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAQAAABpN6lAAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjChULKDgIeYVVAAACzUlEQVR42u2dvU4bQRSFjyMiUYYeUph3SJM2z8Kz0CJRuUJRKjr3tHTkGdKkSJ6AHyENFZZ3s87uzt6Zc+/ce7ZDyN77zfmMvZ4VQCQSiUQikYjb/MAX9ilwk5DwgAscs0+ECSAh4Q8ucco+GSaAhIRn3OIr+4SYAJJHIdLg4UiIdPBwIkQaOZoXYgxA80JMAdC0EFMBNCvEPAANCjEfQGNC5AFoSIglAJoQYikA80JIADAthBwAo0LIAjAohDwAY0KUAmBGiJIATAhRGoB6IeoAUCxEPQBKhagLQKEQDACqhGABeBfim2cAKoRgj08Xgj06XQj22HQh2APThWAPSxeCPShdCPaIdCHY49GFYI9GFmKFVK5cRfIXN7jGb7kHZK8qXQj2MGQh7CnQjYAQv/BKX8ulQizY7boC8BFnWO+Oc3xiL2tWfmKD73jKAdDPyR6ONT7jiD3b5GQIsRr9DWv9eMEWG9zJAejHRj8mCzEfQDea+zFJiKUA+tHWj1EhpAF0o6Uf/xGiLIB+mP04IERdAN3U78eAEEwA/dTqR0cITQC6KduPnRB6AfQj348XbLH5wJ6LnEe9DXCogLsXQc6fwSvc7/8o3ggVfVKHb4U1fhjqlV4WgJY1Hkqhj8Pa1ng4ghdENK/xUEZLPw7AxhoPJfOiqLU1Hk7mZfH4YiS+GmOvX/4htFuAPUZe6cX2nNt5hX+P6w0SRfaMsYeqXnp7AFxvk3O8UbLa3UXsQQml1w3A8XZ50i117LEJpdcGwPFNUyruI3VYej4Ax7fOqig9C4Ca0jMAqCp9XQAKS18PgNLS1wGguPSlAagvfUkAJkpfCoCZ0ssDMFZ6WQAGSy8HwGjpJQCYLv1SAOZLvwRAE6XPA9BQ6ecDaKz08wA0WPqpAJot/RQATZd+DEDzpT8MwEnphwE4Kv2/AJyVvhv3/2wtEolEIpFIxGneAIiTqrM1r2/gAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTEwLTIxVDExOjQwOjU2KzAwOjAwEFFXMAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0xMC0yMVQxMTo0MDo1NiswMDowMGEM74wAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC'}}
                style={{
                  width: 8 * vw,
                  height: 8 * vw,
                  alignSelf: 'center',
                  marginLeft: 3 * vw
                }}
              />
            </TouchableNativeFeedback>
        </View>

      </View>
   )
 }
}
export default youtubeVideo;
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
   },
   fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  fullScreenIcon: {
    flex: 2,
    width: 10 * vh,
    height: 4 * vw,
  },
  trackingControls: {
    backgroundColor: 'rgba(1,1,1,0.5)',
    justifyContent: 'space-between',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center'
  },
  seek: {
    width: 70 * vh,
    flex: 14
  },
  timeLabelText: {
    flex: 3,
    color: 'white',
    textAlign: 'center',
  },
  commentSection: {
    paddingBottom: 10 * vh,
    width: 100 * vw,
    marginBottom: 10,
    backgroundColor: '#ffffff'
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
    marginBottom: 2 * vw,
    marginRight: 2 * vw,
    flex:1,
    padding: 1 * vw,
    borderRadius: 2 * vw
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
});