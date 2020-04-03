/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

import React, {ReactElement} from 'react';

import {StyleSheet, View} from 'react-native';

let portalRef: Portal | null;

let counter = 0;

interface State {
  modals: {[key: string]: ReactElement};
}

export default class Portal extends React.PureComponent<any, State> {
  static allocateTag = () => `__modal_${++counter}`;

  static showModal = (tag: string, component: ReactElement<any>) => {
    if (!portalRef) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Calling showModal but no Portal has been rendered.');
      }

      return;
    }

    portalRef._showModal(tag, component);
  };

  static closeModal = (tag: string) => {
    if (!portalRef) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Calling closeModal but no Portal has been rendered.');
      }

      return;
    }

    portalRef._closeModal(tag);
  };

  static getOpenModals = () => {
    if (!portalRef) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Calling getOpenModals but no Portal has been rendered.');
      }

      return [];
    }

    return portalRef._getOpenModals();
  };

  constructor(props: any) {
    super(props);

    this.state = {
      modals: {},
    };
  }

  componentDidMount() {
    // eslint-disable-next-line consistent-this
    portalRef = this;
  }

  componentWillUnmount() {
    portalRef = null;
    counter = 0;
  }

  _showModal(tag: string, component: ReactElement) {
    const {modals} = this.state;

    this.setState({
      modals: {
        ...modals,
        [tag]: component,
      },
    });
  }

  _closeModal(tag: string) {
    const {modals} = this.state;

    const modalsCopy = {...modals};

    if (!modalsCopy[tag]) {
      return;
    }

    delete modalsCopy[tag];

    this.setState({
      modals: modalsCopy,
    });
  }

  _getOpenModals() {
    const {modals} = this.state;

    return Object.keys(modals);
  }

  render() {
    const {modals} = this.state;

    if (!Object.keys(modals).length) {
      return null;
    }

    return (
      <View style={styles.modalsContainer} pointerEvents="box-none">
        {Object.keys(modals).map((tag) => ({...modals[tag], key: tag}))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalsContainer: {...StyleSheet.absoluteFillObject},
});
