import * as React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import theme from '../modules/theme';
import {SPACE} from '../const';
import Switch from './switch';
import Version from './version';
import Text from './text';
import Space from './space';

type SettingsItem = {
  type: string;
  label: string;
  isActive: boolean;
  onPress: () => void;
};

interface Props {
  settings: Array<SettingsItem>;
  testID: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray.extra,
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

const Settings = ({settings, testID}: Props) => {
  function renderItem({item, index}: {index: number; item: SettingsItem}) {
    function handleOnSettingsItemPress() {
      return item.onPress();
    }
    return (
      <React.Fragment>
        {index % settings.length !== 1 ? <Separator /> : null}
        <View style={styles.notificationItemContainer}>
          <Text>{item.label}</Text>
          <Switch
            isActive={item.isActive}
            onPress={handleOnSettingsItemPress}
            testID={testID + '-switch-' + item.type}
          />
        </View>
        {index % settings.length !== 0 ? <Separator /> : null}
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
          <React.Fragment>
            <View style={styles.shadow} />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Notifications</Text>
            </View>
            {renderItem({item: settings[0]})}
            <Space type={SPACE.BASE} />
          </React.Fragment>
        }
        data={settings.slice(1, settings.length)}
        ItemSeparatorComponent={Separator}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
      <Version style={styles.version} />
    </React.Fragment>
  );
};

export default Settings;
