import React from 'react';
import {
  StyleSheet, View, Image
} from 'react-native';
import { Query } from 'react-apollo';
import {
  Card, Text, Button, Icon,
} from 'react-native-elements';
import { GetCardImage } from '../../src/api/CardDetection';
import { ALL_CARDS } from '../../src/graphql/Query';

const DEF_IMG = 'http://4.bp.blogspot.com/-IU28PWWJPhQ/Vm9_IkqxuUI/AAAAAAAAAlk/ekRF7L4FQ3M/s1600/1.jpg';

const ResultCard = (props) => {
  const {
    cardInfo: { uriImg, isFake },
    title, titleButton, HandleOnPress, nameIcons, colorIcons, colorButton
  } = props;

  // const uriImg = await GetCardImage(cardInfo.id);
  // const uriImg = GetCardImage(cardInfo.idNumber)
  //   .then((res) => { console.log('xxx 699 res: ', res); return res; })
  //   .catch((err) => console.error('Get card image: ', err));
  // console.log('xxx 700 result image: ', uriImg);

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
            source={{ uri: uriImg || DEF_IMG }}
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

  getCardInfo = (allCards) => {
    const { navigation } = this.props;
    const { edges } = allCards;
    if (!edges && !edges.length) return undefined;
    let cardInfo = edges[edges.length - 1].node;
    cardInfo = {
      ...cardInfo,
      uriImg: navigation.getParam('uriImg')
    };
    return cardInfo;
    // console.log('xxx 399 Card image: ', cardImage);
    // const card = { ...cardInfo, ...cardImage };
    // console.log('xxx 400 Card image: ', card);
    // this.setState({ card });
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
            console.log('response-data-------------', data);
            // TODO: handle get card from server. In this, just get last card.
            const cardInfo = this.getCardInfo(data.allCards);
            console.log('xxx 500 cardInfo: ', cardInfo);
            return (
              <View>
                <ResultCard
                  title="Vui lòng xác minh lại"
                  HandleOnPress={this.handleFalseVerify}
                  titleButton="Xác minh lại"
                  nameIcons="error"
                  colorIcons="red"
                  colorButton="#c22b2b"
                  cardInfo={cardInfo}
                />
                {/* {
                  isFake ? (
                    <ResultCard
                      title="Vui lòng xác minh lại"
                      HandleOnPress={this.handleFalseVerify}
                      titleButton="Xác minh lại"
                      nameIcons="error"
                      colorIcons="red"
                      colorButton="#c22b2b"
                      cardInfo={cardInfo}
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
                        cardInfo={cardInfo}
                      />

                    )
                } */}
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
