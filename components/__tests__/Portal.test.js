import React from 'react';
import { render } from '@testing-library/react-native';

import { View, Text } from 'react-native';

import Portal from '../Portal';

describe('Portal', () => {
  it('should correctly open/close modals', async () => {
    const { queryByText } = render(
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

    expect(queryByText('Modal 1')).toBeTruthy();
    expect(queryByText('Modal 2')).toBeTruthy();

    expect(Portal.getOpenModals())
      .toEqual([
        '__modal_1',
        '__modal_2',
      ]);

    Portal.closeModal('__modal_1');

    expect(queryByText('Modal 1')).toBeFalsy();
    expect(queryByText('Modal 2')).toBeTruthy();

    expect(Portal.getOpenModals())
      .toEqual([
        '__modal_2',
      ]);
  });

  it('should throw error if Portal was not rendered', async () => {
    const { queryByText } = render(
      <View />,
    );

    expect(() => Portal.showModal(
      Portal.allocateTag(),
      (
        <Text>
          Modal 1
        </Text>
      ),
    )).toThrow();

    expect(queryByText('Modal 1')).toBeFalsy();

    expect(() => Portal.getOpenModals()).toThrow();

    expect(() => Portal.closeModal('__modal_1')).toThrow();
  });
});
