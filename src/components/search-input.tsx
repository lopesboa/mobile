import * as React from 'react';
import {View, StyleSheet, TextInput, ActivityIndicator, Platform} from 'react-native';
import {
  NovaCompositionCoorpacademySearch as SearchIcon,
  NovaSolidStatusClose as ClearIcon,
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
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    color: theme.colors.black,
    fontSize: theme.fontSize.large,
    // When we don't set any height, the text doesn't appear on Android
    // Which is really weird, see https://github.com/facebook/react-native/issues/24067
    ...Platform.select({
      android: {
        height: 40,
      },
    }),
  },
});

const PLACEHOLDER_COLOR = theme.colors.gray.medium;

interface Props {
  value?: string;
  isFetching?: boolean;
  onChange: (arg0: string) => void;
  testID?: string;
  autoFocus?: boolean;
}

class SearchInput extends React.PureComponent<Props> {
  textInput: TextInput | null;

  handleClear = () => {
    this.props.onChange('');

    // react-test-renderer doesn't provide refs for rendered components.
    // By default, it returns null when the refs are referenced
    // see: https://reactjs.org/blog/2016/11/16/react-v15.4.0.html#mocking-refs-for-snapshot-testing
    /* istanbul ignore next */
    this.textInput && this.textInput.clear && this.textInput.clear();
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
          autoFocus={this.props.autoFocus}
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
