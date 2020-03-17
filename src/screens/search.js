// @flow

import * as React from 'react';
import {StatusBar} from 'react-native';
import {connect} from 'react-redux';

import Screen from '../components/screen';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {selectCard} from '../redux/actions/catalog/cards/select';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';
import Search from '../containers/search';

export type Params = {|
  url: string
|};

type ConnectedDispatchProps = {|
  selectCard: typeof selectCard
|};

export type Props = {|
  ...ConnectedDispatchProps,
  ...ReactNavigation$ScreenPropsWithParams<Params>
|};

class SearchScreen extends React.PureComponent<Props> {
  props: Props;

  handleBackPress = () => this.props.navigation.goBack();

  handleCardPress = (item: DisciplineCard | ChapterCard) => {
    this.props.navigation.navigate('Slide');
    this.props.selectCard(item);
  };

  render() {
    return (
      <Screen noScroll testID="search-screen">
        <StatusBar barStyle="dark-content" backgroundColor={HEADER_BACKGROUND_COLOR} />
        <Search onCardPress={this.handleCardPress} onBackPress={this.handleBackPress} />
      </Screen>
    );
  }
}

const mapDispatchToProps: ConnectedDispatchProps = {
  selectCard
};

export {SearchScreen as Component};
export default connect(
  null,
  mapDispatchToProps
)(SearchScreen);
