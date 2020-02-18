import React from "react";
import {  Image,
  StyleSheet,
  ScrollView,
  Text,
  View, } from "react-native";
import Placeholder from "rn-placeholder";


const image = require('./images/user-hp.png');

const customPlaceholder = props => {
  return (
  	<View style={{flex:1, flexDirection: 'row', width: '100%'}}>
    <View style={styles.teacherContainer}>
      <View style={styles.teacherImageContainer}>
        <Image
          source={image}
          style={styles.teacherImage}/>
        </View>
        <View style={{width:50,  borderWidth:4, height: 8, borderColor:'grey', margin:5}}></View>
    </View>
    <View style={styles.teacherContainer}>
      <View style={styles.teacherImageContainer}>
        <Image
          source={image}
          style={styles.teacherImage}/>
        </View>
       	<View style={{width:50, borderWidth:4, height: 8, borderColor:'grey', margin:5}}></View>
    </View>
    </View>
  );
};


export default Placeholder.connect(customPlaceholder);

const styles = StyleSheet.create({
  
 
   teacherImage: {
    height: 80,
    width: 80,
    resizeMode:'contain',
    opacity: 0.4
  },
  teacherName: {
    fontSize:12,
    color: '#0F3651',
    fontWeight: 'bold',   
  },
  teacherImageContainer: {
    height: 90,
    width: 90,
    borderRadius: 45,
    borderWidth: 3,
    marginTop:5,
    alignItems:'center',
    justifyContent: 'center',
    borderColor: 'grey',
    elevation: 3
  },
  teacherContainer: {
    margin: 3,
    height: 145,
    elevation: 4,
    zIndex: 1,
    alignItems:'center'
  }
});