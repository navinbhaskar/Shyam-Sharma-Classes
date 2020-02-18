import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TouchableNativeFeedback,
  Platform,
  Alert,
  FlatList,
  BackHandler  
} from 'react-native';
import SnapCarousel from 'react-native-snap-carousel';
import axios from 'axios';
import firebase from 'react-native-firebase';
import MathJax from 'react-native-mathjax';
import Modal from 'react-native-modal';
import {NavigationActions} from 'react-navigation';


const screen = Dimensions.get('window');
  vh = screen.height / 100;
  vw = screen.width / 100;

class reviewTest extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null
  })

  constructor() {
    super();
    this.optionColor = this.optionColor.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.state = {
      timer: 600,
      ActiveSlide: 0,
      startTime: new Date(),
      blocks: [],
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      questionIndex: 0,
      n_questions: 0,
      attempted: false,
      num_attempted: 0,
      modalTimeup: false,
      modalPerformance: false,
      totalScore: 0,
      currentIndex: -1,
      correctAnswer: -1,
      answer: [],
      backgroundColorOptionA: 'white',
      backgroundColorOptionB: 'white',
      backgroundColorOptionC: 'white',
      backgroundColorOptionD: 'white',
      loadingCompleted: false,
      testCardShow: false,
      activeGoal: 0,
      activeSubject: 0,
    }
  }

  handleBackButton() {
    
    Alert.alert(
          'Are you sure you want to exit?',
              '',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'Submit', 
                  onPress: () => {
                    const navigateAction = NavigationActions.navigate({
                      routeName: 'testPerformance',
                      params: {

                      },
                    });
                    this.setState({timer: 0});
                    this.props.navigation.dispatch(navigateAction); 
                }},
              ],
              {cancelable: false},
            );
    return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    console.log('snmdvkdvn: '+JSON.stringify(this.props.navigation.state.params.answer));
    this.setState({n_questions:  (this.props.navigation.state.params.blocks).length});
    //this.updateQuestions();
}

  optionColor = (option_index) => {
    try {
    if(this.props.navigation.state.params.answer[this.state.questionIndex]['option']==option_index)
      return 'red'
    }
    catch (e) {
      return 'white'
     }
     return 'white'
  }
  render () {
    console.log("asnsklasds: "+this.optionColor(1));
      return (

        <View style={styles.container}>
           <View style={styles.header}>
            <View style={styles.header1}>
              
            </View>
            <View style={styles.header2}>
            <TouchableNativeFeedback
                    onPress={() => {
                      Alert.alert(
                  'Are you sure you want to exit?',
              '',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'Submit', 
                  onPress: () => {
                    const navigateAction = NavigationActions.navigate({
                      routeName: 'testPerformance',
                      params: {

                      },
                    });
                    this.setState({timer: 0});
                    this.props.navigation.dispatch(navigateAction); 
                }},
              ],
              {cancelable: false},
            );
                      
                    }
                }

               >
              <View style={styles.submitButton}>
                <Text style={styles.activeSnapText}>Exit</Text>
              </View>
            </TouchableNativeFeedback>
            </View>
          </View>
          <ScrollView style={{width: '100%'}}>
          <View style={{marginLeft: 2 * vw,marginTop: 0.02 * screen.height, marginBottom: 0.02 * screen.height, width: '95%'}}>
                
                <FlatList
                    ref={(ref) => { this.flatListRef = ref; }}
                    keyExtractor={item => item}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data = {Object.keys(this.props.navigation.state.params.blocks)}
                    
                renderItem={({item}) => (
                  <View>
                  { this.state.ActiveSlide == item &&
                    <View style={styles.activeQuestion}>
                      <Text style={styles.activeSnapText}>
                        {this.state.ActiveSlide}
                      </Text>
                    </View>
                  }
                  { this.state.ActiveSlide != item &&
                    <View style={styles.inActiveQuestion}>
                    <Text style={styles.inactiveSnapText}>
                      {item}
                    </Text>
                    </View>
                  }
               </View>
                )}
              />
               
              </View>
           
          <View style={styles.questionHeader}>
            <Text>Question</Text>
            <View style={styles.questionHeaderPositive}>
              <Text style={{color: 'white', fontSize: 12, fontWeight: 'bold'}}>+4</Text>
            </View>
            <View style={styles.questionHeaderNegative}>
              <Text style={{color: 'white', fontSize: 12, fontWeight: 'bold'}}>-1</Text>
            </View>
          </View>
          <View style={styles.questionContainer}>
             
          <MathJax
                  html={this.props.navigation.state.params.blocks[this.state.questionIndex]['fields'].question.split('https://console.cloud.google.com/storage/browser').join('https://storage.googleapis.com').split('\\\\').join('\\')}
                  mathJaxOptions={{
                    tex2jax: {
                      inlineMath: [['{tex}', '{/tex}'], ['\\(', '\\)']],
                      displayMath: [['$$', '$$'], ['\\[', '\\]']],
                      processEscapes: true,
                    },
                  }}
                  
                  hasIframe={true}
                  style={{width: 0.9 * screen.width}}
                  enableAnimation={false}
                  scalesPageToFit={Platform.OS === 'android'}
                />
          </View>
         
          <View style={{width: vw * 94, marginTop: 2 * vh, flexDirection: 'row',}}>

            <View style={styles.activeQuestion1}>
                <Text style={styles.activeSnapText}>
                  A
                </Text>
              </View>
          
            <View style={[styles.optionContainer, { borderColor:this.props.navigation.state.params.blocks[this.state.questionIndex]['fields'].option1_iscorrect ? 'green' :  this.optionColor(1) }]}>
          <MathJax
                    html={this.props.navigation.state.params.blocks[this.state.questionIndex]['fields'].option1.split('https://console.cloud.google.com/storage/browser').join('https://storage.googleapis.com').split('\\\\').join('\\')}
                    mathJaxOptions={{
                      tex2jax: {
                        inlineMath: [['{tex}', '{/tex}'], ['\\(', '\\)']],
                        displayMath: [['$$', '$$'], ['\\[', '\\]']],
                        processEscapes: true,
                      },
                    }}
                    
                    hasIframe={true}
                    style={{width: 0.78 * screen.width}}
                    enableAnimation={false}
                    scalesPageToFit={Platform.OS === 'android'}
                  />                      
            </View>
          </View>
          <View style={{width: vw * 94, marginTop: 2 * vh, flexDirection: 'row',}}>

            <View style={styles.activeQuestion1}>
                <Text style={styles.activeSnapText}>
                  B
                </Text>
              </View>
            
            <View style={[styles.optionContainer, { borderColor:this.props.navigation.state.params.blocks[this.state.questionIndex]['fields'].option2_iscorrect ? 'green' :  this.optionColor(2) }]}>
          <MathJax
                    html={this.props.navigation.state.params.blocks[this.state.questionIndex]['fields'].option2.split('https://console.cloud.google.com/storage/browser').join('https://storage.googleapis.com').split('\\\\').join('\\')}
                    mathJaxOptions={{
                      tex2jax: {
                        inlineMath: [['{tex}', '{/tex}'], ['\\(', '\\)']],
                        displayMath: [['$$', '$$'], ['\\[', '\\]']],
                        processEscapes: true,
                      },
                    }}
                    
                    hasIframe={true}
                    style={{width: 0.78 * screen.width}}
                    enableAnimation={false}
                    scalesPageToFit={Platform.OS === 'android'}
                  />                      
            </View>
          </View>
          <View style={{width: vw * 94, marginTop: 2 * vh, flexDirection: 'row',}}>

            <View style={styles.activeQuestion1}>
                <Text style={styles.activeSnapText}>
                  C
                </Text>
              </View>
              
            <View style={[styles.optionContainer, { borderColor:this.props.navigation.state.params.blocks[this.state.questionIndex]['fields'].option3_iscorrect ? 'green' :  this.optionColor(3) }]}>
          <MathJax
                    html={this.props.navigation.state.params.blocks[this.state.questionIndex]['fields'].option3.split('https://console.cloud.google.com/storage/browser').join('https://storage.googleapis.com').split('\\\\').join('\\')}
                    mathJaxOptions={{
                      tex2jax: {
                        inlineMath: [['{tex}', '{/tex}'], ['\\(', '\\)']],
                        displayMath: [['$$', '$$'], ['\\[', '\\]']],
                        processEscapes: true,
                      },
                    }}
                    
                    hasIframe={true}
                    style={{width: 0.78 * screen.width}}
                    enableAnimation={false}
                    scalesPageToFit={Platform.OS === 'android'}
                  />                      
            </View>
          </View>
          <View style={{width: vw * 94, marginTop: 2 * vh, flexDirection: 'row',}}>

            <View style={styles.activeQuestion1}>
                <Text style={styles.activeSnapText}>
                  D
                </Text>
              </View>
          
            <View style={[styles.optionContainer, { borderColor:this.props.navigation.state.params.blocks[this.state.questionIndex]['fields'].option4_iscorrect ? 'green' :  this.optionColor(4) }]}>
          <MathJax
                    html={this.props.navigation.state.params.blocks[this.state.questionIndex]['fields'].option4.split('https://console.cloud.google.com/storage/browser').join('https://storage.googleapis.com').split('\\\\').join('\\')}
                    backgroundColor={'yellow'}
                    mathJaxOptions={{
                      tex2jax: {
                        inlineMath: [['{tex}', '{/tex}'], ['\\(', '\\)']],
                        displayMath: [['$$', '$$'], ['\\[', '\\]']],
                        processEscapes: true,
                      },
                    }}
                    hasIframe={true}
                    style={{width: 0.78 * screen.width}}
                    enableAnimation={false}
                    scalesPageToFit={Platform.OS === 'android'}
                  />                      

            </View>
            
          </View>
          <View style={{flexDirection: 'row', marginBottom: 2 * vh}}>
          <TouchableNativeFeedback
                    onPress={() => {
                      if(this.state.questionIndex > 0) {
                        this.setState({questionIndex: this.state.questionIndex - 1});
                        this.setState({ActiveSlide: this.state.ActiveSlide -1});
                        //this.updatePreviousQuestions();
                        this.setState({ backgroundColorOptionB: 'white'});
                        this.setState({ backgroundColorOptionC: 'white'});
                        this.setState({ backgroundColorOptionA: 'white'});
                        this.setState({ backgroundColorOptionD: 'white'});
                      }
                    }
                }

               >
            <View style={styles.PreviousButton}>
              <Text style={styles.text}>Previous</Text>
            </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
                    onPress={() => {
                      console.log("dsjksff: ");
                      if(this.state.questionIndex+1 < this.state.n_questions) {
                        console.log("dsjksff: ");
                        //this.updateNextQuestions();
                        this.setState({questionIndex: this.state.questionIndex + 1});
                        this.setState({ActiveSlide: this.state.ActiveSlide +1});
                        //this.updateQuestions();
                        this.setState({ backgroundColorOptionB: 'white'});
                        this.setState({ backgroundColorOptionC: 'white'});
                        this.setState({ backgroundColorOptionA: 'white'});
                        this.setState({ backgroundColorOptionD: 'white'});
                      }
                    if(this.state.questionIndex+1 == this.state.n_questions) {
                      Alert.alert(
                        'Are you sure you want to exit?',
                        '',
                        [
                          {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                          },
                          {
                            text: 'Exit', 
                            onPress: () => {
                            const navigateAction = NavigationActions.navigate({
                            routeName: 'testPerformance',
                            params: {
                              
                            },
                          });
                          this.props.navigation.dispatch(navigateAction); 
                          }},
                        ],
                        {cancelable: false},
                      );
                    }
                    }
                }

               >
            <View style={styles.nextButton}>
              <Text style={styles.text}>Next</Text>
            </View>
            </TouchableNativeFeedback>
          </View>
          </ScrollView>
          
          
        </View>
        )
}
}

export default reviewTest

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEAEA',
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
    marginTop: 4 * vh,
    marginLeft: 53 * vw,
    height: 6 * vh,
    width: 20 * vw,
    elevation: 6,
    backgroundColor: 'white',
    borderRadius: 2 * vw,
    justifyContent: 'center',
    alignItems: 'center',
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
  currentConfigContainer: {
    flexDirection: 'row',
    width: 90 * vw,
    justifyContent: 'space-around',
  },
  goalImage: {
    height: 10 * vh,
    width: 10 * vh,
    // borderRadius: 5 * vh,
    marginBottom: 1 * vh,
  },
})