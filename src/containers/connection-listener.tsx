import * as React from 'react';
import {StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import FlashMessage, {showMessage} from 'react-native-flash-message';

import theme from '../modules/theme';
import translations from '../translations';
import {isNetworkConnected} from '../redux/utils/state-extract';

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
});

export interface ConnectedStateProps {
  isConnected: boolean;
}

export type Props = ConnectedStateProps;

class ConnectionListener extends React.PureComponent<Props> {
  componentDidUpdate() {
    const {isConnected} = this.props;

    showMessage({
      message: isConnected ? translations.connectionRestored : translations.connectionLost,
      backgroundColor: isConnected ? theme.colors.positive : theme.colors.negative,
      titleStyle: styles.title,
    });
  }

  render() {
    return <FlashMessage />;
  }
}

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  isConnected: isNetworkConnected(state),
});

export {ConnectionListener as Component};
export default connect(mapStateToProps)(ConnectionListener);
