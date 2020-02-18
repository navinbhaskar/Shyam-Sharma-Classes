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
  ToastAndroid
} from 'react-native';
import VideoPlayer from 'react-native-video';
import MathJax from 'react-native-mathjax';
import {Icon} from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';
import { ProgressCircle }  from 'react-native-svg-charts';
import axios from 'axios';
import Pdf from 'react-native-pdf';
import Orientation from 'react-native-orientation';

const screen = Dimensions.get('window');
  vh = screen.height / 100;
  vw = screen.width / 100;

class assignmentQuestions extends Component {

  static navigationOptions = {
    title: 'Test',
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      timer: 0,
      ActiveSlide: 0,
      startTime: new Date(),
      blocks: [],
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      option1_iscorrect: false,
      option2_iscorrect: false,
      option3_iscorrect: false,
      option4_iscorrect: false,
      explanation: '',
      questionIndex: 0,
      totalQuestions:1,
      questionAttempted: 0,
      correctlyAttempted: 0,
      n_questions: 0,
      attempted: false,
      modalTimeup: false,
      modalPerformance: false,
      totalScore: 0,
      correctAnswer: -1,
      backgroundColorOptionA: 'white',
      backgroundColorOptionB: 'white',
      backgroundColorOptionC: 'white',
      backgroundColorOptionD: 'white',
      loadingCompleted: false,
      showExplanation: false,
    };
  }

  loadNewQestions() {
    
    this.setState({question: this.props.navigation.state.params.url[this.state.questionIndex]['fields'].question});
    this.setState({option1: this.props.navigation.state.params.url[this.state.questionIndex]['fields'].option1});
    this.setState({option2: this.props.navigation.state.params.url[this.state.questionIndex]['fields'].option2});
    this.setState({option3: this.props.navigation.state.params.url[this.state.questionIndex]['fields'].option3});
    this.setState({option4: this.props.navigation.state.params.url[this.state.questionIndex]['fields'].option4});
    this.setState({option1_iscorrect: this.props.navigation.state.params.url[this.state.questionIndex]['fields'].option1_iscorrect});
    this.setState({option2_iscorrect: this.props.navigation.state.params.url[this.state.questionIndex]['fields'].option2_iscorrect});
    this.setState({option3_iscorrect: this.props.navigation.state.params.url[this.state.questionIndex]['fields'].option3_iscorrect});
    this.setState({option4_iscorrect: this.props.navigation.state.params.url[this.state.questionIndex]['fields'].option4_iscorrect});
    this.setState({explanation: this.props.navigation.state.params.url[this.state.questionIndex]['fields'].explanation});
    this.setState({questionIndex: this.state.questionIndex+1})
  }
  
  componentDidMount() {
    //this.props.navigation.state.params.url
    console.log("nkjndfjg: "+JSON.stringify(this.props.navigation.state.params));
    this.setState({n_questions: this.props.navigation.state.params.url.length});
    this.loadNewQestions();
  }

  render() {
    
    const source = {uri: this.props.navigation.state.params.url , cache: true};
    return (
      <View style={styles.container}>
          <View style={styles.header}>
            
            
          </View>
          <ScrollView style={{width: '100%'}}>
           
          <View style={styles.questionHeader}>
            <Text>Question</Text>
            <View style={styles.questionHeaderPositive}>
              <Text style={{color: 'white', fontSize: 12, fontWeight: 'bold'}}>+4</Text>
            </View>
            
          </View>
          <View style={styles.questionContainer}>
          
          	<MathJax
                  html={this.state.question.split('https://console.cloud.google.com/storage/browser').join('https://storage.googleapis.com').split('\\\\').join('\\')}
                  mathJaxOptions={{
                    tex2jax: {
                      inlineMath: [['{tex}', '{/tex}'], ['\\(', '\\)']],
                      displayMath: [['$$', '$$'], ['\\[', '\\]']],
                      processEscapes: true,
                    },
                  }}
                  onHeightUpdated={height => {
                    console.log("nkjnska: "+height)
                  }}
                  hasIframe={true}
                  style={{width: 0.9 * screen.width}}
                  enableAnimation={false}
                  
                />
          </View>
         
          <View style={{width: vw * 94, marginTop: 2 * vh, flexDirection: 'row',}}>

            <View style={styles.activeQuestion1}>
                <Text style={styles.activeSnapText}>
                  A
                </Text>
              </View>
          	<TouchableNativeFeedback
                    onPress={() => {
                      if(!this.state.attempted) {
                        this.setState({questionAttempted: this.state.questionAttempted+1});
                        this.setState({attempted: true});
                        if(this.state.option1_iscorrect) {
                        	this.setState({ backgroundColorOptionA: 'green'});
                        	this.setState({correctlyAttempted: this.state.correctlyAttempted+1});
                        }
                        else {
                        	this.setState({ backgroundColorOptionA: 'red'});		
                        }
                      }
                    }}

               >
            <View style={[styles.optionContainer, { borderColor:  this.state.backgroundColorOptionA }]}>
          <MathJax
                    html={this.state.option1.split('https://console.cloud.google.com/storage/browser').join('https://storage.googleapis.com').split('\\\\').join('\\')}
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
                    
                  />                      
            </View>
           </TouchableNativeFeedback>
          </View>
          <View style={{width: vw * 94, marginTop: 2 * vh, flexDirection: 'row',}}>

            <View style={styles.activeQuestion1}>
                <Text style={styles.activeSnapText}>
                  B
                </Text>
              </View>
             <TouchableNativeFeedback
                    onPress={() => {
                      if(!this.state.attempted) {
                        this.setState({questionAttempted: this.state.questionAttempted+1});
                        this.setState({attempted: true});
                        if(this.state.option2_iscorrect) {
                        	this.setState({ backgroundColorOptionB: 'green'});
                        	this.setState({correctlyAttempted: this.state.correctlyAttempted+1});
                        }
                        else {
                        	this.setState({ backgroundColorOptionB: 'red'});		
                        }
                      }
                    }
                }

               >
            <View style={[styles.optionContainer, { borderColor:  this.state.backgroundColorOptionB }]}>
          <MathJax
                    html={this.state.option2.split('https://console.cloud.google.com/storage/browser').join('https://storage.googleapis.com').split('\\\\').join('\\')}
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
                    
                  />                      
            </View>
            </TouchableNativeFeedback>
          </View>
          <View style={{width: vw * 94, marginTop: 2 * vh, flexDirection: 'row',}}>

            <View style={styles.activeQuestion1}>
                <Text style={styles.activeSnapText}>
                  C
                </Text>
              </View>
              <TouchableNativeFeedback
                    onPress={() => {
                      if(!this.state.attempted) {
                        this.setState({questionAttempted: this.state.questionAttempted+1});
                        this.setState({attempted: true});
                        if(this.state.option3_iscorrect) {
                        	this.setState({ backgroundColorOptionC: 'green'});
                        	this.setState({correctlyAttempted: this.state.correctlyAttempted+1});
                        }
                        else {
                        	this.setState({ backgroundColorOptionC: 'red'});		
                        }
                      }
                    }
                }

               >
            <View style={[styles.optionContainer, { borderColor:  this.state.backgroundColorOptionC }]}>
          <MathJax
                    html={this.state.option3.split('https://console.cloud.google.com/storage/browser').join('https://storage.googleapis.com').split('\\\\').join('\\')}
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
                    
                  />                      
            </View>
            </TouchableNativeFeedback>
          </View>
          <View style={{width: vw * 94, marginTop: 2 * vh, flexDirection: 'row',}}>

            <View style={styles.activeQuestion1}>
                <Text style={styles.activeSnapText}>
                  D
                </Text>
              </View>
          <TouchableNativeFeedback
              background={TouchableNativeFeedback.SelectableBackground()}
                    onPress={() => {
                      if(!this.state.attempted) {
                        this.setState({questionAttempted: this.state.questionAttempted+1});
                        this.setState({attempted: true});
                        if(this.state.option4_iscorrect) {
                        	this.setState({ backgroundColorOptionD: 'green'});
                        	this.setState({correctlyAttempted: this.state.correctlyAttempted+1});
                        }
                        else {
                        	this.setState({ backgroundColorOptionD: 'red'});		
                        }
                      }
                    }
                }

               >
            <View style={[styles.optionContainer, { borderColor:  this.state.backgroundColorOptionD }]}>
          <MathJax
                    html={this.state.option4.split('https://console.cloud.google.com/storage/browser').join('https://storage.googleapis.com').split('\\\\').join('\\')}
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
                    
                  />                      

            </View>
            
            </TouchableNativeFeedback>
          </View>
          { this.state.attempted && this.state.showExplanation &&
            <View style={{marginTop: 1 * vh}}>
            <View style={styles.questionHeader}>
            <Text>Explanation</Text>
            
          </View>
            <View style={styles.questionContainer}>
            <MathJax
                    html={this.state.explanation.split('https://console.cloud.google.com/storage/browser').join('https://storage.googleapis.com').split('\\\\').join('\\')}
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
                    
                  />
            </View>
            </View>
          }
          <View style={{flexDirection: 'row', marginBottom: 2 * vh}}>
            <TouchableNativeFeedback
                onPress={() => {
                  
                  if(this.state.attempted) {
                    this.setState({showExplanation: true});
                  }
                  else {
                    ToastAndroid.show('attempt the question', ToastAndroid.SHORT);
                  }
                }
              }
               >
              <View style={styles.PreviousButton}>
                <Text style={styles.text}>Explanation</Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
                    onPress={() => {

                      this.setState({totalQuestions: this.state.totalQuestions+1});
                      
                      if(this.state.questionIndex < this.state.n_questions) {

                        this.setState({showExplanation: false});
                        this.setState({attempted: false});
                        this.loadNewQestions();
                        this.setState({ backgroundColorOptionB: 'white'});
                        this.setState({ backgroundColorOptionC: 'white'});
                        this.setState({ backgroundColorOptionA: 'white'});
                        this.setState({ backgroundColorOptionD: 'white'});
                      }
                    if(this.state.questionIndex == this.state.n_questions) {
                      this.props.navigation.goBack();
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

export default assignmentQuestions;


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
    borderWidth: 2,
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