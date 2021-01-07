/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StoryListComponent from './src/StoryListComponent';
import JsonRawDetailComponent from './src/JsonRawDetailComponent';

const Stack = createStackNavigator();

class App extends Component {
  render() {
    return (
      <NavigationContainer>
      <Stack.Navigator initialRouteName="StoryListComponent">
        <Stack.Screen 
          name="StoryListComponent" 
          component={StoryListComponent}
          options={({ route, navigation }) => ({
            headerTitle: 'Story List Screen',
            headerTitleAlign: 'center',
            headerTitleStyle: { textAlign: 'center', alignSelf: 'center' },
            route: { route },
            navigation: { navigation }
          })
          }
        />
        <Stack.Screen 
          name="JsonRawDetailComponent" 
          component={JsonRawDetailComponent}
          options={({ route, navigation }) => ({
            headerTitle: 'RAW Json Detail Screen',
            headerTitleAlign: 'center',
            headerTitleStyle: { textAlign: 'center', alignSelf: 'center' },
            route: { route },
            navigation: { navigation }
          })
          }
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
}

export default App;
