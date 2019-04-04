import {
  View,
  Text,
} from 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Button from '../Button';

describe('Button', () => {
  const textStyle = { color: '#000' };
  const containerStyle = { height: 100 };
  const disabledStyle = { opacity: 0.4 };

  it('renders correctly with text', () => {
    const tree = renderer.create(
      <Button
        containerStyle={containerStyle}
        textStyle={textStyle}
        disabledStyle={disabledStyle}
      >
        {'Button text'}
      </Button>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with text and disabled', () => {
    const tree = renderer.create(
      <Button
        disabled
        containerStyle={containerStyle}
        textStyle={textStyle}
        disabledStyle={disabledStyle}
      >
        {'Button text'}
      </Button>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with complex children', () => {
    const tree = renderer.create(
      <Button
        containerStyle={containerStyle}
        textStyle={textStyle}
        disabledStyle={disabledStyle}
      >
        <View>
          <Text>
            Complex children
          </Text>
        </View>
      </Button>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with complex children and disabled', () => {
    const tree = renderer.create(
      <Button
        disabled
        containerStyle={containerStyle}
        textStyle={textStyle}
        disabledStyle={disabledStyle}
      >
        <View>
          <Text>
            Complex children
          </Text>
        </View>
      </Button>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
