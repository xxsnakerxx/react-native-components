import React, {useRef} from 'react';

import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

export const useTimeBlockedCallback = (
  callback?: (...args: any[]) => void,
  timeBlocked = 500,
) => {
  const isBlockedRef = useRef(false);

  if (!callback) {
    return () => {};
  }

  return (...callbackArgs: any[]) => {
    if (!isBlockedRef.current) {
      callback(...callbackArgs);
    }

    setTimeout(() => {
      isBlockedRef.current = false;
    }, timeBlocked);

    isBlockedRef.current = true;
  };
};

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
    onPress,
    ...touchableProps
  } = props;

  const _disabledContainerStyle = touchableProps.disabled
    ? disabledContainerStyle
    : null;
  const _disabledTextStyle = touchableProps.disabled ? disabledTextStyle : null;

  const isTextButton = typeof children === 'string';

  const timeBlockedOnPress = useTimeBlockedCallback(onPress);

  let _onPress: (...args: any[]) => void | undefined;

  if (onPress) {
    _onPress = timeBlockedOnPress;
  }

  return (
    <TouchableOpacity
      testID="Button"
      activeOpacity={!onPress ? 1 : undefined}
      {...touchableProps}
      // @ts-ignore
      onPress={_onPress}
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
