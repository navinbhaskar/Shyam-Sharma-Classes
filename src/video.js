import React, { Component } from 'react'
import {
  Alert,
  LayoutAnimation,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  BackHandler,
  Text,
  View,
  SectionList,
  TouchableNativeFeedback,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import styles from './VideoStyles';
import axios from 'axios';
import VideoPlayer from 'react-native-video';
import {Icon} from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';
import { ProgressCircle }  from 'react-native-svg-charts';
import Orientation from 'react-native-orientation';
import Slider from 'react-native-slider';

class video extends Component {


  static navigationOptions = {
    title: 'video',
    header: null,
  };

  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.renderRateControl = this.renderRateControl.bind(this);
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
      apiHit: false,
      isFullscreen: false
    };
  }

  handleBackButton = () => {
    console.log("dsnldsknldsnds");
    this.props.navigation.goBack(null);
    return true;
  };

  getTime = sec => {
    let s = parseInt(sec);
    let m = Math.floor(s / 60);
    s = s % 60;
    s = s >= 10 ? s : '0' + s;
    m = m >= 10 ? m : '0' + m;
    return `${m}:${s}`
  };

  onLoad = (data) => {
    
    this.setState({
      loaded: true,
      paused: false,
      duration: data.duration,
      back: false,


    });
  };

  onProgress = (data) => {
    console.log("jdidb:Cb "+data.currentTime/data.seekableDuration);
    if(data.currentTime/data.seekableDuration > 0.7 && !this.state.apiHit) {
      this.setState({apiHit: true});
      console.log("jdidb");
      axios.post(`https://classcast-198812.appspot.com/coursedata/storepointsfromcourseblocks`, {
        "course_id": this.props.navigation.state.params.course_id,
        "block_id": this.props.navigation.state.params.block_id,
        "points": 3
      })
      .then( response => {
          console.log("gkyyufyifSS: "+JSON.stringify(response));
        })
        .catch(err => {
          console.loG("gkyyufyifSSerror: "+err);
        })
    }
    this.setState({
      currentTime: data.currentTime,
      playableDuration: this.state.duration,
      seekableDuration: this.state.duration,
      paused: false,
      buffer: false,
      sliderValue: data.currentTime/data.seekableDuration
    });
  };
  onEnd = () => {
    //setTimeout(() => this.props.learnNext(), 100);
    this.setState({paused: true});
  };

  onBuffer = (data) => {
    console.log("jdidb:C "+JSON.stringify(data));
    this.setState({buffer: true,
      currentTime: data.currentTime});
    
  };

  onAudioBecomingNoisy = () => {
    this.setState({paused: true})
  };

  onAudioFocusChanged = (event: { hasAudioFocus: boolean }) => {
    this.setState({paused: !event.hasAudioFocus})
  };

  renderRateControl(rate) {
    //const isSelected = (this.state.rate === rate);

    return (
      <TouchableNativeFeedback onPress={() => {
        this.setState({
          rate: rate,
          showSettings: false
        })
      }}>
        <Text style={[styles.controlOption, {
          fontWeight: this.state.rate === rate ? 'bold' : 'normal',
          opacity: this.state.rate === rate ? 1 : 0.4,
        }]}>
          {rate}x
        </Text>
      </TouchableNativeFeedback>
    );
  };

  renderVideo() {
    return(

      <VideoPlayer 
        ref={(ref: Video) => {
          this.video = ref
        }}
       
        source={{uri: this.props.navigation.state.params.url}}
        style={styles.fullScreen}
        //rate={this.state.rate}
        paused={this.state.paused}
        //volume={this.state.volume}
        muted={this.state.muted}
        resizeMode={this.state.resizeMode}
        onLoad={this.onLoad.bind(this)}
        onBuffer={this.onBuffer}
        onProgress={this.onProgress}
        progressUpdateInterval={1000}
        onEnd={this.onEnd}
        rate={this.state.rate}
        resizeMode={this.state.isFullscreen ? 'stretch': 'contain'}
        onError={(error) => {console.log('videoError:')}}
        onAudioBecomingNoisy={this.onAudioBecomingNoisy}
        onAudioFocusChanged={this.onAudioFocusChanged}
        repeat={false}
        fullScreen={true}
        fullscreenOrientation={'landscape'}
      />
    )
  }
  
  componentWillMount() {
    Orientation.lockToLandscape();
    const initial = Orientation.getInitialOrientation();
  }
  

  ComponentDidMount() {
    console.log("dsnldsknldsnds");
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
    
  componentWillUnmount() {
    Orientation.lockToPortrait();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    console.log("working2: "+JSON.stringify(this.props.navigation.state.params));
  } 
  
  render() {
    //console.log("samskalas: "+this.state.sliderValue);
    console.log("working1: "+JSON.stringify(this.props.navigation));
    return (
      <View style={styles.container}>
        <StatusBar hidden={true}/>
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
       
        {
          this.state.loaded && this.state.buffer && <ActivityIndicator size="large"/>
        }
        {
          this.state.showControls &&
          <View style={styles.controls}>
            <Text style={styles.videoTitle}>{this.props.navigation.state.params.name}</Text>
            <TouchableNativeFeedback
              onPress={() => this.setState({showSettings: !this.state.showSettings})}
            >
              <Image
                style={styles.settingsIcon}
                resizeMode={'contain'}
                source={{uri: 'data:image/png;base64,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'}}
              />
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
              onPress={() => this.setState({muted: !this.state.muted})}
            >
              <Image
                style={styles.muteIcon}
                resizeMode={'contain'}
                source={{uri: this.state.muted ? 'data:image/png;base64,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'
                                              : 'data:image/png;base64,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'
              }}
              />
            </TouchableNativeFeedback>
            {
              this.state.showSettings && this.state.loaded &&
              <View style={styles.generalControls}>
                <Text style={styles.controlTitle}>Playback Speed</Text>
                <View style={styles.rateControl}>
                  {this.renderRateControl(0.5)}
                  {this.renderRateControl(0.75)}
                  {this.renderRateControl(1.0)}
                  {this.renderRateControl(1.25)}
                  {this.renderRateControl(1.5)}
                </View>
              </View>
            }
            {
              !this.state.showSettings && this.state.loaded &&
              <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '50%'}}>
                <TouchableNativeFeedback
                  onPress={() => {
                    if((this.state.currentTime - 10) > 0){
                      this.setState({sliderValue: (this.state.currentTime - 10 )/ this.state.duration });
                      this.video.seek(this.state.currentTime-10);
                    }
                  }}
                >
                  <Image
                    style={styles.playIcon}
                    resizeMode={'contain'}
                    source={{ uri: 'data:image/png;base64,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' }}
                  />
                </TouchableNativeFeedback>

                <TouchableNativeFeedback
                  onPress={() => this.setState({paused: !this.state.paused})}
                >
                  <Image
                    style={styles.playIcon}
                    resizeMode={'contain'}
                    source={{
                      uri:
                        !this.state.paused
                          ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAABfklEQVR4nO3SwU3DUBRFQRspTSDKBdqA4mLaeGxYsbWjODkzBVy/b51lAQAAAAAAAAA42MxcZuZ9ZrY5zva3eXn2+x7ezHwe+GP/+3j2+/Za733AzGzLsrzeaH5b1/Vtz8DZ79vrDAHMLffXdd31xrPft9fLPT/O/QkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHEnSGAnxtubwdsnP2+Xc4QwNcNt78P2Dj7fY9tZi4z8z4z1znO9W/z8uz3AQAAAAAAAAD89wvZ40hJ20f6WgAAAABJRU5ErkJggg=='
                          : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFGklEQVR4nO3dTahVZRTG8WdVhIQUhkGDoJmJGSmJQvQ1SYgaNIioqJBAJ9qHimIRDsJJEuWkD8iCMgqlcGBGKaSRFomgRpYK3UgylVsJEmR+3H+D3YGbnO7X2Xuvfc55fqM7e5+XtXjX2Zz77iOZmZmZmZmZmZmZmZmZmZmZTRBwB7AFOA4MAp8A92TnshoAK4ELtLcNmJ6d0SoCzAPO/0/xW84Ca4HJ2XmtZMCmUYo/3C/Aw9mZrUTAwDgaoGUnMDM7u5VgAsVvOQesA67K3oN1oIMGaDkBLAAiey82ASU0QMtuYHb2fmycSmwAKB4lXwOmZO/LxqjkBmgZBBYBl2Tvz0ZRUQO07AHmZu/RRlBxAwAMAeuBqdl7tTZqaICWP4DFwKXZe+4mlT9aAVS9xkX2S1oSEbtrXrcr9eKHqFmSdgHvAtdmh2m6XmyAlsckHQaWAZdlh2mqXhwB7XyvYizsyA7SNL18Agw3Q9LnwEbguuwwTdIvDdDyoKRDwCrg8uwwTdAvI6CdI5KeiojPsoNk6rcTYLhpkj4FNgPXZ4fJ0s8N0HK/pB+A1cCk7DB16+cR0M6ApGciYkt2kLq4AdrbKunpiPgxO0jVPALau1fSQWANcEV2mCr5BBjdUUnLI+LD7CBVcAOM3XYVj42HsoOUySNg7O6W9C09doHFJ8DE/CppRUS8nx2kU26Aznyh4kum77KDTJRHQGfulLSPLr7A4hOgPCclrZL0TkR0zZ7dAOX7SsVY2JcdZCw8Asp3q6S9wOvA1dlhRuMToFq/S3pO0vqIGMoO044boB57VYyFb7KDXMwjoB5zJH0NvAVckx1mODdAfULSEyr+U3lJUy6weATkOaBiLOzKDOETIM/Nkr4ENmReYHED5HtUiRdYPAKapfYLLD4BmqV1geWluhZ0AzTTcmBlHQt5BDTXGUkzIuKnKhfxCdBckyQtrHoRN0Cz3Vf1Am6AZqv8ypoboM+5AZrt56oXcAM029aqF/BjYHOdkXRjRAxUuYhPgOZ6oeriSz4BmurliFhex0J+fVqzHJT0pL8M6j+nJS2TNKvuV9n5BMiFpPckrYyIExkB3AB5DkhanP1OY4+A+p2StETSLdnFl3wC1AlJb0t6NiIGs8O0uAHqsVfFcb8nO8jFPAKq9ZukRZLmNbH4kk+AqgxJekPS8xFxKjvMSNwA5fP18D51UtICSbd1S/ElN0AZzktaJ2laRHTV20Ekj4BO+SVRfeqYpEci4q5uLr7kBhivc5LWSpoeER9khymDR8DYbVfxVe3h7CBl8gkwuqOSHoiI+b1WfMkNMJK/Ja1Rcdx/lB2mKh4B7fXND0a4Af5rQEXhP84OUhePgMJfklaruI3bN8WXfAJI0mZJSyOi8ls4TdTPDXBExWPdtuwgmfpxBPyp4q3eN/V78aX+OwE2qvgBqGPZQZqiXxrgoIovbXZmB2maXh8BpyUtVXHhYmdylkbq1RMASRtUXLg4mR2myXqxAfarOO7T/+e+G/TSCDglabGkOS5+g1C9IeBNYGr2Xq2Niou/B5ibvUcbQUWFHwQWAr00wnpTyYW/ALwKTMnel41RicXfDczO3o+NUwmFPw48DlT+PiOrQAeFPwe8AlyZvQfrADAwgeLvAGZmZ7cSAJvGUfhfgIeyM1uJgHnA+VEKfxZ4EZicndcqAKygeIRrZxtwQ3ZGqxhwO7CF4lP9yX//np+dy8zMzMzMzMzMzMzMzMzMzKzX/ANcwvqrHCtF+QAAAABJRU5ErkJggg=='
                    }}
                  />
                </TouchableNativeFeedback>

                <TouchableNativeFeedback
                  onPress={() => {
                    //const abc = (this.state.currentTime + 10 )/ this.state.duration;
                    //console.log("smlkdsndfk: "+abc + "||"+ this.state.sliderValue+"||"+this.state.currentTime);
                    if((this.state.currentTime + 10) < this.state.duration){
                      this.setState({sliderValue: (this.state.currentTime + 10 )/ this.state.duration });
                      this.video.seek(this.state.currentTime+10);
                    }
                  }}
                >
                  <Image
                    style={styles.playIcon}
                    resizeMode={'contain'}
                    source={{ uri: 'data:image/png;base64,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' }}
                  />
                </TouchableNativeFeedback>
              </View>
            }
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
                  console.log("samskalas: "+value);
                  this.setState({ currentTime: value * this.state.duration });
                  this.setState({sliderValue: value});
                  this.video.seek(value * this.state.duration);
                }}
              />
              <Text style={styles.timeLabelText}>{this.getTime(this.state.duration)}</Text>
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
            </View>
          </View>
        }
      </View>
    )

  }
}
  export default video;