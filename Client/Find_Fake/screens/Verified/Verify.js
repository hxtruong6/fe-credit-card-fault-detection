import React from 'react';
import {
  StyleSheet, View, Image
} from 'react-native';
import { Query } from 'react-apollo';
import {
  Card, Text, Button, Icon,
} from 'react-native-elements';
import { ALL_CARDS } from '../../src/graphql/Query';
import {
  PRIMARY_COLOR, SECONDARY_COLOR, PRIMARY_LIGHT, RED_LIGHT
} from '../../src/util/Color';

const DEF_IMG = 'http://4.bp.blogspot.com/-IU28PWWJPhQ/Vm9_IkqxuUI/AAAAAAAAAlk/ekRF7L4FQ3M/s1600/1.jpg';

const ResultCard = (props) => {
  const {
    resCardStyle: {
      nameIcons, colorIcons, colorButton
    },
    cardInfo: { uriImg, message, certified }, title, titleButton, handleOnPress
  } = props;

  return (
    <View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Card title={title}>
          <View style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}
          >
            <Image
              style={{
                width: 400,
                height: 270,
                marginBottom: 10,
                resizeMode: 'contain'
              }}
              source={{ uri: uriImg || DEF_IMG }}
            />
          </View>
          <Button
            icon={<Icon name={`${nameIcons}`} color={`${colorIcons}`} size={40} />}
            title={titleButton}
            onPress={handleOnPress}
            buttonStyle={{
              backgroundColor: colorButton,
            }}
          />
        </Card>
      </View>
      {!certified && (
        <View style={{ padding: 5 }}>
          <Text style={{ fontWeight: 'bold' }}>
            Vấn đề xác thực:
        </Text>
          <Text>
            {message}
          </Text>
        </View>
      )}
    </View>
  );
};

export default class Verify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleTrueVerify = () => {
    this.props.navigation.navigate('Playquiz');
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
      ...navigation.state.params
    };

    return cardInfo;
  }

  render() {
    return (
      <View style={styles.container}>
        <Query query={ALL_CARDS}>
          {({ loading, error, data }) => {
            if (loading) return <Text>Is Verifing...</Text>;
            if (error) {
              console.log('Response Error-------', error);
              return <Text style={styles.errorText}>{error.message}</Text>;
            }
            // console.log('response-data-------------', data);
            // TODO: handle get card from server. In this, just get last card.
            const cardInfo = this.getCardInfo(data.allCards);
            console.log('xxx 500 cardInfo: ', cardInfo);
            const { certified } = cardInfo;
            const isFake = !certified;
            const title = isFake ? 'Vui lòng xác minh lại' : 'Xác minh thành công';
            const titleButton = isFake ? 'Xác minh lại' : 'Làm bài thi';
            const handleOnPress = isFake ? this.handleFalseVerify : this.handleTrueVerify;
            const resCardStyle = isFake ? {
              nameIcons: 'error',
              colorIcons: SECONDARY_COLOR,
              colorButton: RED_LIGHT
            }
              : {
                nameIcons: 'check',
                colorIcons: PRIMARY_COLOR,
                colorButton: PRIMARY_LIGHT
              };
            return (
              <View>
                <ResultCard
                  title={title}
                  handleOnPress={handleOnPress}
                  titleButton={titleButton}
                  resCardStyle={resCardStyle}
                  cardInfo={cardInfo}
                />
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
