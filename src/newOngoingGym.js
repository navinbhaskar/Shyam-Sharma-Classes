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
  Alert,
  FlatList,
  BackHandler
} from 'react-native';
import Modal from 'react-native-modal';
import {NavigationActions} from 'react-navigation';
import {MaterialIndicator} from 'react-native-indicators';
import * as Progress from 'react-native-progress';
import RenderQuestions from './renderQuestions';
import axios from 'axios';

const screen = Dimensions.get('window');
  vh = screen.height / 100;
  vw = screen.width / 100;

class newOngoingGym extends Component {


  static navigationOptions = ({ navigation }) => ({
    header: null
  })

  constructor() {
    super();
    this.state = {
      timer: 0,
      ActiveSlide: 0,
      startTime: new Date(),
      blocks: [{
                "section": "",
                "section_name": "",
                "data": [
                  {
                    "section": "",
                    "en": {
                      "options": [
                        
                      ],
                      "value": "",
                      "comp": ""
                    },
                    "correctOption": "",
                    "selectedOption": "",
                    "sol": {
                      "hn": {
                        "value": ""
                      },
                      "en": {
                        "value": ""
                      }
                    },
                    "isNum": false,
                    "hn": {
                      "options": [
                        
                      ],
                      "value": "",
                      "comp": ""
                    },
                    
                  }
                ]
              }],
      questionContainerHeight: 0,
      questionIndex: 0,
      n_questions: 0,
      attempted: false,
      num_attempted: 0,
      modalTimeup: false,
      modalPerformance: false,
      totalScore: 0,
      currentIndex: -1,
      loadingCompleted: false,
      testCardShow: false,
      goal: [],
      subjects: [],
      activeGoal: 0,
      activeSubject: 0,
      isReady: false,
      sections: [],
      selectedSection: 0,
      loading: false,
      language: 'en',
      showReviewModal: false,
      showSubmitModal: false,
      optionLetter: ['A','B','C','D','E','F'],
      correctAnswers: 0,
      incorrectAnswers: 0,
      totalQuestions: 1,
    }
    this.loadNewQuestions = this.loadNewQuestions.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.submitTest = this.submitTest.bind(this);
  }

  handleBackButton() {
    this.setState({showSubmitModal: true});
    return true;
  }


  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  loadNewQuestions() {
    if(this.props.navigation.state.params.chapterAvailable) {
      data = {
        "exams_package": this.props.navigation.state.params.exams_package,
        "exam_name": this.props.navigation.state.params.exam_name,
        "chapter": this.props.navigation.state.params.chapter
      }
      console.log("dlasadaknkjlklaa: "+JSON.stringify(data));
      axios.post(`https://classcast-198812.appspot.com/gym/get_chapterwise_gym_data`, data)
        .then(function (response){
          this.setState({
            blocks: response.data,
            questionIndex: 0
          });
        }.bind(this))
        .catch(function (error) {
          console.log("sammasmlaserror: "+JSON.stringify(error));
        });
    }

    else {
      data = {
        "exams_package": this.props.navigation.state.params.exams_package,
        "exam_name": this.props.navigation.state.params.exam_name
      }
      console.log("dlasadaknkjlklaa: "+JSON.stringify(data));
      axios.post(`https://classcast-198812.appspot.com/gym/get_gym_data`, data)
        .then(function (response){
          this.setState({
            blocks: response.data,
            sections: response.data.map(data => ({name: data.section_name, active_question_number: 0})),
            questionIndex: 0
          });
        }.bind(this))
        .catch(function (error) {
          console.log("sammasmlaserror: "+JSON.stringify(error));
        });
    }

    data = {
        "goal": this.props.navigation.state.params.goal,
        "subject": this.props.navigation.state.params.subject,
        "data": this.state.blocks.map(section => ({ section_name: section.section_name, data: section.data.map(question=> ({ question_id: question._id, isCorrect: question.selectedOption == question.correctOption, attempted: question.attempted}) ) }) )
      }
      axios.post(`https://classcast-198812.appspot.com/test_updated/save_test_performance`, data)
      .then((response) => {console.log("API response" )})
      .catch((error) => {console.log("API error")})
  }

  async componentDidMount() {

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.setState({ sections: this.props.navigation.state.params.blocks.map(data => ({name: data.section_name, active_question_number: 0})),
                    blocks: this.props.navigation.state.params.blocks,
                    loading: true
     });
    setInterval(() => {
      this.setState({
        timer: ++this.state.timer
      })
    }, 1000);
  }

  submitTest() {
    this.setState({
      showSubmitModal: false
    });
    const navigateAction = NavigationActions.navigate({
    routeName: 'gymPerformance',
    params: {
      timer: this.state.timer,
      goal: this.props.navigation.state.params.goal,
      subject: this.props.navigation.state.params.subject,
      path: this.props.navigation.state.params.path,
      points: this.state.correctAnswers,
      wrong: this.state.incorrectAnswers,
      total: this.state.totalQuestions
    }
  });
  this.props.navigation.dispatch(navigateAction);
  }

