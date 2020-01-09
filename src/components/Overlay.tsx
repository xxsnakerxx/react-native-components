import React from 'react';

import {
  StyleSheet,
  Animated,
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StatusBar,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';

import Modal from './Modal';

export interface Props {
  isVisible?: boolean;
  isModal?: boolean;
  showSpinner?: boolean;
  spinnerColor?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: (e: GestureResponderEvent) => void;
  onShow?: () => void;
  onHide?: () => void;
}

interface State {
  isVisible: boolean;
  opacity: Animated.Value;
}

export default class Overlay extends React.PureComponent<Props, State> {
  static defaultProps = {
    isVisible: false,
    isModal: false,
    showSpinner: false,
    spinnerColor: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    onPress: () => {},
    onShow: () => {},
    onHide: () => {},
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isVisible: false,
      opacity: new Animated.Value(0),
    };
  }

  componentDidMount() {
    const {isVisible} = this.props;

    if (isVisible) {
      this.show();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const {isVisible} = this.props;

    if (isVisible && !prevProps.isVisible) {
      this.show();
    }

    if (!isVisible && prevProps.isVisible) {
      this.hide();
    }
  }

  componentWillUnmount() {
    const {opacity} = this.state;

    opacity.stopAnimation();
  }

  _renderSpinner = () => {
    const {spinnerColor} = this.props;

    return (
      <View testID="SpinnerContainer" style={styles.spinnerContainer}>
        <ActivityIndicator color={spinnerColor} size="large" />
      </View>
    );
  };

  _onPress = (e: GestureResponderEvent) => {
    const {onPress} = this.props;

    onPress!(e);
  };

  _renderOverlay = () => {
    const {style, showSpinner, isModal, backgroundColor, children} = this.props;

    const {isVisible, opacity} = this.state;

    return (
      <View
        testID="Overlay"
        pointerEvents={isVisible ? 'auto' : 'none'}
        style={[
          styles.overlay,
          !isModal
            ? // eslint-disable-next-line react-native/no-inline-styles
              {
                opacity: +!!isVisible,
                overflow: isVisible ? 'visible' : 'hidden',
              }
            : {},
        ]}>
        {isModal ? (
          <StatusBar
            animated
            barStyle="light-content"
            backgroundColor={backgroundColor}
          />
        ) : null}
        <Animated.View
          style={[styles.overlay, {backgroundColor}, style, {opacity}]}>
          {showSpinner ? this._renderSpinner() : null}
        </Animated.View>
        {!showSpinner ? (
          <View style={styles.flex1}>
            <TouchableWithoutFeedback
              testID="PressHandler"
              onPress={this._onPress}
              style={styles.overlay}>
              <View style={styles.flex1} />
            </TouchableWithoutFeedback>
            {children}
          </View>
        ) : null}
      </View>
    );
  };

  show() {
    const {onShow} = this.props;

    const {opacity} = this.state;

    this.setState({
      isVisible: true,
    });

    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onShow!();
    });
  }

  hide() {
    const {onHide} = this.props;

    const {opacity} = this.state;

    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(({finished}) => {
      if (finished) {
        this.setState({
          isVisible: false,
        });

        onHide!();
      }
    });
  }

  render() {
    const {isModal} = this.props;

    const {isVisible} = this.state;

    return !isModal ? (
      this._renderOverlay()
    ) : (
      <Modal isVisible={isVisible} isAnimated={false}>
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
