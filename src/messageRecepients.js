import React, { Component } from 'react';
import {View, Image, FlatList, TouchableWithoutFeedback, Dimensions, Text, BackHandler, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements'
import firebase from 'react-native-firebase';
import axios from 'axios';
import { NavigationActions } from 'react-navigation';
import { DrawerActions } from 'react-navigation-drawer';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height

export default class messageRecepients extends Component {

  /*
  static navigationOptions = ({ navigation }) => ({
    title: 'Chats',
    headerStyle: {
      backgroundColor: '#353666',
    },
    style: {
      backgroundColor: '#353666',
      height: 0.1 * SCREEN_HEIGHT
    },
    headerTintColor: '#fff'
  })
  */
  static navigationOptions = ({ navigation }) => ({
    header: null
  })

  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
    this._renderList = this._renderList.bind(this);
    this.state = {
    active: false,
    random: false,
    isReady: false,
    username: null,
    recepients: []
    }
}

  handleBackButton() {
    this.props.navigation.navigate('Home');
    return true;
  }

  loadData() {
    axios.get(`https://classcast-198812.appspot.com/teachersapp/chat_list_student/`)
      .then((res)=> {
        console.log("chat_list: "+JSON.stringify(res.data));
        this.setState({recepients: res.data.reverse(),
                          isReady: true
             })
      })
      .catch(err=> {console.log("chat_listerrorrr: "+err)});

    axios.get(`https://classcast-198812.appspot.com/teachersapp/updateMessageSeenStatus`)
  }

_renderList({item, index}){
    console.log("data1234: "+JSON.stringify(item));
    return (
      <TouchableWithoutFeedback
          onPress={() => {
            this.props.navigation.navigate('chatScreen', {
              name: item.name,
              username: item.username,
              chat_id: item.chat_id
            });
        }}>
          <View style={{flexDirection:'row', width: '90%', flex:21, backgroundColor: 'rgba(256,256,256,0.8)', marginBottom: 0.015 * SCREEN_HEIGHT, borderRadius: 0.02 * SCREEN_WIDTH, alignSelf: 'center', padding: 0.01 * SCREEN_WIDTH, paddingRight: 0.02 * SCREEN_WIDTH}}>
              <View style={{flex: 5, alignItems: 'center', justifyContent: 'center', paddingTop: 0.01 * SCREEN_HEIGHT, paddingBottom: 0.01 * SCREEN_HEIGHT}}>
                <View style={{backgroundColor: item.type == 'student' ?'#587eeb': item.type == 'teacher'? '#9d80ec': '#eb85b5', alignItems: 'center', justifyContent: 'center', borderRadius: 0.07 * SCREEN_WIDTH, height: 0.14 * SCREEN_WIDTH, width: 0.14 * SCREEN_WIDTH}}>
                  <Text style={{fontFamily: 'Montserrat-Bold', fontSize: 0.07 * SCREEN_WIDTH, color: 'white'}}>{item.name[0]}</Text>
                </View>
              </View>
              <View style={{flex:11, justifyContent:'flex-start', alignSelf: 'center'}}>
              	{ item.type != 'teacher' &&
                  <Text style={{fontFamily: item.type == 'student' ? 'Montserrat-SemiBold': 'Montserrat-Bold', fontSize: 0.04 * SCREEN_WIDTH, alignSelf:'flex-start', color: 'black'}} >{item.name}</Text>
              	}
              	{ item.type == 'teacher' &&
                  <Text style={{fontFamily: item.type == 'student' ? 'Montserrat-SemiBold': 'Montserrat-Bold', fontSize: 0.04 * SCREEN_WIDTH, alignSelf:'flex-start', color: 'black'}} >{item.name+ ' Sir'}</Text>
              	}
                  <View style={{flexDirection:'row'}}>
                      <Text style={{fontFamily: 'Montserrat-Bold', fontSize: 0.025 * SCREEN_WIDTH, color:'#7741cd'}}>{ item.type=="student"? item.batch_id: '' }</Text>
                      { item.type != 'teacher' &&
                      	<Text style={{fontFamily: 'Montserrat-Bold', fontSize: 0.025 * SCREEN_WIDTH, color:'#7741cd', marginLeft:5}}>Class {item.standard}  </Text>
                      }
                      <Text style={{fontFamily: 'Montserrat-Bold', fontSize: 0.025 * SCREEN_WIDTH, color:'#7741cd'}}>{ item.type=="group"? item.teacher_name + ' Sir': '' }</Text>
                  </View>
              </View>
              <View style={{ alignSelf: 'center', marginRight: 0.01 * SCREEN_WIDTH}}>
                <Icon type='font-awesome' name='chevron-right' color= {'#7741cd'}/>
              </View>
          </View>
        </TouchableWithoutFeedback>

    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  async componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    var currentUser = await firebase.auth().currentUser;                 
     await currentUser.getIdToken()
            .then(idToken => {
                  this.setState({ username: currentUser['phoneNumber'].slice(3, 13) });
                });


    const db = firebase.firestore()
        db.collection('chatLists')
          .doc(this.state.username)
            .onSnapshot((doc)=> {
              if (doc.exists) {
                this.loadData()
              }
            }),
            (error) => {
            console.error(error);
            };

    this._navListener = this.props.navigation.addListener('didFocus', () => {
      this.loadData()
    })

  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#e2e2e2'}}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 8 * vh, backgroundColor: '#ffffff', marginBottom: 5 * vh}}>
	        <View style={{justifyContent:'flex-start', marginLeft:10}}>
		        <Icon           
		          name='menu'
		          color='#7741cd'
		          type='material'
		          size= {35} 
		          onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}
		          />
	        </View>
	        <View style={{marginLeft:0}}>
	          <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 3 * vh, color: '#7741cd'}}> Chats </Text>
	        </View>
	        <View style={{justifyContent:'flex-end', marginRight: 10}}>
		        <Icon
		          name='notifications'
		          color='#7741cd'
		          type='material'
		          size= {35} 
		          onPress={() => this.props.navigation.navigate('notification', { title: "Notification" })}
		          />
		        </View>
	    </View>

        <View style={{padding:2}}>
        { this.state.isReady &&
          <FlatList 
              data={this.state.recepients}
              extraData={this.state}
              renderItem={this._renderList}
            />  
         }            
        </View>
        { !this.state.isReady &&
          <ActivityIndicator size="large" color='#7741cd' />
         }
        <TouchableWithoutFeedback
          onPress={() => {
            console.log("saosankjs");
            this.props.navigation.navigate('newChat');
            //this.props.navigation.navigate('chatStackNavigator', {}, NavigationActions.navigate({ routeName: 'chatScreen' }));
          }}
        >
          <View style={{ position: 'absolute', bottom: 0.05 * SCREEN_WIDTH, right: 0.05 * SCREEN_WIDTH, backgroundColor: '#6382ff', height: 0.16 * SCREEN_WIDTH, width: 0.16 * SCREEN_WIDTH, borderRadius: 0.08* SCREEN_WIDTH, justifyContent: 'center'}}>
            <Icon
              name='plus'
              type='font-awesome'
              color={'white'}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}