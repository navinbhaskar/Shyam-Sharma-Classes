import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  Platform,
  BackHandler,
  Dimensions,
  Image,
  FlatList,
  ToastAndroid
} from 'react-native';
import axios from "axios";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import {NavigationActions} from 'react-navigation';
const screen = Dimensions.get('window'),
  vh = screen.height / 100,
  vw = screen.width / 100;

//class HomePageHeader extends Component {
export default class HomePageHeader extends React.Component {


  static navigationOptions = ({ navigation }) => ({
    header: null
  })

  constructor() {
    super();
    this._renderHeader = this._renderHeader.bind(this);
    this.navigateToScreen = this.navigateToScreen.bind(this);
    this.state = {
      updates: [],
      ActiveSlide: 0
    }
  }

  handleBackButton = () => {
    console.log("dsnldsknldsnds");
    this.props.navigation.goBack(null);
    return true;
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    axios.get(`https://classcast-198812.appspot.com/users/whatsnew`)
      .then((response)=>{
        console.log("sdjsadjkssddnsa: "+JSON.stringify(response.data));
        this.setState({ updates: response.data })
      })
      .catch((error)=> {
        console.log('sdjsadjkssddnsa'+error);
      });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  navigateToScreen = (route, url, name) => {
    console.log("saklndlknA: "+route);
    const navigateAction = NavigationActions.navigate({
      routeName: route,
      params: {
        url: url,
        name: name
      },
    });
    this.props.navigation.dispatch(navigateAction);
  }

  _renderHeader ({item, index}) {
    console.log("sanaloasnda: "+JSON.stringify(item))
    return (
        <TouchableNativeFeedback
          onPress={() => {
              console.log("workingndkjds: "+JSON.stringify(item))
              if(item.type == 'video'){
                axios.post(`https://classcast-198812.appspot.com/coursedata/generateSignedUrl`, {
                  "path": item.path
                })
                  .then( response => {
                    console.log("gkyyufyifSS: "+JSON.stringify(response.data));
                    //this.setState({startBuffering: false});
                    this.navigateToScreen('video', response.data, item.display_name);
                  })
                  .catch(err => {
                    console.log("mkldfsndfskl: "+err);
                    //this.setState({startBuffering: false});
                    ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
                  })
              }

              else if(item.type == 'course') {
                const navigateAction = NavigationActions.navigate({
                  routeName: 'CourseHome',
                  params: {
                    course_id: item.course_id,
                    display_name: item.display_name,
                    teacher_name: item.teacher_name,
                    number_of_videos: item.video,
                    number_of_assignment: item.assignment,
                    number_of_pdf: item.pdf,
                    percentage_completion: 0
                  },
                });
                this.props.navigation.dispatch(navigateAction);
              }
              else if(item.type == 'pdf') {
                const navigateAction = NavigationActions.navigate({
                  routeName: 'pdfViewer',
                  params: {
                    url: item.url
                  },
                });
                this.props.navigation.dispatch(navigateAction);
              }
              else if(item.type == 'web') {
                const navigateAction = NavigationActions.navigate({
                  routeName: 'webViewer',
                  params: {
                    url: item.url
                  },
                });
                this.props.navigation.dispatch(navigateAction);
              }
              else if(item.type == 'teacher') {
                axios.get(`https://classcast-198812.appspot.com/teachers/idToTeacherDetails/`+item.teacher_id)
                  .then((response)=>{
                    console.log("sdjsadjkssddnsa: "+JSON.stringify(response.data));
                    this.props.navigation.navigate('TeacherArea', { data: response.data, isEnrolled: true})
                  })
                  .catch((error)=> {
                    console.log('sdjsadjkssddnsa'+error);
                  });
              }
              else if(item.type == 'test') {
                const navigateAction = NavigationActions.navigate({
                  routeName: 'loading',
                  params: {
                    duration: item.duration,
                    goal: item.goal,
                    test_id: item.test_id,
                    chapterAvailable: item.chapter_available,
                    path: 'TabB_test',
                    chapter_name: item.chapter,
                    subject: item.subject,
                  }
                });
                this.props.navigation.dispatch(navigateAction);
              }
              else{
                console.log("working")
              }
            }}
          >
            <View style={styles.headerCardShadow}>
              <Image
                style={styles.headerCardImage}
                source={{uri: item.thumbnail}}
              />
            </View>   
        </TouchableNativeFeedback>
        );
    }


  render () {
    return(
      <View style={styles.mainContainer}>
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={this.state.updates}
          renderItem={this._renderHeader}
          sliderWidth={100 * vw}
          itemWidth={100 * vw}
          inactiveSlideScale={0.5}
          inactiveSlideOpacity={0}
          activeSlideOffset={200}
          autoplayInterval={1000}
          enableSnap
          keyExtractor={(item, index) => index.toString()}
          activeSlideAlignment= {'center'}
          onSnapToItem={(index) => this.setState({ ActiveSlide: index }) }
        />
      
        <TouchableNativeFeedback
            onPress={() => {
              this._carousel.snapToPrev() 
            }}
          >
          <View style={styles.prevSlide}>
            <Image
              source= {{uri: 'data:image/png;base64,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'}}
              style={{
                width: '100%',
                height: '100%'
              }}
            />
          </View>  
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
            onPress={() => {
              this._carousel.snapToNext() 
            }}
          >
          <View style={styles.nextSlide}>
            <Image
              source= {{uri: 'data:image/png;base64,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'}}
              style={{
                width: '100%',
                height: '100%'
              }}
            />
          </View>  
        </TouchableNativeFeedback>
      </View>
      )
  }
}



const styles = StyleSheet.create({
  mainContainer: {
    alignSelf: 'center',
    width:'100%',
    marginTop: 1 * vw,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginBottom: 2 * vh,
  },
  headerCardShadow:{
    alignSelf: 'center',
    height: 50 * vw,
    width: '98%'
  },
  headerCardImage: {
    height: 50 * vw,
    width: '100%',
    resizeMode: 'stretch'
  },
  nextSlide: {
    position: 'absolute',
    opacity: 0.3,
    right: 5 * vw,
    top: 8 * vh,
    height: 10 * vw,
    width: 10 * vw
  },
  prevSlide: {
    position: 'absolute',
    left: 5 * vw,
    opacity: 0.3,
    top: 8 * vh,
    height: 10 * vw,
    width: 10 * vw
  },
})