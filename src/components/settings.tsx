import * as React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {ANALYTICS_EVENT_TYPE} from '../const';
import theme from '../modules/theme';
import {NotificationType} from '../types';
import withAnalytics, {WithAnalyticsProps} from '../containers/with-analytics';
import Switch from './switch';
import Version from './version';
import Text from './text';

export type SettingsItem = {
  type: NotificationType;
  label: string;
  isActive: boolean;
};

interface Props extends WithAnalyticsProps {
  settings: Array<SettingsItem>;
  onSettingToggle: (type: NotificationType) => Promise<void>;
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
  headerContainer: {
    height: 90,
  },
  titleContainer: {
    height: 110,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 37,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.gray.light,
  },
  title: {
    fontSize: theme.fontSize.xlarge,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.black,
  },
  text: {
    fontSize: theme.fontSize.large,
    color: theme.colors.black,
  },
  notificationItemContainer: {
    flexDirection: 'row',
    height: 53,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 37,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  version: {
    backgroundColor: theme.colors.gray.extra,
    color: theme.colors.gray.medium,
    paddingBottom: theme.spacing.base,
    paddingTop: theme.spacing.small,
  },
});

const Settings = ({settings, onSettingToggle, analytics, testID}: Props) => {
  function renderItem({item}: {index: number; item: SettingsItem}) {
    async function handleOnSettingsItemToggle() {
      analytics?.logEvent(ANALYTICS_EVENT_TYPE.NOTIFICATIONS_TOGGLE, {
        type: item.type,
        value: item.isActive,
      });
      await onSettingToggle(item.type);
    }
    return (
      <React.Fragment>
        <Separator />
        <View style={styles.notificationItemContainer}>
          <Text style={styles.text}>{item.label}</Text>
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
        ListHeaderComponentStyle={styles.headerContainer}
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

export {Settings as Component};
export default withAnalytics(Settings);
