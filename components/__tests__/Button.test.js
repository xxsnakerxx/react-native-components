import React from 'react';
import { View, Text } from 'react-native';

import { render, fireEvent } from '../../test-utils';

import Button from '../Button';

describe('Button', () => {
  it('should render just text button', async () => {
    const { queryByText, queryByTestId } = render(
      <Button>Text</Button>,
    );

    expect(queryByTestId('Button')).toBeTruthy();
    expect(queryByText('Text')).toBeTruthy();
  });

  it('should render button with children', async () => {
    const { queryByText, queryByTestId } = render(
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
    const { queryByTestId } = render(
      <Button>Text</Button>,
    );

    expect(queryByTestId('Button').getProp('activeOpacity')).toBe(1);
  });

  it('should handle press', async () => {
    let pressed = false;

    const { queryByTestId } = render(
      <Button
        onPress={() => { pressed = true; }}
      >
        Text
      </Button>,
    );

    fireEvent.press(queryByTestId('Button'));

    expect(pressed).toBeTruthy();
  });

  it('should handle correctly disabled prop', async () => {
    let pressed = false;

    const { queryByTestId } = render(
      <Button
        isDisabled
        onPress={() => { pressed = true; }}
      >
        Text
      </Button>,
    );

    fireEvent.press(queryByTestId('Button'));

    expect(pressed).toBeFalsy();
  });
});
