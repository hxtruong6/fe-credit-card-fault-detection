import React from 'react';
import {
  StyleSheet, TouchableOpacity, Text, View,
} from 'react-native';
import { Query } from 'react-apollo';

import { ALL_CARDS } from '../../src/graphql/Query';

export default class Verify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFake: false
    };
  }

  render() {
    const { isFake } = this.state;
    return (
      <View style={styles.container}>
        <Text>
          This page for verifing....
        </Text>
        <Query query={ALL_CARDS}>
          {({ loading, error, data }) => {
            if (loading) return <Text>Is Verifing...</Text>;
            if (error) {
              console.log('Response Error-------', error);
              return <Text style={styles.errorText}>{error.message}</Text>;
            }
            // If the response is done, then will return the FlatList
            console.log('response-data-------------', data);
            // Return the cards if there is not an error.
            return (
              // <Text>
              //   {data.allCards.edges[0].node.name}
              // </Text>
              <View>
                {
                  isFake ? <View><Text>True</Text></View> : <View><Text>False</Text></View>
                }
              </View>
            );
          }}
        </Query>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
          marginBottom: 15,
        }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => { console.log('Doing the exam.'); }}
          >
            <Text>Làm bài</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

Verify.navigationOptions = {
  header: null,

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Chalkboard SE',
      android: 'sans-serif-condensed',
    }),
    color: 'red',
  },
  button: {
    height: 35,
    width: 150,
    margin: 10,
    borderWidth: 2,
    borderRadius: 20,
    alignItems: 'center',
    borderColor: '#e93766',
    justifyContent: 'center',
  },
});
