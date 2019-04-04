import React from 'react';

import {
  TouchableOpacity,
  View,
  ViewPropTypes,
  Text,
  StyleSheet,
} from 'react-native';

const Button = (props) => {
  const touchableProps = { ...props };
  delete touchableProps.style;
  delete touchableProps.disabledStyle;
  delete touchableProps.disabledTextStyle;
  delete touchableProps.children;

  const {
    children,
    containerStyle,
    textStyle,
    disabledStyle,
    disabledTextStyle,
    disabled,
  } = props;

  const _disabledStyle = disabled ? disabledStyle : null;
  const _disabledTextStyle = disabled ? disabledTextStyle : null;
  const isTextButton = typeof children === 'string';

  return (
    <TouchableOpacity
      style={isTextButton ? containerStyle : null}
      activeOpacity={!touchableProps.onPress ? 1 : undefined}
      {...touchableProps}
    >
      {isTextButton
        ? (
          <Text
            style={[
              styles.text,
              textStyle,
              _disabledStyle,
              _disabledTextStyle,
            ]}
          >
            {children}
          </Text>
        )
        : (
          <View
            style={[
              _disabledStyle,
              !isTextButton ? containerStyle : {},
            ]}
          >
            {children}
          </View>
        )
      }
    </TouchableOpacity>
  );
};

Button.propTypes = {
  /* eslint-disable react/no-typos */
  textStyle: Text.propTypes.style,
  containerStyle: ViewPropTypes.style,
  disabledStyle: ViewPropTypes.style,
  disabledTextStyle: Text.propTypes.style,
  /* eslint-enable react/no-typos */
  ...TouchableOpacity.propTypes,
};

Button.defaultProps = {
  textStyle: null,
  containerStyle: null,
  disabledStyle: null,
  disabledTextStyle: null,
};

export default Button;

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
});
