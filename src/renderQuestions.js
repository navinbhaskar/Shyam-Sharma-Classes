import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  Platform,
  BackHandler
} from 'react-native';
import MathJax from 'react-native-mathjax';

class RenderQuestions extends Component {


  static navigationOptions = ({ navigation }) => ({
    header: null
  })

  constructor() {
    super();
    this.state = {
      }
  }



  render () {
    return(
      <View style={[styles.txtContainer, {backgroundColor: this.props.data.color}]}>
        <MathJax
                html={this.props.data.text}
                mathJaxOptions={{
                  tex2jax: {
                    inlineMath: [['{tex}', '{/tex}'], ['\\(', '\\)']],
                    displayMath: [['$$', '$$'], ['\\[', '\\]']],
                    processEscapes: true,
                  },
                }}
                hasIframe={false}
                style={{width: '90%', textAlign: 'justify'}}
                enableAnimation={false}
                scalesPageToFit={Platform.OS === 'android'}
              />
        </View>
      )
  }
}

export default RenderQuestions

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEAEA',
  },
  txtContainer: {
    width:'100%',
    backgroundColor: '#ffffff',
    marginLeft: '3%',
    marginRight: '3%',
    elevation: 6,
    padding: 5,
    borderRadius: 5,
  },
})