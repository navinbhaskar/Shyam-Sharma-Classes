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
} from 'react-native';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
import Carousel from 'react-native-snap-carousel';
import TabA from './TabA';
import Courses from './Courses'
import ClassUpdates from './ClassUpdates'


const Rohit_gaba = require('./images/user-hp.png');


class TeacherHome extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title
  })

  render() {  
    return (
    <View style={{flex:1}}>

    <AppContainer5 />
    </View>
  );
  }
}
export default TeacherHome;


const styles = StyleSheet.create({
  
  
  linearGradientHeader:{
    marginBottom: 5,
    height: 50,
    width:'100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  linearGradientCarousel:{
    marginBottom: 5,
    paddingTop:10,
    height: 140,
    width:'98%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius:3
  },
   container:{
    paddingBottom: 70,
    paddingTop: 20,
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
  },
  teacherImage:{
    height: 150,
    width: 150,
    resizeMode: 'contain',
    alignItems:'center'
  },
  teacherImageContainer:{
    height: 150,
    width: 150,
    alignItems:'center',
  },
  aboutTeacherContainer:{
    height: 100,
    width:'80%',
    alignItems: 'flex-start',
    margin:5,
  },
  teacherName:{
    fontSize:25,
  },
  aboutTeacher:{
    fontSize:15,
    margin:3,
  },
  liveCourses:{
    height: 100,
    width: 100,
    resizeMode: 'contain',
    alignItems:'center',

  }

});
