import React from 'react';

import {
  StyleSheet,
  View,
  Animated,
  Platform,
} from 'react-native';

/**
 * @typedef {import("react-native").GestureResponderEvent} GestureResponderEvent
 * @typedef {import("react-native").ImageLoadEventData} ImageLoadEventData
 * @typedef {import("react-native").NativeSyntheticEvent<ImageLoadEventData>} OnLoadEvent
 * @typedef {import("react-native").ViewStyle} ViewStyle
 * @typedef {import("react-native").StyleProp<ViewStyle>} ViewStyleProp
 * @typedef {import("react-native").ImageProps} ImageProps
 * @typedef {import("react").ReactElement<any>} Element
 *
 * @typedef Props
 * @prop {Element} [placeholder]
 * @prop {ViewStyleProp} [containerStyle=null]
 *
 * @typedef {ImageProps & Props} LazyImageProps
 */

/**
 * @class LazyImage
 * @extends {React.Component<LazyImageProps>}
 */
export default class LazyImage extends React.Component {
  static defaultProps = {
    placeholder: null,
    containerStyle: null,
    resizeMode: 'cover',
    onLoad: () => {},
    onLoadStart: () => {},
  }

  /**
   * @param {LazyImageProps} props
   */
  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
    };
  }

  /**
   * @param {LazyImageProps} nextProps
   */
  shouldComponentUpdate(nextProps) {
    return JSON.stringify(nextProps) !== JSON.stringify(this.props);
  }

  _onLoadStart = () => {
    const {
      opacity,
    } = this.state;

    const {
      onLoadStart,
    } = this.props;

    opacity.setValue(0);

    onLoadStart();
  }

  /**
   * @param {OnLoadEvent} e
   */
  _onLoad = (e) => {
    const {
      opacity,
    } = this.state;

    const {
      onLoad,
    } = this.props;

    requestAnimationFrame(() => {
      Animated.timing(opacity,
        {
          toValue: 1,
          duration: 300,
          useNativeDriver: Platform.OS === 'ios',
        },
      ).start(() => {
        onLoad(e);
      });
    });
  };

  render() {
    const {
      containerStyle,
      placeholder,
      ...imageProps
    } = this.props;

    const { style } = imageProps;

    const {
      opacity,
    } = this.state;

    return (
      <View
        testID="LazyImage"
        style={[
          containerStyle,
          styles.container,
        ]}
      >
        {placeholder}
        <Animated.Image
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...imageProps}
          testID="LazyImage-Image"
          onLoad={this._onLoad}
          onLoadStart={this._onLoadStart}
          style={[
            styles.image,
            style,
            {
              opacity,
            },
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: { ...StyleSheet.absoluteFillObject },
});
