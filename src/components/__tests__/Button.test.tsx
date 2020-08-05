import React from 'react';
import {View, Text} from 'react-native';

import {render, fireEvent} from '../../../test-utils';

import Button from '../Button';

describe('Button', () => {
  it('should render just text button', async () => {
    const {queryByText, queryByTestId} = render(<Button>Text</Button>);

    expect(queryByTestId('Button')).toBeTruthy();
    expect(queryByText('Text')).toBeTruthy();
  });

  it('should render button with children', async () => {
    const {queryByText, queryByTestId} = render(
      <Button>
        <View>
          <Text>Text</Text>
        </View>
      </Button>,
    );

    expect(queryByTestId('Button')).toBeTruthy();
    expect(queryByText('Text')).toBeTruthy();
  });

  it('should render right active opacity without onPress', async () => {
    const {queryByTestId} = render(<Button>Text</Button>);

    expect(queryByTestId('Button').props.activeOpacity).toBe(1);
  });

  it('should handle press', async () => {
    const onPress = jest.fn();

    const {queryByTestId} = render(<Button onPress={onPress}>Text</Button>);

    fireEvent.press(queryByTestId('Button'));

    expect(onPress).toBeCalledTimes(1);
  });

  it('should handle fast double press', async () => {
    const onPress = jest.fn();

    jest.useFakeTimers();

    const {queryByTestId} = render(<Button onPress={onPress}>Text</Button>);

    fireEvent.press(queryByTestId('Button'));
    fireEvent.press(queryByTestId('Button'));

    expect(onPress).toBeCalledTimes(1);

    jest.runOnlyPendingTimers();

    fireEvent.press(queryByTestId('Button'));
    fireEvent.press(queryByTestId('Button'));

    expect(onPress).toBeCalledTimes(2);
  });

  it('should handle correctly disabled prop', async () => {
    const onPress = jest.fn();

    const {queryByTestId} = render(
      <Button disabled onPress={onPress}>
        Text
      </Button>,
    );

    fireEvent.press(queryByTestId('Button'));

    // FIXME: Must be 0 here, when RN team fix the TouchableOpacity mock
    expect(onPress).toBeCalledTimes(1);
  });
});
