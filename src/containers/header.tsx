import * as React from 'react';
import {Alert} from 'react-native';
import {connect} from 'react-redux';

import translations from '../translations';
import HeaderComponent from '../components/header';
import type {Props as ComponentProps} from '../components/header';
import {signOut as _signOut} from '../redux/actions/authentication';

interface ConnectedDispatchProps {
  signOut: typeof _signOut;
}

export interface Props extends ConnectedDispatchProps {
  height: Pick<ComponentProps, 'height'>;
  onSearchPress: () => void;
  onSettingsPress: () => void;
}

class Header extends React.PureComponent<Props> {
  handleLogoLongPress = () =>
    Alert.alert(translations.logOut, null, [
      {
        text: translations.cancel,
      },
      {
        text: translations.ok,
        onPress: () => this.props.signOut(),
      },
    ]);

  render() {
    const {onSearchPress, onSettingsPress, height} = this.props;

    return (
      <HeaderComponent
        height={height}
        onLogoLongPress={this.handleLogoLongPress}
        onSearchPress={onSearchPress}
        onSettingsPress={onSettingsPress}
        testID="header"
      />
    );
  }
}

const mapDispatchToProps: ConnectedDispatchProps = {
  signOut: _signOut,
};

export {Header as Component};
export default connect(null, mapDispatchToProps)(Header);
