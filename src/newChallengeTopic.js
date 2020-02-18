import React, { Component } from 'react'
import {Dimensions, Image, Text, TouchableWithoutFeedback, View, ScrollView, TouchableNativeFeedback, BackHandler} from 'react-native'
import styles from './TestStyles';
import SnapCarousel from 'react-native-snap-carousel';
import axios from "axios/index";
const screen = Dimensions.get('window');
import {NavigationActions} from 'react-navigation';
import {MaterialIndicator} from 'react-native-indicators';

class newChallengeTopic extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Select Topic',
    header: null
  })

   constructor() {
    super();
    this.state = {
      isReady: false,
      chapters: [],
      selectedChapter: null,
      isChapterSelected: false,
    }
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  handleBackButton() {
    this.props.navigation.navigate('test2');
    return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    console.log("sdnkadsjdsa: "+JSON.stringify(this.props.navigation.state.params.goal));

    data = {
      "exams_package": this.props.navigation.state.params.subject,
      "exam_name": this.props.navigation.state.params.goal
    }
    
    axios.post(`https://classcast-198812.appspot.com/test_updated/get_topic_list`, data)
      .then(res => {
        this.setState({
          isReady: true,
          chapters: res.data.map((chapter, index) => ({
            index: index,
            name: chapter.name,
            selected: false,
          }))
        })

        console.log("test_topic_list: "+JSON.stringify(res.data.map((chapter, index) => ({
          index: index,
          name: chapter.name,
          selected: false
        }))));
      })
      .catch(e => {
        console.log("test_topic_list_error: "+JSON.stringify(e))
      })
    }


   render() {
    
    return (
      <View style={styles.container}>
        <View style={{marginLeft:0, marginTop: 0.04 * screen.height, marginBottom: 0.02 * screen.height}}>
            <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 0.07 * screen.width, color: '#7741cd'}}> Chapters </Text>
        </View>
        { !this.state.isReady &&
          <View style={{height: 20 * vh,width: 30 * vw, borderRadius: 1.5 * vw, marginTop: 20 * vh}}>
            <MaterialIndicator color='purple'/>
          </View>
        }
        <View style={styles.topicListWrapper}>
          <ScrollView style={{width: '100%', marginTop: '7%', marginBottom: 7 * vh}}>
            {
              this.state.chapters.map((chapter, index) => {
                return (
                  <TouchableNativeFeedback
                    onPress={() => {
                      this.setState({
                        isChapterSelected: true,
                        selectedChapter: chapter.name
                      })
                    }}
                    key={'TopicsList' + index}
                  >
                    <View style={styles.topicsListItem}>
                      <View style={styles.bullet}/>
                      <Text style={styles.topicsListItemText}>{chapter.name}</Text>
                      <View style={
                        chapter.name == this.state.selectedChapter
                          ? [styles.topicsListItemIconContainer, {backgroundColor: 'green'}]
                          : styles.topicsListItemIconContainer
                      }>
                        <Image
                          source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAABm0lEQVR4nO3YT6uMYQDG4YOFrJCTSBKJRDp1okgpSlGUIhYWko2Ftc9gZ8knsLdSylZSpFBSUjoJIUI4nMtiRnQ8M/7M+76Pcl/bmad+9zM17zRjYxERERERERERERHxb8JGXMZ1HK7d0ylM4IXvprGudlcnsAnP/exA7bbWYQOeFsY/waLafa3C+v7Q2V5ionZfq7AWU4XxrzBZu69VWIPHhfGvsbV2X6uwCo8K499gW+2+VmElHhbGv8WO2n2twgo8KIx/h521+4bCXExi9V+eX477hfHvsavp3kZhHq72g2dwHgv+4PxS3CuM/4A9bbY3ArsL8Xex+TfOjuNO4fxH7O2if2TYXhjw7RM8PeTcEtwunPuE/V1uGBkuDLgEuITxWe9fjJuF907jYK0dI8EJvcdVyZT+lxkW4saA8Ydq7xiJ3m/3WwMu4QvO4lrhtc84Wru/EZiPcwMuYdDFHKvd3Tjsw7NfjJ/B8dqtrcEyXBky/mTtxtZhDs7oPd5+dKp2W6ewBRf1/tA8UrsnIiIiIiIiIiIi4r/0FYagSGVUJK8oAAAAAElFTkSuQmCC'}}
                        />
                      </View>
                    </View>
                  </TouchableNativeFeedback>
                )
              })
            }
          </ScrollView>
        </View>
        
        { this.state.isReady && this.state.isChapterSelected &&
            <TouchableNativeFeedback
               onPress={() => {
                const navigateAction = NavigationActions.navigate({
                  routeName: 'newLoadingChallenge',
                  params: {
                    chapters: this.state.selectedChapter,
                    goal: this.props.navigation.state.params.goal,
                    subject: this.props.navigation.state.params.subject,
                    chapterAvailable: true,
                    path: 'playground',
                    test_id: null,
                  }
                });
                this.props.navigation.dispatch(navigateAction); 
              }}
            >
              <View style={styles.nextButton}>
                <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw, color: 'white'}}>Continue</Text>
              </View>
            </TouchableNativeFeedback>
          }
      </View>
    )
  }

}

export default newChallengeTopic
