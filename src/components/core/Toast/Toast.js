import { COLORS } from '@src/styles';
import React, { Component } from 'react';
import { Animated } from 'react-native';
import { Icon } from 'react-native-elements';
import Text from '../Text';
import styles from './style';

let instance;

class Toast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animation: null,
      msg: null,
      config: {},
      opacityAni: new Animated.Value(1)
    };
  }

  static show(...params) {
    if (typeof instance?.show === 'function') {
      instance.show(...params);
    }
  }

  static showSuccess(msg, config) {
    Toast.show(msg, {
      ...typeof config === 'object' ? config : {},
      icon: <Icon type='material' name='check' size={20} color={COLORS.white} />,
      containerStyle: styles.successContainer
    });
  }

  static showError(msg, config?) {
    Toast.show(msg, {
      ...typeof config === 'object' ? config : {},
      icon: <Icon type='material' name='error' size={20} color={COLORS.white} />,
      containerStyle: styles.errorContainer
    });
  }

  static showInfo(msg, config?) {
    Toast.show(msg, {
      icon: <Icon type='material' name='info' size={20} color={COLORS.white} />,
      containerStyle: styles.infoContainer,
      duration: 2500,
      ...typeof config === 'object' ? config : {},
    });
  }

  static showWarning(msg, config?) {
    Toast.show(msg, {
      ...typeof config === 'object' ? config : {},
      icon: <Icon type='material' name='warning' size={20} color={COLORS.dark1} />,
      containerStyle: styles.warningContainer,
      messageStyle: styles.warningMessage
    });
  }

  componentDidMount() {
    instance = this;
  }

  show = (msg, config = {}) => {
    const { opacityAni, animation } = this.state;

    // stop exist animation
    if (animation && typeof animation.stop === 'function') {
      animation.stop();
    }

    this.setState({
      msg,
      config: config || {}
    }, () => {
      const animation = Animated.sequence([
        Animated.timing(
          opacityAni,
          {
            toValue: 1,
            duration: 300,
          }
        ),
        Animated.delay(config?.duration || 4000),
        Animated.timing(
          opacityAni,
          {
            toValue: 0,
            duration: 200,
          }
        )
      ]);

      animation.start(({ finished}) => {
        if (finished) {
          this.setState({ msg: null });
        }
      });

      this.setState({ animation });
    });
  }

  render() {
    const { msg, config, opacityAni } = this.state;

    if (msg) {
      return (
        <Animated.View
          style={
            [
              styles.container,
              config?.containerStyle,
              {
                opacity: opacityAni
              }
            ]
          }
        >
          {config?.icon}
          <Text
            numberOfLines={10}
            ellipsizeMode='tail'
            style={
              [
                styles.message,
                config?.messageStyle,
              ]
            }
          >
            {msg}
          </Text>
        </Animated.View>
      );
    }

    return null;
  }
}

export default Toast;
