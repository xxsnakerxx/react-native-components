import React, {ReactElement} from 'react';

import {
  StyleSheet,
  View,
  Animated,
  ImageSourcePropType,
  ImageProps,
  StyleProp,
  ViewStyle,
  NativeSyntheticEvent,
  ImageLoadEventData,
} from 'react-native';

const cache: string[] = [];

const sourceIsCached = (source: ImageSourcePropType): boolean => {
  if (!source) {
    return false;
  }

  if (typeof source !== 'number' && !Array.isArray(source)) {
    return !!source.uri && cache.includes(source.uri);
  }

  // @ts-ignore
  return cache.includes(source);
};

const cacheSource = (source: ImageSourcePropType) => {
  if (!source) {
    return;
  }

  if (typeof source !== 'number' && !Array.isArray(source) && source.uri) {
    cache.push(source.uri);
  }

  // @ts-ignore
  cache.push(source);
};

interface LazyImageProps {
  placeholder?: ReactElement;
  containerStyle?: StyleProp<ViewStyle>;
}

export type Props = LazyImageProps & ImageProps;

interface State {
  opacity: Animated.Value;
}

export default class LazyImage extends React.PureComponent<Props, State> {
  static defaultProps = {
    placeholder: null,
    resizeMode: 'cover',
    onLoad: () => {},
    onLoadStart: () => {},
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(+sourceIsCached(props.source)),
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const {opacity} = this.state;

    if (!sourceIsCached(nextProps.source)) {
      opacity.setValue(0);
    }
  }

  _onLoadStart = () => {
    const {opacity} = this.state;

    const {onLoadStart, source} = this.props;

    opacity.setValue(+sourceIsCached(source));

    onLoadStart!();
  };

  _onLoad = (e: NativeSyntheticEvent<ImageLoadEventData>) => {
    const {opacity} = this.state;

    const {onLoad, source} = this.props;

    const {width, height} = e.nativeEvent.source;

    if (width <= 1 || height <= 1) {
      return;
    }

    if (sourceIsCached(source)) {
      opacity.setValue(1);
    } else {
      cacheSource(source);

      requestAnimationFrame(() => {
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onLoad!(e);
        });
      });
    }
  };

  render() {
    const {containerStyle, placeholder, ...imageProps} = this.props;

    const {style} = imageProps;

    const {opacity} = this.state;

    return (
      <View testID="LazyImage" style={[containerStyle, styles.container]}>
        {placeholder}
        <Animated.Image
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
