import {
  Text,
} from 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Overlay from '../Overlay';

describe('Overlay', () => {
  const style = { width: 200 };

  it('renders correctly with defaults', () => {
    const tree = renderer.create(
      <Overlay />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly as modal', () => {
    const tree = renderer.create(
      <Overlay
        modal
      />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with layer', () => {
    const tree = renderer.create(
      <Overlay
        style={style}
        layer={(
          <Text>
            Layer
          </Text>
        )}
      />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with spinner', () => {
    const tree = renderer.create(
      <Overlay
        spinner
        spinnerColor="red"
      />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when visible', () => {
    jest.useFakeTimers();

    const tree = renderer.create(
      <Overlay
        visible
      />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
