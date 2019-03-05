// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {NovaCompositionNavigationArrowDown as ArrowDown} from '@coorpacademy/nova-icons';
import type {Choice} from '@coorpacademy/progression-engine';
import SelectBase from 'react-native-picker-select';

import theme from '../modules/theme';

type Props = {|
  isDisabled?: boolean,
  values: $NonMaybeType<$PropertyType<Choice, 'items'>>,
  value?: string,
  placeholder?: string,
  color?: string,
  onChange: (value: string) => void,
  style?: GenericStyleProp,
  testID?: string
|};

const ICON_WIDTH = 15;

const styles = StyleSheet.create({
  text: {
    color: theme.colors.gray.medium,
    paddingRight: theme.spacing.tiny + ICON_WIDTH + theme.spacing.small
  },
  icon: {
    top: '50%',
    marginTop: -ICON_WIDTH / 2,
    right: theme.spacing.small
  }
});

class Select extends React.PureComponent<Props> {
  props: Props;

  renderIcon = () => {
    const {color = theme.colors.gray.dark} = this.props;

    return <ArrowDown color={color} height={ICON_WIDTH} width={ICON_WIDTH} />;
  };

  render() {
    const {
      values,
      placeholder,
      value,
      onChange,
      style,
      color,
      isDisabled = false,
      testID
    } = this.props;
    const selectedItem = values.find(item => item.value === value);
    const items = values.map(item => ({value: item.text, label: item.text}));

    return (
      <View testID={testID}>
        <SelectBase
          disabled={isDisabled}
          placeholder={{label: placeholder, value: ''}}
          items={items}
          onValueChange={onChange}
          value={selectedItem && selectedItem.value}
          style={{
            iconContainer: styles.icon
          }}
          // This prop let us add border & more styling to Android Input
          useNativeAndroidPickerStyle={false}
          Icon={this.renderIcon}
          pickerProps={{testID: testID && `${testID}-picker`}}
          textInputProps={{style: [styles.text, style, color && {color}]}}
        />
      </View>
    );
  }
}

export default Select;
