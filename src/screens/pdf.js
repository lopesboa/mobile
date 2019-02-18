// @flow

import * as React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {NovaSolidStatusClose as BackIcon} from '@coorpacademy/nova-icons';

import Pdf from '../components/pdf';
import Screen from '../components/screen';
import theme from '../modules/theme';

export type Params = {|
  title: string,
  source: File | {uri: string}
|};

type Props = {|
  ...ReactNavigation$ScreenPropsWithParams<Params>
|};

const styles = StyleSheet.create({
  close: {
    paddingLeft: theme.spacing.small
  }
});

class PdfScreen extends React.PureComponent<Props> {
  props: Props;

  static navigationOptions = (screenProps: ReactNavigation$ScreenProps) => {
    const {navigationOptions, navigation} = screenProps;

    return {
      ...navigationOptions,
      headerStyle: {},
      title: navigation.getParam('title'),
      headerLeft: (
        <View style={styles.close}>
          <TouchableOpacity
            testID="button-close"
            onPress={PdfScreen.handleButtonPress(screenProps)}
          >
            <BackIcon height={16} width={16} color={theme.colors.gray.dark} />
          </TouchableOpacity>
        </View>
      )
    };
  };

  static handleButtonPress = ({navigation}: ReactNavigation$ScreenProps) => () =>
    navigation.dispatch(NavigationActions.back());

  render() {
    const {source} = this.props.navigation.state.params;
    return (
      <Screen testID="pdf-screen" noScroll>
        <Pdf source={source} />
      </Screen>
    );
  }
}

export default PdfScreen;
