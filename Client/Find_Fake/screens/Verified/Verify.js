import React from 'react';
import {
  StyleSheet, View, Image
} from 'react-native';
import { Query } from 'react-apollo';
import {
  Card, Text, Button, Icon,
} from 'react-native-elements';
import { GetCard } from '../../src/api/CardDetection';
import { ALL_CARDS } from '../../src/graphql/Query';

const ResultCard = (props) => {
  const {
    title, ResultImage, titleButton, HandleOnPress, nameIcons, colorIcons, colorButton
  } = props;

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Card title={title}>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
        >
          <Image
            style={{
              width: 350,
              height: 300,
              marginBottom: 10,
            }}
            source={{ uri: `${ResultImage}` }}
          />
        </View>
        <Button
          icon={<Icon name={`${nameIcons}`} color={`${colorIcons}`} size={40} />}
          title={titleButton}
          onPress={HandleOnPress}
          backgroundColor={`${colorButton}`}
        />
      </Card>
    </View>
  );
};

export default class Verify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFake: false
    };
  }

  handleTrueVerify = () => {
    // this.props.navigation.navigate('');
    alert('Làm bài đi');
  }

  handleFalseVerify = () => {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.navigation.navigate('InfoVerified');
  }

  render() {
    const { isFake } = this.state;
    return (
      <View style={styles.container}>
        <Query query={ALL_CARDS}>
          {({ loading, error, data }) => {
            if (loading) return <Text>Is Verifing...</Text>;
            if (error) {
              console.log('Response Error-------', error);
              return <Text style={styles.errorText}>{error.message}</Text>;
            }
            // If the response is done, then will return the FlatList
            console.log('response-data-------------', data);

            // TODO: handle get card from server. In this, just get last card.
            // cardInfo = data.edges.node;

            // Return the cards if there is not an error.
            return (
              <View>
                {
                  isFake ? (
                    <ResultCard
                      title="Vui lòng xác minh lại"
                      HandleOnPress={this.handleFalseVerify}
                      titleButton="Xác minh lại"
                      nameIcons="error"
                      colorIcons="red"
                      colorButton="#c22b2b"

                    />
                  )
                    : (
                      <ResultCard
                        title="Xác minh thành công"
                        HandleOnPress={this.handleTrueVerify}
                        titleButton="Làm bài"
                        nameIcons="check"
                        colorIcons="blue"
                        colorButton="#2bc2b5"


                      />

                    )
                }
              </View>
            );
          }}
        </Query>

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
