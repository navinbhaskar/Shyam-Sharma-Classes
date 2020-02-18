import React, { Component } from 'react'
import {
  Alert,
  LayoutAnimation,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  ScrollView,
  Text,
  View,
  SectionList,
  TouchableNativeFeedback,
  ActivityIndicator,
  ToastAndroid,
  Dimensions,
  BackHandler,
  TextInput
} from 'react-native';
import SnapCarousel from 'react-native-snap-carousel';
import Orientation from 'react-native-orientation';
import firebase from 'react-native-firebase';
import {NavigationActions} from 'react-navigation';
import { ProgressCircle }  from 'react-native-svg-charts';
import axios from 'axios';
import Modal from 'react-native-modal';
import {MaterialIndicator} from 'react-native-indicators';
import {Circle} from 'react-native-progress';
import RazorpayCheckout from 'react-native-razorpay';

const screen = Dimensions.get('window'),
  vh = screen.height / 100,
  vw = screen.width / 100;
   

class selectPackage extends Component {


  constructor(props) {
    super(props);
    this._renderPanel = this._renderPanel.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.storePaymentData = this.storePaymentData.bind(this);
    this.storeErrorData = this.storeErrorData.bind(this);
    this.state = {
      startBuffering: false,
      title: '',
      name: '',
      username: '',
      package: this.props.navigation.state.params.package,
      completion: 0.00,
      promocodeModal: false,
      paymentSuccessModal: false,
      paymentFailedModal: false,
      selectedPackage: 0,
      promocode: '',
      completedBlocks: [],
      blocks: [
        {
         
        }
      ]
    }
  }

  storeErrorData = (error) => {
    this.setState({ paymentFailedModal: true });
    console.log("asklaslasnads: "+JSON.stringify(error));
    const db = firebase.firestore();
    const userRef = db.collection('payment').add({
      username: this.state.username,
      status: "failed",
      course: this.state.package.filter(function (pilot) {return pilot.selected}).map(section =>  ({ "teacher_id": section.teacher_id,"course_id": section.course_id}) ),
      information: error
    }); 
  }

  storePaymentData =(data) => {
    this.setState({ paymentSuccessModal: true });
    console.log("asklaslasnads: "+JSON.stringify(data));
    const db = firebase.firestore();
    const userRef = db.collection('payment').add({
      username: this.state.username,
      status: "success",
      course: this.state.package.filter(function (pilot) {return pilot.selected}).map(section =>  ({ "teacher_id": section.teacher_id,"course_id": section.course_id}) ),
      information: data
    }); 
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

  static navigationOptions = ({ navigation }) => ({
    header: null
  })


  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    var currentUser = await firebase.auth().currentUser;                 
    await currentUser.getIdToken()
      .then(idToken => {
            this.setState({ username: currentUser['phoneNumber'].slice(3, 13) })

            axios.get('https://classcast-198812.appspot.com/users/user_data_updated')
            .then(res => {
              console.log("hsjsa: "+JSON.stringify(res.data));
              this.setState({name: res.data.name});
            })
            .catch((error) => {
                console.log("error")
            })
          });
  }

