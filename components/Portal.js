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

/** @type Portal */
let portalRef;

let counter = 0;

/**
 * @typedef {import("react").ReactElement<any>} ReactElement
 */

/**
 * @class Portal
 * @extends {React.Component<any>}
 */
export default class Portal extends React.Component {
  // eslint-disable-next-line no-plusplus
  static allocateTag = () => `__modal_${++counter}`;

  /**
   * @param {string} tag
   * @param {ReactElement} component
   */
  static showModal = (tag, component) => {
    if (!portalRef) {
      throw new Error('Calling showModal but no Portal has been rendered.');
    }

    portalRef._showModal(tag, component);
  }

  /**
   * @param {string} tag
   */
  static closeModal = (tag) => {
    if (!portalRef) {
      throw new Error('Calling closeModal but no Portal has been rendered.');
    }

    portalRef._closeModal(tag);
  }

  static getOpenModals = () => {
    if (!portalRef) {
      throw new Error('Calling getOpenModals but no Portal has been rendered.');
    }

    return portalRef._getOpenModals();
  }

  constructor(props) {
    super(props);

    portalRef = this;

    this.state = {
      /** @type {Object<string,ReactElement>} */
      modals: {},
    };
  }

  componentWillUnmount() {
    portalRef = null;
    counter = 0;
  }

  /**
   * @param {string} tag
   * @param {ReactElement} component
   */
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

  /**
   * @param {string} tag
   */
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
