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
      isFake: false,
      card: {}
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

  getCardVerify = (allCards) => {
    const { edges } = allCards;
    if (!edges.length) return;
    const cardInfo = edges[edges.length - 1].node;
    const cardImage = GetCard(cardInfo.idNumber);
    const card = { ...cardInfo, ...cardImage };
    console.log('xxx 400 Card image: ', cardImage);
    this.setState({ card });
    return card;
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
            // const card = this.getCardVerify(data.all_cards);
            // const resultImage = card.url;
            const resultImage = 'http://4.bp.blogspot.com/-IU28PWWJPhQ/Vm9_IkqxuUI/AAAAAAAAAlk/ekRF7L4FQ3M/s1600/1.jpg';
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
                      ResultImage={resultImage}

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
                        ResultImage={resultImage}
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