  _renderItem = ({item, index}) => (
      <TouchableNativeFeedback
         onPress={() => {
          this.setState({ 
            selectedSection: index,
            questionIndex: this.state.sections[index].active_question_number
           })
         }}
      >
        <View style={{height: 6 * vh, marginLeft: 5 *vw, marginRight: 5 * vw, alignItems: 'center', justifyContent: 'center'}}>
           <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 3 * vw, color: this.state.selectedSection==index ? 'red': 'white'}}>{item.name}</Text>
        </View>
      </TouchableNativeFeedback>
  );


  render () {
    console.log("snldnlasds: "+this.state.totalQuestions)
      return(
        <View style={styles.container}>
          <View style={styles.testHeader}>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.headerText}>Timer: {Math.floor(this.state.timer/60)}:{(this.state.timer % 60) > 9 ? this.state.timer % 60 : '0'+ this.state.timer % 60}</Text>
              <Text style={styles.headerText}>{(this.props.navigation.state.params.goal.length+this.props.navigation.state.params.subject.length < 30) ? this.props.navigation.state.params.goal+' - '+this.props.navigation.state.params.subject: (this.props.navigation.state.params.goal+ ' - '+this.props.navigation.state.params.subject).substring(0,30)+' ...'}</Text>
            </View>
            <TouchableNativeFeedback
              onPress={() => {
                if(this.state.language == 'en')
                  this.setState({language: 'hn'})
                else
                  this.setState({language: 'en'})
              }}
            >
              <Image
                style={{height: 7.5 * vw, width: 7.5 * vw, marginLeft: 5 * vw}}
                source={{uri: this.state.language == 'en'? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAIoFJREFUeNrsnXe4VNXVh9/LhUsXEEFERFRU7F1jbyhYQEG9EMDPEmOMaSZfTPKlWWJJt6RJ1CS2gFflWgA7VsSCihUbigVRUZR+pdz5/lhrnMMwzJw6c8p6n2ceYJg5c+bM3r+z9tqr1OVyOWJMA/AXYDSwEpgCNAP3ASswDCMQdTEXgB8Al5d4fpmKwS3AVGC5/ZSG4Z02MT+/A9fzfGegUQVgAdAEnKTPG0YtGWACEB4dXLymk07+JocYnKjPG0Y12Ag4G5gOvGNLgPCYDBzj873LgbtUEO42n4ERMp2B4cBYYAjQ1jmvTABqLwBOlgJ3AjcD9wJf2vg1fNAWGKyTfkSZJacJQIQCsAR4FdjH5zEXA7erGDyA7C4YBmUm8z466UcBvVy+xwQgIgGYAwwEtkAcgaOA3Xwe/3NgkorBQ8BqG++Gsq1O+jHAVj5EwwQgYgEo/rFGIfEC2/n8rAXAbeozeBRYY3Mgc2yiY2gssEdAq8EEoIoC4LzwOzrEYCufn/sRcCswEZgBtNrcSC3ddD0/FjiMcHbGTABqJADFP8LuKgSjgM18nsMHukS4GZgJ5GzOJJ72wFE66Yfpv8P2G5gA1FgAnLQBvqZC0Aj08Xk+bzvE4EUTg0TRBgksG4vEifSIcl6ZAMRLAJzUAwepGJwI9PR5nNd1iXAzMNvmV2zZWSf91wNYgSYAKRIAJ+103Tda14HdfB7nJYcYzLE5V3M2R7z3YxCfUNXnlQlAMgSgeF04RMVgOP7zCmaqGDQB79tcrBo9kZDwscABtZ5XJgDJEwAnnfRzR+mfHXwe5zG1Cm4FPrY5GsnvNEwn/VC16GIxr0wAki0ATrqqRTBaLQQ/g6wVmKaWQTOw0Oaub9oCh1MIx+0Sx3llApAeAXDSQwfdaPUd1Ps4xiokH2Eikp+wxOa0qwm1F4Vw3I0TcL4mACkUACe9gRN0QB7k80dfod9xIpaxWIptEEfe2Jj85iYAJgAl2RRxQI1C4g38sESXBxORJKVVGZ30fSiE4+6ZYIvFBCBDAuBkABJsNBr/SUqfIXkJExBHYtrzEjagEI57OPEvVGMCYALg2oTN5yVs7/MYHyI7CRNIVyhyA+K5H4s4WTuQHkwATADWYUcKeQl+z/8tXSJMQGoiJI02yB79WF0y9SCdmACYAJQdHLurEIwC+vs8zgsUog/jXoduJwrhuP1JPyYAJgCu74hhJCk9pVZBEzA/Jt+tv074sSoAWcIEwATAM/VIttpo/Ccp5YCHVQxuo/oBRxvquY9FtkazigmACUAg8klKo4CR+EtSWo0EHE0g2oCjjhTCcY8iPuG4JgAmAKmgPXCkWgbH4S9JqYVCwNFUggcc1atAjVWB6mpz3gTABCB6OgFHqxj4TVJailRFnoj0WFzlYVDvoZN+dAB/hQmACYAJQAiEkaS0EKmKPBF4hNJVkQdSqI67jV12EwATgPiRT1IahUTS+UlS+gRJW74VqXaUd+btbZfXBMAEIDn0QpKURuM/ScnIiAC0sd8qdSwArgIOAfoB5wBP2mUxTACyx4fAFcC+SCelnwLP2WUxTACyx1zg94gnfx/gFbskRlu7BJmhD3A8sm9/qP32hglA+hmA7A6cAOyHe+fUXH2vYQJgJIxBOuFHIlmHfthSlwqN+tjcLqsJgBFP6pDKQyP1sV0Ix8whxUdmIo7DvRxisJldchMAo7a0QTz7+Tt9lHfoHPC0Pn6CBAY1IgU9+tlPkfC7hwUCJYZ2yN7+SMSZF2UsvhtfQb6WQV4M+tp08nT9TABMACrSEThC7/TDqF4JLa8DuA3iZGxEQog3MQEwATAB8EdX/c4jkcy/zgkbwPXA/g4x2NgEwATABKA8PZHMvpFI7n9DSgZwvspRo1oxvU0ATABMAIS+yB79SOBg/GXwJWkAt0WSkxr1O/cyATAByJoAbElhu27fDA/gtip6ecugpwmACUAaBaAOaQiSn/S72gBeh/zuRt4y2NAEwAQgyQJQh/S0y0/6bWwAexKDw1QMRpDcxiEmABkTgLznOz/pkx4tF4cB3IBUN8qLQTe7fiYAcRKABr1b5QNz0uTUitsAbg8MVjE4HmkmatcvBCwU2BudkAKcI5HAnG52SarCl8AUfeTLpDciZdKtJLkJQKR0UyvkBKTxRUe7JDUXg7v00UEFuRGJo+hil8cEIAx66d1lpJqe1u0mnrQAd+ijI9JuvFGts852eUwAvNCPQmDOQVi5tKSxAmjWRye11hqBY/XfhgnAOmxNwXNv9e/Tw3KkOeptagkcrWJwjC3hsi0AdUir6vyk38mGQOpZBtyijy5FYtDBBCD9tEEq2uSLZ2xlcyKzLAWa9NFFlweNKgrtTQDS9b0O1Ak/AtjUxr5RQgwm6mMDhxgcRfBszCOAhyjdazFeJnGKAoHaI5FjIxEP/kY2xgMtlbJKN2QXoRHZYvQrBgt02TERmA60mgCELwBdkK2fkargFhRiAhAm3ZH4gkYk+MjvdvCHKgZNSJu2VhMA/wLwAfBznfRDMUeOCUB16KGWZaOa+H6Xz+9TcEo+hRRdNQHwIACGCUCt2RDJSWhEAsXqA4jBrWoZ1EQM4iwAPYCpSOVZwwQgrvREHM2NSHKYXzF4T8XgVhWD1iwKQB8KIbiHYYFKJgDJopdDDA7FfzTpByoEt0TtM4iDAAygEIK7vw0+E4CU0FvH9ElIxSO/YjAPiWhsAp4Ie5lQCwGoQ9pX5aPxdrOxYgKQcjbWsd6I1EL0e31fAc4F7k6aANQhzSbzk35bGxMmABllE4cYHOjzWg8GHoy7ANQDB1CIxrOmkiYAxtr0RULUG3WuuOUmYFwcBaA9hTJZx5Hu2u8mAEaY9HOIwX4VXnsvEgMTKwH4FfBj4l+vzTABiDubIW3VGim9DR6aAIRZ9GIfm/yGEQrvA5chzWNej/KDrOqNYWQYEwDDMAEwDN90wcK1TQCMzLIUuAiJULsXSZs1TACMDHEKUv3mSBWBHPA0MMoujQmAkX7mAeOLntsLqYaTA94Avo1tL5oAGKnlu8CS9fzf1sDfkay2j4FfI9V2DBOARLIGKfr4A+BCuxxfcTSVs9V6AxcAnyP1+y8HNrdLZwIQd5YhOdon6yA+DLgS+LMOZEPSVR/38PqOKqJzVTiux3o1mADEiI+AfyJlyTZCcrtvBBY6XrMImGCXCtTEHxPg/ScDL6oYTEby6A0TgKoyG/gtEoa5KfAtpDRZS5n3jLfL9hUfAP8XwnGO0WVWDimrPcIurQlAlJyP1CnYXgewl1JMM4Hn7RJ+xW8RZ19Y7AdMUjF4FfiGXWITgDCZjzjz3vD5/pxZAetwRkTH3Q64Rq/5POBnSDSiYQLgm/sIXmvtv0hUnCFMBh6N+DP6Apci24+L1fLoY5feBMCPAARliYqAUWA41euP1xX4qVpzq9VK2N5+AhMAN9wf0nGusku5FouA39fgc+vVT/CKWnaTqFxlxwQgozyHNHIMg+eBZ+ySrsUvkDDgWTU8hxHITkIO2VmwblMmAF9xb8jHM2dgactoT6Tz7tgq+AbKcQjin8gBLyCJTCYAJgChMRFxSBlrs0avy3+RKMpOSEfnO2t4TjsD/1ExeAc4B//twE0AEshSYEbIx1yGRAsa5cVgBTAFqSDdHmmYcSO165Y7AKnD9yUS6XkRGahqnXUBeAhYGcFxbRngTQxW6rLgFL0D7wb8lfVnF0ZND/VdfKKC8HdgoAlA+rgvouO+GIFlkQVakS28WcD3dSJupXfjD2t0Tg2IE/NNtU4mIrUOTABs/W9WQITk1Dp4G+k5sRnSVutHwGs1PK9RSLWjHLJ9PNQEIJnMBd6K8PhNwBc2j0O1Dj7SdfoOwIbA6cDLNTynwUijzsSWQMuyAORr10XFCiS/3YhGDD4H/g2cGpNzcpZA62wCkN31vy0Dqr9UiBuzTADizRpgWhU+51XgMZujNR/DixBvfrUYiDT6NAGIKU9VcX1uVkDtx/DHiBNxe+APwKdVOK+/AW1NAOK7/q8WtwGf2TyNDDelxluBVUi1p58AGwP9kb3+dyI6r42RKEMTgIyu//O0ANfZPI2MepdLvtYiQXgfuETN9d7AdyJYu48FBpkAxIsvqH7G3j9tntZ8DLeWeX4BEu0XRcLS9SYA8eIBvSNUk9eRsGMjHhZAudeFnbC0F9AY14vXNoMDxs/6/zDEo/9RgM8dDxyawevdW7/3psAuSEjvGqRYxzQkXmIJ/rfz3PoAvB7fmbB0jwrN3kitw3EuhSfPzcBdejwTgASu/4chZcIvDvC5zWpq9srANW4LHA+chTT66F3mtUuBWxDv/OyILIAc7is8r08M1iBNT55AIhB3QKoOnarLhkr8AziNmMUtZG0J8Brwno/3DQHO9Kj6xaxEItfSTp1+zxuBwytMfpCKvqephbUQqd5T7/Hz3E7gMGjVx0vAD5GQ5C2B31A+YelkYlijMGsC4Mf83wwpRd0f6X0XhKtTfn33RBqDjENy/L3SA2m/dr2H99e7nLRR3HnzlsU7SMPTfip455SwZtpQneAzE4CQzf8hjr9/O+Dnv4U4IdNIB8ST3jeEMTlGrbVOIY3hNVUyvXO6zLtClwhddYnwpMMf8r8mALVhJfBIQAEYquZeENJaOfh6ws2TH4BE7G0YwhhuDegD8CsGS5EYkP1UIIcDB5gA1IbHkXJdXmiLpHw615vfCngedxJsNyGOHI00Tg2bjmpKdwy4BKi14y2H5CLcRcxyBLIkAH7W/3sB3YueO93n+jbPKuBfKbqu7ZEW31HRG2nZ1qaMSLuxAOJCqwlAMtf/eTYCTgx4LlcTzzRWPwxEtvqipB/Sc6EuoRZAbMmKAHyM1OkLQwAguDNwLtVNSIqSLZFSXVGzM6VDqtuZAJgAVOJ+H6ZXDyTyqxT764AMQlqcgUdV8bPOYN0KQA02jU0Aolj/D65wfYJaAVOQ9tZJZ+8qf941SHefPB3NAjABcGMBhGX+5xmH7PP6ZTVwbQqu7VZV/rx64Ha10HD5G1gHrAxfmFnqA/BCnQsB6KIiEPRu1prw69s95OO5CdntBjysf+/p8vc0MioAfrz/2yGe50qcHXBwvQ9MzfD4a0Xi5ycAo5FQ4j2RuIJxSGn19bEz8Cd9fSXMT7AespAN6Gf9P8Tl63ZEHIKPBzi/q5Cc86SS8ymCLwOXr2cZNEv/vAmptX8skk1XLMo/cmlBtXN5Tg1E0yrOLIAasRzpC+8VL91egjoD78FfhmJcWOjx9cuQePidcO8Dmaxi+6DPMdxhPUuCocjW4lRgPtLc4xMkk3F4BMsbE4Aq8zDey0F3BA7y8PoTCZbjv0Z9AUnlTQ+vXYL0/Puzj89ZpJbAsz7e26nIf/BLve53Ad9EtjL7IAVLeiElwe5Amo9MBbY1AciO+X9QiTtGJbPx9IDneS3VL1MWFm779K1Rn0mQMOgWvWsv9vi+Xg6xvh+4UMe+myXwUfodbydYPQgTgBoQVvhvJc4KODg+1LtREnnS5eS/VE3roHwKHOfxPZ0RP80t+M9YPA7Zuh1qApAM3kOKcVZDAAb4fJ+TpDYQeU0nRjlmI7UCwlza3eDh9XWIszYM7iba5CcTgBDv/l4jwPLdY/zw7RDOd24Cr/PLVE6zvg1xsoXJGbpGrwWXA+eZAKRv/X9kgM87Btg8wPtbSWb/gM+o3GrrLxF87kpdVtSK84GfmwDEk1ZKbxlFYf47zcwzA573v12Y03HkT2X+7xWia412JbWN87+YtfMSTABiwtM+zMN61q7+49csDRJ19hHibU4a/ynzf49H+LlfUvtW3A8meR6lVQD8eP/3opBg4pfewMiAx0iiM3BFmYn4WsSf/UwM5tAbJgDJX/8PCWkwBk08mYZUD04aF6zn+SURf+7iGHz3rYDLTADiwSJdAlRDAFqQ/fszkdZXeyOJLUFIqjPwYUqHBXeN+HPjkul3DpWboJgAVGlN5tWR1gPYx8M6/WokVryn/nk15bvC+FlTJy0p5QukyEkxO0b8uV1idA1eNgFI5vr/8ArX4gWk9dPeeqc/U+/8yyP6DguASQm89qVCoodF/Jk7VPk7ltt16IVkKJoAJEwAis3/lepH+A6yt78r0vrpGapXwCOJzsDVrBvr3xvYIsLJH1WjjWVINOnvgK8hdQc2Q3Z6/oa0ey8VAHUB7joaxYK6XC60bdTJSDBMLXkT2MbHGvJdJAtwCtK4436id165Oa/Z1CYTLci6ui8S0ejMwZ8ewUTdHAnL3S6C7/8UEuQzrcLNczO1BosDgi4L0RJ4rcQYuJeQchLSZgH48f53QKrR9EEqzk6KweTPm5pJtALmA/8tem5/godKO9k6osm/HPgF0gq+UiPPVr1x/IJ1S879EG8ZpbYEqKEArEB6vscxHfc6vNcziINwnVViqfR34BshHP8YJAMx7Mm/EGgELsF7dOE9JZ67ygSguqyiUCgyLSxEUliTRgtwWonnr9H1sx/qgYuAiVRuGOqVOYgfaIrP95eK2zgJ6SJlAlAlpiPdWNNGUtOEb6B0taCz1do6E3eRl+2QXPwX1NwOe9vvHaRQyMyAgldMJ2LWCDTtAnAf6WQ68GoCzzuHVPdd37gbr0uvP+jr8pmU+cChQUhB0PuQ/IgotvvmIlvAswIeZ32idIUJQLzX/0mZSEltI/YW5b3hg4Afq+k9E9lGfBbZXpuh5v4hEZ3bKzr53wnhWOsrId9eP8MEIGIWUPussKjN6RUJPffLcFeZeSNd52+t5nP3CM/pE11WvB3S8QaU+b/TTQCix0/zzyTxBXBzgs9/BN67M0XFM7qcmBPiMcvFnuyMu/6FJgApXf9vgGwvBa1JNz7Bv88C4EBqn7n3LhLr8WmIx+yABASVE4eeJgDZEoB+SODLPTrYbkZyCYLwFPBign+jN5E9/FU1+vy7kcSksB2qlYrINOhNwAQgIl4i/IKTXqlTU+9XiDPrfSTwZQiFkNhDEaeXX5IaGejkcSTqstpBV4+qIEexTeymRPnOJgDRUSvvfzvgMKRC7NvIPvWFwB5l3vOtgJ95I5Ur8MadSXodqmkJXKfmfxSMcfGaPU0A0mH+d0UivG5EnFoPIjXiB7h8/6kEcwgtJnjBkThwrV7Hlip9XlSiuRfuMv8GmABEQwvwWMSfsWnRer4J6R3np35gdyS4JQjjSQd36BKpGtGbUVkbbn/L/iYA0fBIBHeROqRz7S+RLaMPHOv5MPrMnxXw/TOB51IiAo/qtf40gQLQDTjY5Ws3MgGI9/q/LeKkuxzZH34R8dpHsXbbB9jNrICvmItU0vlXwgRgWyRoyQ2dTADit/7viiSB3IBEhk3T9fwWVTjvoLnxE4hHzYIw+QayffpgBBM2ivqKo9QKcHuDMQEImXn429M9FdkT/hRJtR1H8H4AXhnjYfCUYglwE+ljHtKebQTwfIjHDbvbUoOOI7d8aQIQjfnvtXBDTzU1h4a0nvdLZxUeWwasSyuSHLQ74o85A3H0vk2h8vIbyLbrzZQuRR61AJyCt5oEi0wA4mH+H0586sifFfBc3tNH2rkWOAhpvrEnhVbfuyJFR16psg+gI5LC7IX5JgDhkgMe8PG+I2P0HXbEe37A1kh67cPqt+hPtshPpPyuQT2V4ypyhBt5eCzeQ3vnxPWCtk3oQJiJ946zdTETABBnYLnmmfVISerh+hiEUfybVrKiWkNcAnTWtb9Xy+1lE4Dw1/9eGUT5rK1acCLSUmqB47kuwBE64Y8lAXXlaiwA9S4sgLCWAKuATXy8b4YJQO3X/0fG8Hs06Dr2Jp3sw9VP0d7mtuslbCUBWBPiEmAl0izmCQ/vWUPtOxinSgCWIGWh0yAAIAlEv7O5HJkF0BqyD2AGcBvuC37GulRdEp2A03yYdO2JrrZcUOxuH1wEyrGa8NOPT8F9gtGNJgC1X//vT4L6tRmexm+lMZwj/DiAZcClLl73mU9r1QQgA+t/ozpLgDVEUy/yYip3h34W2a41AQiJOfjbUzUBSK8FUOdCAKKqQLS9i5vVMhOA2t79NyZ49p0RXwugjQsBiKpi9LtIXYNStAJ3JUFB077+H2zzJNUWQDW3AUvxPUpnGz6I5CyYAITEauAhM/8NjxbAaqLtGfE+pbsfnZcUBU0KM/BeV77OBCDzFkDUAgDS8fhZx79nEePov6QKgJ/1/05AH5snqReBcrTiPW3cD/l26DngyrRcvKSv/+3un25aKPRdWB+rqE7buJeAPyJFTR41AQiXz/BXCNMEIN18CvzWhQDkqnQ+5yIFTOaYAITLA3j35HZCCkkY6eYPSBvy9RHlNmBYlqoJQEgXtQNwFPAPZAvG4uyzwWll7vKrq2gBJI6kZAPeX+b/eiFNJ4eryd/ZftbM8bg+DizxfytNAJItAK8gzTny1CHFPfJVcvYlPnX+jNoxmNLVd80CSLgA3KfneYBO+GHAQPvpjBJ3+guBXxc9v8oEINkCcAiSUdXDfi6jApcCZ7N2GTVbApQhCU7A3WzyGy5pQbo7FVsARoIFwDC8MAF4xywAEwAjm+SQXSGzAEwAjIwyG7jTIQBmAZgAGBnjZP1zhV0KEwAjeywGfkNye1+YABhGQC5CCnYYJgCGB+5UE7pbwr/HSrx38jUBMDLPMOB6JADrTmAc3jvixoUVmBPQBMDwRYOKwQ0qBncAYxMsBoYJgOGT9kguxo0qBrebGJgAGMnmLaSMVRMSRutFDI4rEoMxQFe7pMnCtkiyxyxgEtCMpFrn18cbAMcDXweOoHK13WIxOA5Jx71bBWUy0snZMAEwakgOmK6T/nbWjpN3shhx/F2PZNOdCIwCDsZ9vYX2KiLHq0XhFIOl9lPEj7pcLjQH6WTWjsE2ascqpDNNM+K4+zjAsfoCJ6kY7OvzGC3AVOAWEwPPvAZsW/TcvcBQEwDDyTK94zYDU4BFEXzGAKBRxWD3gGLQpOdpYmACYPhkIbJP34zUTaxm3Ps2KgSNwI4+j7GiSAyW2U9qAmCUZ55O+GakAcXqGJzT9g7LYFAAMZiiywQTAxMAw8EbFDz3M6lunXtP4wlpx5YXg4EBxGCyisHUjIuBCUBGec4x6WeTvHDWOmBXxzJhC5/HWa4WQZOKwXITABOANNKK1LbPb9e9m6LvVgfsqWJwEtA/gBg4LYPlJgAmAElmJdL2rBlx5n2Sge/cBtjHIQZ9A4jBXSoGd6dYDEwAUsZSvXs165+LM3wt2gD7qRiciP9W7st0/DWpGKwwATABiBOfUtiuewBvcfdZoR5p/jIKOAHoHUAMnJbBChMAE4Ba8D6F7brHicd2XZLE4GDEeXgCazf68Gpt5cXgnoSKgQlAwn6svOf+WawQRRi0BQ5Vy2Ak/pvE5MWgScWgxQTABCAMZjom/Ws2XyOlHXC4isEI/JcsW6pLslsSIAYmADGjFYnAa0a2696zeVkT2iNpy6OQVGS/tQiWOMTg3hiKQaQCYOnA7vgSibVvVjNygV2SWPwmk/XRARiiYjAc6OzhOF2RykZjHWLQhHSlTr2z1gSg/J1hik76u7HiFnGmBUl7vgPoCBytYnAM0CmAGNzhsAy+NAFIPwv0R29G8um/tEuSOFYAt+mjs4pBo4pBR49iME4fix1icF+axoX5AGQNn3fiTQfW2BxKJV0clsHRumzwQ14MmnRZGLUYmBMwAl51TPrnse26LIrBsWoZHBVADBYVicFKE4D48rRj0r9hc8BwmPrHqmUwFNld8CsGt+syIUwxMAHwyRrgEQrbdR/YWDcqsEGRZdDg8zhfOMTggYBiYALggRbESZPfrvvMxrQRQAyGqWUwJAQxaEIcyytNAMJlsX52MxLVZUUmjbDphsQXNKoYtAsgBs1qGbgVAxOAEuS70TQD04jG+WIYpeiO9D04CYlE9CsGnxeJwSoTgPLMpeDEm4Ft1xm1p4fDMggiBgsdy4RpRWKQaQF42THpX8C264z4i8FJwJEBxSBvGUwDXsqaADzpmPRv2bgyErpMOC4kMejIuhGMqUoGWg08TKGN1TwbP0bC+QK4Th/dHZaBVwfihlGfaK0EYIWqWLNaDgttzBgpFoN809XuRT6DhlqfXDUFYBGyN9+sk986vxhZFoNuSNBR3jLokEYB+IjCdt3D2HadYThviDfpI5+odKL+Wameweo4C8DbFJx4TxLfNlaGEReWIluATYjDbwhSDHUYpcueTQ7rg8PcBRgBzEG2LWy7zgibnjohFhQ9lqV4vDUAhyA7CsfoNbgaOJeQ4mDCFADDiJI6ZF/8kKLnWxxi8EkJgSh+LLYblAmAkUx2Quo31Ac4xkqkUYtTMH6G9HEwATCMmHMl8L0Qj/cxsCkZDS1vY+PJSBjn6R08LG4lw3klJgBG0vgc+HmIx2syH4BhJIt6pMTb7gGPMx/oR4a3qs0CMJLIGuC7IRznFjIep2ICYCSVGUhIbRBuzvpFtCWAkWQ2AV7HX1/AD4DNzQLIHrsANwA3AochASZGMpkPXOjzvU1YmHrmLIA+SIklZ3z1dOCn+qeRLPZD4gL28PHerwFPZf0CZs0CKJVcsT/wONIVdgebU4lgMySLbrrPyf8usouACUC2WF1BHF4ErkEiw4z40QW4QNf9YwIcpwnLB8jkEqAH0hewT4XXrQAuA36P5G0btaUe+B/gYsTxF5S9gJl2WbO5C7AdMBHY2cVrFwJ/BP6K9Is3qs9g/Q12cfHaVVSuufc2MNAsgGwuAQBmA3sDl1A5BnxDfd27wPlIPrZRHXYH7kYabbqZ/JOArYDHzPw3C8AtuwBXIR5hNywHrgUu1zuJET47A79GKuK44S3gHGCK/rtSyvBuwCy7zNm1AJy8gOwCnAp86OL1nZBU1LeQWoeDsTiCsMbhUKTU1QsuJ/9SJCloR8fkB6lIdcV63vOmHt8wC2AdOuud5FxK12FbH68D45GwVOtG7I1NVHy/CWzh8j2tyE7NeUjR2VJ0ReI9+hY9fxHwK7vsJgDl6AH8EPgB0iLaLSvVKviPrltX26UsSQNS+fY0pM6dl+o+k4BfIn6cSoxCnL3Fy4uX7CcwAXBDd+Bs4PvAxh7f+zGSaDIBiTbL+kVug0TtjdGJ6bXjzRRk//8ZL2MbuE+XaahFsL39FiYAXumgA/f7uPNGF/MucJvevWaQnfjzesS5egLS/KKfx/fn1KK6BP979tvqHb+dCsj5NpxNAHxfK+AA4CykgYOftk4f691sMvAA6Yst6K533GP00cvHMVqQRK0/Iv6VoFyMOAt3QILADBOAwGwEnAycjnih/bAKyUG4H3gQeC6BfoPOepc/BDgcia/wW7H3A2RLdjzh1vzrpMuxYTZsTQCisAp2B8bpMqF3gGMtAZ5AElxmqNn7RYy+a0ddQ++CJODsA+xKsBLda5A+keOBqREKYCckhsMwAYiMtsChwNeRLkndQzjmHGTf+mXgFeANfS6KpUO9Ctimul7fHNmaGwgM0r+HFTcyi0JfvPk2dEwA0kaDmsQjkbZOvUI+/mdqMs9HGlt8jnS8WY5sR7bqZK3XRwPQXu/inZB98m4qUhsiIc49iTYw7EWkX+RExCNvmABkgnpgX6Qv/LFIMlIWWAU8ijg970KiJw0TgMwzAAl7HYKUJNsgJd+rFYnBfwTZ4XgMCdc1TACMMn6D3dR3cBASLNMjIec+D9m5eAqprvMkljJtAmAEog2wDeJh31PFYacaWwk5JIlmlk745/TvC+znMgEwqvAbIV75QYhHfkugP5JI0wtx4nVBIhb9OPFW6p37U8Sp+B7wDrLjMBsJxrEttJTy/wMAh3rHQ21/SNkAAAAASUVORK5CYII='
                            : 'data:image/png;base64,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'
                }}
              />
            </TouchableNativeFeedback>

          </View>
          <View style={styles.sectionHeader}>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={this.state.sections}
              renderItem={this._renderItem}
              extraData={this.state}
            />
          </View>
            
            <TouchableNativeFeedback onPress={()=> this.setState({showSubmitModal: true})}>              
              <View style={{height: 5 * vh, width: '19%', backgroundColor: '#323131', alignSelf: 'center', justifyContent: 'center', borderRadius: 4 * vw, alignItems: 'center', alignSelf: 'center', marginTop: 2 * vh}}>
                <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 3 * vw, color: 'white'}}>Submit</Text>
              </View>
            </TouchableNativeFeedback>
          { this.state.loading &&
            <Modal 
              isVisible={this.state.showSubmitModal}
              onRequestClose={() => {this.setState({showSubmitModal: false})}}>
              <View style={{height: 18 * vh, width: '70%', position: 'absolute', alignSelf: 'center', borderRadius: 2*vw, backgroundColor: 'white'}}>
                <View style={{height: 10 * vh, width: '100%', justifyContent: 'center'}}>
                  <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw, marginLeft: 2 * vw, marginRight: 2 * vw, color: 'black'}}> Are you sure you want to submit this test? </Text>
                </View>
                <View style={{flexDirection: 'row', height: 8 * vh}}>
                  <TouchableNativeFeedback onPress={()=>this.submitTest()}>
                    <View style={{height: 8 * vh, width: '50%', backgroundColor: '#323131', justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 2 * vw}}>
                      <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw, color: '#ffffff'}}> Yes </Text>
                    </View>
                  </TouchableNativeFeedback>
                  <TouchableNativeFeedback onPress={()=> this.setState({showSubmitModal: false})}>
                    <View style={{height: 8 * vh, width: '50%', backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderBottomRightRadius: 2 * vw}}>
                      <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw}}> No </Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              </View>
            </Modal>
          }
          
          <ScrollView style={{width: '100%'}}>
          { this.state.blocks[this.state.selectedSection].data[this.state.questionIndex][this.state.language].comp != "" &&
            <View style={[styles.textContainer, {width: '96%'}]}>
              <RenderQuestions
                data={{text: "<strong>Passage</strong>"+"<p>"+this.state.blocks[this.state.selectedSection].data[this.state.questionIndex][this.state.language].comp.split('//storage.googleapis.com/classcast_exams_images/').join('https://storage.googleapis.com/classcast_exams_images/').split('https://console.cloud.google.com/storage/browser').join('https://storage.googleapis.com').split('\\\\').join('\\')+"</p>", color: 'white'}}/>
            </View>
          }
            <View style={[styles.textContainer, {width: '96%'}]}>
              <RenderQuestions
                data={{text: "<strong>Question</strong>"+"<p>"+this.state.blocks[this.state.selectedSection].data[this.state.questionIndex][this.state.language].value.split('//storage.googleapis.com/classcast_exams_images/').join('https://storage.googleapis.com/classcast_exams_images/').split('https://console.cloud.google.com/storage/browser').join('https://storage.googleapis.com').split('\\\\').join('\\')+"</p>", color: 'white'}}
                />
            </View>
            { 
              this.state.blocks[this.state.selectedSection].data[this.state.questionIndex][this.state.language].options && this.state.blocks[this.state.selectedSection].data[this.state.questionIndex][this.state.language].options.map((options, index)=>{
                return(
                  <TouchableNativeFeedback
                    onPress={() => {
                      if(!this.state.attempted) {
                        tempAttempt =this.state.blocks;
                        tempAttempt[this.state.selectedSection].data[this.state.questionIndex].attempted = true;
                        tempAttempt[this.state.selectedSection].data[this.state.questionIndex].selectedOption = index+1;
                        this.setState({
                          blocks: tempAttempt,
                          attempted: true
                        });
                        if(this.state.blocks[this.state.selectedSection].data[this.state.questionIndex].correctOption == index+1) {
                          this.setState({correctAnswers: this.state.correctAnswers+1});
                        }
                        else{
                          this.setState({incorrectAnswers: this.state.incorrectAnswers+1}); 
                        }
                      }
                    }}
                  >
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={styles.optionLabelExtension}>
                      <View style={styles.labelWrapper}>
                        <Text style={{fontWeight: 'bold', fontSize: 16}}>{this.state.optionLetter[index]}</Text>
                      </View>
                    </View>
                    <View style={[styles.textContainer, {marginTop: 1 * vh}]}>
                      { this.state.loading &&
                      <RenderQuestions
                        data={{text: "<p>"+options.value.split('//storage.googleapis.com/classcast_exams_images/').join('https://storage.googleapis.com/classcast_exams_images/').split('https://console.cloud.google.com/storage/browser').join('https://storage.googleapis.com').split('\\\\').join('\\')+"</p>", color: this.state.attempted ? this.state.blocks[this.state.selectedSection].data[this.state.questionIndex].correctOption == (index+1).toString() ? '#80e180' : this.state.blocks[this.state.selectedSection].data[this.state.questionIndex].selectedOption == (index+1).toString() ? '#f28888': 'white': 'white' }}
                        />
                      }
                    </View>
                  </View>
                  </TouchableNativeFeedback>
                )
              })
            }
            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 3 * vh}}>

              <TouchableNativeFeedback
                onPress={() => {
                  
                  this.setState({
                    attempted: false,
                    totalQuestions: this.state.totalQuestions + 1
                  });
                  if(this.state.questionIndex != this.state.blocks[this.state.selectedSection].data.length-1) {
                    temp = this.state.sections;
                    temp[this.state.selectedSection].active_question_number = this.state.questionIndex+1;
                    this.setState({sections: temp});
                    this.setState({questionIndex: this.state.questionIndex+1});
                  }
                  else {
                    if(this.state.sections.length > this.state.selectedSection+1) {
                      this.setState({ 
                        questionIndex: 0,
                        selectedSection: this.state.selectedSection+1
                       });
                    }
                    else {
                      
                      this.setState({attempted: false});
                      this.loadNewQuestions();
                    }
                  }
                 }}
              >
                <Image
                  style={{height: 10 * vw, width: 10 * vw}}
                  source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAIM8AACDPAGwo/07AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAJNQTFRFaHSSaXWSaXWTanaTbHeVbHiVbXmWb3qXdH+bfYihfoiigIqkh5CojZatj5iukJmvkZqvkZqwkpuwm6O3pKu9q7LCr7XFtbvKuL7MusDNvcLPvcLQvsPQvsTQv8TRwMXRwMXSwcbSzNDa3N/m3+Lo4eTq6evv6uzw7e7y+Pn6+fr7+vr7+vv8+/v8+/z8/v7/////xbzuLgAABBxJREFUeNrt3dkyA2EUhVExxZAg5jkh5iDn/Z/ODYUq7lzof6/1CGd/V91d1QsLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdE9vfe94sj9YcYlMw/uqqqrZwaJj5OmP5/VhuuEeaZZu6ovHLRcJc1jfPCkgy+ZLKSDZdZUCkj2UApKtVSkg2agUEG1QCoi2/KqAbLelgGhHvwRQMwVEWL1TQLbhXAHZTkoB0XpXClCAAhSgAAUoQAEKUIACFKAABShAAQpQgAIUoAAFVNVs23kUgAJQAApAASiAVguYKEABClCAAhSgAAUoQAEKUIACFKCAOApQgAIUoAAFKEABClCAAhSgAAUoQAEKUIACFKAABShAAQpIMVaAAhSgAAUoQAEKUIACFKAABShAAQpQgAIUoAAFKEABClCAAhSgABSAAlAACkABKIBGXSpAAQpQgAIUoAAFKEABClCAAhSgAAUoQAEfBey4jgJQAAogtYBnBSgABaAAFIACUAAKoFEXClCAAhSgAAUoQAEKUIACFKAABShAAQpQgAIUoAAFKEABClCAAhSAAlAAuQWMXEcBKAAF0LZzBShAAQpQgAIUoAAFKEABClCAAhSgAAUoQAEKUIACFKAABShAAQpAASgABaAAFIACaNSZAhSgAAUoQAE/FbDrOgpAASgABaAAFIACUAAKQAEoAAWgABSAAlAACqD7ThWgAAUoQAEKUIACFKAABShAAQpQgAIUoAAFCEAA9re//bE/9sf+2B/7Y3/sTwt8FGp/+9vf/va3v/3tb3/729/+9ncd+2N/7I/9sT/2x/7YH/tjf5rc348j7Y/9aZjfx9vf/va3v/3tb3/729/+9re//V3H/tgf+2N/7I/9sT/2x/7YH/tjf+xPt1zY3/72t7/97W9/+3/uv+M69sf+2B/7Y3/sj/2xP/bH/tgf+2N/7I/9sT//36X97W9/+9vf/va3v/3tb3/729/+BO8/s7/9sT/2J2//bdexP/bH/tgf+2N/7I/96b6x/e1vf/vb3/72t7/97W9/+9vf/tgf+2N/7I/9sT/2x/7YH/tjf+yP/emUif3tb3/729/+9re//e1vf/vb3/7YH/tjf+yP/WlJz/72t7/97W9/+9vf/va3v/3tb3/naX//K/vb3/72t7/97W9/+9vf/va3f/r+W85jf+yP/bE/9sf+2B/7Y3/sT3ed2D/acG7/ZKt39o92ZP9st7/s/2T/CMuv9o82sH+2kf2zrdk/3IP9s13bP9vmi/2zHdo/29LN1/0f7R+nP/58HTTdcI9Aw/v3x/8Hi44Rqbe+dzzZH6y4BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/mDdi8i1suoDkNAAAAAElFTkSuQmCC'}}
                />
              </TouchableNativeFeedback>
            </View>
          </ScrollView>
        </View>
      )
  }

}
export default newOngoingGym

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEAEA',
  },
  testHeader: {
    flexDirection: 'row',
    height: 8 * vh,
    width: '100%',
    backgroundColor: '#323131',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    fontFamily: 'Montserrat-SemiBold', 
    fontSize: 3.5 * vw, 
    color: 'white', 
    marginLeft: 5 * vw
  },
  textContainer:{
    "width": '88%',
    marginTop: 2 * vh,
    marginBottom: 1 * vh,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  questionIndex: {
    height: 6 * vh,
    width: '80%',
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center'
  },
  sectionHeader: {
    height: 6 * vh,
    width: '100%',
    backgroundColor: '#323131',
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tncHeader: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  optionLabelExtension: {
    height: 5 * vh,
    width: '10%',
    backgroundColor: '#323131',
    borderTopLeftRadius: 3 * vh,
    borderBottomLeftRadius: 3 * vh,
    elevation: 5,
    paddingLeft: 0.5 * vh,
    justifyContent: 'center',
  },
  labelWrapper: {
    backgroundColor: '#eee',
    borderRadius: 2 * vh,
    height: 4 * vh,
    width: 4 * vh,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.5)',
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