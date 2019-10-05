import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Icon } from 'react-native-elements';
import Animbutton from './Animbutton';


const { width, height } = Dimensions.get('window');
let arrnew = [];
const jsonData = {
  quiz: {
    quiz1: {
      question1: {
        correctoption: 'option4',
        options: {
          option1: 'bring',
          option2: 'borrow',
          option3: 'give',
          option4: 'lend'
        },
        question: 'If you have any problem, please call Ann. She always ______ a sympathetic ear.'
      },
      question2: {
        correctoption: 'option4',
        options: {
          option1: 'remembered',
          option2: 'YML',
          option3: 'HTML',
          option4: 'JSX'
        },
        question: 'Tony would have forgotten the appointment if I hadn’t ______ him'
      },
      question3: {
        correctoption: 'option1',
        options: {
          option1: 'Single root DOM node',
          option2: 'Double root DOM node',
          option3: 'Multiple root DOM node',
          option4: 'None of the above'
        },
        question: 'Application built with just React usually have ____'
      },
      question4: {
        correctoption: 'option2',
        options: {
          option1: 'mutable',
          option2: 'immutable',
          option3: 'variable',
          option4: 'none of the above'
        },
        question: 'React elements are ____'
      },
      question5: {
        correctoption: 'option3',
        options: {
          option1: 'functions',
          option2: 'array',
          option3: 'components',
          option4: 'json data'
        },
        question: 'React allows to split UI into independent and reusable pieses of ____'
      }
    }
  }
};
class Quiz extends Component {
  constructor(props) {
    super(props);
    this.qno = 0;
    this.score = 0;

    const jdata = jsonData.quiz.quiz1;
    arrnew = Object.keys(jdata).map((k) => jdata[k]);
    this.state = {
      question: arrnew[this.qno].question,
      options: arrnew[this.qno].options,
      correctoption: arrnew[this.qno].correctoption,
      countCheck: 0
    };

  }

  prev() {
    if (this.qno > 0) {
      this.qno--;
      this.setState({ question: arrnew[this.qno].question, options: arrnew[this.qno].options, correctoption: arrnew[this.qno].correctoption });
    }
  }

  next() {
    if (this.qno < arrnew.length - 1) {
      this.qno++;

      this.setState({
        countCheck: 0, question: arrnew[this.qno].question, options: arrnew[this.qno].options, correctoption: arrnew[this.qno].correctoption
      });
    } else {

      this.props.quizFinish(this.score * 100 / 5);
    }
  }

  _answer(status, ans) {

    if (status == true) {
      const count = this.state.countCheck + 1;
      this.setState({ countCheck: count });
      if (ans == this.state.correctoption) {
        this.score += 1;
      }
    } else {
      const count = this.state.countCheck - 1;
      this.setState({ countCheck: count });
      if (this.state.countCheck < 1 || ans == this.state.correctoption) {
        this.score -= 1;
      }
    }

  }

  render() {
    const _this = this;
    const currentOptions = this.state.options;
    const options = Object.keys(currentOptions).map((k) => (
      <View key={k} style={{ margin: 10 }}>
        <Animbutton countCheck={_this.state.countCheck} onColor={"green"} effect={"tada"} _onPress={(status) => _this._answer(status, k)} text={currentOptions[k]} />
      </View>
    ));

    return (
      <View>
        <ScrollView style={{ backgroundColor: '#F5FCFF', paddingTop: 10 }}>
          <View style={styles.container}>

            <View style={{
              flex: 1, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center',
            }}
            >

              <View style={styles.oval}>
                <Text style={styles.welcome}>
                  {this.state.question}
                </Text>
              </View>
              <View>
                {options}
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => this.next()}>
                  <View style={{
                    paddingTop: 5, paddingBottom: 5, paddingRight: 20, paddingLeft: 20, borderRadius: 10, backgroundColor: 'green'
                  }}
                  />
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </ScrollView>

      </View>

    );
  }
}
Quiz.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({

  oval: {
    width: width * 90 / 100,
    borderRadius: 20,
    backgroundColor: 'green'
  },
  container: {
    flex: 1,
    alignItems: 'center'
  },
  welcome: {
    fontSize: 20,
    margin: 15,
    color: 'white'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
export default Quiz;
