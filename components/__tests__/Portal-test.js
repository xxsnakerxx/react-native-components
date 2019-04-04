import {
  Text,
} from 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Portal from '../Portal';

describe('Portal', () => {
  it('renders correctly', () => {
    const component = renderer.create(
      <Portal />,
    );

    Portal.showModal(
      Portal.allocateTag(),
      (
        <Text>
          Modal 1
        </Text>
      ),
    );
    Portal.showModal(
      Portal.allocateTag(),
      (
        <Text>
          Modal 2
        </Text>
      ),
    );

    expect(component.toJSON()).toMatchSnapshot();
    expect(Portal.getOpenModals()).toMatchSnapshot();
  });
});
