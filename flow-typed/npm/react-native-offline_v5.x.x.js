// @flow

// Because each file are typed except the index

import _NetworkProvider from 'react-native-offline/src/components/NetworkProvider';
import _ReduxNetworkProvider from 'react-native-offline/src/components/ReduxNetworkProvider';
import _NetworkConsumer from 'react-native-offline/src/components/NetworkConsumer';
import _createReducer from 'react-native-offline/src/redux/createReducer';
import _createNetworkMiddleware from 'react-native-offline/src/redux/createNetworkMiddleware';
import _offlineActionTypes from 'react-native-offline/src/redux/actionTypes';
import _offlineActionCreators from 'react-native-offline/src/redux/actionCreators';
import _networkSaga from 'react-native-offline/src/redux/sagas';
import _checkInternetConnection from 'react-native-offline/src/utils/checkInternetConnection';

declare module 'react-native-offline' {
  declare export var NetworkProvider: typeof _NetworkProvider;
  declare export var ReduxNetworkProvider: typeof _NetworkProvider;
  declare export var NetworkConsumer: typeof _NetworkProvider;
  declare export var reducer: $ExtractReturn<typeof _createReducer>;
  declare export var createReducer: typeof _createReducer;
  declare export var createNetworkMiddleware: typeof _createNetworkMiddleware;
  declare export var offlineActionTypes: typeof _offlineActionTypes;
  declare export var offlineActionCreators: typeof _offlineActionCreators;
  declare export var networkSaga: typeof _networkSaga;
  declare export var checkInternetConnection: typeof _checkInternetConnection;
}
