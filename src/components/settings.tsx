import * as React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import theme from '../modules/theme';
import {NotificationType} from '../types';
import Switch from './switch';
import Version from './version';
import Text from './text';

type SettingsItem = {
  type: NotificationType;
  label: string;
  isActive: boolean;
};

interface Props {
  settings: Array<SettingsItem>;
  onSettingToggle: (type: NotificationType) => void;
  testID: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shadow: {
    backgroundColor: theme.colors.white,
    height: 1,
    shadowColor: theme.colors.black,
    width: '100%',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 9,
  },
  titleContainer: {
    height: 110,
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 37,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.gray.light,
  },
  title: {
    fontSize: theme.fontSize.xxlarge,
    fontWeight: theme.fontWeight.bold,
  },
  notificationItemContainer: {
    flexDirection: 'row',
    height: 53,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationItem: {
    flexDirection: 'row',
  },
  version: {
    backgroundColor: theme.colors.gray.extra,
    color: theme.colors.gray.medium,
    paddingBottom: theme.spacing.base,
    paddingTop: theme.spacing.small,
  },
});

const Settings = ({settings, onSettingToggle, testID}: Props) => {
  function renderItem({item, index}: {index: number; item: SettingsItem}) {
    function handleOnSettingsItemToggle() {
      return onSettingToggle(item.type);
    }
    return (
      <React.Fragment>
        <Separator />
        <View style={styles.notificationItemContainer}>
          <Text>{item.label}</Text>
          <Switch
            isActive={item.isActive}
            onPress={handleOnSettingsItemToggle}
            testID={testID + '-switch-' + item.type}
          />
        </View>
        <Separator />
      </React.Fragment>
    );
  }

  function Separator() {
    return <View style={styles.separator} />;
  }

  function keyExtractor(item: SettingsItem) {
    return item.type;
  }

  return (
    <React.Fragment>
      <FlatList
        testID={testID + 'list'}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Notifications</Text>
          </View>
        }
        data={settings.slice(0, settings.length)}
        ItemSeparatorComponent={Separator}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
      <Version style={styles.version} />
    </React.Fragment>
  );
};

export default Settings;
