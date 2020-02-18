import React, { Component } from 'react'
import {Dimensions, Image, Text, TouchableWithoutFeedback, View, BackHandler, ScrollView} from 'react-native'
import styles from './TestStyles';
import SnapCarousel from 'react-native-snap-carousel';
import {NavigationActions, StackActions} from 'react-navigation';
import axios from "axios";
import {MaterialIndicator} from 'react-native-indicators';

const screen = Dimensions.get('window');


class newCreateChallenge extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Create Test',
    header: null
  })

   constructor() {
    super();
    this.state = {
      duration: 30,
      goal: '',
      subject: '',
      selectedGoal: 0,
      selectedSubject: 0,
      selectedSubjectName: '',
      selectedGoalName: '',
      testData: [],
      goalImage: '',
      subjectImage: '',
      testDataPackage: [],
      isReady: false,
      topicAvailable: false,
    }
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  handleBackButton() {
    
    this.props.navigation.dispatch(StackActions.popToTop());
    this.props.navigation.navigate('Tabs', {}, NavigationActions.navigate({ routeName: 'Tabs' }));
    return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    axios.get('https://classcast-198812.appspot.com/test_updated/exams_list')
      .then((response) => {
        console.log("dlkdsoskoL: "+JSON.stringify(response.data));
        this.setState({
          testData: response.data,
          isReady: true,
          goal: response.data[0].name,
          goalImage: response.data[0].image,
          selectedGoal: 0,
          selectedSubject: 0,
          subject: response.data[0].package[0].name,
          subjectImage: response.data[0].package[0].image,
          topicAvailable: response.data[0].package[0].topic_available,
        });

        console.log("sniuasa: "+JSON.stringify(response.data));
        console.log("sniuasa12"+ JSON.stringify(response.data.subjects[0]['index']))
      })
  }

  _renderItemGoal = ({item, index}) => {
    console.log("ndwknlkew: "+JSON.stringify(item))
    console.log("ndwknlkewaa: "+this.state.selectedGoal+"||"+index)
    
    return (
      <View style={styles.goalCardWrapper}>
        <TouchableWithoutFeedback

          onPress={() => {
            this.setState({
              goal: item.name,
              goalImage: item.image,
              selectedGoal: index,
              selectedSubject: 0,
              subject: item.package[0].name,
              subjectImage: item.package[0].image,
              topicAvailable: item.package[0].topic_available
            });
          }}
        >
          <View
            style={[styles.goalCard, {transform: [{scaleX: 1.05}, {scaleY: 1.05}]}]}
          >
            {
              this.state.selectedGoal === index
              && <View style={styles.selectedCardIconContainer}>
                <Image
                  style={styles.selectedCardIcon}
                  source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAABm0lEQVR4nO3YT6uMYQDG4YOFrJCTSBKJRDp1okgpSlGUIhYWko2Ftc9gZ8knsLdSylZSpFBSUjoJIUI4nMtiRnQ8M/7M+76Pcl/bmad+9zM17zRjYxERERERERERERHxb8JGXMZ1HK7d0ylM4IXvprGudlcnsAnP/exA7bbWYQOeFsY/waLafa3C+v7Q2V5ionZfq7AWU4XxrzBZu69VWIPHhfGvsbV2X6uwCo8K499gW+2+VmElHhbGv8WO2n2twgo8KIx/h521+4bCXExi9V+eX477hfHvsavp3kZhHq72g2dwHgv+4PxS3CuM/4A9bbY3ArsL8Xex+TfOjuNO4fxH7O2if2TYXhjw7RM8PeTcEtwunPuE/V1uGBkuDLgEuITxWe9fjJuF907jYK0dI8EJvcdVyZT+lxkW4saA8Ydq7xiJ3m/3WwMu4QvO4lrhtc84Wru/EZiPcwMuYdDFHKvd3Tjsw7NfjJ/B8dqtrcEyXBky/mTtxtZhDs7oPd5+dKp2W6ewBRf1/tA8UrsnIiIiIiIiIiIi4r/0FYagSGVUJK8oAAAAAElFTkSuQmCC'}}
                />
              </View>
            }
            <Image
              style={styles.goalImage}
              resizeMode={'contain'}
              source={{uri: item.image}}
            />
            <Text style={styles.goalName}>
              {item.name}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };
  _renderItemSubject = ({item, index}) => {
    console.log("asdlkasna: "+JSON.stringify(item))
    return (
      <View style={styles.goalCardWrapper}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({
              selectedSubject: index,
              subject: item.name,
              subjectImage: item.image,
              topicAvailable: item.topic_available
            });
          }}
        >
          <View
            style={ [styles.goalCard, {transform: [{scaleX: 1.05}, {scaleY: 1.05}]}]}
          >
            {
              this.state.selectedSubject === index
              && <View style={styles.selectedCardIconContainer}>
                <Image
                  style={styles.selectedCardIcon}
                  source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAABm0lEQVR4nO3YT6uMYQDG4YOFrJCTSBKJRDp1okgpSlGUIhYWko2Ftc9gZ8knsLdSylZSpFBSUjoJIUI4nMtiRnQ8M/7M+76Pcl/bmad+9zM17zRjYxERERERERERERHxb8JGXMZ1HK7d0ylM4IXvprGudlcnsAnP/exA7bbWYQOeFsY/waLafa3C+v7Q2V5ionZfq7AWU4XxrzBZu69VWIPHhfGvsbV2X6uwCo8K499gW+2+VmElHhbGv8WO2n2twgo8KIx/h521+4bCXExi9V+eX477hfHvsavp3kZhHq72g2dwHgv+4PxS3CuM/4A9bbY3ArsL8Xex+TfOjuNO4fxH7O2if2TYXhjw7RM8PeTcEtwunPuE/V1uGBkuDLgEuITxWe9fjJuF907jYK0dI8EJvcdVyZT+lxkW4saA8Ydq7xiJ3m/3WwMu4QvO4lrhtc84Wru/EZiPcwMuYdDFHKvd3Tjsw7NfjJ/B8dqtrcEyXBky/mTtxtZhDs7oPd5+dKp2W6ewBRf1/tA8UrsnIiIiIiIiIiIi4r/0FYagSGVUJK8oAAAAAElFTkSuQmCC'}}
                />
              </View>
            }
            <Image
              style={styles.goalImage}
              resizeMode={'contain'}
              source={{uri: item.image}}
            />
            <Text style={styles.goalName}>
              {item.name}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

   render() {
    console.log("ansanadskjaL : "+this.state.selectedSubject);
    return (
      <View style={styles.container}>
        <View style={{marginLeft:0, marginTop: 0.04 * screen.height, marginBottom: 0.02 * screen.height}}>
            <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 0.07 * screen.width, color: '#7741cd'}}> Create Challenge </Text>
        </View>
        <ScrollView style={{width: '100%'}}>
        <View style={styles.durationContainer}>
          <Text style={styles.sectionTitle}>Duration</Text>
          <View style={styles.toggleWrapper}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({duration: 30});
              }}
            >
              <View style={
                this.state.duration === 30
                  ? [styles.durationToggle, styles.activeToggle]
                  : styles.durationToggle
              }>
                {
                  this.state.duration === 30
                  && <Image
                    style={{
                      position: 'absolute',
                      top: 0,
                      height: '100%',
                      width: '100%',
                    }}
                    source={{uri: 'data:image/png;base64,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'}}
                  />
                }
                <Text style={
                  this.state.duration === 30
                    ? [styles.durationToggleText, styles.activeToggleText]
                    : styles.durationToggleText
                }>30 MINUTES</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({duration: 60});
              }}
            >
              <View style={
                this.state.duration === 60
                  ? [styles.durationToggle, styles.activeToggle]
                  : styles.durationToggle
              }>
                {
                  this.state.duration === 60
                  && <Image
                    style={{
                      position: 'absolute',
                      top: 0,
                      height: '100%',
                      width: '100%',
                    }}
                    source={{uri: 'data:image/png;base64,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'}}
                  />
                }
                <Text style={
                  this.state.duration === 60
                    ? [styles.durationToggleText, styles.activeToggleText]
                    : styles.durationToggleText
                }>1 HOUR</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View style={styles.goalContainer}>
          <Text style={styles.sectionTitle}>Goal</Text>
          <View style={styles.goalWrapper}>
            <SnapCarousel
              // ref={(c) => { this._carousel = c; }}
              data={this.state.testData}
              renderItem={this._renderItemGoal.bind(this)}
              sliderWidth={screen.width}
              itemWidth={0.45 * screen.width}
              enableMomentum={true}
              enableSnap={false}
              inactiveSlideScale={0.9}
              inactiveSlideOpacity={1}
              autoplayDelay={100}
              autoplayInterval={1000}
              firstItem={0}
              activeSlideAlignment= {'center'}
              onSnapToItem={index => {
                this.setState({selectedGoal: index})
              }}
            />
          </View>
        </View>
        <View style={[styles.goalContainer, {marginTop: 0, marginBottom: 3 * vh}]}>
          <Text style={styles.sectionTitle}>Subject</Text>
          <View style={styles.goalWrapper}>
          { this.state.isReady &&
            <SnapCarousel
              // ref={(c) => { this._carousel = c; }}
              data={this.state.testData[this.state.selectedGoal].package}
              renderItem={this._renderItemSubject.bind(this)}
              sliderWidth={screen.width}
              itemWidth={0.45 * screen.width}
              enableMomentum={true}
              enableSnap={false}
              inactiveSlideScale={0.9}
              inactiveSlideOpacity={1}
              autoplayDelay={100}
              autoplayInterval={1000}
              firstItem={0}
              activeSlideAlignment= {'center'}
              onSnapToItem={index => {
                this.setState({selectedSubject: index})
              }}
            />
          }
          </View>
        </View>
        </ScrollView>
        { this.state.isReady &&
        <TouchableWithoutFeedback
          onPress={() => {
            if(this.state.topicAvailable) {
              const navigateAction = NavigationActions.navigate({
                routeName: 'newChallengeTopic',
                params: {
                  duration: this.state.duration,
                  goal: this.state.goal,
                  goalImage: this.state.goalImage,
                  subject: this.state.subject,
                  subjectImage: this.state.subjectImage,
                  user: this.props.navigation.state.params.user,
                  username: this.props.navigation.state.params.username
                }
              });
              this.props.navigation.dispatch(navigateAction); 
            }
            else {
              const navigateAction = NavigationActions.navigate({
                routeName: 'loading',
                params: {
                  duration: this.state.duration,
                  goal: this.state.goal,
                  goalImage: this.state.goalImage,
                  subject: this.state.subject,
                  subjectImage: this.state.subjectImage,
                  chapterAvailable: false,
                  path: 'createTest',
                  test_id: null,
                  user: this.props.navigation.state.params.user,
                  username: this.props.navigation.state.params.username
                }
              });
              this.props.navigation.dispatch(navigateAction); 
            }
          }}
            >
              <View style={[styles.nextButton,{bottom: 0}]}>
                <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw, color: 'white'}}>Continue</Text>
              </View>
            </TouchableWithoutFeedback>
          }
          { !this.state.isReady &&
            <View style={{height: 10 * vw,width: 10 * vw, borderRadius: 1.5 * vw, alignSelf: 'center'}}>
              <MaterialIndicator color='purple'/>
            </View>
          }
      </View>
    )
  }

}

export default newCreateChallenge
