import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback
} from 'react-native';
import * as Animatable from 'react-native-animatable';

export default class Animbutton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: false
    }
  }
  _onPress() {
    this.props._onPress(!this.state.status)
    this.setState({ status: !this.state.status })
    switch (this.props.effect) {
      case 'bounce':
        this.refs.view.bounce(800)
        break;
      case 'flash':
        this.refs.view.flash(800)
        break;
      case 'jello':
        this.refs.view.jello(800)
        break;
      case 'pulse':
        this.refs.view.pulse(800)
        break;
      case 'rotate':
        this.refs.view.rotate(800)
        break;
      case 'rubberBand':
        this.refs.view.rubberBand(800)
        break;
      case 'shake':
        this.refs.view.shake(800)
        break;
      case 'swing':
        this.refs.view.swing(800)
        break;
      case 'tada':
        this.refs.view.tada(800)
        break;
      case 'wobble':
        this.refs.view.wobble(800)
        break;
    }

  }
  render() {
    return (
      <View>
        <TouchableWithoutFeedback onPress={() => this._onPress()}>
          <Animatable.View ref="view" style={{ margin: 10, paddingTop: 10, paddingBottom: 10, paddingRight: 20, paddingLeft: 20, backgroundColor: this.state.status ? this.props.onColor : "#bdbdbd", borderRadius: 20 }}>
            <Text style={{ color: this.state.status ? "white" : "#696969", fontWeight: "bold" }}>{this.props.text}</Text>
          </Animatable.View>
        </TouchableWithoutFeedback>

      </View>

    );
  }
}