import React from 'react';
import { View } from 'react-native';
import mockdate from 'mockdate';

import { render, fireEvent } from '../../test-utils';

import Overlay from '../Overlay';

beforeEach(() => {
  mockdate.set(0);
});

describe('Overlay', () => {
  it('should renders correctly if is not modal', async () => {
    const { queryByTestId } = render(
      <View>
        <Overlay
          isVisible
        />
      </View>,
    );

    expect(queryByTestId('Modal')).toBeFalsy();
    expect(queryByTestId('Overlay')).toBeTruthy();
  });

  it('should renders correctly if is modal', async () => {
    const { queryByTestId } = render(
      <Overlay
        isModal
        isVisible
      />,
    );

    expect(queryByTestId('Modal')).toBeTruthy();
    expect(queryByTestId('Overlay')).toBeTruthy();
  });

  it('should correctly handle isVisible prop if is not modal', async () => {
    const { queryByTestId, rerender } = render(
      <Overlay />,
    );

    expect(queryByTestId('Overlay')).toBeTruthy();

    rerender(
      <Overlay
        isVisible
      />,
    );

    global.timeTravel(300);

    expect(queryByTestId('Overlay')).toBeTruthy();

    rerender(
      <Overlay
        isVisible={false}
      />,
    );

    global.timeTravel(300);

    jest.runAllTimers();

    expect(queryByTestId('Overlay')).toBeTruthy();
  });

  it('should correctly handle isVisible prop is modal', async () => {
    const onShow = jest.fn();
    const onHide = jest.fn();

    const { queryByTestId, rerender } = render(
      <Overlay
        isModal
        onShow={onShow}
        onHide={onHide}
      />,
    );

    expect(queryByTestId('Modal')).toBeFalsy();
    expect(queryByTestId('Overlay')).toBeFalsy();
    expect(onShow).toHaveBeenCalledTimes(0);
    expect(onHide).toHaveBeenCalledTimes(0);

    rerender(
      <Overlay
        isModal
        onShow={onShow}
        onHide={onHide}
        isVisible
      />,
    );

    global.timeTravel(300);

    expect(queryByTestId('Modal')).toBeTruthy();
    expect(queryByTestId('Overlay')).toBeTruthy();
    expect(onShow).toHaveBeenCalledTimes(1);
    expect(onHide).toHaveBeenCalledTimes(0);

    rerender(
      <Overlay
        isModal
        onShow={onShow}
        onHide={onHide}
        isVisible={false}
      />,
    );

    global.timeTravel(300);

    jest.runAllTimers();

    expect(queryByTestId('Modal')).toBeFalsy();
    expect(queryByTestId('Overlay')).toBeFalsy();
    expect(onShow).toHaveBeenCalledTimes(1);
    expect(onHide).toHaveBeenCalledTimes(1);
  });

  it('should correctly handle show/hide methods via ref', async () => {
    const ref = React.createRef();
    const onShow = jest.fn();
    const onHide = jest.fn();

    const { queryByTestId } = render(
      <Overlay
        ref={ref}
        onShow={onShow}
        onHide={onHide}
        isModal
      />,
    );

    expect(queryByTestId('Modal')).toBeFalsy();
    expect(queryByTestId('Overlay')).toBeFalsy();
    expect(onShow).toHaveBeenCalledTimes(0);
    expect(onHide).toHaveBeenCalledTimes(0);

    ref.current.show();

    global.timeTravel(300);

    expect(queryByTestId('Modal')).toBeTruthy();
    expect(queryByTestId('Overlay')).toBeTruthy();
    expect(onShow).toHaveBeenCalledTimes(1);
    expect(onHide).toHaveBeenCalledTimes(0);

    ref.current.hide();

    global.timeTravel(300);

    jest.runAllTimers();

    expect(queryByTestId('Modal')).toBeFalsy();
    expect(queryByTestId('Overlay')).toBeFalsy();
    expect(onShow).toHaveBeenCalledTimes(1);
    expect(onHide).toHaveBeenCalledTimes(1);
  });

  it('should render spinner', async () => {
    const { queryByTestId } = render(
      <Overlay
        showSpinner
      />,
    );

    expect(queryByTestId('SpinnerContainer')).toBeTruthy();
  });

  it('should handle press', async () => {
    let pressed = false;

    const { queryByTestId } = render(
      <Overlay
        onPress={() => { pressed = true; }}
      />,
    );

    fireEvent.press(queryByTestId('PressHandler'));

    expect(pressed).toBeTruthy();
  });
});
