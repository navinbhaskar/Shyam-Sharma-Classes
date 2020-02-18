import React, { Component } from 'react'
import {Dimensions, Image, Text, TouchableWithoutFeedback, Platform, View, ScrollView, TouchableNativeFeedback, BackHandler, StyleSheet, FlatList, Alert} from 'react-native'
import SnapCarousel from 'react-native-snap-carousel';
import axios from "axios/index";
const screen = Dimensions.get('window');
import {NavigationActions} from 'react-navigation';
import MathJax from 'react-native-mathjax';
import Modal from 'react-native-modal';
import firebase from 'react-native-firebase';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';


vh = screen.height / 100;
vw = screen.width / 100;

class ongoingChallenge extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Select Topic',
    header: null
  })

  async loadQuestions() {
    
    await axios.get('https://classcast-198812.appspot.com/challenge/fetchchallengequestions/'+ this.props.navigation.state.params.challenge_id)
    .then(function (response){
      this.setState({blocks: response.data  });
      
      this.setState({loadingCompleted: true});
      this.setState({n_questions: this.state.blocks.length});
      this.updateQuestions();
    }.bind(this))
    .catch(function (error) {
      console.log("error");
    });
  }

  updateQuestions() { 
    this.setState({attempted: false});
    this.setState({question: this.state.blocks[this.state.questionIndex]['fields'].question});
    this.setState({option1: this.state.blocks[this.state.questionIndex]['fields'].option1});
    this.setState({option2: this.state.blocks[this.state.questionIndex]['fields'].option2});
    this.setState({option3: this.state.blocks[this.state.questionIndex]['fields'].option3});
    this.setState({option4: this.state.blocks[this.state.questionIndex]['fields'].option4});
    this.setState({option1_iscorrect: this.state.blocks[this.state.questionIndex]['fields'].option1_iscorrect});
    this.setState({option2_iscorrect: this.state.blocks[this.state.questionIndex]['fields'].option2_iscorrect});
    this.setState({option3_iscorrect: this.state.blocks[this.state.questionIndex]['fields'].option3_iscorrect});
    this.setState({option4_iscorrect: this.state.blocks[this.state.questionIndex]['fields'].option4_iscorrect});
    
    if(this.state.blocks[this.state.questionIndex]['fields'].option1_iscorrect==1) {
        this.setState({correctAnswer: 1})
      }
      else if(this.state.blocks[this.state.questionIndex]['fields'].option2_iscorrect==1) {
        this.setState({correctAnswer: 2})
      }
      else if(this.state.blocks[this.state.questionIndex]['fields'].option3_iscorrect==1) {
        this.setState({correctAnswer: 3})
      }
      else {
        this.setState({correctAnswer: 4})
      }
  }

  updateNextQuestions() { 
    this.setState({attempted: false});
    this.setState({question: this.state.blocks[this.state.questionIndex+1]['fields'].question});
    this.setState({option1: this.state.blocks[this.state.questionIndex+1]['fields'].option1});
    this.setState({option2: this.state.blocks[this.state.questionIndex+1]['fields'].option2});
    this.setState({option3: this.state.blocks[this.state.questionIndex+1]['fields'].option3});
    this.setState({option4: this.state.blocks[this.state.questionIndex+1]['fields'].option4});
    
    this.setState({option1_iscorrect: this.state.blocks[this.state.questionIndex+1]['fields'].option1_iscorrect});
    this.setState({option2_iscorrect: this.state.blocks[this.state.questionIndex+1]['fields'].option2_iscorrect});
    this.setState({option3_iscorrect: this.state.blocks[this.state.questionIndex+1]['fields'].option3_iscorrect});
    this.setState({option4_iscorrect: this.state.blocks[this.state.questionIndex+1]['fields'].option4_iscorrect});
    if(this.state.blocks[this.state.questionIndex+1]['fields'].option1_iscorrect==1) {
        this.setState({correctAnswer: 1})
      }
      else if(this.state.blocks[this.state.questionIndex+1]['fields'].option2_iscorrect==1) {
        this.setState({correctAnswer: 2})
      }
      else if(this.state.blocks[this.state.questionIndex+1]['fields'].option3_iscorrect==1) {
        this.setState({correctAnswer: 3})
      }
      else {
        this.setState({correctAnswer: 4})
      }
      this.setState({questionIndex: this.state.questionIndex+1});
  }


   constructor() {
    super();
    this.state = {
      timer: 600,
      ActiveSlide: 0,
      ActiveSlide1: 0,
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
      selectedAnswer: -1,
      answer: [],
      opponent_answer: [],
      backgroundColorOptionA: 'white',
      backgroundColorOptionB: 'white',
      backgroundColorOptionC: 'white',
      backgroundColorOptionD: 'white',
      loadingCompleted: false,
      testCardShow: false,
    }
    this.handleBackButton = this.handleBackButton.bind(this);
    this.loadQuestions = this.loadQuestions.bind(this);
  }

  handleBackButton() {
    Alert.alert(
                'Are you sure you want to submit?',
                '',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {text: 'Submit', onPress: () =>{
                    if(this.props.navigation.state.params.is_sender) {
                      axios.post('https://classcast-198812.appspot.com/challenge/updateChallengeRequest', {
                                            "challenge_id": this.props.navigation.state.params.challenge_id,
                                            "completed_by_sender": true
                                          })
                                      }
                    else {
                      axios.post('https://classcast-198812.appspot.com/challenge/updateChallengeRequest', {
                                            "challenge_id": this.props.navigation.state.params.challenge_id,
                                            "completed_by_receiver": true
                                          })
                    }
                    
                    this.props.navigation.navigate('Playground', {}, NavigationActions.navigate({ 
                            routeName: 'challengePerformance',
                            params: {
                              opponent_username: this.props.navigation.state.params.username,
                              opponent_name: this.props.navigation.state.params.name,
                              timer: this.state.timer,
                              answer: this.state.answer,
                              opponent_answer: this.state.opponent_answer,
                              challenge_id: this.props.navigation.state.params.challenge_id, 
                              is_sender: this.props.navigation.state.params.is_sender
                            },
                          }));
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
    await this.loadQuestions();
    var count = 0

    setInterval(() => {
      count += 1
      if(this.state.timer > 0) {
            this.setState({
                timer: --this.state.timer
            })
        }
        if(count == 7) {
          this.setState({testCardShow: true})
          }

        if(this.state.timer == 1) {
          this.setState({modalTimeup: true})
          }
        }, 1000);

    if(this.props.navigation.state.params.is_sender) {
      axios.post('https://classcast-198812.appspot.com/challenge/updateChallengeRequest', {
                            "challenge_id": this.props.navigation.state.params.challenge_id,
                            "started_by_sender": true
                          })
                      }
    else {
      axios.post('https://classcast-198812.appspot.com/challenge/updateChallengeRequest', {
                            "challenge_id": this.props.navigation.state.params.challenge_id,
                            "started_by_receiver": true
                          })
    }
    

     await firebase.firestore()
     .collection("challenge_questions").where("challenge_id", "==", this.props.navigation.state.params.challenge_id)
     .onSnapshot(
        snapshot => {
          snapshot.docChanges.forEach(change => {
            const data = change.doc.data()
            
            if (change.type === 'modified') {
              if(this.props.navigation.state.params.is_sender){
                
                this.setState({opponent_answer: data.receiver_answers});
                this.setState({ActiveSlide1: data.receiver_answers.length});
              }
              else {
                this.setState({opponent_answer: data.sender_answers});
                this.setState({ActiveSlide1: data.sender_answers.length});
              }
            }
          })
        },
        
      )

  }

   render() {
    if(!this.state.loadingCompleted) {
      return(
        <BarIndicator color='purple' count={5} size={60} />
      )
    }
    else {
      return (
        <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.header1}>
                <Text style={styles.text}>Time: {Math.floor(this.state.timer/60)}:{(this.state.timer % 60) > 9 ? this.state.timer % 60 : '0'+ this.state.timer % 60}</Text>
              </View>
              <View style={styles.header2}>
              <TouchableNativeFeedback
                      onPress={() => {
                        Alert.alert(
                'Are you sure you want to submit?',
                '',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {text: 'Submit', onPress: () =>{
                    if(this.props.navigation.state.params.is_sender) {
                      axios.post('https://classcast-198812.appspot.com/challenge/updateChallengeRequest', {
                                            "challenge_id": this.props.navigation.state.params.challenge_id,
                                            "completed_by_sender": true
                                          })
                                      }
                    else {
                      axios.post('https://classcast-198812.appspot.com/challenge/updateChallengeRequest', {
                                            "challenge_id": this.props.navigation.state.params.challenge_id,
                                            "completed_by_receiver": true
                                          })
                    }
                    
                    this.props.navigation.navigate('Playground', {}, NavigationActions.navigate({ 
                            routeName: 'challengePerformance',
                            params: {
                              opponent_username: this.props.navigation.state.params.username,
                              opponent_name: this.props.navigation.state.params.name,
                              timer: this.state.timer,
                              answer: this.state.answer,
                              opponent_answer: this.state.opponent_answer,
                              challenge_id: this.props.navigation.state.params.challenge_id, 
                              is_sender: this.props.navigation.state.params.is_sender
                            },
                          }));
                  }},
                ],
                {cancelable: false},
              );
                        //this.calculateScore();
                      }
                  }

                 >
                <View style={styles.submitButton}>
                  <Text style={styles.activeSnapText}>End</Text>
                </View>
              </TouchableNativeFeedback>
              </View>
            </View>
            <ScrollView style={{width: '100%'}}>
            <View style={{marginLeft: 2 * vw,marginTop: 0.02 * screen.height, marginBottom: 0.02 * screen.height, width: '95%'}}>
                <Text style={styles.text}>Opponent</Text>
                  <FlatList
                      ref={(ref) => { this.flatListRef = ref; }}
                      keyExtractor={item => item}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      data = {Object.keys(this.state.blocks)}
                      
                  renderItem={({item}) => (
                    <View>
                    
                    { item == this.state.opponent_answer.length &&
                      <View style={styles.activeQuestion}>
                        <Text style={styles.activeSnapText}>
                          {Number(item)+1}
                        </Text>
                      </View>
                    }
                    { item != this.state.opponent_answer.length &&
                      <View style={[styles.inActiveQuestion, {backgroundColor: this.state.opponent_answer[item]== 4 ? 'green': this.state.opponent_answer[item]== -1? 'red': 'white'}]}>
                      <Text style={styles.inactiveSnapText}>
                        {Number(item)+1}
                      </Text>
                      </View>
                    }
                    
                 </View>
                  )}
                />
                 
            </View>
             <View style={{marginLeft: 2 * vw,marginTop: 0.02 * screen.height, marginBottom: 0.02 * screen.height, width: '95%'}}>
                  <Text style={styles.text}>You</Text>
                  <FlatList
                      ref={(ref) => { this.flatListRef = ref; }}
                      keyExtractor={item => item}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      data = {Object.keys(this.state.blocks)}
                      
                  renderItem={({item}) => (
                    <View>
                    { this.state.ActiveSlide == item &&
                      <View style={styles.activeQuestion}>
                        <Text style={styles.activeSnapText}>
                          {this.state.ActiveSlide+1}
                        </Text>
                      </View>
                    }
                    { this.state.ActiveSlide != item &&
                      <View style={[styles.inActiveQuestion, {backgroundColor: this.state.answer[item]==4 ? 'green': this.state.answer[item]== -1 ? 'red': 'white'}]}>
                      <Text style={styles.inactiveSnapText}>
                        {Number(item)+1}
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
                    html={this.state.question.split('https://console.cloud.google.com/storage/browser').join('https://storage.googleapis.com').split('\\\\').join('\\')}
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
            <TouchableNativeFeedback
                      onPress={() => {
                        if(!this.state.attempted) {
                          this.setState({selectedAnswer: 1});
                          this.setState({questionAttempted: this.state.questionAttempted+1});
                          this.setState({attempted: true});

                          if(this.state.correctAnswer== 1) {
                            this.setState({ backgroundColorOptionA: 'green'});
                            this.setState({correctlyAttempted: this.state.correctlyAttempted+1});
                          }
                          else if(this.state.correctAnswer==2) {
                            this.setState({ backgroundColorOptionB: 'green'});
                            this.setState({ backgroundColorOptionA: 'red'}); 
                          }
                          else if(this.state.correctAnswer==3) {
                            this.setState({ backgroundColorOptionC: 'green'});
                            this.setState({ backgroundColorOptionA: 'red'}); 
                          }
                          else if(this.state.correctAnswer==4) {
                            this.setState({ backgroundColorOptionD: 'green'});
                            this.setState({ backgroundColorOptionA: 'red'}); 
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
                      scalesPageToFit={Platform.OS === 'android'}
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
                          this.setState({selectedAnswer: 2});
                          this.setState({questionAttempted: this.state.questionAttempted+1});
                          this.setState({attempted: true});

                          if(this.state.correctAnswer== 1) {
                            this.setState({ backgroundColorOptionA: 'green'});
                            this.setState({ backgroundColorOptionB: 'red'});
                          }
                          else if(this.state.correctAnswer==2) {
                            this.setState({ backgroundColorOptionB: 'green'});
                            this.setState({correctlyAttempted: this.state.correctlyAttempted+1});
                          }
                          else if(this.state.correctAnswer==3) {
                            this.setState({ backgroundColorOptionC: 'green'});
                            this.setState({ backgroundColorOptionB: 'red'}); 
                          }
                          else if(this.state.correctAnswer==4) {
                            this.setState({ backgroundColorOptionD: 'green'});
                            this.setState({ backgroundColorOptionB: 'red'}); 
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
                      scalesPageToFit={Platform.OS === 'android'}
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
                          this.setState({selectedAnswer: 3});
                          this.setState({questionAttempted: this.state.questionAttempted+1});
                          this.setState({attempted: true});

                          if(this.state.correctAnswer== 1) {
                            this.setState({ backgroundColorOptionA: 'green'});
                            this.setState({ backgroundColorOptionC: 'red'});
                          }
                          else if(this.state.correctAnswer==2) {
                            this.setState({ backgroundColorOptionB: 'green'});
                            this.setState({ backgroundColorOptionC: 'red'}); 
                          }
                          else if(this.state.correctAnswer==3) {
                            this.setState({ backgroundColorOptionC: 'green'});
                            this.setState({correctlyAttempted: this.state.correctlyAttempted+1});
                          }
                          else if(this.state.correctAnswer==4) {
                            this.setState({ backgroundColorOptionD: 'green'});
                            this.setState({ backgroundColorOptionC: 'red'}); 
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
                      scalesPageToFit={Platform.OS === 'android'}
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
                          this.setState({selectedAnswer: 4});
                          this.setState({questionAttempted: this.state.questionAttempted+1});
                          this.setState({attempted: true});

                          if(this.state.correctAnswer== 1) {
                            this.setState({ backgroundColorOptionA: 'green'});
                            this.setState({ backgroundColorOptionD: 'red'});
                          }
                          else if(this.state.correctAnswer==2) {
                            this.setState({ backgroundColorOptionB: 'green'});
                            this.setState({ backgroundColorOptionD: 'red'}); 
                          }
                          else if(this.state.correctAnswer==3) {
                            this.setState({ backgroundColorOptionC: 'green'});
                            this.setState({ backgroundColorOptionD: 'red'}); 
                          }
                          else if(this.state.correctAnswer==4) {
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
                      scalesPageToFit={Platform.OS === 'android'}
                    />                      

              </View>
              
              </TouchableNativeFeedback>
            </View>
            
            <View style={{flexDirection: 'row', marginBottom: 2 * vh}}>
              <TouchableNativeFeedback
                      onPress={() => {
                        if(this.state.selectedAnswer == -1) {
                          var joined = this.state.answer.concat(0);
                          this.setState({ answer: joined })
                          axios.post('https://classcast-198812.appspot.com/challenge/submitchallengequestions', {
                              "challenge_id": this.props.navigation.state.params.challenge_id,
                              "is_sender": this.props.navigation.state.params.is_sender,
                              "question_index": this.state.questionIndex,
                              "status": "skipped"
                            })
                        }
                        if(this.state.selectedAnswer == this.state.correctAnswer) {
                          var joined = this.state.answer.concat(4);
                          this.setState({ answer: joined })
                          axios.post('https://classcast-198812.appspot.com/challenge/submitchallengequestions', {
                              "challenge_id": this.props.navigation.state.params.challenge_id,
                              "is_sender": this.props.navigation.state.params.is_sender,
                              "question_index": this.state.questionIndex,
                              "status": "correct"
                            })
                        }
                        else {
                          var joined = this.state.answer.concat(-1);
                          this.setState({ answer: joined })
                          axios.post('https://classcast-198812.appspot.com/challenge/submitchallengequestions', {
                              "challenge_id": this.props.navigation.state.params.challenge_id,
                              "is_sender": this.props.navigation.state.params.is_sender,
                              "question_index": this.state.questionIndex,
                              "status": "wrong"
                            })
                        }
                        this.setState({selectedAnswer: -1});
                        this.setState({totalQuestions: this.state.totalQuestions+1});
                        
                        if(this.state.questionIndex+1 < this.state.n_questions) {
                          this.setState({ActiveSlide: this.state.ActiveSlide +1});
                          this.flatListRef.scrollToIndex({animated: true, index: this.state.ActiveSlide+1});
                          this.updateNextQuestions();
                          this.setState({ backgroundColorOptionB: 'white'});
                          this.setState({ backgroundColorOptionC: 'white'});
                          this.setState({ backgroundColorOptionA: 'white'});
                          this.setState({ backgroundColorOptionD: 'white'});
                        }
                      if(this.state.questionIndex+1 == this.state.n_questions) {
                        Alert.alert(
                          'Are you sure you want to submit?',
                          '',
                          [
                            {
                              text: 'Cancel',
                              onPress: () => console.log('Cancel Pressed'),
                              style: 'cancel',
                            },
                            {text: 'Submit', onPress: () =>{
                              if(this.props.navigation.state.params.is_sender) {
                                axios.post('https://classcast-198812.appspot.com/challenge/updateChallengeRequest', {
                                                      "challenge_id": this.props.navigation.state.params.challenge_id,
                                                      "completed_by_sender": true
                                                    })
                                                }
                              else {
                                axios.post('https://classcast-198812.appspot.com/challenge/updateChallengeRequest', {
                                                      "challenge_id": this.props.navigation.state.params.challenge_id,
                                                      "completed_by_receiver": true
                                                    })
                              }
                              
                              this.props.navigation.navigate('Playground', {}, NavigationActions.navigate({ 
                                      routeName: 'challengePerformance',
                                      params: {
                                        opponent_username: this.props.navigation.state.params.username,
                                        opponent_name: this.props.navigation.state.params.name,
                                        timer: this.state.timer,
                                        answer: this.state.answer,
                                        opponent_answer: this.state.opponent_answer,
                                        challenge_id: this.props.navigation.state.params.challenge_id, 
                                        is_sender: this.props.navigation.state.params.is_sender
                                      },
                                    }));

                              /*
                              const navigateAction = NavigationActions.navigate({
                              routeName: 'challengePerformance',
                              params: {
                                opponent_username: this.props.navigation.state.params.username,
                                opponent_name: this.props.navigation.state.params.name,
                                timer: this.state.timer,
                                answer: this.state.answer,
                                opponent_answer: this.state.opponent_answer,
                                challenge_id: this.props.navigation.state.params.challenge_id, 
                                is_sender: this.props.navigation.state.params.is_sender
                              },
                            });
                            this.props.navigation.dispatch(navigateAction); 
                            */
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
  }

export default ongoingChallenge


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
    marginTop: 1 * vh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inActiveQuestion: {
    height: 4 * vh,
    width: 4 * vh,
    backgroundColor: 'white',
    borderRadius: 2 * vh,
    marginLeft: 1 * vw,
    marginTop: 1 * vh,
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