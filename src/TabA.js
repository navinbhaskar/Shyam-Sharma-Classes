import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableNativeFeedback
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import axios from "axios";
import firebase from 'react-native-firebase';
import { DrawerActions } from 'react-navigation-drawer';
import CourseListPlaceholder from "./courseListPlaceholder";
import {NavigationActions} from 'react-navigation';

class disover extends Component {


  constructor(props) {
    super(props);
    this._renderItem = this._renderItem.bind(this);
    this.state = {
      username: '',
      n_teachers: 0,
      isReady: false,
    availableTeachers: [
      {
      }
      ]
    }
  }

  async componentDidMount() {       
    var currentUser = await firebase.auth().currentUser;                 
     await currentUser.getIdToken()
                      .then(idToken => {
                            
                            this.setState({ username: currentUser['phoneNumber'].slice(3, 13) })
                          });

    axios.get(`https://classcast-198812.appspot.com/teachers/availableTeachers/`+this.state.username)
              .then(function (response){
                this.setState({availableTeachers: response.data});
                this.setState({n_teachers: response.data.length});
                this.setState({isReady: true});
              }.bind(this))
              .catch(function (error) {
                console.log('error');
                this.setState({isReady: true});
              });
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      this.setState({isReady: false});
      axios.get(`https://classcast-198812.appspot.com/teachers/availableTeachers/`+this.state.username)
              .then(function (response){
                this.setState({availableTeachers: response.data});
                this.setState({n_teachers: response.data.length});
                this.setState({isReady: true});
              }.bind(this))
              .catch(function (error) {
                console.log('error');
                this.setState({isReady: true});
              });
    })
  } 



  _renderItem ({item, index}) {
    console.log("dsasd: "+JSON.stringify(item.teacher_id))
    if(item.teacher_id == this.state.teacherFromDeepLink) {
      this.setState({activeTeacher: index})
    }
    return (
      <TouchableNativeFeedback containerStyle={{flex:1}}
        onPress={() => {
          this.props.navigation.navigate('TeacherArea', { data: item, isEnrolled: false})
        }}>
            <View style={styles.teacherCardContainer}>
              <View style={styles.teacherPreview}>
                <View style={styles.teacherPreviewLeft}>
                  <Text style={styles.h2}>{item.firstname} {item.lastname} - {item.subject} </Text>
                    <View style={styles.insituteName}>
                      <Icon
                          name='university'
                          type='font-awesome'
                          color='#6003bb'
                          size={20}
                        />
                      <Text style={styles.h3}> {item.coaching_name} </Text>

                    </View>
                    <View style={styles.insituteName}>
                      <Icon
                          name='compass'
                          type='font-awesome'
                          color='#6003bb'
                          size={20}
                        />
                      <Text style={styles.h3}> {item.area} </Text>
                      
                    </View>
                  
                 <View style={styles.insituteName}>
                    <Icon
                      name='play-circle-outline'
                      type='material'
                      size={20}
                      color='#6003bb'
                    />
                    <Text style={styles.videoCount}> {item.number_of_courses} Courses </Text>

                  </View>
                </View>
                <View style={styles.teacherCardRight} >
                <View style= {styles.teacherImageContainer}>
                    <Image source={{uri: item.photo}} style={styles.teacherImage}/>
                </View>
                { item.classcast_select &&
                <View style={{height: 12 * vw, width: 12 * vw, position: 'absolute' }}>
                <Image
                  source={{uri: 'data:image/png;base64,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'}}
                  style={{height: 12 * vw, width: 12 * vw, marginLeft: 12 * vw}}/>
                </View>
              }
                </View>
                <View style={{justifyContent: 'center'}}>
                <Icon
                      name='chevron-right'
                      type='font-awesome'
                      size={20}
                      color='#6003bb'
                    />
                  </View>
              </View>
            </View>
          </TouchableNativeFeedback>
         );
    }

  render () {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 8 * vh, backgroundColor: '#ffffff'}}>
        <View style={{justifyContent:'flex-start', marginLeft: 3 * vw}}>
        <Icon           
          name='menu'
          color='#7741cd'
          type='material'
          size= {35} 
          onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}
          />
        </View>
        <View style={{marginLeft:0}}>
          <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 3 * vh, color: '#7741cd',}}> Discover Teachers</Text>
        </View>
        <View style={{justifyContent:'flex-end', marginRight: 3 * vw}}>
        <Icon
          name='notifications'
          color='#7741cd'
          type='material'
          size= {35} 
          onPress={() => this.props.navigation.navigate('notification', { title: "Notification" })}
          />
        </View>

      </View>

      <CourseListPlaceholder onReady={this.state.isReady} animate="fade">
      { this.state.n_teachers == 0 && this.state.isReady &&
        <View style={{height: 5 * vh, width: 60 * vw, marginTop: 5 * vh}}>
          <Text style={{fontSize: 20, color: 'white', textAlign: 'center'}}> No available teachers </Text>
        </View>
      }
        <FlatList
          style={{width:'100%'}}
          data={this.state.availableTeachers.reverse()}
          showsVerticalScrollIndicator={false}
          renderItem={this._renderItem }
          initialScrollIndex={this.state.activeTeacher}
          keyExtractor={(item, index) => index.toString()}
        />
      </CourseListPlaceholder>
        
      </View>
      )
  }
}

export default disover;

const styles = StyleSheet.create({
  
  container:{
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#ffffff',
    },
    h2:{
      fontSize: 2.2 * vh,
      fontFamily: 'Montserrat-Bold',
      color: '#5e5e5e'
    },
    h3:{
      marginLeft: 1 * vw,
      fontFamily: 'Montserrat-SemiBold',
      fontSize: 1.8 * vh,
      color: '#5e5e5e',

    },
    videoCount: {
      marginLeft: 1 * vw,
      fontFamily: 'Montserrat-SemiBold',
      fontSize: 1.8 * vh,      
      color: '#5e5e5e'
    },
    h2Blue:{
      fontSize: 2 * vh ,
      fontWeight: 'bold',
      color: '#262f46'
    },
    teacherCardContainer:{
      width: '98%',
      alignSelf: 'center',
      borderRadius: 2 * vw,
      backgroundColor:'#ffffff',
      elevation: 3,
      marginTop: 2* vh ,
      padding: 0.5 * vh,
      elevation: 5,
    },
    teacherPreview:{
      flex:1,
      flexDirection:'row',
    },
    teacherPreviewLeft:{
      flex: 6,
      margin: 0.5 * vh ,
    },
    teacherAbout:{
      width: '100%',
    },
    teacherImageContainer:{
      height: 27 * vw,
      width: 27 * vw,
      alignItems: 'center',
      padding: 1 * vw,
      backgroundColor: '#ff7816',
      borderRadius: 15 * vw
    },
    teacherCardRight:{
      width:'36%',
      margin: 0.5* vh ,
      alignItems: 'center',
    },
    teacherImage:{
      alignSelf: 'center',
      resizeMode:'contain',
      height: 25 * vw,
      width: 25 * vw,
    },
    videoTestCount:{
      flex:1,
      alignItems:'center',
      flexDirection:'row',
      margin: 0.5 * vh,
    },
    insituteName:{
      marginTop: 1.5 * vh,
      alignItems:'center',
      flexDirection:'row',
      margin: 0
    }
  });
