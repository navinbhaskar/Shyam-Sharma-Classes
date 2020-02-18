import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import AuthFlowContainer from './src/navigators';
import SplashScreen from 'react-native-splash-screen';

export default class App extends React.Component {

	async componentDidMount() {
		SplashScreen.hide();
	}

	componentWillUnmount() {
	  //this.notificationListener();
	  //this.notificationOpenedListener();
	}

	

	render() {
		return <AuthFlowContainer />;
	}
}
