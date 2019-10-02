import React from 'react'
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import { Query } from 'react-apollo'

import { ALL_CARDS } from '../../src/graphql/Query'

export default class Verify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }

    }

    render() {
        return (
            <View style={styles.container}>
                <Text>
                    This page for verifing....
                </Text>
                <Query query={ALL_CARDS}>
                    {({ loading, error, data }) => {
                        if (loading) return <Text>Is Verifing...</Text>
                        if (error) {
                            console.log('Response Error-------', error);
                            return <Text style={styles.errorText}>{error.message}</Text>
                        }
                        //If the response is done, then will return the FlatList
                        console.log('response-data-------------', data);
                        //Return the cards if there is not an error.
                        return (<Text>
                            {data}
                        </Text>)
                    }}
                </Query>
            </View>
        )
    }
}

Verify.navigationOptions = {
    header: null

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    errorText: {
        fontSize: 20,
        fontWeight: '500',
        fontFamily: Platform.select({
            ios: 'Chalkboard SE',
            android: 'sans-serif-condensed'
        }),
        color: 'red'
    },
})