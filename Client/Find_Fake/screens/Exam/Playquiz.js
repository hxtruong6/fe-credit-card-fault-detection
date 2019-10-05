// import liraries
import React, { Component } from 'react';
import {
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  View,
  Text
} from 'react-native';
import { Icon } from 'react-native-elements';
import Quiz from './Quiz';
import { SECONDARY_LIGHT } from '../../src/util/Color';

// create a component
class Playquiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizFinish: false,
      score: 0
    };
  }

  _onPressBack() {
    const { goBack } = this.props.navigation;
    goBack();
  }

  _quizFinish(score) {
    this.setState({ quizFinish: true, score });
  }

  _scoreMessage(score) {
    if (score <= 30) {
      return (<View style={styles.innerContainer} >
        <View style={{ flexDirection: "row" }} >
          <Icon name="trophy" size={30} color="white" />
        </View>
        <Text style={styles.score}>You need to work hard</Text>
        <Text style={styles.score}>You scored {score}%</Text>
      </View>)
    } if (score > 30 && score < 60) {
      return (<View style={styles.innerContainer} >
        <View style={{ flexDirection: "row" }} >
          <Icon name="trophy" size={30} color="white" />
          <Icon name="trophy" size={30} color="white" />
        </View>
        <Text style={styles.score}>You are good</Text>
        <Text style={styles.score}>Congrats you scored {score}% </Text>
      </View>)
    } else if (score >= 60) {
      return (<View style={styles.innerContainer}>
        <View style={{ flexDirection: "row" }} >
          <Icon name="trophy" size={30} color="white" />
          <Icon name="trophy" size={30} color="white" />
          <Icon name="trophy" size={30} color="white" />
        </View>
        <Text style={styles.score}>You are the master</Text>
        <Text style={styles.score}>Congrats you scored {score}% </Text>
      </View>)
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={() => this._onPressBack()}><Text style={styles.toolbarButton}>Back</Text></TouchableOpacity>
          <Text style={styles.toolbarTitle} />
          <Text style={styles.toolbarButton} />
        </View>

        {this.state.quizFinish ? (
          <View style={styles.container}>
            <View style={styles.circle}>

              {this._scoreMessage(this.state.score)}
            </View>

          </View>
        ) : <Quiz quizFinish={(score) => this._quizFinish(score)} />}

      </View>
    );
  }
}
Playquiz.navigationOptions = {
  header: null,

};
const scoreCircleSize = 300;
// define your styles
const styles = StyleSheet.create({
  score: {
    color: 'white',
    fontSize: 20,
    fontStyle: 'italic'
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scoreCircleSize,
    height: scoreCircleSize,
    borderRadius: scoreCircleSize / 2,
    backgroundColor: 'green'
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  toolbar: {
    backgroundColor: '#81c04d',
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row'
  },
  toolbarButton: {
    width: 55,
    color: SECONDARY_LIGHT,
    textAlign: 'center'
  },
  toolbarTitle: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1
  }
});

// make this component available to the app
export default Playquiz;
