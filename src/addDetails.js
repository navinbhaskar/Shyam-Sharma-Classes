import React, { Component } from 'react';
import { View, Image, FlatList, TouchableNativeFeedback, ScrollView, StyleSheet, Dimensions, LayoutAnimation, TextInput, Picker, ToastAndroid, Input, Text, BackHandler } from 'react-native';
import axios from "axios";
import {NavigationActions} from 'react-navigation';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;


export default class addDetails extends Component {

  static navigationOptions = {
      header: null,
      };
      
  constructor(props) {
      super(props);
      this.submitData = this.submitData.bind(this);
      this.state = {
        selectedClassesIndex: 3,
        selectedStreamIndex: 2,
        loading: false,
        selectedType: null,
        fontLoaded: false,
        school_name: '',
        firstname: '',
        lastname: '',
        coachingName:'',
        schoolNameValid: false,
        text: '',
        standard: null,
        gender: null,
        batch_id: null,
        isNameValid: false,
        submitAttempted: false,
        message: 'Please enter a valid name',
        batchList: [],
        batchSelected: false,
        relationshipToStudent: 'Other'
      }
      this.handleBackButton = this.handleBackButton.bind(this);
  }

  
  handleBackButton() {
    this.props.navigation.goBack(null);
    return true;
  }


  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  submitData() {
    console.log("submitData: "+this.state.isNameValid+'||'+this.state.schoolNameValid);
    
    var data = {
                "school": this.state.school_name,
                "coachings": this.state.coachingName
              }
      console.log("sdnlskadsak: "+JSON.stringify(data));
      axios.post('https://classcast-198812.appspot.com/users/completeprofile', data)
            .then((response) => 
            {
              this.setState({loading: false});
              if(response.data.status == 'True'){
                ToastAndroid.showWithGravity("Added successfully", ToastAndroid.SHORT, ToastAndroid.CENTER);
                //this.props.navigation.goBack(null);
                this.props.navigation.navigate('HomeStack', {}, NavigationActions.navigate({ routeName: 'addParent' }));
              }
              else{
                this.setState({schoolNameValid: false});
                ToastAndroid.showWithGravity("Something went wrong", ToastAndroid.SHORT, ToastAndroid.CENTER);
                this.setState({message: response.data.message});
              }
            })
            .catch((error) => {
              this.setState({loading: false});
            })
            
  }

  render() {

    const { selectedClassesIndex, selectedStreamIndex, school_name, gender, username, usernameValid, standard } = this.state
    return (
      <View style={{backgroundColor: '#293046', height: SCREEN_HEIGHT, width: SCREEN_WIDTH}}>
        <ScrollView
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
        <Text style={styles.h2}> Add Details </Text>

       <View style={{ width: '75%', alignItems: 'center', height: 0.08 * SCREEN_HEIGHT, borderRadius: 0.1 * SCREEN_WIDTH, borderWidth: 2, borderColor: this.state.schoolNameValid ? 'white': this.state.submitAttempted ? 'red': 'white', justifyContent: 'center', alignItems: 'center', marginTop: .05 * SCREEN_WIDTH}}>
        <TextInput
          style={{width: '100%', fontFamily: 'Montserrat-Regular', fontSize: 0.04 * SCREEN_WIDTH, color: 'white', textAlign: 'center',}}
          placeholder='Enter school Name'
          placeholderTextColor= 'white'
          onChangeText={(text) => {
            this.setState({school_name: text});
            if(text.length>0){
              this.setState({isNameValid: true})
            }
            else {
              this.setState({isNameValid: false}) 
            }
          }}
        />
        </View>
        { this.state.submitAttempted && !this.state.isNameValid &&
          <Text style={{color: 'red'}}>Please enter school name</Text>
        }
       
        <View style={{ width: '75%', alignItems: 'center', height: 0.08 * SCREEN_HEIGHT, borderRadius: 0.1 * SCREEN_WIDTH, borderWidth: 2, borderColor: this.state.schoolNameValid ? 'white': this.state.submitAttempted ? 'red': 'white', justifyContent: 'center', alignItems: 'center', marginTop: .05 * SCREEN_WIDTH }}>
        <TextInput
          style={{width: '100%', fontFamily: 'Montserrat-Regular', fontSize: 0.04 * SCREEN_WIDTH, color: 'white', textAlign: 'center',}}
          inputStyle={styles.inputStyleName}
          placeholder=" Enter coaching name "
          placeholderTextColor= 'white'
          onChangeText={(text) => {
            this.setState({coachingName: text});
            if(text.length>0){
              this.setState({schoolNameValid: true})
            }
            else {
              this.setState({schoolNameValid: false}) 
            }
        }}
          onSubmitEditing={() => {
            console.log("working varified")
          }}
        />
        </View>
        { this.state.submitAttempted && !this.state.schoolNameValid &&
          <Text style={{color: 'red'}}>{this.state.message}</Text>
        }
        
    
      <View style={{flexDirection: 'row', height: 0.1 * SCREEN_HEIGHT, width: '75%', justifyContent: 'space-between', marginTop: 0.05 * SCREEN_HEIGHT}}>

      <TouchableNativeFeedback
        onPress={()=> {
          this.props.navigation.navigate('HomeStack', {}, NavigationActions.navigate({ routeName: 'addParent' }));
        }}>
      <Text style={{fontSize: 3 * vh, color: 'yellow',fontFamily: 'Montserrat-Bold', textDecorationLine: 'underline'}}>Skip</Text>
      </TouchableNativeFeedback>


      <TouchableNativeFeedback
        onPress={()=> {
          this.setState({submitAttempted: true});
          if(this.state.schoolNameValid && this.state.isNameValid){
            this.submitData();
          }
        }}>
      <Text style={{fontSize: 3 * vh, color: 'yellow',fontFamily: 'Montserrat-Bold', textDecorationLine: 'underline'}}>Next</Text>
      </TouchableNativeFeedback>
      </View>
      </ScrollView>
      </View>
    );
  }
}


