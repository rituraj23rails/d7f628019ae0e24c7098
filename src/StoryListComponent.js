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
  TouchableOpacity,
  ActivityIndicator,
  TextInput
} from 'react-native';
import moment from 'moment';
import { Card, Text } from 'native-base';

class StoryListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postsData:  [],
      pageCount: 0,
      limit: 20,
      loading: true,
      pageLoader: false,
      pullToRefresh: false,
      onEndReachedCalledDuringMomentum: true,
      lastLoadCount: 0,
      filterData: this.props.insightsFilter ,
      searchedPostsData: [],
      showEmptyView: false,
      searchText: ''
    }
  }

  componentDidMount() {
    //*> Fetch Initial Request
    this.fetchPostsRequest();
    //*> Fetch Request after every 10 seconds
    setInterval(() => {
      this.setState({ pageCount: this.state.pageCount + 1 }, () => {
        this.fetchPostsRequest();
      });
      }, 10000);
  }

  //*> Fetch Story Data 
  fetchPostsRequest = async () => {
      let localStoryList = this.state.postsData;
      try {
        let response = await fetch(
          `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${this.state.pageCount}`
        );
        let json = await response.json();
        
        this.setState({ 
          postsData: this.state.postsData.concat(json.hits),
          searchedPostsData: this.state.postsData.concat(json.hits),
          pageLoader: false,
          lastLoadCount: this.state.postsData.concat(json.hits).length,
          onEndReachedCalledDuringMomentum: this.state.postsData.concat(json.hits).length >= this.state.limit ? true : false,
          notFinalLoad: this.state.postsData.concat(json.hits).length >= this.state.limit ? true : false
        });
        return;
      } catch (error) {
        console.error(error);
      }
  }

  //*> On End Reached of the List Fetch data again
  
  onEndReached = () => {
    if (!this.state.onEndReachedCalledDuringMomentum) {
      this.setState({ onEndReachedCalledDuringMomentum: true }, () => {
        setTimeout(() => {
          if (
            this.state.lastLoadCount >= this.state.limit &&
            this.state.notFinalLoad
          ) {
            this.setState(
              {
                pageLoader: true,
                pageCount: this.state.pageCount + 1
              },
              () => {
                // Then we fetch more data;
                this.fetchPostsRequest();
            });
          }
        }, 1500);
      });
    }
};


  // Key Extractor
  _keyExtractor = (item, index) => item.id;

  // Check if list has started scrolling
  _onMomentumScrollBegin = () =>
    this.setState({ onEndReachedCalledDuringMomentum: false });

  //*> On Navigate to story detail screen
  onPressCellRow = (item) => {
    this.props.navigation.navigate('JsonRawDetailComponent', { rawData: item });
  }

  //*> Search Filter Function
  searchFilterFunction = (text) => {
    let detail = this.state.postsData;
    const newData = detail.filter(function(item){
    const itemData = `${item.title.toLowerCase()} ${item.url} ${item.author.toLowerCase()}`;
    const textData = text.toLowerCase()
      return itemData.toString().indexOf(textData) > -1
    });
    this.setState({ searchedPostsData: newData });
  }

  handleInputChange = (value) => {
    this.setState({ searchText: value }, () => {
      this.searchFilterFunction(value);
    });
  }

  renderCellData(item) {
    let date = moment(item.created_at).format("MMM Do YY");
    return (
      <Card>
        <TouchableOpacity onPress={() => this.onPressCellRow(item)} style={styles.cellContainer}>
            <Text style={styles.data}>Title: <Text style={styles.insideText}>{item.title}</Text></Text>
            <Text style={styles.data}>URL: <Text style={styles.linkText}>{item.url}</Text></Text>
            <Text style={styles.data}>Created at: <Text style={styles.dateText}>{date}</Text></Text>
            <Text style={styles.data}>Author: {item.author}</Text>
        </TouchableOpacity>
      </Card>
    )
  }

   // Footer loader for Pagination  
   _renderSearchResultsFooter = () => {
    return this.state.pageLoader ? (
      <View style={styles.activityIndicator}>
        <ActivityIndicator size="large" color={'#000000'} />
      </View>
    ) : null;
  };

  renderPostsLists() {
    return (
      <View style={{flex: 1}}>
        <FlatList
          data={this.state.searchedPostsData}
          renderItem={({ item }) => this.renderCellData(item)}
          extraData={this.state}
            keyExtractor={this._keyExtractor}
            contentContainerStyle={styles.contentContainer}
            onEndReachedThreshold={0.01}
            onEndReached={() => this.onEndReached()}
            ListFooterComponent={this._renderSearchResultsFooter}
            onMomentumScrollBegin={() => this._onMomentumScrollBegin()}
        />
      </View>
    )
  }

  renderSearchTextInput = () => {
    return (
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.textInputStyle}
          placeholder="Search title, url or author"
          underlineColorAndroid="transparent"
          value={this.state.searchText}
          onChangeText={(value) => this.handleInputChange(value)}
          autoCapitalize={false}
        />
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.constainer}>
          {this.renderSearchTextInput()}
          {this.renderPostsLists()}
      </SafeAreaView>
  );
};
}

const styles = StyleSheet.create({
  
  constainer: {
    flex: 1
  },

  cellContainer: {
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    justifyContent: 'center',
    borderRadius: 5
  },
  
  data: {
    fontSize: 15,
    marginLeft: 15,
    marginBottom: 10,
    color: '#ffffff'
  },

  insideText: {
    fontWeight: 'bold',
    color: 'yellow'
  },

  linkText: {
    fontWeight: 'bold',
    color: 'red'
  },

  dateText: {
    fontWeight: 'bold',
    color: 'white'
  },

  searchContainer: {
    marginHorizontal: 20,
  },

  textInputStyle: {
    height: 50,
    fontSize: 15,
    lineHeight: 18,
    textAlign: 'left',
    color: 'black',
},

  activityIndicator: {
    marginBottom: 30, 
    marginTop: -50, 
    alignItems: 'center'
  }

});

export default StoryListComponent;
