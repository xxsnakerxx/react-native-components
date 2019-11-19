import React from 'react';
import { Text } from 'react-native';

import { render } from '../../test-utils';

import Modal from '../Modal';

describe('Modal', () => {
  it('should correctly handle isVisible prop', async () => {
    const { queryByText, queryByTestId, rerender } = render(
      <Modal>
        <Text>
          Modal 1 Text
        </Text>
      </Modal>,
    );

    expect(queryByTestId('Modal')).toBeFalsy();
    expect(queryByText('Modal 1 Text')).toBeFalsy();

    rerender(
      <Modal
        isVisible
      >
        <Text>
          Modal 1 Text
        </Text>
      </Modal>,
    );

    jest.runAllTimers();

    expect(queryByTestId('Modal')).toBeTruthy();
    expect(queryByText('Modal 1 Text')).toBeTruthy();

    rerender(
      <Modal
        isVisible={false}
      >
        <Text>
          Modal 1 Text
        </Text>
      </Modal>,
    );

    jest.runAllTimers();

    expect(queryByTestId('Modal')).toBeFalsy();
    expect(queryByText('Modal 1 Text')).toBeFalsy();
  });
});
