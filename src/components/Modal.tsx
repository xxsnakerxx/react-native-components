import React from 'react';

import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Easing,
  InteractionManager,
} from 'react-native';

import Portal from './Portal';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export interface Props {
  isVisible?: boolean;
  isAnimated?: boolean;
  animationType?: 'pushToTop' | 'fade';
}

interface State {
  y: Animated.Value;
  opacity: Animated.Value;
}

export default class Modal extends React.PureComponent<Props, State> {
  static defaultProps: Props = {
    isVisible: false,
    isAnimated: true,
    animationType: 'pushToTop',
  };

  _tag: string;

  constructor(props: Props) {
    super(props);

    this.state = {
      y: new Animated.Value(
        props.animationType === 'pushToTop' ? SCREEN_HEIGHT : 0,
      ),
      opacity: new Animated.Value(props.animationType === 'fade' ? 0 : 1),
    };
  }

  componentDidMount() {
    const {isVisible, isAnimated} = this.props;

    this._tag = Portal.allocateTag();

    if (isVisible) {
      Portal.showModal(this._tag, this._renderModal());

      if (isAnimated) {
        this.showAnimation();
      }
    }
  }

  componentDidUpdate(prevProps: Props) {
    const {isVisible, isAnimated} = this.props;

    if (isVisible) {
      Portal.showModal(this._tag, this._renderModal());

      if (isAnimated) {
        this.showAnimation();
      }
    }

    if (!isVisible && prevProps.isVisible) {
      if (isAnimated) {
        this.hideAnimation();
      }

      InteractionManager.runAfterInteractions(() => {
        Portal.closeModal(this._tag);
      });
    }
  }

  componentWillUnmount() {
    const {isAnimated} = this.props;

    if (isAnimated) {
      this.hideAnimation();
    }

    InteractionManager.runAfterInteractions(() => {
      Portal.closeModal(this._tag);

      this._tag = null;
    });
  }

  _renderModal = () => {
    const {isAnimated, children} = this.props;

    const {y, opacity} = this.state;

    /** @type {AnimatedView | View} */
    const ModalView = isAnimated ? Animated.View : View;

    return (
      <ModalView
        testID="Modal"
        style={[
          styles.modal,
          isAnimated
            ? {
                transform: [
                  {
                    translateY: y,
                  },
                ],
                opacity,
              }
            : {},
        ]}>
        {children}
      </ModalView>
    );
  };

  showAnimation() {
    const {animationType} = this.props;

    const {y, opacity} = this.state;

    switch (animationType) {
      case 'pushToTop':
        Animated.timing(y, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start();
        break;
      case 'fade':
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start();
        break;
      default:
        break;
    }
  }

  hideAnimation() {
    const {animationType} = this.props;

    const {y, opacity} = this.state;

    switch (animationType) {
      case 'pushToTop':
        Animated.timing(y, {
          toValue: SCREEN_HEIGHT,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start();
        break;
      case 'fade':
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start();
        break;
      default:
        break;
    }
  }

  render() {
    return null;
  }
}

const styles = StyleSheet.create({
  modal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
});
