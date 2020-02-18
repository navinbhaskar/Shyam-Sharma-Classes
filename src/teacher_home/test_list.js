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
  FlatList
} from 'react-native';
import axios from "axios";
import {StackActions, NavigationActions} from 'react-navigation';
const screen = Dimensions.get('window'),
  vh = screen.height / 100,
  vw = screen.width / 100;


class test_list extends Component {


  static navigationOptions = ({ navigation }) => ({
    header: null
  })

  constructor() {
    super();
    this._renderList = this._renderList.bind(this);
    this.state = {
      updates: [],
      ActiveSlide: 0
    }
  }

  _renderList({item, index}){
    return (
      <TouchableNativeFeedback
        onPress={() => {
          const navigateAction = NavigationActions.navigate({
                  routeName: 'viewTest',
                  params: {
                    test_id: item.test_id,
                    goal: "skdnlfk",
                    subject: "esmkmlmdf",
                    timer: 300,
                    duration: 300
                  },
                });
                this.props.navigation.dispatch(navigateAction);
        }}>
        <View style={{flexDirection:'row', width: '95%', flex:21, marginTop: 1 * vh, marginBottom: 1 * vh, borderRadius: 2 * vw, elevation: 2, alignSelf: 'center', paddingTop: 1 * vh, paddingBottom: 1 * vh}}>
            <View style={{flex: 4, alignItems: 'center', justifyContent: 'center'}}>
              <View style={{backgroundColor: '#f3e8f0', alignItems: 'center', justifyContent: 'center', borderRadius: 7 * vw, height: 14 * vw, width: 14 * vw, alignSelf: 'center'}}>
                <Image
                      source= {{uri: 'data:image/png;base64,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'}}
                      style={{
                        width: 8 * vw,
                        height: 8 * vw,
                      }}
                    />
              </View>
            </View>

            <View style={{flex:12, justifyContent:'flex-start', flexDirection: 'column'}}>
              <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 3.5 * vw, alignSelf:'flex-start', marginBottom: 1 * vh}} >{item.exam_name}, {item.package}, {'Class: '+item.class}</Text>
            {
              item.sections && item.sections.map((blocks, index)=>{
                return(
                      <View style={{flexDirection:'row'}}>
                          <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 2.5 * vw, color:'black'}}>{index+1}: {blocks}</Text>
                      </View>

                )
              })
            }
              <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 3 * vw, color:'#f32a76', alignSelf:'flex-start'}}>{(new Date(item.time).toLocaleString())}</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
    );
  }

  componentDidMount() {
    axios.get(`https://classcast-198812.appspot.com/coursedata/myTests/`+this.props.navigation.state.params.teacher_id)
      .then((response)=>{
        console.log("sdjsadjkssddnsa: "+JSON.stringify(response.data));
        this.setState({ updates: response.data })
      })
      .catch((error)=> {
        console.log('sdjsadjkssddnsa'+error);
      });
  }

  render () {
    return(
      <View style={styles.mainContainer}>
        <FlatList
          data={this.state.updates}
          extraData={this.state}
          renderItem={this._renderList}
          />
      </View>
    )
  }
}

export default test_list

const styles = StyleSheet.create({
  mainContainer: {
    alignSelf: 'center',
    width:'100%',
    backgroundColor: '#ffffff'
  },
  headerCardShadow:{
    height: 25 * vh,
    width: '100%'
  },
  headerCardImage: {
    height: 25 * vh,
    width: 100 * vw,
    resizeMode: 'stretch'
  },
  nextSlide: {
    position: 'absolute',
    right: 5 * vw,
    top: 8 * vh,
    height: 10 * vw,
    width: 10 * vw
  },
  prevSlide: {
    position: 'absolute',
    left: 5 * vw,
    top: 8 * vh,
    height: 10 * vw,
    width: 10 * vw
  },
})