  _renderPanel = ({item, index}) => {
    
    return (
      <View style={styles.goalCardWrapper}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({selectedPackage: index})
          }}
        >
          <View
            style={[styles.goalCard, {transform: [{scaleX: 1.05}, {scaleY: 1.05}]}]}
          >
            <Image
              style={styles.goalImage}
              resizeMode={'contain'}
              source={{uri: item.thumbnail}}
            />
            {
              this.state.selectedPackage === index
              && <View style={styles.selectedCardIconContainer}>
                <Image
                  style={styles.selectedCardIcon}
                  source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAABm0lEQVR4nO3YT6uMYQDG4YOFrJCTSBKJRDp1okgpSlGUIhYWko2Ftc9gZ8knsLdSylZSpFBSUjoJIUI4nMtiRnQ8M/7M+76Pcl/bmad+9zM17zRjYxERERERERERERHxb8JGXMZ1HK7d0ylM4IXvprGudlcnsAnP/exA7bbWYQOeFsY/waLafa3C+v7Q2V5ionZfq7AWU4XxrzBZu69VWIPHhfGvsbV2X6uwCo8K499gW+2+VmElHhbGv8WO2n2twgo8KIx/h521+4bCXExi9V+eX477hfHvsavp3kZhHq72g2dwHgv+4PxS3CuM/4A9bbY3ArsL8Xex+TfOjuNO4fxH7O2if2TYXhjw7RM8PeTcEtwunPuE/V1uGBkuDLgEuITxWe9fjJuF907jYK0dI8EJvcdVyZT+lxkW4saA8Ydq7xiJ3m/3WwMu4QvO4lrhtc84Wru/EZiPcwMuYdDFHKvd3Tjsw7NfjJ/B8dqtrcEyXBky/mTtxtZhDs7oPd5+dKp2W6ewBRf1/tA8UrsnIiIiIiIiIiIi4r/0FYagSGVUJK8oAAAAAElFTkSuQmCC'}}
                />
              </View>
            }
            <Text style={styles.goalName}>
              {item.name}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  render() {
  	console.log("sdlkdsnlnd: "+JSON.stringify( this.state.package.filter(function (pilot) {return pilot.selected}).map(section =>  ({ "teacher_id": section.teacher_id,"course_id": section.course_id}) ) ))
    return (
        <View style={{width: '100%', height: '100%'}}>
        	<View style={{ height: '92%', width: '100%'}}>
	        	<ScrollView>
	            	<View style={{height: 30 * vh, width: 100 * vw, backgroundColor: 'red', alignItems:'center', justifyContent:'center', alignSelf:'center'}}>
		            	<Image
		                  style={{height: '100%' , width: '100%'}}
		                  source={{uri: this.props.navigation.state.params.package_image}}
		                />
		            </View>
		       		<View style={{width: '90%', marginTop: 5 * vh, alignSelf: 'center'}}>
	                	<Text style={{ fontFamily:'Montserrat-Bold', color: '#333333', fontSize: 5*vw, textAlign: 'center'}}> {this.props.navigation.state.params.package_text}</Text>
	                </View>
			        
	                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignSelf: 'center', marginTop: 5 * vh}}>
                  		{
                    		this.state.package && this.state.package.map((blocks, index)=>{
                    			return(
                    				<TouchableNativeFeedback
                    					onPress={() => {
                    						temp = this.state.package;
                    						temp[index]['selected'] = !temp[index]['selected'];
                    						this.setState({package: temp});
                    					}}
                    				>
	                    				<View style={{height: 75 * vw, width: 25 * vw, borderWidth: 0.5 * vw, borderRadius: 2 * vw, borderColor: '#035493', backgroundColor: blocks.selected ? '#035493': 'white'}}>
	                    					<View style={{height: 5 * vw, width: 5 * vw, borderRadius: 2.5 * vw, marginTop: 2 * vw, borderColor: '#035493', borderWidth: 0.5 * vw, alignSelf: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
	                    						<Image
								                  style={{height: '80%' , width: '80%', alignSelf: 'center'}}
								                  source={{uri: blocks.selected ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAclBMVEUAAAAAWZADVJMDU5MCVJIAUZcCVZMCVJICVJQCVJMCVZQDVJMDVJMDVJMAVZUDVJMAVZIDVJMCVJMAgIAFUpQDVJMFU5MDVJMDVJQEU5MDVJMDU5MDVJMDVJMDVJMDVJQDU5IDVZQDU5MDVJMDVJMAAAAsraAeAAAAJHRSTlMAF7biZxbTennUae3J5CTjKpVqAjKeNO+d2ehT/FX7WKJR3MKFJcXYAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAd0SU1FB+MKEwoGEWVlIf4AAAGvSURBVHja7ZnHcgJBDEQH2zjhnHPU/3+ji3JizcyuNEoHd9+X96D20GpKQRAEQRAE+XeZbWxuZfLn20S0k8xPNPjipxn88JMMVvgpBgM+0W4yP9xgjR9sUOGHGlT5gQazPapnP5lPi2Q+HSTzD48C+I33b5lj8MEHH3zwwQcffPCHOTk9O9fyNf3vYkF0qTTQfP8lX2ug5+sMLPgaAxt+v4EVv9fAjt9nYMnvMbDlyw2s+VIDDf/quv7gjcBgrrm/b1uP8g1U/HJHWgMdv9w/KA2U/FIen5ofwHkTDfqHysCk/ygMjPpXt4FZ/+s0MOyfXQam/bfDwLh/iw3M+7/QwOH+EBm43D8CA6f7i23gdv8xDRzvT5aB6/3LMHC+vycN3O//CYOA/WHUIGT/eG63tJeY/59GfoOA799nYL0/SQ3s9y+Zgcf+JjHw2f/4Bl77I9fAb//kGXjurxwD3/132sB7f54y8N+/xw0i9vcxg5D9f8Qght82iOK3DOL4dYNIfs0glr9uEM3/axDPHxpk8FcNcvi/Bln8b4M8/qdBJr+U17f3VD6CIAiCIIhHPgAfhLIszQpykAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOS0xMC0xOVQxMDowNjoxNyswMDowMHK0TPUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMTAtMTlUMTA6MDY6MTcrMDA6MDAD6fRJAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg=='
								                  								: ''
								              }}
								                />
	                    					</View>
	                    					<View style={{marginTop: 4 * vw}}>
	                    						<Text style={{fontSize: 4 * vw, color: blocks.selected? 'white': '#035493', fontFamily: 'Montserrat-SemiBold', textAlign: 'center'}}>{'₹ '+blocks.amount}</Text>
	                    					</View>
	                    					<View style={{marginTop: 4 * vw}}>
	                    						<Text style={{fontSize: 3 * vw, color: blocks.selected? 'white': '#035493', fontFamily: 'Montserrat-SemiBold', textAlign: 'center'}}>{blocks.name}</Text>
	                    					</View>
	                    					<View style={{marginTop: 4 * vw}}>
	                    						<Text style={{fontSize: 3 * vw, color: blocks.selected? 'white': '#035493', fontFamily: 'Montserrat-SemiBold', textAlign: 'center'}}>{blocks.details}</Text>
	                    					</View>
	                    				</View>
	                    			</TouchableNativeFeedback>
                    			)
                    		})
                    	}
                    </View>

		            <TouchableNativeFeedback
		            	onPress={() => {
		            		this.setState({ promocodeModal: true })
    					}}
		            >
		            	<Text style={{ fontFamily:'Montserrat-SemiBold', color: '#035493', fontSize: 5*vw, textAlign: 'center', marginTop: 5 * vh, marginBottom: 5 * vh, textDecorationLine: 'underline'}}>Have a promo code?</Text>
		            </TouchableNativeFeedback>
			    </ScrollView>
        	</View>
        	<TouchableNativeFeedback
        		onPress={() => {
				  var options = {
				    description: 'Manjushri Education Ltd.',
				    image: 'https://storage.googleapis.com/classcast_images/ic_launcher.png',
				    currency: 'INR',
				    key: 'rzp_test_i4rzqnF5QSKxQI',
				    amount: this.state.package.filter(function (pilot) {return pilot.selected}).reduce(function (accumulator, pilot) { return accumulator + pilot.amount;}, 0)*100,
				    name: 'Crash Course',
				    prefill: {
				      contact: this.state.username,
				      name: this.state.name
				    },
				    theme: {color: '#F37254'}
				  }
				  RazorpayCheckout.open(options).then((data) => {
				    // handle success
            this.storePaymentData(data);
				    console.log("paymentSuccess");
            json_data = {
              data: this.state.package.filter(function (pilot) {return pilot.selected}).map(section =>  ({ "teacher_id": section.teacher_id,"course_id": section.course_id}) )
            }
				    axios.post(`https://classcast-198812.appspot.com/teachers/add_crashcourse_enrollment/`, json_data)
		                .then(function (response){
		                	console.log("paymentSuccessEnrollmentsuccess");
		                  console.log("sdjsadjksadsds: "+JSON.stringify(response.data));
		                }.bind(this))
		                .catch(function (error) {
		                  console.log('error');
		                });
            console.log("samsladml: "+JSON.stringify(data));
				    //alert(`Success: ${data.razorpay_payment_id}`);
				  }).catch((error) => {
				    // handle failure
            this.storeErrorData(error);
				    //alert(`Error: ${error.code} | ${error.description}`);
				  });
				}}
        	>
			    <View style={{ height: '8%', width: '100%', backgroundColor: '#035493', alignItems: 'center', justifyContent: 'center'}}>
			    	<Text style={{ fontFamily:'Montserrat-Bold', color: 'white', fontSize: 5*vw, textAlign: 'center'}}> Join for ₹{this.state.package.filter(function (pilot) {return pilot.selected}).reduce(function (accumulator, pilot) { return accumulator + pilot.amount;}, 0)} </Text>
			    </View>
			</TouchableNativeFeedback>
			{
        <Modal
          backdropOpacity={0.6}
          backdropColor="black"
          transparent={true}
          isVisible={this.state.promocodeModal}
          onRequestClose={() => {
            this.setState({promocodeModal: false})
          }}>
          <View style={[styles.tncModal]}>
          	<Text style={styles.tncHeadingBig}>Have a referral code?</Text>
          	<View style={{flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.6)', marginTop: 2 * vh, alignItems: 'center', justifyContent: 'center'}}>
	          	<TextInput
                  style={{ height: 15 * vw, width: '70%', borderColor: '#035493', borderWidth: 0.5 * vw, borderTopLeftRadius: 2 * vw, borderBottomLeftRadius: 2 * vw, fontFamily: 'Montserrat-Bold', fontSize: 3.5 * vw, letterSpacing: 2, padding: 2 * vw }}
                  onChangeText={(text) => {
                    this.setState({promocode: text});
                  }}
                  value = {this.state.message}
                  placeholder='Enter your code here'
                  placeholderTextColor= 'grey'
                />
                <TouchableNativeFeedback
                	onPress={() => {
                		ToastAndroid.show('Invalid Promo Code', ToastAndroid.SHORT);
                	}}
                >
                <View style={{ height: 15 * vw, width: '25%', borderColor: '#035493', borderWidth: 0.5 * vw, borderTopRightRadius: 2 * vw, borderBottomRightRadius: 2 * vw, backgroundColor: '#035493', justifyContent: 'center' }}>
                	<Text style={{fontFamily: 'Montserrat-Bold', fontSize: 4 * vw, color: 'white', alignSelf: 'center'}}>Apply</Text>
                </View>
               	</TouchableNativeFeedback>
            </View>
          </View>

        </Modal>
      }

      {
        <Modal
          backdropOpacity={0.8}
          backdropColor="black"
          transparent={true}
          isVisible={this.state.paymentSuccessModal}
          onRequestClose={() => {
            this.setState({paymentSuccessModal: false})
          }}>
          <View style={[styles.tncModal2,{ alignItems: 'center'}]}>
            <Image
              style={styles.paymentStatusIcon}
              resizeMode={'contain'}
              source={{uri: 'data:image/png;base64,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'}}
            />
            <Text style={[styles.tncHeadingBig,{fontFamily: 'Montserrat-SemiBold', textAlign: 'center'}]}>Payment Successfull</Text>
            <Text style={[styles.tncHeadingBig,{fontFamily: 'Montserrat-Regular', textAlign: 'center', fontSize: 4 * vw}]}>Your Payment was Successfull. You can check your course in Crash Course section on Home Page</Text>
            <TouchableNativeFeedback
              onPress={()=>{
                this.setState({paymentSuccessModal: false});
                this.props.navigation.navigate('Home')
              }}
            >
              <View style={{backgroundColor: '#02ADEE', marginTop: 2 * vh, alignItems: 'center', justifyContent: 'center', padding: 2 * vw, borderRadius: 2 * vw}}>
                <Text style={[styles.tncHeadingBig,{fontFamily: 'Montserrat-SemiBold', textAlign: 'center', fontSize: 4 * vw, color: 'white', alignSelf: 'center', marginBottom: 0}]}>Go To Home</Text>
              </View>
            </TouchableNativeFeedback>
          </View>

        </Modal>
      }

      {
        <Modal
          backdropOpacity={0.8}
          backdropColor="black"
          transparent={true}
          isVisible={this.state.paymentFailedModal}
          onRequestClose={() => {
            this.setState({paymentFailedModal: false})
          }}>
          <View style={[styles.tncModal2,{ alignItems: 'center'}]}>
            <Image
              style={styles.paymentStatusIcon}
              resizeMode={'contain'}
              source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAG/AAABvwBV2Eo/wAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAABmISURBVHja7Z17VJVV3sfHyx+9/hEKqeAdQREQBUW8pJTmFDNTWZO9Nb66HN6Vla84pYw1ON2mwCabMdOpRs1h3rfRVuMtUQyyVBIxVBABFURBRNQCTPDC9Zz97o2b0wm5nHN4zvM8e+/vXuu7Vsu4HJ5nfz7PZe/92z8jhPwMETfVv/5Fdxpfmiia+TQxNHE0K2jW0CTSbKVJpcmgyaMpoamkqeep5P+Wx78mlX9PIv8ZK/jPjOG/I4r/zu44B2IHB0Ec0D1oImjm0cTTbKHJpamlIQalln+GLfwzzeOf0QPnDAJAXAO9J80kmqU062nSaK4YCLmrucI/+3r+t7C/qSfOMQSA3HkLH0YTS5NMUyMg7I6mhv+NsfxvxiMEBKAk9EH8eXobTZXEwHeWKn4M2LEIQt+AAGQF3odmAc1mmssKA99ZLvNjxI6VD/oOBCAy9L1o5tCk0DQBbqfTxI8dO4a90KcgABGg70YznQ+f1QBiTd8dJPJj2w19DQIwG/gBNAk0pYDV7SnlxzoAfQ8CMBJ6L5pFNJmA0rBk8nPghT4JAegFvh/NBj6DDhCaI/X8nPihj0IA7gI/mGYTXuiZ/sUhO0fB6LMQgFbgh9PsoLECMGFi5ecsHH0YAnAV/Ei+KAZAiR12DiPRpyEAR8FnK90OAhzpws5pFPo4BNAe+DNosgCK9GHneAb6PATQAr43f3EEONQKO+feEIC64PegWUxTDRiUTTXvAz0gALXgn0iTDQAQHtYXJkIA8oPvSbMOQ3pIO0OHrG94QgByLtKJpqlAR0c6SQXvK90gADngD6FJR8dGnAzrMyEQgNjwx2DOPtLFNQYxEIB44PfmpabQiREtwvpSbwhADPgn0BSj0yIah/WpCRCAueFfQtOAzoq4KaxvLYEAzAd+H5qd6KCITmF9rQ8EYA74J6MUF2JQabLJEICxY/vLaBrRGRGD0sj7YDcIQF/478JbfsRkowR3QQD6bZJ5AJ0OMVkOiLgpqohLd3PQ2RCTJke0JcYiwe+P8X1EkPkC/hCAtvCPo/kOnQsRJKyvjoMAtCvVhW22EBG3M5sBAXQN/tk0dehMiKBhfXc2BOAa/AtpLOhEiOBhfXghBOAc/MvRcRDJshwCcPzKjw6DyJiFEEDnz/y47UdkfhyYDQG0/7YfL/wQFV4MzoAA7hznx1AfotIQ4TgI4McZfpjkg6g4WchfaQHwuf2Y3ouoPG3YW0kB8FV9WNiDYAGRgasIjVzPjyW9CPLjUuK7lBAAr+SDYh4IcmdRkW4qCGAZTjaCtJllUguAF/BEDT8Eab/G4GQpBVB9u3Q3qvciSOfVhvvIKADU7UcQx7JTKgFU396xBycWQRzPEikEUH17rz5s14UgzoUxM0FoAVTf3qUXM/0QxPWZgr1FFgDG+xGki/MDhBQA/eAxOHkIoklihBIA/cAhNPU4cQiiSRhLIUIIgE/1TcdJQxBNk+6OqcLuEEA0ThaCuCXRphYA/YCeNBU4UQjiljC2PM0sgHU4SQji1qwzpQDoB5tIY8UJQhC3hjE20VQCoB+oB002Tk6rPPkwqXlmLrkRG0OuL4wm1U/PwjFBtAhjrYeZBLAYJ4UB/wi5mfA6qd+TRCyXygmxWknrZq2+RhrS08ittatIzW+fwjHjYYKsXf8BqU9JJo2Zh0nTmQLSmJtDGtL2kbrtn5Gb8a9CoD/NYlMIoPp2Yc9qpU/GE78kt9b8hVi+u0ycada6WlK39VNSM3e2msftqUdJ7ca/35alI62hnjR+e6j5jgoCaGbO2wwC2KT0lev5aNJUfJZ0pVmv19Ar3GtKHbdbq1cSS2WFiwfMShoOpzc/XikugU2GCqD69m4+yp6Am6/HEWtNNdGk0U5d969EJd6LsEckTQ5ZVSW58fKLqktghpECyFL1wN96N4GQpiaidav/Ype0x6xmzq+bn+s1bfSx4NbKeJUFkGWIAOgvjgL87mnsCikj/E2n8t1zwOi5YOdEYQlEGSGAg4Dffa1+9+eAHxJwNAd1FQD9hZGA3/2tftcOwA8JOJpIPQWQCvh1kkDSdsAPCTiSVF0EQH9ROODXWQKfbwX8kIAjCddDADsAvwES2LEF8EMCnWWHWwVAf0GwSgt+zAJ/S2NTYgG/8xKoePgBlRYKBbtTAJsAv8ES2Pop4HdmshA9h0d/O59ceGAqZgd2RQD0B/vRNAF+E0jg35sBvzMSaGxslkDZzGkqCIAx6ucOAWwA/CaSwGf/AvyQQHvZoKkA6A/0qlagyi+bUioC/DYJfPoJ4IcE2qsi7KWlABbJDj9bVMLmlYvW6jb/H+B3UgKHHntMBQks0lIAmTIfLLaslK0sE7UZsYpQRPhtQ6pVVWRvWKjsEsjURAD0BwXIfvVna8tFb3Wf/APwO9F+OHGCJN3jJbsEArQQQILUt/6xMW2W7hKx1f7vRsDvRDv63HNkp2cfmSWQ0CUBVN/e5adUZgGwElMytdp/bgD8DrYb58+THV5eMkuAsdutKwKYLvXt/9OzhHzx16kEEtcDfgfboSefJNvuvltmCUzvigASpS7pFf8qkbWxYpuAv/N2dt26ZgFILIFElwRAv7EXTY3MAmBz62VutR9/BPg7adfPnrUJQFIJMIZ7uSKAOdK//U/bR2RvrNY+4O9gXoDFQrZ7esougTmuCCBFdgFoXqDSlD3cSmrXrQX8HbQ9o0b9RAASSiDFKQHQb/BRYeEP231GicYk8NEawN9O+3rq1DsEIJkEGMs+zghggQoLf9gWVMo0KoFbH64G/G20lDFj2hSAZBJY4IwANqsgALYPnVKNSeBv7wH+Vu3z/v3bFYBEEtjsjAAuqyAA9oJMucYksHYV4OetrqKiQ/glksBlhwRAvzBImX39FkYTJRuTwJq/KA8/a2XbtjkkAEkkEOSIAGJUKqTo8M60Mkrg/XeVhp+1YwsXOiwACSQQ44gAtqkkADZjTtlGJWApL1P2z2+8eZPs8vV1SgCCS2BbhwKgX9CdpkqpUspPPer6NtVoQrfT777rNPyCS4Cx3b0jAYQpueXX6pWgQbFWf/UqSRo0yGUB3JaAp4gSCOtIALGq7rCq1Z71aAI8+Vgs5NDs2V2CX2AJxHYkgGRlt1h+8mE1pgajkfw33tAEfkElkNymAOj/6Cn76j/MgkM7t2GDpvALKAHGeM+2BDBJZfghAfmb/dp/xSUwqS0BLIUAIAFp4f/oI7fCL5gElrYlgPWAHxKQsRV98IEu8AskgfVtCSAN4EMCsrUza9fqCr8gEkhrSwBXAD0kIBX8779vCPwCSODKTwRA/8EDsEMCMrXC994zFH4BJOBhL4AIgA4JyNIKVq0yBfwml0CEvQDmAXJIQIbWlfn9iklgnr0A4gE4JCA8/O+8Y0r4TSqBeHsBbAHckIDI7dTbb5safhNKYIu9AHIBNiQgLPwJCULAbzIJ5DYLgNcAqAXUkICI7eRbbwkFv4kkwJjvzgTgC5ghARGb1qv6FJSALxNAFECGBERrea+9JjT8JpFAFBPAfEAMCQgF/6uvSgG/CSQwX7kqwJCA2C33j3+UCn6DJRDDBBAHeCEBEdqJuDgp4TdQAnFMACsALiRgevhffllq+A2SwAomgDWAFhIwc8tZtkwJ+A2QwBomgEQACwmYslmt5PjSpUrBr7MEEpkAtgJWSMCM8Ge/+KKS8LckycvtEtjKBJAKUCEB08H/u98pDb9OEkhlAsgApJCAmeDPWrwY8OsjgQwmgDwACgmYgn2LhWQtWgTo9ZNAHhNACeCEBMwAv7NbdUMCXU4JE0AlwIQEjIb/6HPPAXL9JVDJBFAPKA2SQMEp0E+f+Y8++yzgNkYC9RAABGBoKy8vJ+kvvACwjZFAPR4B8AhgWLt48SI5depUc9Ix7GeEBCrxEhDwG3DXb/0J/DYJ4E7AJQlc/Pm0Lr0ExDAg4DccfpsEFJ/9p7ME8jARCPDrCn9ZWVm78NsksGQJwNZHAhmYCgz4TQU/JKCrBFKxGAjwmw5+mwQUXQmoowS2Yjkw4Dcl/JCALhJIREEQwO9W+C9cuOAy/DYJxMYCbPdIYA1KggF+U8Nvk8Dvfw+wtZfAChQFBfymh98mAcVKg+kggTiUBQf8msNfWlqqOfw2Cbz0EsDWTgIx2BgE8AsDv00CilQI1kEC87E1GOAXCv6WHPrDHwB21yUQhc1BAX+Xm8Vi0RV+252A5BuF6CABX2wPDvi7DP/58+d1h992J7B8OcB2bRVhffP24PQcMgnkAmjALxr8NglIul+gO7Nv6OAaxn6LALYAasAvIvw2CbzyCsB2IodG+hXaCyAeYAN+UeG3SUCybcPdmWMhgbvsBTAPcAN+R+EvKSkxHfw2Cbz+OgB3IPkTQt+wF0AEAAf8osPfkow33gDknaRs5rT77QXgAcgBvwzw2+4E/vQngN5Okvv1Zf3awyYALoErgB3wt9WampqEgt92J/DmmwC+jewfNqSuhXt7AaQBeMDfFvzFxcXCwW+TwFtvAfpWOTxqRFlbAlgP6AG/TPDbJBAfD/Dtcjx09IG2BLAU4AN+2eC3SSAhAfDzFEwOf68tAUwC/IBfRvhtEnj7bQiApvzB+6a3JYCeNDWAH/DLCH9LDisugdQB3hbG+h0C4BJIVlYATz5MGnNzlIf/3Llz0sLfkjSFdyA6NNKv2J751gKIVVUA9XuSlIa/sbFRCfhbkhoVpeoLwH90JIAwFeG/tXol4FcIfpaT2dlkx4ABSsG/3eNuUnL/lMiOBMBqA1QpJYCnHiWWygrArxD8LTmoWEGRLwf6NDLG2xUAl8A2lQRQu/HvysJfV1FBiouKlIS/Obm55PMhQ5QRQEaAf2Fr3tsSgFJVgi2XypWEv/bSJfLl+PFkT3g4KcjPV1YCX/3mN8oIICds9IeOCCBIFfivL4xWEv5b5eUkNSzM1jH2UBEUKiqBYxs3KvL870FKZ9wb3qkAuAQuK3H7v/4DNeEPDb2jg+yhQlBRAuxloAoC2DtoQENbrLcngM1KDP2lJKsF/8WLJGXs2HY7iaoS2N63rwrP//nOCGCBCgJozDysDPw3y8pIypgxna8Vp3cHqkkgKTBQegHkhY9d6YwAfGiaZBdA05kCNeC/cIGkhIQ4XjCC3iWoJIHk8HCp4d/d9x5yddZDAxwWAJdAivR3AApM/b1ZWkq+GD3a+aox9G5BFQns9POTfP2/f0l7nHckgDmyC6AhbZ/U8N84f558ERTkeukoRSSwvU8fqQVwamLYclcE0Ev21YF12z+TF/6SErJHg2fbZProILUEjh2TGv4vvPuz1X+9nBYAl0CizAK4Gf+qnPAXF5M9o0ZpV0SSPkLIKoHsxESpBfBt4IjsjhjvTADTpX4MeHoWIQ31UsF//exZTeGXXQJ7Z82S/PZ/3NyuCKAbTanULwK/PSQP/EVFJDkgwH3lpJkE8vKkgb/gxAmy3dNT5sU/bAPQbi4LgEsgQWYB3IiNYZvbCw9/zZkzJHnkSPcPKQUHkzOSSCBj2TLJb/9H7u2Mb0cEECD9aMDhdLHhLywkySNG6DeuHBQkvAQKjx8n23r3lnrt/8mI0KldFgCXQKbUtQCfmUusVZVCwl99+jTZ7e+v/+SSwEBhJVBAj1lqZKTUV/+vhwy65gjbjgpgkex3ATdeflG4F4LVtDPvNnASi4gSOE3hT3/+eQWW/ob8TUsBeNHUS18abGU8q4wpBvwnT5Ldw4cbP8101ChhJMDgz1Jgk5AUH28rY1YzAXAJbFCiPuC7CaaXwLX8fLLL19c8c80FkEAz/IpsDpI9NvgbR7l2RgB+KiwQMrsErlHQdg0bZr4FJwEBppWASvDvuseLXPx5ZJDmAuAS2KRMpWATSuBabq4p4bdJYORI00lAJfj5zL9cZ5h2VgDBNFZIQP/2Q04O2TV0qPmvQCaSgGrw7+jdmxROCZ/mNgFwCexQas8AE0jgh+PHSZJA1Wt3jRhhuARUg5/lG79h553l2RUBhCu3cYiBErialUWSBg8W71mUSqDIIAmoCD/f9ec/3S4ALoFUFSVg1VkCV48dI0mDBon7QsrfX3cJqAr/V4MHVrrCsqsCiFRNACcjwsi38+YRa2OjLvBXHTkiNPw2Cfj5kaLcXMDv5hwLCfwf3QTAJXBQJQF8/6sHyBfe/XSRQFVmJkkaOFCeoSkdJKAy/PuHDalwleOuCCBKtbsAPSRQefgw2SnhppXulIDK8LMNPwomj/9v3QXAJZClrATmziVNtbWawv99WhrZ6eMj7ySV4cNJ0YkTmN6rbcHP77vCcFcFMEPF7cRbJLBv+vTmPfa0aGfXrZO6OIVtrLpvX1L41VfaLOktKCAHo6OVhX+nZx9yfvqUxw0TgGqzA9uSAKvAU56U5HJREbZV15FnnlGu82b/9a/kDAXYVfiLjhwhKZMnKws/y5HggONd5VcLAXjTVKssgeb111OnNovA0ccCVrsv56WXmq+IqnbgzwcMIHmJieQMvY139Ha/6OhR8s2cOUqDzzf7sNCr/1DDBcAlsFhFAbSWQHOn7t+fpD/xBClYtYpc+Oyz5uf6KtppL+3eTYo3biTHly51aIsu5caxZ84kuR9/TAr372+GvCg/v/l9wZmMDHKaHrvMuDiyU6DZkDpc/T/Rgl2tBNCDJhsSQMdE9Fjv3/8Wvfr3NI0AuAQmqrRQCBJAjEpm0MhnteJWMwFwCaxTVQCQAKLTgp88LZnVWgCeNBWQACSAaJ89/fs1FUweP9C0AuASiFZZAJAA4q7kjh/zZ615dYcA2G5C6ZAAJIBol4wAv0ud7fJjCgFwCYSoUEUYEkD0ufXvay2bOS3CHay6RQBcAjGqC+BHCfRHR0ZcTl742PfdxanbBMAlsA0SgAQQ13PQ3/ecOxl1twB60xRDApAA4tJ030Z69R8orAC4BCbQNEACkADiTIVfDzbdN9rdfLpdAFwCSyAASABxqr7/v/VgUxcBcAnshAAgAcSh2X6lenGppwD60JRCAJAA0n5SB/jUF02N8JZOAFwCk2kaIQBIALkzSV6e5PSkcY/ryaSuAuASWAb4IQGkdXHP5vH+9XrzaIQAumF+ACSAtC7wMSrfHVN9TScALoG7aA4AfkgAYXX9B1d898sZ/2EEi4YIgEvAgyYH8EMCar/0876ZO37MAKM4NEwAdgVFMVMQElAy9Dw3UPgDjWTQUAFwCfjTfAf4IQGVktyvbxOF/16j+TNcAFwC42hqAD8koEJ23eNlpfDPMgN7phCA3S5DdYAfEpB7Nx9PcmJcyAKzcGcaAXAJzKaxAH5IQMqNUPr0ZvC/YibmTCUALoGFAB8SkHEX35yw0WvNxpvpBMAlsBzgQwIywZ89NvhTM7JmSgHY3QngcQASEHxdf28G/4dm5cy0ArB7J4AXg5CAsC/8csLM9cwvlADsRgcwRAgJCDbUdw8b6nvG7HyZXgB28wQwWQgSEGYHn/wJoY+IwJYQArCbMYhpw5CA2ef215+aGDZRFK6EEYDd2gEsIIIETJmvBg+8fnrSuBEiMSWUAOxWEWIpMSRgsiW9Q74vmhrRTzSehBOAXT0BFBWBBEwxxs+KeRi1nl9JAdhVFlqGGoOQgIGLekj+hNB1RlTyUV4ArQqNotowJKBr9g4aUFc4ZcKjovMjvADsSo5j3wFIQJekjxheXDrj3n4ysCOFAFrtQIRtyCABt63mOxYS+IlMzEglALu9CDFfABLQenJPw/HQ0U/Jxot0ArDblRijBJCAZlt0u3uXXgjAPSKIoamHBCAB14p29rPmTwhdLTMjUguASyCEJh0SgAScGdv/NnDExfIH7wuXnQ/pBWA3ZyCapgISgAQ6SoqPd9PJiLA3RR7bhwDaF4EnDZu4YYUEAHvrq35GgH/W+elTvFViQikB2IlgIk02JADwW3bnOR4a/F8qsqCkALgEetAspqmGBFQd2utrOTp61D/pVb+nqhwoK4BWS4w3QQJqzeHPGhN0tPzB+war3v+VF0Cr0mNZkIDMM/n6EHrFv3Tpoft/hT4PAbQngiiag5CATJV52Qs+v3J6q/80+jgE4KgIImlSIQGx3+ynDR966fSkcQAfAnBZBOE0O1QYOpRFAqwcN73iF52aGPYI+jAEoJUIgvnLwiZIwKxTd/s3v9wrmzktHH0WAnCXCPxoNsi8xqDiYbEksH/YEMvJiLCUHx57yB99FALQSwReNItoMiEBY7bcSh8xnBXijGfnAn0SAjBSBgE0CbKVJmMSSPHpb6qXevuHDa6lt/lJ5yIn4TYfAjDloqPpNImybGdmtAS2e9xN9g0d3JQ9NvhQ6Yx7Z6mySAcCEF8GvWjm0KSI/uLQCAl8PWSQ9Xho8KkLD0xlu0T3Qp+CAESWgQ/NAprNNJchgbaH7g74Dq07FhKYRa/0L7Fjhr4DAcgqhCBerYiVLatSUQI7Pfsw4Bso8LkFk8e/c3XWg6PRNyAAFWXQnSaMJpYm2ezvDlyVAJuHf8B3SCMF/nTB5PDVVY8+OJ797egDEADyUyH0pJlEs5RmPU0azRVRJMBA3ztoABuiq6Wwl+SFj/3yXOSkP9Mr/BT2t+EcQwCI65uiRtDMo2Fj31tocmlqjZLAN37DLIdG+lVljQnMyZ8Qurnk/ikvXHs8ihVb8cA5gwAQ/R4hfPkqxvn83UIczQqaNXxIcitf2JRBk0dTQlPJZzPW8/8u4f8vg3/tVv69a/jPiuM/ez7/Xb64hRc//w/rnx9a5LtnPQAAAABJRU5ErkJggg=='}}
            />
            <Text style={[styles.tncHeadingBig,{fontFamily: 'Montserrat-SemiBold', textAlign: 'center'}]}>Payment Failed</Text>
            <Text style={[styles.tncHeadingBig,{fontFamily: 'Montserrat-Regular', textAlign: 'center', fontSize: 4 * vw}]}>Your transaction has failed. Please go back and try again.</Text>
            <TouchableNativeFeedback
              onPress={()=>{
                this.setState({paymentFailedModal: false});
              }}
            >
              <View style={{backgroundColor: '#02ADEE', marginTop: 2 * vh, alignItems: 'center', justifyContent: 'center', padding: 2 * vw, borderRadius: 2 * vw}}>
                <Text style={[styles.tncHeadingBig,{fontFamily: 'Montserrat-SemiBold', textAlign: 'center', fontSize: 4 * vw, color: 'white', alignSelf: 'center', marginBottom: 0}]}>Close</Text>
              </View>
            </TouchableNativeFeedback>
          </View>

        </Modal>
      }
        </View>
    
  );
  }
}
export default selectPackage;


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
  goalCardWrapper: {
    marginTop: 2.5 * vh,
    height: 24 * vh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalCard: {
    height: 22 * vh,
    width: 22 * vh,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    borderRadius: 2 * vw,
  },
  tncModal: {
   height: 30 * vh,
   width: 90 * vw,
   backgroundColor: 'white',
   borderRadius: 1.5 * vw,
   paddingTop: 5 * vh,
   paddingLeft: 7.5 * vw,
   paddingRight: 7.5 * vw,
   paddingBottom: 3 * vh,
 },
 tncModal2: {
   height: 80 * vw,
   width: 80 * vw,
   alignSelf: 'center',
   backgroundColor: 'white',
   borderRadius: 1.5 * vw,
   paddingLeft: 7.5 * vw,
   paddingRight: 7.5 * vw,
 },
 tncHeadingBig: {
   fontSize: 5.5 * vw,
   color: 'black',
   fontFamily: 'Montserrat-Bold',
   marginBottom: 2 * vh,
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
  paymentStatusIcon: {
    height: 25 * vw,
    width: 25 * vw,
    marginTop: -12.5 * vw,
    marginBottom: 5 * vw
  },
  selectedCardIconContainer: {
    position: 'absolute',
    height: 2.5 * vh,
    width: 2.5 * vh,
    top: 0,
    right: 0,
    margin: vh,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
    borderRadius: 2 * vh,
  },
  selectedCardIcon: {
    height: 3 * vh,
    width: 3 * vh,
    backgroundColor: 'green',
    borderRadius: 1.5 * vh

  },
  goalImage: {
    height: '100%',
    width: '100%',
    borderRadius: 2 * vw,
  },
  goalName: {
    fontSize: 3.35 * vw,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'white',
    padding: 4,
    borderRadius: 100,
    width: '85%',
    position: 'absolute',
    bottom: 2 * vw,
    textAlign: 'center',
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
