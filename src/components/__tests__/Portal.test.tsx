import React from 'react';
import {render} from '@testing-library/react-native';

import {View, Text} from 'react-native';

import Portal from '../Portal';

describe('Portal', () => {
  it('should correctly open/close modals', async () => {
    const {queryByText} = render(<Portal />);

    Portal.showModal(Portal.allocateTag(), <Text>Modal 1</Text>);

    Portal.showModal(Portal.allocateTag(), <Text>Modal 2</Text>);

    expect(queryByText('Modal 1')).toBeTruthy();
    expect(queryByText('Modal 2')).toBeTruthy();

    expect(Portal.getOpenModals()).toEqual(['__modal_1', '__modal_2']);

    Portal.closeModal('__modal_1');

    expect(queryByText('Modal 1')).toBeFalsy();
    expect(queryByText('Modal 2')).toBeTruthy();

    expect(Portal.getOpenModals()).toEqual(['__modal_2']);
  });

  it('should have correct behavior if it was not rendered', async () => {
    const {queryByText} = render(<View />);

    Portal.showModal(Portal.allocateTag(), <Text>Modal 1</Text>);

    expect(queryByText('Modal 1')).toBeFalsy();

    expect(Portal.getOpenModals()).toEqual([]);

    Portal.closeModal('__modal_1');

    expect(Portal.getOpenModals()).toEqual([]);
  });
});