export const UserTypeItem = props => {
  const { image, label, labelColor, selected, ...attributes } = props;
  return (
    <TouchableNativeFeedback {...attributes}>
      <View
        style={[
          styles.userTypeItemContainer,
          selected && styles.userTypeItemContainerSelected,
        ]}
      >
        <Text style={[styles.userTypeLabel, { color: labelColor }]}>
          {label}
        </Text>
        <Image
          source={image}
          style={[
            styles.userTypeMugshot,
            selected && styles.userTypeMugshotSelected,
          ]}
        />
      </View>
    </TouchableNativeFeedback>
  );
};

export const UserClass = props => {
  const { label, labelColor, selected,...attributes } = props;
  return (
    <TouchableNativeFeedback {...attributes}>
      <View
        style={[
          styles.userClassItemContainer,
          selected && styles.userClassItemContainerSelected,
        ]}
      >
      <Text style={[styles.userTypeLabel, { color: labelColor }]}>
          {label}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
};


const styles = StyleSheet.create({
  
  container: {
    paddingBottom: 0.1 * SCREEN_HEIGHT,
    paddingTop: 0.05 * SCREEN_HEIGHT,
    backgroundColor: '#293046',
    alignItems: 'center',
  },
   h2: {
    fontFamily: 'Montserrat-Bold',
     fontSize: 0.06 * SCREEN_WIDTH,
    paddingBottom: 0.05 * SCREEN_HEIGHT,
    paddingTop: 0.05 * SCREEN_HEIGHT,
    color: 'white',
  },
   h3: {
    paddingBottom: 20,
    paddingTop: 20,
    fontSize: 20,
    color: 'white',
  },
  flatListContainer: {
    marginTop: 20,
    flex: 1
  },
  formContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  userTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  classTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 0.02 * SCREEN_WIDTH,
    justifyContent: 'space-around',
    width: '80%',
    alignItems: 'center',
    marginTop: 0.01 * SCREEN_HEIGHT,
  },
  userTypeItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  userTypeItemContainerSelected: {
    opacity: 1,
  },
  userClassItemContainer: {
    height: 0.05 * SCREEN_HEIGHT, 
    width: 0.2 * SCREEN_WIDTH, 
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
    margin: 0.01 * SCREEN_WIDTH,
    borderRadius: 0.1 * SCREEN_WIDTH,
    borderWidth: .005 * SCREEN_WIDTH,
    borderColor: 'white'
  },
  userClassItemContainerSelected: {
    opacity: 1,
    backgroundColor: 'rgba(110, 120, 170, 1)',
  },

  userTypeMugshot: {
    margin: 4,
    height: 80,
    width: 80,
  },
  userTypeMugshotSelected: {
    height: 110,
    width: 110,
  },
  userTypeLabel: {
    color: 'yellow',
    fontFamily: 'bold',
    fontSize: 11,
  },
  inputContainer: {
    paddingLeft: 8,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(110, 120, 170, 1)',
    height: 45,
    marginVertical: 10,
  },
  inputStyle: {
    flex: 1,
    marginLeft: 10,
    color: 'white',
    fontFamily: 'light',
    fontSize: 16,
  },
  errorInputStyle: {
    marginTop: 0,
    textAlign: 'center',
    color: '#F44336',
  },
  inputStyleName: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'light',
    color: '#211482',
   fontSize: 35,
   fontFamily: 'Montserrat-SemiBold',
  },
});