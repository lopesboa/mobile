// @flow

// Because of https://github.com/facebook/react-native/issues/15902
// @todo RN upgrade 0.59 reminder: remove this
import symbol from 'core-js/es6/symbol';
import 'core-js/fn/symbol/iterator';
import 'core-js/fn/map';
import 'core-js/fn/set';
import 'core-js/fn/array/find';

import app from './app';

global.Symbol = symbol;

export default app;
