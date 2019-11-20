import React from 'react';

import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';

/**
 * @typedef {import("react-native").GestureResponderEvent} GestureResponderEvent
 * @typedef {import("react-native").ImageLoadEventData} ImageLoadEventData
 * @typedef {import("react-native").NativeSyntheticEvent<ImageLoadEventData>} OnLoadEvent
 * @typedef {import("react-native").ViewProps} ViewProps
 * @typedef {import("react-native").ViewStyle} ViewStyle
 * @typedef {import("react-native").StyleProp<ViewStyle>} ViewStyleProp
 * @typedef {import("react-native").TextStyle} TextStyle
 * @typedef {import("react-native").StyleProp<TextStyle>} TextStyleProp
 * @typedef {import("react-native").TouchableOpacityProps} TouchableOpacityProps
 * @typedef {import("react").Props} ReactProps
 *
 * @typedef ButtonProps
 * @prop {ViewStyleProp} [containerStyle=null]
 * @prop {TextStyleProp} [textStyle=null]
 * @prop {ViewStyleProp} [disabledContainerStyle=null]
 * @prop {TextStyleProp} [disabledTextStyle=null]
 *
 * @typedef {TouchableOpacityProps & ButtonProps & ReactProps} Props
 */

/**
 * @param {Props} props
 */
const Button = (props) => {
  const {
    containerStyle,
    textStyle,
    disabledContainerStyle,
    disabledTextStyle,
    children,
    ...touchableProps
  } = props;

  const _disabledContainerStyle = touchableProps.disabled ? disabledContainerStyle : null;
  const _disabledTextStyle = touchableProps.disabled ? disabledTextStyle : null;

  const isTextButton = typeof children === 'string';

  return (
    <TouchableOpacity
      testID="Button"
      activeOpacity={!touchableProps.onPress ? 1 : undefined}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...touchableProps}
    >
      {
        isTextButton
          ? (
            <View
              style={[
                containerStyle,
                _disabledContainerStyle,
              ]}
            >
              <Text
                style={[
                  styles.text,
                  textStyle,
                  _disabledTextStyle,
                ]}
              >
                {children}
              </Text>
            </View>
          )
          : (
            <View
              style={[
                containerStyle,
                _disabledContainerStyle,
              ]}
            >
              {children}
            </View>
          )
      }
    </TouchableOpacity>
  );
};

Button.defaultProps = {
  textStyle: null,
  containerStyle: null,
  disabledContainerStyle: null,
  disabledTextStyle: null,
};

export default Button;

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
});
