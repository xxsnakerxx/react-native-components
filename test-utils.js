import React from 'react';
import {render} from '@testing-library/react-native';
import {Portal} from './index';

const Wrapper = ({children}) => (
  <>
    {children}
    <Portal />
  </>
);

const customRender = (ui, options) =>
  render(ui, {wrapper: Wrapper, ...options});

export * from '@testing-library/react-native';

export {customRender as render};
