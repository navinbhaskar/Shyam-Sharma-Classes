import React, {Component} from 'react';
import {Dimensions, Platform, ScrollView, Text, View} from 'react-native';
import MathJax from 'react-native-mathjax';
import styles from './TestStyles';

const screen = Dimensions.get('window');

class QAPanel extends Component<{}> {
  constructor() {
    super();
    this.state = {
      height: 0,
    };
  }

  componentDidMount() {
    console.log("adskjadbs");
    console.log("adskjadbs: "+JSON.stringify(this.state));
    console.log("adskjadbs: "+JSON.stringify(this.props));
  }


  render() {
    return (
      <ScrollView style={{width: '100%'}}>
        <View style={styles.questionWrapper}>
          <Text style={styles.questionTitle}>Ques.</Text>
          <View style={{height: this.state.height}}>
            <MathJax
              html={"abcd"}
              mathJaxOptions={{
                tex2jax: {
                  inlineMath: [['{tex}', '{/tex}'], ['\\(', '\\)']],
                  displayMath: [['$$', '$$'], ['\\[', '\\]']],
                  processEscapes: true,
                },
              }}
              onHeightUpdated={height => {
                console.log(this.state.height, height);
                if (!this.state.height) {
                  this.setState({height});
                }
              }}
              hasIframe={true}
              style={{width: 0.75 * screen.width}}
              enableAnimation={false}
              scalesPageToFit={Platform.OS === 'android'}
            />
          </View>
        </View>
      </ScrollView>
    )
  }
}

export default QAPanel