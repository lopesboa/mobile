// @flow strict

import * as React from 'react';
import {View, StyleSheet, TextInput, ActivityIndicator} from 'react-native';
import {
  NovaCompositionCoorpacademySearch as SearchIcon,
  NovaSolidStatusClose as ClearIcon
} from '@coorpacademy/nova-icons';

import theme, {getHitSlop} from '../modules/theme';
import translations from '../translations';
import Touchable from './touchable';
import Space from './space';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 40,
    width: '100%',
    backgroundColor: theme.colors.gray.light,
    borderRadius: theme.radius.search,
    paddingHorizontal: theme.spacing.small,
    paddingVertical: theme.spacing.tiny,
    alignItems: 'center',
    flexDirection: 'row'
  },
  input: {
    flex: 1,
    color: theme.colors.black,
    fontSize: theme.fontSize.large
  }
});

const PLACEHOLDER_COLOR = theme.colors.gray.medium;

type Props = {|
  value?: string,
  isFetching?: boolean,
  onChange: string => void,
  testID?: string
|};

class SearchInput extends React.PureComponent<Props> {
  props: Props;

  textInput: TextInput | null;

  handleClear = () => {
    this.props.onChange('');
    this.textInput && this.textInput.clear();
  };

  handleRef = (element: TextInput | null) => {
    this.textInput = element;
  };

  render() {
    const {value, isFetching, onChange, testID = 'search-input'} = this.props;

    return (
      <View style={styles.container}>
        <View>
          <SearchIcon color={PLACEHOLDER_COLOR} height={16} width={16} />
        </View>
        <Space />
        <TextInput
          value={value}
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={onChange}
          placeholder={translations.search}
          placeholderTextColor={PLACEHOLDER_COLOR}
          ref={this.handleRef}
          testID={`${testID}-field`}
        />
        {value ? (
          <React.Fragment>
            <Space />
            {isFetching ? <ActivityIndicator color={theme.colors.black} /> : null}
            {!isFetching ? (
              <Touchable
                testID={`${testID}-clear`}
                onPress={this.handleClear}
                hitSlop={getHitSlop()}
                analyticsID="button-clear"
              >
                <ClearIcon height={14} width={14} color={theme.colors.gray.dark} />
              </Touchable>
            ) : null}
          </React.Fragment>
        ) : null}
      </View>
    );
  }
}

export default SearchInput;
