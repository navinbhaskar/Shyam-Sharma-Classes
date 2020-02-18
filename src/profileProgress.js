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

class profileProgress extends Component {


  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      data: [],
    }
  }

  componentDidMount() {       
    axios.get('https://classcast-198812.appspot.com/users/profile_progress')
      .then((response) => {
        console.log("dasmlaskmdsa: "+JSON.stringify(response.data.profile_progress));
        this.setState({data: response.data.profile_progress});
      })
  } 


  render () {
    return (
      <View style={styles.container}>
      {
        this.state.data && this.state.data.map((section, index)=>{
          return(
            <View style={{flexDirection: 'column', width: '100%'}}>

              <TouchableNativeFeedback onPress={()=> {
                if(!section.status) {
                  if(section.type == "screen") {
                    this.props.navigation.navigate('HomeStack', {}, NavigationActions.navigate({ routeName: section.screen }));
                  }
                }
              }}>

                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                  <View style={{height: 10 * vw, width: 10 * vw, borderRadius: 5 * vw, margin: 5 * vw, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', elevation: 5}}>
                    <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 3 * vw}}>{index+1}</Text>
                  </View>
                  <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 3 * vw, textDecorationLine: section.status ? 'line-through': 'none'}}>{section.text}</Text>
                </View>
              </TouchableNativeFeedback>

            </View>
            )
        })
      }
      </View>
      )
  }
}

export default profileProgress;

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
