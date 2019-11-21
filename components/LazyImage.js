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
 * @typedef {import("react-native").ImageSourcePropType} ImageSourcePropType
 * @typedef {import("react").ReactElement<any>} Element
 *
 * @typedef Props
 * @prop {Element} [placeholder]
 * @prop {ViewStyleProp} [containerStyle=null]
 *
 * @typedef {ImageProps & Props} LazyImageProps
 */

const cache = [];

/**
 * @param {ImageSourcePropType} source
 * @returns boolean
 */
const sourceIsCached = (source) => {
  if (!source) return false;

  if (typeof source !== 'number' && !Array.isArray(source)) {
    return cache.includes(source.uri);
  }

  return cache.includes(source);
};

/**
 * @param {ImageSourcePropType} source
 */
const cacheSource = (source) => {
  if (!source) return;

  if (typeof source !== 'number' && !Array.isArray(source)) {
    cache.push(source.uri);
  }

  cache.push(source);
};

/**
 * @class LazyImage
 * @extends {React.PureComponent<LazyImageProps>}
 */
export default class LazyImage extends React.PureComponent {
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
      opacity: new Animated.Value(+sourceIsCached(props.source)),
    };
  }

  _onLoadStart = () => {
    const {
      opacity,
    } = this.state;

    const {
      onLoadStart,
      source,
    } = this.props;

    opacity.setValue(+sourceIsCached(source));

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
      source,
    } = this.props;

    const { width, height } = e.nativeEvent.source;

    if (width <= 1 || height <= 1) return;

    if (sourceIsCached(source)) {
      opacity.setValue(1);
    } else {
      cacheSource(source);

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
    }
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
  image: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
  },
});
