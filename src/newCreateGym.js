import React, { Component } from 'react'
import {Dimensions, Image, Text, TouchableWithoutFeedback, View, BackHandler, ScrollView} from 'react-native'
import styles from './TestStyles';
import SnapCarousel from 'react-native-snap-carousel';
import {NavigationActions, StackActions} from 'react-navigation';
import axios from "axios";
import {MaterialIndicator} from 'react-native-indicators';

const screen = Dimensions.get('window');


class newCreateGym extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Create Test',
    header: null
  })

   constructor() {
    super();
    this.state = {
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
            <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 0.07 * screen.width, color: '#7741cd'}}> Create Gym </Text>
        </View>
        <ScrollView style={{width: '100%'}}>
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
                routeName: 'topic',
                params: {
                  goal: this.state.goal,
                  goalImage: this.state.goalImage,
                  subject: this.state.subject,
                  subjectImage: this.state.subjectImage
                }
              });
              this.props.navigation.dispatch(navigateAction); 
            }
            else {
              const navigateAction = NavigationActions.navigate({
                routeName: 'loading',
                params: {
                  goal: this.state.goal,
                  goalImage: this.state.goalImage,
                  subject: this.state.subject,
                  subjectImage: this.state.subjectImage,
                  chapterAvailable: false,
                  path: 'createTest',
                  test_id: null
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

export default newCreateGym
