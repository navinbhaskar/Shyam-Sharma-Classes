import React from "react";
import {  Image,
  StyleSheet,
  ScrollView,
  Text,
  View, } from "react-native";
import Placeholder from "rn-placeholder";


const courseListPlaceholder = props => {
  return (

    <View style={{flex:2}}>
    <View style={{margin: 12, backgroundColor:'white', borderRadius: 5, height: 160}} >
        <View style={{width:320, height: 15, backgroundColor:'grey', margin:5}}>
        </View>
      <View style={{flex:1, flexDirection:'row', height: 60}}>
        <View style={{width:'58%', margin: 5}}>
          <View style={{height: 10, backgroundColor:'grey', margin:8}}></View>
          <View style={{height: 10, backgroundColor:'grey', margin:8}}></View>
          <View style={{height: 10, backgroundColor:'grey', margin:8}}></View>
          <View style={{height: 10, backgroundColor:'grey', margin:8}}></View>
        </View>
        <View  style={{width:'38%', margin: 5}}>
          <View style={{height: 50, backgroundColor:'grey', margin:8}}></View>
          <View style={{height: 20, backgroundColor:'grey', margin:8}}></View>
        </View>
      </View>
              
    </View>
    <View style={{margin: 12, backgroundColor:'white', borderRadius: 5, height: 160}} >
        <View style={{width:320, height: 15, backgroundColor:'grey', margin:5}}>
        </View>
      <View style={{flex:1, flexDirection:'row', height: 60}}>
        <View style={{width:'58%', margin: 5}}>
          <View style={{height: 10, backgroundColor:'grey', margin:8}}></View>
          <View style={{height: 10, backgroundColor:'grey', margin:8}}></View>
          <View style={{height: 10, backgroundColor:'grey', margin:8}}></View>
          <View style={{height: 10, backgroundColor:'grey', margin:8}}></View>
        </View>
        <View  style={{width:'38%', margin: 5}}>
          <View style={{height: 50, backgroundColor:'grey', margin:8}}></View>
          <View style={{height: 20, backgroundColor:'grey', margin:8}}></View>
        </View>
      </View>
              
    </View>
    </View>
  );
};

export default Placeholder.connect(courseListPlaceholder);

