import React from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  Animated,
  View,
  ViewPropTypes,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import Modal from './Modal';

export default class Overlay extends React.Component {
  static propTypes = {
    style: ViewPropTypes.style,
    modal: PropTypes.bool,
    spinner: PropTypes.bool,
    spinnerColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    visible: PropTypes.bool,
    layer: PropTypes.object,
    onPress: PropTypes.func,
  }

  static defaultProps = {
    style: null,
    modal: false,
    spinner: false,
    visible: false,
    spinnerColor: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    layer: null,
    onPress: () => {},
  }

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      opacity: new Animated.Value(0),
    };
  }

  componentDidMount() {
    const {
      visible,
    } = this.props;

    if (visible) this.show();
  }

  componentDidUpdate(prevProps) {
    const {
      visible,
    } = this.props;

    if (visible && !prevProps.visible) {
      this.show();
    }

    if (!visible && prevProps.visible) {
      this.hide();
    }
  }

  componentWillUnmount() {
    const {
      opacity,
    } = this.state;

    opacity.stopAnimation();
  }

  _renderSpinner = () => {
    const { spinnerColor } = this.props;

    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator color={spinnerColor} size="large" />
      </View>
    );
  };

  _onPress = () => {
    const {
      onPress,
    } = this.props;

    onPress();
  }

  _renderOverlay = () => {
    const {
      style,
      layer,
      spinner,
      modal,
      backgroundColor,
      children,
    } = this.props;

    const {
      visible,
      opacity,
    } = this.state;

    return (
      <View
        pointerEvents={visible ? 'auto' : 'none'}
        removeClippedSubviews={!visible}
        style={[
          styles.overlay,
          // eslint-disable-next-line react-native/no-inline-styles
          !modal ? {
            opacity: +!!visible,
            overflow: visible ? 'visible' : 'hidden',
          } : {},
        ]}
      >
        <StatusBar
          animated
          barStyle="light-content"
          backgroundColor={backgroundColor}
        />
        <Animated.View
          style={[
            styles.overlay,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              backgroundColor:
              layer && React.isValidElement(layer)
                ? 'transparent'
                : backgroundColor,
            },
            style,
            {
              opacity,

            },
          ]}
        >
          {layer && React.isValidElement(layer)
            ? React.cloneElement(layer, {
              style: styles.overlay,
            })
            : null
          }
          {spinner
            ? this._renderSpinner()
            : null
          }
        </Animated.View>
        {!spinner
          ? (
            <View style={styles.flexContainer}>
              <TouchableWithoutFeedback
                onPress={this._onPress}
                style={styles.overlay}
              >
                <View style={styles.flexContainer} />
              </TouchableWithoutFeedback>
              {children}
            </View>
          )
          : null
        }
      </View>
    );
  }

  show(cb) {
    const {
      opacity,
    } = this.state;

    this.setState({
      visible: true,
    });

    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (cb) cb();
    });
  }

  hide(cb) {
    const {
      opacity,
    } = this.state;

    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        this.setState({
          visible: false,
        });
      }

      if (cb) cb();
    });
  }

  render() {
    const {
      modal,
    } = this.props;

    const {
      visible,
    } = this.state;

    return !modal
      ? this._renderOverlay()
      : (
        <Modal visible={visible}>
          {this._renderOverlay()}
        </Modal>
      );
  }
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexContainer: {
    flex: 1,
  },
});
