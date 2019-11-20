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

/**
 * @typedef AnimationTypeEnum
 * @prop {string} PUSH_TO_TOP
 * @prop {string} FADE
 */

/** @type AnimationTypeEnum */
const AnimationType = {
  PUSH_TO_TOP: 'push_to_top',
  FADE: 'fase',
};

/**
 * @typedef {import("react-native").ViewProps} ViewProps
 * @typedef {import("react-native").Animated.View} AnimatedView
 *
 * @typedef Props
 * @prop {boolean} [isVisible=true]
 * @prop {boolean} [isAnimated=true]
 * @prop {string} [animationType=AnimationType.PUSH_TO_TOP]
 */

/**
 * @class Modal
 * @extends {React.PureComponent<Props>}
 */
export default class Modal extends React.PureComponent {
  static defaultProps = {
    isVisible: false,
    isAnimated: true,
    animationType: AnimationType.PUSH_TO_TOP,
  }

  static AnimationType = AnimationType;

  /**
   * @param {Props} props
   */
  constructor(props) {
    super(props);

    this.state = {
      y: new Animated.Value(
        props.animationType === AnimationType.PUSH_TO_TOP
          ? SCREEN_HEIGHT
          : 0,
      ),
      opacity: new Animated.Value(
        props.animationType === AnimationType.FADE
          ? 0
          : 1,
      ),
    };
  }

  componentDidMount() {
    const {
      isVisible,
      isAnimated,
    } = this.props;

    this._tag = Portal.allocateTag();

    if (isVisible) {
      Portal.showModal(this._tag, this._renderModal());

      if (isAnimated) {
        this.showAnimation();
      }
    }
  }

  /**
   * @param {Props} prevProps
   */
  componentDidUpdate(prevProps) {
    const {
      isVisible,
      isAnimated,
    } = this.props;

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
    const {
      isAnimated,
    } = this.props;

    if (isAnimated) {
      this.hideAnimation();
    }

    InteractionManager.runAfterInteractions(() => {
      Portal.closeModal(this._tag);

      this._tag = null;
    });
  }

  _renderModal = () => {
    const {
      isAnimated,
      children,
    } = this.props;

    const {
      y,
      opacity,
    } = this.state;

    /** @type {AnimatedView | View} */
    const ModalView = isAnimated ? Animated.View : View;

    return (
      <ModalView
        testID="Modal"
        style={[
          styles.modal,
          isAnimated ? {
            transform: [
              {
                translateY: y,
              },
            ],
            opacity,
          } : {},
        ]}
      >
        {children}
      </ModalView>
    );
  }

  showAnimation() {
    const {
      animationType,
    } = this.props;

    const {
      y,
      opacity,
    } = this.state;

    switch (animationType) {
      case AnimationType.PUSH_TO_TOP:
        Animated.timing(y,
          {
            toValue: 0,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          },
        ).start();
        break;
      case AnimationType.FADE:
        Animated.timing(opacity,
          {
            toValue: 1,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          },
        ).start();
        break;
      default:
        break;
    }
  }

  hideAnimation() {
    const {
      animationType,
    } = this.props;

    const {
      y,
      opacity,
    } = this.state;

    switch (animationType) {
      case AnimationType.PUSH_TO_TOP:
        Animated.timing(y,
          {
            toValue: SCREEN_HEIGHT,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          },
        ).start();
        break;
      case AnimationType.FADE:
        Animated.timing(opacity,
          {
            toValue: 0,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          },
        ).start();
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
