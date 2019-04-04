import {
  Text,
} from 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import LazyImage from '../LazyImage';

const containerStyle = { width: 40, height: 40 };
const imageStyle = { borderRadius: 20 };
const onLoad = jest.fn();
const source = { uri: 'https://pic.com/1' };

describe('LazyImage', () => {
  it('renders correctly', () => {
    const component = renderer.create(
      <LazyImage
        containerStyle={containerStyle}
        style={imageStyle}
        source={source}
        placeholder={(
          <Text>
            Placeholder
          </Text>
        )}
      />,
    );

    expect(component.toJSON()).toMatchSnapshot();
  });

  it('renders correctly when loaded', () => {
    jest.useFakeTimers();

    const component = renderer.create(
      <LazyImage
        containerStyle={containerStyle}
        style={imageStyle}
        source={source}
        placeholder={(
          <Text>
            Placeholder
          </Text>
        )}
        onLoad={onLoad}
      />,
    );

    const instance = component.getInstance();

    instance._onLoad();
    jest.runAllTimers();

    expect(component.toJSON()).toMatchSnapshot();
    expect(onLoad).toBeCalled();
    expect(instance.isLoaded()).toBeTruthy();
    expect(LazyImage.cache.includes(JSON.stringify(source))).toBeTruthy();
  });

  it('renders correctly when reseted', () => {
    jest.useFakeTimers();

    const component = renderer.create(
      <LazyImage
        containerStyle={containerStyle}
        style={imageStyle}
        source={source}
        placeholder={(
          <Text>
            Placeholder
          </Text>
        )}
        onLoad={onLoad}
      />,
    );

    const instance = component.getInstance();

    instance._onLoad();
    jest.runAllTimers();
    instance.reset(() => {
      expect(component.toJSON()).toMatchSnapshot();
    });
  });
});
