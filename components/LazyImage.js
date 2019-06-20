import React from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  View,
  ViewPropTypes,
  Animated,
  Image,
  Platform,
} from 'react-native';

const sourceIsSame = (src1, src2) => JSON.stringify(src1) === JSON.stringify(src2);

export default class LazyImage extends React.Component {
  static cache = [];

  static propTypes = {
    containerStyle: ViewPropTypes.style,
    style: Image.propTypes.style, // eslint-disable-line react/forbid-foreign-prop-types
    source: Image.propTypes.source, // eslint-disable-line react/forbid-foreign-prop-types
    placeholder: PropTypes.node,
    autoLoad: PropTypes.bool,
    resizeMode: PropTypes.string,
    onLoad: PropTypes.func,
    onError: PropTypes.func,
  };

  static defaultProps = {
    containerStyle: null,
    style: null,
    source: null,
    placeholder: null,
    autoLoad: true,
    resizeMode: 'cover',
    onLoad: () => {},
    onError: () => {},
  }

  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      src: null,
      opacity: new Animated.Value(0),
    };
  }

  componentDidMount() {
    const {
      autoLoad,
    } = this.props;

    if (autoLoad) {
      this.load();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      source,
      autoLoad,
    } = this.props;

    if (!sourceIsSame(prevProps.source, source)) {
      this.reset();
    }

    if (autoLoad) {
      this.load();
    }
  }

  _onLoadError = () => {
    const {
      onError,
    } = this.props;

    onError(this);
  };

  _onLoad = () => {
    const {
      src,
      opacity,
    } = this.state;

    const {
      onLoad,
    } = this.props;

    if (!src) return;

    this.setState({
      loaded: true,
    });

    const loadedFromCache = LazyImage.cache.includes(JSON.stringify(src));

    if (!loadedFromCache) {
      LazyImage.cache.push(JSON.stringify(src));
    }

    requestAnimationFrame(() => {
      Animated.timing(opacity,
        {
          toValue: 1,
          duration: 300,
          useNativeDriver: Platform.OS === 'ios',
        },
      ).start(() => {
        onLoad(this);
      });
    });
  };

  load() {
    const {
      source,
    } = this.props;

    const {
      loaded,
      src,
    } = this.state;

    if (!loaded && !sourceIsSame(source, src)) {
      this.setState({
        src: source,
      });
    }
  }

  isLoaded() {
    const {
      loaded,
    } = this.state;

    return loaded;
  }

  reset(cb) {
    const {
      opacity,
    } = this.state;

    opacity.setValue(0);

    this.setState({
      loaded: false,
      src: null,
    }, cb);
  }

  render() {
    const {
      containerStyle,
      style,
      placeholder,
      resizeMode,
    } = this.props;

    const {
      src,
      opacity,
    } = this.state;

    return (
      <View
        style={[
          containerStyle,
          styles.container,
        ]}
      >
        {placeholder}
        <Animated.Image
          source={src || null}
          style={[
            styles.image,
            style,
            {
              opacity,
            },
          ]}
          resizeMode={resizeMode}
          onError={this._onLoadError}
          onLoad={this._onLoad}
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
