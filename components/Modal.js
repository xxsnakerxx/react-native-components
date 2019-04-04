import React from 'react';
import PropTypes from 'prop-types';

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

export default class Modal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    animated: PropTypes.bool,
    animationType: PropTypes.oneOf(['pushToTop', 'fade']),
  }

  static defaultProps = {
    visible: true,
    animated: false,
    animationType: 'pushToTop',
  }

  constructor(props) {
    super(props);

    this.state = {
      y: new Animated.Value(props.animationType === 'pushToTop' ? SCREEN_HEIGHT : 0),
      opacity: new Animated.Value(props.animationType === 'fade' ? 0 : 1),
    };
  }

  componentDidMount() {
    const {
      visible,
      animated,
    } = this.props;

    this._tag = Portal.allocateTag();

    if (visible) {
      Portal.showModal(this._tag, this._renderModal());

      if (animated) {
        this.showAnimation();
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {
      visible,
      animated,
    } = this.props;

    if (visible) {
      Portal.showModal(this._tag, this._renderModal());

      if (animated) {
        this.showAnimation();
      }
    }

    if (!visible && prevProps.visible) {
      if (animated) {
        this.hideAnimation();
      }

      InteractionManager.runAfterInteractions(() => {
        Portal.closeModal(this._tag);
      });
    }
  }

  componentWillUnmount() {
    const {
      animated,
    } = this.props;

    if (animated) {
      this.hideAnimation();
    }

    InteractionManager.runAfterInteractions(() => {
      Portal.closeModal(this._tag);

      this._tag = null;
    });
  }

  _renderModal = () => {
    const {
      animated,
      children,
    } = this.props;

    const {
      y,
      opacity,
    } = this.state;

    const ModalView = animated ? Animated.View : View;

    return (
      <ModalView
        style={[
          styles.modal,
          animated ? {
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
      case 'pushToTop':
        Animated.timing(y,
          {
            toValue: 0,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          },
        ).start();
        break;
      case 'fade':
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
      case 'pushToTop':
        Animated.timing(y,
          {
            toValue: SCREEN_HEIGHT,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          },
        ).start();
        break;
      case 'fade':
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
