import React from 'react';

import {
  StyleSheet,
  Animated,
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import Modal from './Modal';

/**
 * @typedef {import("react-native").GestureResponderEvent} GestureResponderEvent
 * @typedef {import("react-native").ViewStyle} ViewStyle
 * @typedef {import("react-native").StyleProp<ViewStyle>} ViewStyleProp
 * @typedef {import("react").Props} ReactProps
 *
 * @typedef OverlayProps
 * @prop {boolean} [isVisible=false]
 * @prop {boolean} [isModal=false]
 * @prop {boolean} [showSpinner=false]
 * @prop {string} [spinnerColor="white"]
 * @prop {string} [backgroundColor="rgba(0, 0, 0, 0.75)"]
 * @prop {ViewStyleProp} [style=null]
 * @prop {(e:GestureResponderEvent) => void} [onPress]
 * @prop {() => void} [onShow]
 * @prop {() => void} [onHide]
 *
 * @typedef {OverlayProps & ReactProps} Props
 */

/**
 * @class Overlay
 * @extends {React.PureComponent<Props>}
 */
export default class Overlay extends React.PureComponent {
  static defaultProps = {
    isVisible: false,
    isModal: false,
    showSpinner: false,
    spinnerColor: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    style: null,
    onPress: () => {},
    onShow: () => {},
    onHide: () => {},
  }

  /**
   * @param {Props} props
   */
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      opacity: new Animated.Value(0),
    };
  }

  componentDidMount() {
    const {
      isVisible,
    } = this.props;

    if (isVisible) this.show();
  }

  /**
   * @param {Props} prevProps
   */
  componentDidUpdate(prevProps) {
    const {
      isVisible,
    } = this.props;

    if (isVisible && !prevProps.isVisible) {
      this.show();
    }

    if (!isVisible && prevProps.isVisible) {
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
      <View
        testID="SpinnerContainer"
        style={styles.spinnerContainer}
      >
        <ActivityIndicator color={spinnerColor} size="large" />
      </View>
    );
  };

  /**
   * @param {GestureResponderEvent} e
   */
  _onPress = (e) => {
    const {
      onPress,
    } = this.props;

    onPress(e);
  }

  _renderOverlay = () => {
    const {
      style,
      showSpinner,
      isModal,
      backgroundColor,
      children,
    } = this.props;

    const {
      isVisible,
      opacity,
    } = this.state;

    return (
      <View
        testID="Overlay"
        pointerEvents={isVisible ? 'auto' : 'none'}
        removeClippedSubviews={!isVisible}
        style={[
          styles.overlay,
          // eslint-disable-next-line react-native/no-inline-styles
          !isModal ? {
            opacity: +!!isVisible,
            overflow: isVisible ? 'visible' : 'hidden',
          } : {},
        ]}
      >
        {
          isModal
            ? (
              <StatusBar
                animated
                barStyle="light-content"
                backgroundColor={backgroundColor}
              />
            )
            : null
        }
        <Animated.View
          style={[
            styles.overlay,
            { backgroundColor },
            style,
            { opacity },
          ]}
        >
          {
            showSpinner
              ? this._renderSpinner()
              : null
          }
        </Animated.View>
        {
          !showSpinner
            ? (
              <View style={styles.flex1}>
                <TouchableWithoutFeedback
                  testID="PressHandler"
                  onPress={this._onPress}
                  style={styles.overlay}
                >
                  <View style={styles.flex1} />
                </TouchableWithoutFeedback>
                {children}
              </View>
            )
            : null
        }
      </View>
    );
  }

  show() {
    const {
      onShow,
    } = this.props;

    const {
      opacity,
    } = this.state;

    this.setState({
      isVisible: true,
    });

    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onShow();
    });
  }

  hide() {
    const {
      onHide,
    } = this.props;

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
          isVisible: false,
        });

        onHide();
      }
    });
  }

  render() {
    const {
      isModal,
    } = this.props;

    const {
      isVisible,
    } = this.state;

    return !isModal
      ? this._renderOverlay()
      : (
        <Modal
          isVisible={isVisible}
          isAnimated={false}
        >
          {this._renderOverlay()}
        </Modal>
      );
  }
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
