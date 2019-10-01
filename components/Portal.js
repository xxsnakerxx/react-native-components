/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

import React from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

let _portalRef;
let lastUsedTag = 0;

export default class Portal extends React.Component {
  // eslint-disable-next-line no-plusplus
  static allocateTag = () => `__modal_${++lastUsedTag}`;

  static showModal = (tag, component) => {
    if (!_portalRef) {
      throw new Error('Calling showModal but no Portal has been rendered.');
    }

    _portalRef._showModal(tag, component);
  }

  static closeModal = (tag) => {
    if (!_portalRef) {
      throw new Error('Calling closeModal but no Portal has been rendered.');
    }

    _portalRef._closeModal(tag);
  }

  static getOpenModals = () => {
    if (!_portalRef) {
      throw new Error('Calling getOpenModals but no Portal has been rendered.');
    }

    return _portalRef._getOpenModals();
  }

  constructor(props) {
    super(props);

    this.state = {
      modals: {},
    };
  }

  _showModal(tag, component) {
    const {
      modals,
    } = this.state;

    this.setState({
      modals: {
        ...modals,
        [tag]: component,
      },
    });
  }

  _closeModal(tag) {
    const {
      modals,
    } = this.state;

    const modalsCopy = { ...modals };

    if (!modalsCopy[tag]) {
      return;
    }

    delete modalsCopy[tag];

    this.setState({
      modals: modalsCopy,
    });
  }

  _getOpenModals() {
    const {
      modals,
    } = this.state;

    return Object.keys(modals);
  }

  render() {
    const {
      modals,
    } = this.state;

    _portalRef = this;

    if (!Object.keys(modals).length) {
      return null;
    }

    return (
      <View
        style={styles.modalsContainer}
        pointerEvents="box-none"
      >
        {Object.keys(modals).map((tag) => ({ ...modals[tag], key: tag }))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalsContainer: { ...StyleSheet.absoluteFillObject },
});
