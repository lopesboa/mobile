// @flow strict

/* eslint-disable import/prefer-default-export */

export const getCleanUri = (originalUri: string): string =>
  originalUri.replace(/(http:|https:|)\/\//g, 'https://');
