import React, { Component } from 'react';
import {
  Alert,
  LayoutAnimation,
  TouchableOpacity,
  Dimensions,
  Image,
  UIManager,
  StyleSheet,
  ScrollView,
  Text,
  View,
  AsyncStorage,
  TextInput,
  ToastAndroid,
  TouchableNativeFeedback
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Modal from "react-native-modal";
import firebase from 'react-native-firebase';
import axios from "axios";
import {MaterialIndicator} from 'react-native-indicators';
import Orientation from 'react-native-orientation';


UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const brandColor = '#211482';
const MAX_LENGTH_CODE = 6;
const MAX_LENGTH_NUMBER = 20;

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: true,
      isLoading: false,
      enterCode: false,
      selectedType: null,
      fontLoaded: false,
      name: '',
      phone: '',
      phoneIN: '',
      phoneLogin: '',
      phoneValid: true,
      username:'',
      usernameValid: true,
      isModalVisible: false,
      verificationId: '',
      code: '',
      OTP1:'',
      OTP2:'',
      OTP3:'',
      OTP4:'',
      OTP5:'',
      OTP6:'',
      optVarificationLoader: false,
    };
    this.setSelectedType = this.setSelectedType.bind(this);
    this.validatePhone = this.validatePhone.bind(this);
    this.signon = this.signon.bind(this);
    this._verifyCode = this._verifyCode.bind(this);
    this.auth = this.auth.bind(this);
  }


  async auth() {
    console.log("smoslL3: "+this.state.phoneIN);
    LayoutAnimation.easeInEaseOut();
    const phoneValid = await this.validatePhone();
    if (phoneValid && this.state.phoneIN!='') {
      firebase.auth()
      .verifyPhoneNumber(this.state.phoneIN)
      .on('state_changed', (phoneAuthSnapshot) => {
        switch (phoneAuthSnapshot.state) {
          
          case firebase.auth.PhoneAuthState.CODE_SENT:
            console.log('code sent');
            ToastAndroid.show('OTP sent', ToastAndroid.SHORT);
            this.setState({verificationId: phoneAuthSnapshot.verificationId});
            this.setState({ isModalVisible: true });
            break;

          case firebase.auth.PhoneAuthState.ERROR:
            //this.setState({isReady: true});
            this.setState({phone: ''});
            ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
            console.log('verification error');
            
            break;

          case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
            console.log('auto verify on android timed out');
            //this.setState({phone: ''});
            this.setState({isReady: true});
            
            break;
          case firebase.auth.PhoneAuthState.AUTO_VERIFIED:
            ToastAndroid.show('Auto Verified', ToastAndroid.SHORT);
            console.log('auto verified on android');
            
            // Example usage if handling here and not in optionalCompleteCb:
            const { verificationId, code } = phoneAuthSnapshot;
            const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
            this.signon(credential);

            break;
        }
      }, (error) => {
        // optionalErrorCb would be same logic as the ERROR case above,  if you've already handed
        // the ERROR case in the above observer then there's no need to handle it here
        console.log('error: '+error);
        ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
        this.setState({isReady: true});
        //this.setState({phone: ''});
        // verificationId is attached to error if required
        console.log(error.verificationId);
      });
    }
  }

  signon(credential){
    firebase.auth().signInWithCredential(credential).then((result) => {
                        
                        this.setState({ isModalVisible: false });
                        result.user.getIdToken().then(function(idToken) {
                          userIdToken = idToken;
                          console.log("hsabhjsa: "+idToken);
                          axios.defaults.headers.common['Authorization'] = idToken;
                          axios.defaults.headers.post['Content-Type'] = 'application/json';
                           

                          if (result.additionalUserInfo.isNewUser) {
                              this.setState({optVarificationLoader: false});
                              this.props.navigation.navigate("UserDetails");
                            }
                          else { 
                          	console.log("hsabhjsaOO");
                            axios.get('https://classcast-198812.appspot.com/users/check_if_user_exists')
                            .then(res=> {
                            	console.log("hsabhjsa"+JSON.stringify(res.data));
	                              if(res.data.status) {
	                              	this.setState({optVarificationLoader: false});
	                                ToastAndroid.show('Please wait', ToastAndroid.SHORT);
	                                this.props.navigation.navigate("Home");
	                              }
	                              else {
	                                this.setState({optVarificationLoader: false});
	                                this.props.navigation.navigate("UserDetails");
	                              }
                            })
                            .catch(err=>console.log("hsabhjsaerror"+err))
                          }
                          
                         }.bind(this));

                          }, (error) => {
                            console.log("singon error");
                            this.setState({isModalVisible: false});
                            this.setState({isReady: true});
                            this.setState({optVarificationLoader: false});
                            ToastAndroid.show('Wrong OTP', ToastAndroid.SHORT);
                          });

  }



  validatePhone() {
    const { phone, phoneIN } = this.state;
    console.log("smoslL1: "+this.state.phoneIN);
    const phoneValid = phone.length=10;
    LayoutAnimation.easeInEaseOut();
    this.setState({phoneIN: '+'+91 + ''+ phone});
    this.setState({ phoneValid });
    phoneValid || this.phoneInput.shake();
    return phoneValid;
  }


  setSelectedType = selectedType =>
    LayoutAnimation.easeInEaseOut() || this.setState({ selectedType });

  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  _verifyCode = (val) => {
    //this.setState({code: val});
    const credential = firebase.auth.PhoneAuthProvider.credential(this.state.verificationId, val+'');
    this.signon(credential);
  }

  _onChangeText = (val) => {
    if (val.length === 6){
      this.setState({optVarificationLoader: true});
      this._verifyCode(val);
    }
  }

  componentWillMount() {
    Orientation.lockToPortrait();
    const initial = Orientation.getInitialOrientation();
  }

  componentDidMount() {
    Orientation.lockToPortrait();
  }

  render() {
    console.log("smoslL "+this.state.phoneIN);
    const {
      isLoading,
      selectedType,
      phone,
      phoneLogin,
      phoneValid,
      username,
      usernameValid,
      isModalVisible,
      OTP1,
      OTP2,
      OTP3,
      OTP4,
      OTP5,
      OTP6,
      phoneIN,
      verificationId
    } = this.state;

    let textStyle = this.state.enterCode ? {
      textAlign: 'center',
      fontSize: 5 * vw,
      fontWeight: 'bold',
      fontFamily: 'Courier'
    } : {};

    return (
      <ScrollView style={{backgroundColor: '#ffffff'}}
      contentContainerStyle ={{backgroundColor: '#ffffff'}}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1, position: 'absolute', height: SCREEN_HEIGHT, width: SCREEN_WIDTH }}>
          <Image
            style={{height: 0.4 *SCREEN_WIDTH, width: 0.4 * SCREEN_WIDTH, position: 'absolute', alignSelf:'center', marginTop: 0.4 * SCREEN_HEIGHT}}
            resizeMode={'contain'}
            source={{uri: 'data:image/png;base64,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'}}
          />
          <Modal backdropOpacity={0.6}
            backdropColor="black"
            transparent={true}
            isVisible={this.state.isModalVisible}
            onRequestClose={() => {
              this.setState({isReady: true});
              this.setState({isModalVisible: false});
          }}>
            <View style={styles.modalContent}>
                <Text style={{fontSize:6 * vw, fontFamily: 'Montserrat-SemiBold', color: 'black', marginBottom: 3 * vw, textAlign: 'center'}}> Verification Code </Text>
                <Text style={{fontSize:4 * vw, fontFamily: 'Montserrat-Regular', color: 'black', textAlign: 'center'}}> Please type the verification code sent to +91-{this.state.phone} </Text>
                <View style={{height:50, width:'100%', marginLeft:10, marginRight:10, alignItems:'center', justifyContent: 'center', marginTop: 10}}>
                  <View style={{flexDirection:'row', flex:1, marginBottom: 10 * vw}}>
                    { !this.state.optVarificationLoader &&
                    <View style={{height: .07 * SCREEN_HEIGHT, width:'60%', marginTop:2 * vw}}>
                      <TextInput
                        ref={'textInput'}
                        name={'OTP'}
                        type={'TextInput'}
                        underlineColorAndroid={'transparent'}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        selectionColor={'black'}
                        onChangeText={this._onChangeText}
                        placeholder={this.state.enterCode ? '_ _ _ _ _ _' : 'OTP'}
                        keyboardType={'numeric'}
                        style={[ styles.textInput, textStyle, { textAlign: 'center', borderBottomColor: 'black', borderBottomWidth: 3, borderRadius: 2, width: '100%', justifyContent: 'center', alignItems: 'center'} ]}
                        returnKeyType='go'
                        placeholderTextColor={'black'}
                        maxLength={6}
                        //onSubmitEditing={this._verifyCode} 
                        />
                    </View>
                  }
                  { this.state.optVarificationLoader &&
                    <View style={{height: .07 * SCREEN_HEIGHT, width:'60%', marginTop:2 * vw}}>
                      <MaterialIndicator color='black'/>
                    </View>
                  }
                  </View>
                </View>
              </View>
              
            </Modal>
          </View>
           
          { !this.state.isReady && !this.state.isModalVisible &&
            <View style={{height: 20 * vh, width: '100%', borderRadius: 1.5 * vw, alignItems: 'center', justifyContent: 'center', marginTop: 20 * vh, position: 'absolute', paddingTop: 0.25 * SCREEN_HEIGHT}}>
              <MaterialIndicator color='black'/>
              <Text style={[styles.signUpText, {fontSize: 20, marginTop: .03 * SCREEN_HEIGHT}]}> Loading...</Text>
              
            </View>
          }
          { 
            <Text style={styles.signUpText}>{this.state.isReady ? 'Start your journey': ''}</Text>
          }
          <Text style={styles.whoAreYouText}>What is your mobile number?</Text>
          <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center',}}>
            <View style={{width: '75%'}}>
            <FormInput
              refInput={input => (this.phoneInput = input)}
              icon="phone"
              value={phone}
              
              onChangeText={phone => this.setState({ phone })}
              placeholder="Enter your 10 digit Phone No."
              keyboardType='numeric'
              returnKeyType="next"
              errorMessage={
                phoneValid ? null : 'Please enter a valid phone address'
              }
              onSubmitEditing={() => {
                this.validatePhone();
              }}
            />
            </View>
           { this.state.isReady &&
             <TouchableNativeFeedback
              onPress={() => {
                this.setState({isReady: false});
                this.auth();
              }}
              >
               <View style={{marginLeft: .02 * SCREEN_WIDTH ,height: 0.14 * SCREEN_WIDTH, width: 0.14 * SCREEN_WIDTH, borderRadius: .07 * SCREEN_WIDTH, backgroundColor: '#03264c', justifyContent: 'center', alignItems: 'center',}}>
                 <Image
                    style={{height: '60%', width: '60%'}}
                    source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAdVBMVEUAAAAPh8MKjrwLjrsLjrsAgL8LjbwMjbwA//8Mi7sMjrwMjb0LjbwAgIAKjL0OjrgLjbwLjbwLjrwLjbwNlLwLjLwMjL0LjbwLjbwLjbwLjbwLjbwLjbwLjLsLjLwNjrwLjbwAqqoLjbwQj78Kjb0LjbwAAADV1Y8BAAAAJXRSTlMAEX6iWgTOmAFAmVWcAkkS7fhI9xOgPu/Q/Hnn5XjPPe4DzRB72r3D7AAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjBwwOAyXORQqqAAAA7UlEQVR42u2aS1LCQBgGBwEFEhN5K6DEx3//K1IJaNhmk6ak+wLdi5mkpupLSURERETkHzJ4GI5I//gxIp4mXMA0amZcQdYERP4MB3AFvwFYwV8AVdAGQAVFG8DchfKFLijmdMFiGfA5sMACCyywwAILLLDAAgss6FSwKrL+WF8FXF5tm21gNAWvnP9c8EYG1AWoP2JHB+zpgAMd8M4fwg/Yn44V60+phD/FvVLAv0P9+vXr13+ffvo5pl+/fv3679NPDxjKivXzIxZ8xnM7QyZ6ykWP2bg5Hz5o/PwKdtKZvn/yDNSLiIiIiHTkBAy9PZ/mV+35AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA3LTEyVDEyOjAzOjM3KzAyOjAwaW9mvAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wNy0xMlQxMjowMzozNyswMjowMBgy3gAAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC'}}
                  />
                </View>
              </TouchableNativeFeedback>
            }
            </View>
      </ScrollView>
    );
  }
}


