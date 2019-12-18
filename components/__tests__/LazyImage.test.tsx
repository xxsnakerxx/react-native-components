import React from 'react';
import {Text} from 'react-native';

import {render} from '../../test-utils';

import LazyImage from '../LazyImage';

const source = {
  uri: 'https://images.com/somepick.jpg',
};

const Placeholder = <Text>Placeholder</Text>;

describe('LazyImage', () => {
  it('should renders correctly', async () => {
    const {queryByText, queryByTestId} = render(
      <LazyImage source={source} placeholder={Placeholder} />,
    );

    expect(queryByTestId('LazyImage')).toBeTruthy();
    expect(queryByTestId('LazyImage-Image')).toBeTruthy();
    expect(queryByText('Placeholder')).toBeTruthy();
  });
});
