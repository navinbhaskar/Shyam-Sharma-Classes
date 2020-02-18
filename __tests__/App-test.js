/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

global.fetch = jest.fn(() => new Promise(resolve => resolve()));
//jest.mock('react-native-gesture-handler', () => {});
jest.mock('react-native-firebase', () => {
  return {
    firestore: jest.fn(() => {
      return {
        collection: jest.fn()
      };
    }),
    messaging: jest.fn(() => {
      return {
        hasPermission: jest.fn(() => Promise.resolve(true)),
        subscribeToTopic: jest.fn(),
        unsubscribeFromTopic: jest.fn(),
        requestPermission: jest.fn(() => Promise.resolve(true)),
        getToken: jest.fn(() => Promise.resolve('myMockToken'))
      };
    }),
    notifications: jest.fn(() => {
      return {
        onNotification: jest.fn(),
        onNotificationDisplayed: jest.fn()
      };
    })
  };
});
jest.mock('rn-fetch-blob', () => {
  return {
    DocumentDir: () => {},
    polyfill: () => {},
  }
});
jest.mock('react-native-share', () => {
  return {}
});
jest.mock('react-native-device-info', () => {
  return {
    getUniqueID: () => {},
  }
});
jest.mock('rn-placeholder', () => {
  return {
    connect: () => {},
  }
});
jest.mock('react-test-renderer', () => {
  return {
    hide: () => {},
  }
});
jest.mock('react-native-document-picker', () => {
  return {}
});


it('renders correctly', () => {
  renderer.create(<App />);
});