export const FormInput = props => {
  const { icon, refInput, ...otherProps } = props;
  return (
    <Input
      {...otherProps}
      ref={refInput}
      inputContainerStyle={styles.inputContainer}
      leftIcon={<Icon name={icon} color="#03264c" size={.06 * SCREEN_WIDTH} />}
      inputStyle={styles.inputStyle}
      autoFocus={true}
      autoCapitalize="none"
      keyboardAppearance="dark"
      errorStyle={styles.errorInputStyle}
      autoCorrect={true}
      blurOnSubmit={true}
      placeholderTextColor="#03264c"
    />
  );
};

export const OTPInput = props => {
  const { icon, refInput, ...otherProps } = props;
  return (
    <Input
      {...otherProps}
      ref={refInput}
      inputContainerStyle={styles.OTPinputContainer}
      leftIcon={<Icon name={icon} color="#7384B4" size={18} />}
      inputStyle={styles.OTPinputStyle}
      autoFocus={false}
      autoCapitalize="none"
      keyboardAppearance="dark"
      maxLength={1}
      errorStyle={styles.errorInputStyle}
      autoCorrect={false}
      blurOnSubmit={true}
      placeholderTextColor="#7384B4"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 20,
    backgroundColor: '#293046',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  signUpText: {
    color: '#03264c',
    fontSize: .05 * SCREEN_WIDTH,
    fontFamily: 'light',
    textAlign: 'center',
    paddingBottom: 20,
    marginTop: .3 * SCREEN_HEIGHT,
    marginBottom: .2 * SCREEN_HEIGHT,
    fontFamily: 'Montserrat-SemiBold',
  },
  whoAreYouText: {
    marginTop: .1 * SCREEN_HEIGHT,
    color: '#03264c',
    textAlign: 'center',
    fontFamily: 'bold',
    fontSize: .035 * SCREEN_WIDTH,
    marginBottom: .01 * SCREEN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Montserrat-SemiBold',
  },
  nextPage: {
    marginTop: .02 * SCREEN_HEIGHT,
    height: .09 * SCREEN_HEIGHT,
    width: .09 * SCREEN_HEIGHT,
    borderRadius: .045 * SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b8dbc'
  },
  nextPageIcon: {
    height: '100%',
    width: '100%',
  },
  userTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  userTypeItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  userTypeItemContainerSelected: {
    opacity: 1,
  },
  userTypeMugshot: {
    margin: 4,
    height: 80,
    width: 80,
  },
  userTypeMugshotSelected: {
    height: 110,
    width: 110,
  },
  userTypeLabel: {
    fontFamily: 'bold',
    fontSize: 11,
  },
  textInput: {
    fontFamily: 'Montserrat-SemiBold',
    padding: 0,
    margin: 0,
    flex: 1,
    fontSize: 7 * vw,
    color: "black"
  },
  inputContainer: {
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#03264c',
    height: .07 * SCREEN_HEIGHT,
    marginVertical: 10,
  },

  OTPinputContainer: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(110, 120, 170, 1)',
    height: 40,
    width:40,
    alignItems:'center'
  },
  inputStyle: {
    flex: 1,
    marginLeft: .02 * SCREEN_WIDTH,
    color: '#03264c',
    fontFamily: 'light',
    fontSize: .033 * SCREEN_WIDTH,
    fontFamily: 'Montserrat-SemiBold',
  },
  OTPinputStyle: {
    color: 'black',
    fontFamily: 'light',
    fontSize: 15,
    margin:-4
  },
  errorInputStyle: {
    marginTop: 0,
    textAlign: 'center',
    color: '#F44336',
  },
  signUpButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: .05 * SCREEN_WIDTH,
  },
  signUpButton: {
    width: '35%',
    marginLeft: '35%',
    borderRadius: 50,
    height: 45,
    backgroundColor: '#749391',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginHereContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alreadyAccountText: {
    fontFamily: 'lightitalic',
    fontSize: 12,
    color: 'white',
  },
  loginHereText: {
    color: '#FF9800',
    fontFamily: 'lightitalic',
    fontSize: 12,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 5 * vw,
    paddingTop: 10 * vw,
    paddingBottom: 15 * vw,
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});