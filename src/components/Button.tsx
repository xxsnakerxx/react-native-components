import React from 'react';

import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface ButtonProps {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabledContainerStyle?: StyleProp<ViewStyle>;
  disabledTextStyle?: StyleProp<TextStyle>;
}

export type Props = TouchableOpacityProps & ButtonProps;

const Button: React.FC<Props> = (props) => {
  const {
    containerStyle,
    textStyle,
    disabledContainerStyle,
    disabledTextStyle,
    children,
    ...touchableProps
  } = props;

  const _disabledContainerStyle = touchableProps.disabled
    ? disabledContainerStyle
    : null;
  const _disabledTextStyle = touchableProps.disabled ? disabledTextStyle : null;

  const isTextButton = typeof children === 'string';

  return (
    <TouchableOpacity
      testID="Button"
      activeOpacity={!touchableProps.onPress ? 1 : undefined}
      {...touchableProps}
      style={[containerStyle, _disabledContainerStyle]}>
      {isTextButton ? (
        <Text style={[styles.text, textStyle, _disabledTextStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
});
