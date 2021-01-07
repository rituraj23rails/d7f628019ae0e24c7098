/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
} from 'react-native';
import { Card, Text } from 'native-base';

//*> Functional Component(Stateless component)
const jsonRawComponent = (navigation) => {
    return (
      <SafeAreaView style={styles.container}>
          <Text style={styles.detailText}>{JSON.stringify(navigation.route.params.rawData)}</Text>
      </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },

  detailText: {
      fontSize: 15,
      padding: 10,
      fontWeight: 'bold'
  }

});

export default jsonRawComponent;
