import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableNativeFeedback,
  Platform,
  FlatList,
  BackHandler
} from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';
import {NavigationActions, StackActions} from 'react-navigation';
import {MaterialIndicator} from 'react-native-indicators';
import firebase from 'react-native-firebase';

const screen = Dimensions.get('window');
  vh = screen.height / 100;
  vw = screen.width / 100;

class newLoadingGym extends Component {


  static navigationOptions = ({ navigation }) => ({
    header: null
  })

  constructor() {
    super();
    this.state = {
      timer: 600,
      ActiveSlide: 0,
      startTime: new Date(),
      blocks: [],
      questionIndex: 0,
      n_questions: 0,
      loadingCompleted: false,
      testCardShow: false,
      goal: [],
      subjects: [],
      activeGoal: 0,
      activeSubject: 0,
      isReady: false,
      attempted: false
    }
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  handleBackButton() {
    if(this.props.navigation.state.params.path == 'TabB' || this.props.navigation.state.params.path == 'TabB_test') {
      this.props.navigation.dispatch(StackActions.popToTop());
      this.props.navigation.navigate('HomeStack', {}, NavigationActions.navigate({ routeName: 'Home' }));
      return true;
    }
    else {
      this.props.navigation.goBack(null)
      return true;
    }
  }


  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  async componentDidMount() {
    console.log("dbidbwkdqwd: "+JSON.stringify(this.props.navigation.state.params.chapterAvailable));
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  
    if(this.props.navigation.state.params.chapterAvailable) {
      
      data = {
        "exams_package": this.props.navigation.state.params.subject,
        "exam_name": this.props.navigation.state.params.goal,
        "chapter": this.props.navigation.state.params.chapters
      }
      console.log("dlasadaknkjlkl: "+JSON.stringify(data));
      axios.post(`https://classcast-198812.appspot.com/gym/get_chapterwise_gym_data`, data)
        .then(function (response){
          console.log("sammasmlas: "+JSON.stringify(response.data));
          this.setState({blocks: response.data});
          this.setState({loadingCompleted: true});
        }.bind(this))
        .catch(function (error) {
          console.log("sammasmlaserror: "+JSON.stringify(error));
        });
    }

    else {
      data = {
        "exams_package": this.props.navigation.state.params.subject,
        "exam_name": this.props.navigation.state.params.goal
      }

      console.log("dlasadaknkjlkl: "+JSON.stringify(data));

      axios.post(`https://classcast-198812.appspot.com/gym/get_gym_data`, data)
        .then(function (response){
          this.setState({blocks: response.data});
          console.log("sammasmlas: "+JSON.stringify(response.data));
          this.setState({loadingCompleted: true});
        }.bind(this))
        .catch(function (error) {
          console.log("sammasmlaserror: "+error);
        });
    }


  }

  render () {
    console.log("sakjsbgkjbL "+JSON.stringify(this.props.navigation.state.params));
      return(
        <View style={styles.container}>
          <View style={{marginLeft:0, marginTop: 0.04 * screen.height, marginBottom: 0.02 * screen.height}}>
              <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 7 * vw, color: '#7741cd'}}> Instructions </Text>
          </View>
          <View style={styles.tncHeader}>
          <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 5 * vw, color: 'black'}}>{(this.props.navigation.state.params.goal.length+this.props.navigation.state.params.subject.length < 30) ? this.props.navigation.state.params.goal+' - '+this.props.navigation.state.params.subject: (this.props.navigation.state.params.goal+ ' - '+this.props.navigation.state.params.subject).substring(0,30)+' ...'}</Text>
            
          </View>
          <View style={[styles.tncHeader, {justifyContent: 'space-around'}]}>
            
          </View>
          <ScrollView style={{width: '100%', padding: 19 }}>
            <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 4 * vw, color: 'black'}}>{" 1: this test comprises multiple-choice questions (MCQs)"}</Text>
            <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 4 * vw, color: 'black'}}>{" 2: Each questions will have only 1 of the available options as a correct answer."}</Text>
            <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 4 * vw, color: 'black'}}>{" 3: 1 mark(s) will be deducted for every wrong answer."}</Text>
            <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 4 * vw, color: 'black'}}>{" 4: No marks will be deducted for un-attempted questions."}</Text>
            <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 4 * vw, color: 'black'}}>{" 5: You are advised not to close the App before submitting the test."}</Text>
            <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 4 * vw, color: 'black'}}>{" 6: I have read all the instructions carefully and have understood them. I agree not to cheat or use any unfair means of any for my own or someone else's advantage will lead to my immediate disqualification."}</Text>
          </ScrollView>
          { !this.state.loadingCompleted &&
            <View style={{height: 10 * vw,width: 10 * vw, borderRadius: 1.5 * vw}}>
              <MaterialIndicator color='purple'/>
            </View>
          }
          { this.state.loadingCompleted && !this.state.attempted &&
            <TouchableNativeFeedback
               onPress={() => {
                const navigateAction = NavigationActions.navigate({
                  routeName: 'ongoingGym',
                  params: {
                    blocks: this.state.blocks,
                    goal: this.props.navigation.state.params.goal,
                    subject: this.props.navigation.state.params.subject,
                    path: this.props.navigation.state.params.path,
                    test_id: this.props.navigation.state.params.test_id,
                    exams_package: this.props.navigation.state.params.subject,
                    exam_name: this.props.navigation.state.params.goal,
                    chapter: this.props.navigation.state.params.chapters,
                    chapterAvailable: this.props.navigation.state.params.chapterAvailable
                  }
                });
                this.props.navigation.dispatch(navigateAction); 
              }}
            >
              <View style={styles.nextButton}>
                <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw, color: 'white'}}>Agree and Continue</Text>
              </View>
            </TouchableNativeFeedback>
          }
          { this.state.loadingCompleted && this.state.attempted &&
            <TouchableNativeFeedback
               onPress={() => {
                this.props.navigation.dispatch(StackActions.popToTop());
                this.props.navigation.navigate('HomeStack', {}, NavigationActions.navigate({ routeName: 'Home' }));
              }}
            >
              <View style={[styles.nextButton,{backgroundColor: '#323131'}]}>
                <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw, color: 'white'}}>Already Attempted</Text>
              </View>
            </TouchableNativeFeedback>
          }
        </View>
      )
  }

}
export default newLoadingGym

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#EBEAEA',
  },
  tncHeader: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  questionHeader: {
    width: vw * 94,
    backgroundColor: '#ffffff',
    marginLeft: '3%',
    marginRight: '3%',
    marginBottom: 0.1 * vh,
    marginTop: 1 * vh,
    borderTopRightRadius: 2 * vw,
    borderTopLeftRadius: 2 * vw,
    elevation: 6,
    flexDirection: 'row',
    padding: 1 * vw,
  },
  questionContainer: {
    width: vw * 94,
    backgroundColor: '#ffffff',
    marginLeft: '3%',
    marginRight: '3%',
    elevation: 6,
    padding: 3 * vw,
    borderBottomRightRadius: 2 * vw,
    borderBottomLeftRadius: 2 * vw,
  },
  optionContainer: {
    width: vw * 80,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginLeft: '3%',
    marginRight: '3%',
    elevation: 6,
    marginTop: 1 * vh,
    padding: 3 * vw,
    borderTopRightRadius: 2 * vw,
    borderTopLeftRadius: 2 * vw,
    borderBottomRightRadius: 2 * vw,
    borderBottomLeftRadius: 2 * vw,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:  2 * vw,
    borderWidth: 1,
  },
  questionHeaderPositive: {
    marginLeft: 55 * vw, 
    backgroundColor: 'green', 
    height: 3 * vh, 
    width: 5 * vh,
    borderRadius: 1 * vw,
    justifyContent: 'center',
    alignItems: 'center',
  },
  PreviousButton: {
    marginTop: 4 * vh,
    marginLeft: 3 * vw,
    height: 6 * vh,
    width: 20 * vw,
    elevation: 6,
    backgroundColor: 'white',
    borderRadius: 2 * vw,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    height: 7 * vh,
    width: '100%',
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7741cd'
  },
  submitButton: {
    height: 4 * vh,
    width: 30 * vw,
    elevation: 6,
    backgroundColor: '#7900EA',
    borderRadius: 2 * vw,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeQuestion: {
    height: 4 * vh,
    width: 4 * vh,
    backgroundColor: '#7900EA',
    borderRadius: 2 * vh,
    marginLeft: 1 * vw,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inActiveQuestion: {
    height: 4 * vh,
    width: 4 * vh,
    backgroundColor: 'white',
    borderRadius: 2 * vh,
    marginLeft: 1 * vw,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeQuestion1: {
    height: 7 * vh,
    width: 7 * vh,
    marginTop: 2 * vh,
    marginLeft: 2 * vw,
    backgroundColor: '#7900EA',
    borderRadius: 3.5 * vh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionHeaderNegative: {
    marginLeft: 2 * vw, 
    backgroundColor: 'red', 
    height: 3 * vh, 
    width: 5 * vh,
    borderRadius: 1 * vw,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: vw * 100,
    height: vh * 8,
    backgroundColor: '#EBEAEA',
  },
  header1: {
    width: vw * 39.6,
    height: vh * 8,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header2: {
    width: vw * 60,
    height: vh * 8,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeSnapText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inactiveSnapText: {
    color: '#C385FC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  item: {
    padding: 10,
  },
  itemText: {
    color: 'white',
    fontSize: 20,
  },
  imageModal: {
    height: 30 * vh,
    width: 70 * vw,
    display: 'flex',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#73009e',
    marginLeft: 10 * vw,
    marginTop: 10 * vh,
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    height: 5 * vh,
    width: 20 * vw,
    display: 'flex',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#73009e',
    marginTop: 10 * vh,
  },
  goalContainer: {
    height: 30 * vh,
    width: 100 * vw,
    marginTop: 2.5 * vh,
    paddingLeft: 7.5 * vw,
  },
  goalWrapper: {
    position: 'absolute',
    top: 20,
  },
  goalCardWrapper: {
    marginTop: 15 * vh,
    marginLeft: 10 * vw,
    //height: 24 * vh,
    width: 35 * vw,

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
  currentConfigContainer: {
    flexDirection: 'row',
    width: 100 * vw,
    justifyContent: 'space-around',
  },
  goalImage: {
    height: 10 * vh,
    width: 10 * vh,
    // borderRadius: 5 * vh,
    marginBottom: 1 * vh,
  },
  loadingTimeIndicatorBackground: {
    height: 7 * vh,
    width: 100 * vw,
  },
  loadingTopicsHeader: {
    fontSize: 6 * vw,
    fontFamily: 'Montserrat-Medium',
    color: 'black',
    marginTop: vh,
    marginLeft: 5 * vw,
    marginBottom: vh,
  },
  topicListItem: {
    backgroundColor: 'white',
    height: 7.5 * vh,
    width: '100%',
    flexDirection: 'row',
    marginLeft: 5 * vw,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingLeft: 4 * vw,
    elevation: 10,
  },
  bullet: {
    width: 2.5 * vw,
    height: 2.5 * vw,
    borderRadius: 1.25 * vw,
    borderWidth: 0.5 * vw,
    borderColor: '#C596EC',
    marginRight: 4 * vw,
  },

})